import React, { useState,useEffect } from 'react';
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
import axios,{AxiosInstance} from 'axios';
import config from '../config/config';
// RootStackParamList 타입 정의
type RootStackParamList = {
    NonLogMain: undefined; // 비로그인 메인 페이지
    Main: undefined; // 메인 페이지
    Login: undefined; // 로그인 페이지
    SignUp: undefined; // 회원가입 페이지
    FindId: undefined; // 아이디 찾기 페이지
    FindPassWord: undefined; // 비밀번호 찾기 페이지
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
    const [userId,setUserId] = useState("");
    const [debug,setDebug] = useState("");
    const getTimer = (second) => {
        return `${Math.floor(second/60)}:${`${second%60}`.padStart(2,'0')}`
    }
    const axiosInstance: AxiosInstance = axios.create({
        baseURL: config.baseURL,
        responseType: 'json',
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
    });
    useEffect(() => {
      const send_data = async () => {
          try {
              const response = await axiosInstance.post('/send-find-loginId-auth-code', {
                  phoneNumber,
                  userName,
              });
  
              if (response.status === 200) {
                  console.log('인증번호 요청 성공');
              } else {
                  setOnAuth(false);
              }
          } catch (error) {
              console.log('Error sending auth code:', error);
              setOnAuth(false);
              if(error.response.status==404){
                  Alert.alert("인증 요청 실패", "일치하는 유저 정보가 없습니다.");//유저 정보 X
              }
              else if(error.response.status==400){
                  Alert.alert("인증 요청 실패", "인증 요청에 실패했습니다.");//기타 이유
              }
          }
      };
  
      if (onAuth && !authSuccess && authTime > 0) {
          send_data(); // 인증번호 요청은 한 번만 실행
      }
  }, [onAuth, authSuccess, phoneNumber, userName]);
  
  useEffect(() => {
      let intervalId: NodeJS.Timeout;
  
      if (onAuth && !authSuccess && authTime > 0) {
          intervalId = setInterval(() => {
              setAuthTime((prevTime) => {
                  if (prevTime <= 1) {
                      clearInterval(intervalId);
                      return 0;
                  }
                  return prevTime - 1;
              });
          }, 1000);
      }
  
      // 컴포넌트 언마운트 또는 인증 성공 시 인터벌 정리
      return () => clearInterval(intervalId);
  }, [onAuth, authSuccess, authTime]);
  
  
    
    const navigation = useNavigation<NavigationProps>();
  return (
    <View className="flex-1 justify-center items-center bg-white px-[35px]">
        <View className='flex flex-row w-full items-start'>
            <Text className="text-[32px] font-bold mb-2 pr-1">
                아이디 찾기
            </Text>
            <Image
                    source={require('../images/common/footprint.png')}
                    />
        </View>
        <View className='flex flex-row w-full items-start mb-11'>
            <View className='flex flex-col gap-0 items-start'>
                <Text className="text-[#717171] text-left">
                    회원가입 시 작성했던 정보를 입력해주세요!{debug}
                </Text>
            </View>
                
        </View>

            
      <View className='flex flex-col gap-[7px] items-center'>
        <View className='w-[289px]'>
            <TextInput
                className="border border-gray-300 rounded-xl py-3 px-4 font-medium"
                placeholder="이름 입력"
                placeholderTextColor="#d1d5db"
                value={userName}
                onChangeText={newText => setUserName(newText)}
                autoCapitalize="none"
            />
        </View>
        <View className='flex flex-row w-[289px] h-[44px]'>
            <TextInput
                className="border border-gray-300 rounded-xl w-[211px] h-[44px] py-3 px-4 mb-4 font-medium mr-[7px]"
                placeholder="전화번호 입력"
                placeholderTextColor="#d1d5db"
                value={phoneNumber}
                keyboardType={'phone-pad'}
                onChangeText={newText => setPhoneNumber(newText)}
                editable={!onAuth}
            />
            <TouchableOpacity className={`${(userName&&phoneNumber)&&!(authSuccess)?"bg-[#3D47AA]":"bg-[#BABABA]"} w-[71px] h-[44px] py-3 rounded-xl mb-4`}
            onPress={()=>{setOnAuth(true)}}
            disabled={!(userName&&phoneNumber)||onAuth||authSuccess}>
                <Text className="text-center text-white font-bold">인증</Text>
            </TouchableOpacity>
        </View>
        
        <View className={`flex flex-row w-[289px] h-[44px]`}>
            <TextInput
                className="border border-gray-300 rounded-xl w-[211px] h-[44px] py-3 px-4 mb-4 font-medium mr-[7px]"
                placeholder="인증번호 입력"
                placeholderTextColor="#d1d5db"
                value={authNumber}
                keyboardType={'phone-pad'}
                onChangeText={newText => setAuthNumber(newText)}
                editable={!authSuccess}
            />
            <TouchableOpacity className={`${authNumber.length>=6&&!(authSuccess)?"bg-[#3D47AA]":"bg-[#BCBCBC]"} w-[71px] h-[44px] py-3 rounded-xl mb-4`}
            onPress={async () => {
                try {
                  const response = await axiosInstance.post('/verify-findId-auth-code', {
                    phoneNumber: phoneNumber,
                    authCode: authNumber,
                  });
              
                  console.log(response.status);
                  if (response.status === 200) {
                    setUserId(response.data);
                    setAuthSuccess(true);
                    // console.log("인증 성공, 인증코드가 잘되었습니다");
                    // Alert.alert("인증 성공", "인증코드가 잘되었습니다");
                  } else {
                    console.log("인증 실패, 인증코드가 잘못되었습니다");
                    Alert.alert("인증 실패", "인증코드가 잘못되었습니다");
                  }
                } catch (error) {
                    console.log("인증 실패, 인증코드가 잘못되었습니다");
                    Alert.alert("인증 실패", "인증코드가 잘못되었습니다");
                }
              }}
              
            disabled={!(authNumber.length>=6)||authSuccess}>
                <Text className="text-center text-white font-bold">확인</Text>
            </TouchableOpacity>
        </View>

      </View>
      
      <View className='flex flex-row w-full pl-[17px] justify-start items-start mb-[200px]'>
        <Text className='text-left text-[#3D47AA] text-[12px] font-medium mt-1'>{authSuccess?'인증이 완료되었습니다':authTime!==300?`남은 시간 ${getTimer(authTime)}`:""}</Text>
      </View>
        <TouchableOpacity className={`w-[284px] py-3 rounded-xl mb-4 ${userName&&phoneNumber&&authSuccess?"bg-[#3D47AA]":"bg-[#BCBCBC]"}`}
        onPress={()=>{
            // navigation.navigate("NaverLogin", { url: naverLoginUrl });
            navigation.navigate('FindIdSuccess',{userId: userId});
          }}>
            <Text className="text-center text-white font-bold">아이디 찾기</Text>
        </TouchableOpacity>


    <View className="flex-row justify-center gap-2">
        <Text className="text-sm text-gray-500 font-medium">아이디가 떠오르셨나요?</Text><TouchableOpacity onPress={()=>{navigation.navigate('FindId');}}><Text className="text-sm text-gray-500 font-medium underline">로그인 하러 가기</Text></TouchableOpacity>
      </View>
    </View>
  );
}
