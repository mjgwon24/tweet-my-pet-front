import React,{useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosInstance} from 'axios';
import config from '../config/config';
// RootStackParamList 타입 정의
type RootStackParamList = {
    NonLogMain: undefined; // 비로그인 메인 페이지
    Main: undefined; // 메인 페이지
    Login: undefined; // 로그인 페이지
    SignUp: undefined; // 회원가입 페이지
    FindId: undefined; // 아이디 찾기 페이지
    FindPassword: undefined; // 비밀번호 찾기 페이지
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;


export default function LoginScreen() {
  const [loginId,setLoginId] = useState("");
  const [loginPassword,setLoginPassword] = useState("");
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: config.baseURL,
    responseType: 'json',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});
  const tryLogin = async() => {
  try {
    const response = await axiosInstance.post('/login',
        { "loginId": loginId,"password":loginPassword});
    if (response.status === 200) {
        await AsyncStorage.setItem('accessToken', response.data);
        Alert.alert('로그인 성공', '로그인에 성공했습니다');
    }
} catch (error) {
  Alert.alert('로그인 실패', '로그인에 실패했습니다');
}
}
  const navigation = useNavigation<NavigationProps>();
  return (
    <View className="flex-1 justify-center items-center bg-white px-[35px]">
        <View className='flex flex-row w-full items-start'>
            <Text className="text-[32px] font-bold mb-2 pr-1">
                로그인 
            </Text>
            <Image
                    source={require('../images/common/footprint.png')}
                    />
        </View>
        <View className='flex flex-row w-full items-start mb-11'>
            <View className='flex flex-col gap-0 items-start'>
                <Text className="text-[#717171] text-left">
                    트윗 마이 펫의 회원이신가요?
                </Text>
                <Text className="text-[#717171] text-left">
                    로그인을 해주세요!
                </Text>
            </View>
                
        </View>

            
        
      <TextInput
        className="border border-gray-300 rounded-xl w-[289px] py-3 px-4 mb-2"
        placeholder="아이디 입력"
        placeholderTextColor="#d1d5db"
        autoCapitalize="none"
        value={loginId}
        onChangeText={Text=>setLoginId(Text)}
      />
      <TextInput
        className="border border-gray-300 rounded-xl w-[289px] py-3 px-4 mb-4"
        placeholder="비밀번호 입력"
        placeholderTextColor="#d1d5db"
        autoCapitalize="none"
        secureTextEntry
        value={loginPassword}
        onChangeText={Text=>setLoginPassword(Text)}
      />
      
      <TouchableOpacity className="bg-[#3D47AA] w-[289px] py-3 rounded-xl mb-4" onPress={tryLogin}>
        <Text className="text-center text-white font-bold">로그인</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center w-[289px] mb-40 gap-4">
        <TouchableOpacity onPress={()=>{navigation.navigate('FindId');}}><Text className="text-sm text-gray-500">아이디 찾기</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate('FindPassword');}}><Text className="text-sm text-gray-500">비밀번호 찾기</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate('SignUp');}}><Text className="text-sm text-gray-500">회원가입</Text></TouchableOpacity>
      </View>

      <View className="flex-row items-center w-[289px] mb-4">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="text-gray-500 mx-2">SNS 간편 로그인</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <View className="flex-row justify-center w-[289px] gap-[29px]">
            <View className='w-9 h-9 rounded-[50%] overflow-hidden border border-[#FFF]'>
                <Image
                    source={require('../images/authImages/NaverOAuthButton.png')}
                    />
            </View>
            <View className='w-9 h-9 rounded-[100px] overflow-hidden'>
                <Image
                    source={require('../images/authImages/KakaoOAuthButton.png')}
                />
            </View>
            <View className='w-9 h-9 rounded-[50%] overflow-hidden'>
                <Image
                    source={require('../images/authImages/GoogleOAuthButton.png')}
                    />
            </View>
      </View>
    </View>
  );
}
