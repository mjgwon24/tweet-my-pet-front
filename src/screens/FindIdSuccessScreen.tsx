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
// RootStackParamList 타입 정의
type RootStackParamList = {
    NonLogMain: undefined; // 비로그인 메인 페이지
    Main: undefined; // 메인 페이지
    Login: undefined; // 로그인 페이지
    SignUp: undefined; // 회원가입 페이지
    FindId: undefined; // 아이디 찾기 페이지
    FindPassword: undefined; // 비밀번호 찾기 페이지
    FindIdSuccess:{ userId: string }; // 아이디 찾기 성공 페이지
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;
export default function LoginScreen() {
    const [userName,setUserName] = useState("");
    const [phoneNumber,setPhoneNumber] = useState("");
    const [onAuth,setOnAuth] = useState(false);
    const [authTime,setAuthTime] = useState(300);
    const [authNumber,setAuthNumber] = useState("");
    const [authSuccess,setAuthSuccess] = useState(false);
    const route = useRoute();
    const { userId } = route.params as { userId: string };
    const getTimer = (second) => {
        return `${Math.floor(second/60)}:${`${second%60}`.padStart(2,'0')}`
    }

    
    const navigation = useNavigation<NavigationProps>();
  return (
    <View className="flex-1 justify-center items-center bg-white px-[35px]">
        <View className='flex flex-row w-full justify-center mb-[133px]'>
            <Text className="text-[32px] font-bold mb-2 pr-1">
                아이디를 찾았어요!
            </Text>
        </View>

            
      <View className='flex flex-col gap-[7px] items-center'>
        <Text className='text-[#323232] text-[24px] font-semibold'>회원님의 아이디는</Text>
        <Text className='text-[#3D47AA] text-[24px] font-bold'>{userId}</Text>
        <Text className='text-[#323232] text-[24px] font-semibold'>입니다!</Text>

      </View>
      
      <View className='flex flex-row w-full pl-[17px] justify-start items-start mb-[200px]'>
        <Text className='text-left text-[#3D47AA] text-[12px] font-medium mt-1'>{authSuccess?'인증이 완료되었습니다':authTime!==300?`남은 시간 ${getTimer(authTime)}`:""}</Text>
      </View>
        <TouchableOpacity className='w-[284px] py-3 rounded-xl mb-4 bg-[#3D47AA]'
        onPress={()=>{navigation.navigate('Login');}}>
            <Text className="text-center text-white font-bold text-[14px]">로그인 하러가기</Text>
        </TouchableOpacity>


    <View className="flex-row justify-center gap-2">
        <Text className="text-sm text-gray-500 font-medium">비밀번호도 기억나지 않으시나요?</Text><TouchableOpacity onPress={()=>{navigation.navigate('FindPassword');}}><Text className="text-sm text-gray-500 font-medium underline">비밀번호 찾기</Text></TouchableOpacity>
      </View>
    </View>
  );
}
