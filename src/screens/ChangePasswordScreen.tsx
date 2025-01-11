import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation,useRoute} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import axios,{AxiosInstance} from 'axios'
import config from '../config/config';
// RootStackParamList 타입 정의
type RootStackParamList = {
    NonLogMain: undefined; // 비로그인 메인 페이지
    Main: undefined; // 메인 페이지
    Login: undefined; // 로그인 페이지
    SignUp: undefined; // 회원가입 페이지
    FindId: undefined; // 아이디 찾기 페이지
    FindPassword: undefined; // 비밀번호 찾기 페이지
    FindIdSuccess: undefined; // 아이디 찾기 성공 페이지
    ChangePassword: {userPhoneNumber:string}; // 비밀번호 바꾸기 페이지
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;
export default function LoginScreen() {
    const [password,setPassword] = useState("");
    const [passwordAgain,setPasswordAgain] = useState("");
    const getTimer = (second) => {
        return `${Math.floor(second/60)}:${`${second%60}`.padStart(2,'0')}`
    }

    const route = useRoute();
    const { userPhoneNumber } = route.params as {userPhoneNumber:string};
    const { token } = route.params as {token:string};
    const navigation = useNavigation<NavigationProps>();
    const axiosInstance: AxiosInstance = axios.create({
        baseURL: config.baseURL,
        responseType: 'json',
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
    });
  return (
    <View className="flex-1 justify-center items-center bg-white px-[35px]">
        <View className='flex flex-row w-full justify-center mb-[133px]'>
            <Text className="text-[28px] font-bold mb-2 pr-1">
                비밀번호를 변경해주세요!
            </Text>
        </View>

            
        <TextInput
            className="border border-gray-300 rounded-xl w-[289px] py-3 px-4 mb-2"
            placeholder="비밀번호 입력"
            placeholderTextColor="#d1d5db"
            value={password}
            onChangeText={newText=>setPassword(newText)}
            secureTextEntry
        />
        <TextInput
            className="border border-gray-300 rounded-xl w-[289px] py-3 px-4"
            placeholder="비밀번호 다시 입력"
            placeholderTextColor="#d1d5db"
            value={passwordAgain}
            onChangeText={newText=>setPasswordAgain(newText)}
            secureTextEntry
        />
        <Text className="mt-[10px] mb-[243px] text-[#F00] font-semibold">{password==passwordAgain?"":"비밀번호가 일치하지 않습니다."}</Text>
      
        <TouchableOpacity className={`w-[284px] py-3 rounded-xl mb-4 ${password==passwordAgain&&password!=""?"bg-[#3D47AA]":"bg-[#BABABA]"}`}
        onPress={()=>{
            
            const send_data = async()=>{
                const response = await axiosInstance.post('/changePassword',
                { "token": token,"phoneNumber":userPhoneNumber,"password":password});
                console.log(response);
                if(response.status==200)
                    navigation.navigate('Login');
            }
            try{
                send_data();
            }
            catch(error){
                if(error.response.status==404){
                    Alert.alert("비밀번호 변경 실패", "일치하는 유저 정보가 없습니다.");//토큰 불일치
                }
                else if(error.response.status==403){
                    Alert.alert("비밀번호 변경 실패", "인증정보가 만료되었습니다.");//토큰 만료
                }
                else{
                    Alert.alert("비밀번호 변경 실패", "비밀번호 변경을 실패하였습니다.");//기타 이유
                }
                
            }
            
            }}>
            <Text className="text-center text-white font-bold text-[14px]">비밀번호 변경</Text>
        </TouchableOpacity>

    </View>
  );
}
