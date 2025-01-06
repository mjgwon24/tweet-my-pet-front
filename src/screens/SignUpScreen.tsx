import React, {useEffect, useRef, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View,Image} from 'react-native';
import axios, {AxiosInstance} from 'axios';
import config from '../config/config';
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";

// RootStackParamList 타입 정의
type RootStackParamList = {
    NonLogMain: undefined; // 비로그인 메인 페이지
    Main: undefined; // 메인 페이지
    Login: undefined; // 로그인 페이지
    SignUp: undefined; // 회원가입 페이지
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'SignUp'>;
/**
 * 회원가입 화면
 * @since 2024.10.26
 * @latest 2024.12.10
 * @author 권민지
 */
const SignUpScreen: React.FC = () => {
    // 상태 변수 생성
    const [id, setId] = useState<String>('');
    const [password, setPassword] = useState<String>('');
    const [passwordCheck, setPasswordCheck] = useState<String>('');
    const [name, setName] = useState<String>('');
    const [email, setEmail] = useState<String>('');
    const [phone, setPhone] = useState<String>('');
    const [isTouched, setIsTouched] = useState<boolean>(false);
    const [authCode, setAuthCode] = useState<String>('');
    const [isAuthCodeSent, setIsAuthCodeSent] = useState<boolean>(false);
    const [isAuthCodeVerified, setIsAuthCodeVerified] = useState<boolean>(false);
    const [step,setStep] = useState<Number>(1);
    const [authTime,setAuthTime] = useState<Number>(300);

    // ref 객체 생성
    const idRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const passwordCheckRef = useRef<TextInput>(null);
    const nameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);

    const navigation = useNavigation<NavigationProps>();

    /**
     * Axios 인스턴스 생성
     */
    const axiosInstance: AxiosInstance = axios.create({
        baseURL: config.baseURL,
        responseType: 'json',
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
    });
    const getTimer = (second) => {
        return `${Math.floor(second/60)}:${`${second%60}`.padStart(2,'0')}`
    }
    useEffect(() => {
        return () => {
            // 컴포넌트가 언마운트될 때 인증번호 확인 상태 초기화
            setIsAuthCodeVerified(false);
        };
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        if (isAuthCodeSent && !isAuthCodeVerified && authTime > 0) {
            intervalId = setInterval(() => {
                setAuthTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(intervalId);
                        return 0;
                    }
                    return prevTime as number - 1;
                });
            }, 1000);
        }
        
        // 컴포넌트 언마운트 또는 인증 성공 시 인터벌 정리
        return () => clearInterval(intervalId);
    }, [isAuthCodeSent, isAuthCodeVerified]);
    /**
     * 전화번호 인증 버튼 클릭 이벤트
     */
    const handlePhoneAuth = async (): Promise<void> => {
        setIsAuthCodeSent(true);

        // 전화번호 입력 필드 유효성 검증
        if (!phone.trim()) {
            Alert.alert('전화번호 빈칸', '전화번호를 입력해주세요.');
            phoneRef.current?.focus();
            return;
        }

        // 전화번호 형식 검증 (숫자 11자리, 010으로 시작)
        if (!/^010\d{8}$/.test(phone as string)) {
            Alert.alert('전화번호 형식 오류', '올바른 전화번호를 입력해주세요.');
            setPhone('');
            phoneRef.current?.focus();
            return;
        }
        try {
            const response = await axiosInstance.post('/send-auth-code',
                { "phoneNumber": phone });

            if (response.status === 200) {
                setIsAuthCodeSent(true);
                Alert.alert('인증번호 전송 성공', '인증번호가 전송되었습니다.');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    Alert.alert('중복 전화번호 가입 불가', '이미 존재하는 전화번호이므로 인증번호를 전송할 수 없습니다.');
                    phoneRef.current?.focus();
                } else {
                    Alert.alert('인증번호 전송 실패', '인증번호 전송에 실패하였습니다.');
                }
            } else {
                Alert.alert('인증번호 전송 실패', '인증번호 전송에 실패하였습니다.');
            }
        }
    };

    /**
     * 인증번호 확인 버튼 클릭 이벤트
     */
    const handleAuthCodeVerification = async (): Promise<void> => {
        try {
            const response = await axiosInstance.post('/verify-auth-code',
                { "phoneNumber": phone, "authCode": authCode });

            if(authTime!=0){
                setIsAuthCodeVerified(true);
                Alert.alert('인증 성공', '인증번호 확인이 완료되었습니다');
            }
            else{
                Alert.alert('인증 실패', '인증 번호가 일치하지 않습니다.');
            }
        } catch (error) {
            Alert.alert('인증 실패', '인증 번호가 일치하지 않습니다.'+error.toString());
        }
    }

    /**
     * 회원가입 버튼 클릭 이벤트
     */
     const handleSignUp1 = async (): Promise<void> => {
        setIsTouched(true);

        // 입력 필드 유효성 검증
        if (!id.trim() || !password.trim()) {
            Alert.alert('입력폼 빈칸 존재', '모든 입력폼을 채워주세요.');

            // 빈 필드에 포커스
            if (!id.trim()) {
                idRef.current?.focus();
            } else if (!password.trim()) {
                passwordRef.current?.focus();
            } else if (!passwordCheck.trim()) {
                passwordCheckRef.current?.focus();
            }
            return;
        }

        // 비밀번호 문자, 숫자, 특수문자 포함 여부 확인 && 길이 8자 이상
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,}$/.test(password as string)) {
            Alert.alert('비밀번호 형식 오류', '비밀번호는 문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.');
            setPassword('');
            setPasswordCheck('');
            passwordRef.current?.focus();
            return;
        }

        // 비밀번호 폼과 비밀번호 확인 폼 일치 여부 확인
        if (password !== passwordCheck) {
            Alert.alert('비밀번호 불일치', '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            setPasswordCheck('');
            passwordCheckRef.current?.focus();
            return;
        }

        setIsTouched(false);

        setStep(2);
        
    };
    const handleSignUp2 = async (): Promise<void> => {
        console.log('===== 회원가입 요청 =====');
        setIsTouched(true);

        // 입력 필드 유효성 검증
        if (!id.trim() || !password.trim() || !name.trim() || !email.trim() || !phone.trim()) {
            Alert.alert('입력폼 빈칸 존재', '모든 입력폼을 채워주세요.');

            // 빈 필드에 포커스
            if (!name.trim()) {
                nameRef.current?.focus();
            } else if (!email.trim()) {
                emailRef.current?.focus();
            } else if (!phone.trim()) {
                phoneRef.current?.focus();
            }
            return;
        }



        // 인증번호 확인 여부 확인
        if (!isAuthCodeVerified) {
            Alert.alert('인증번호 확인 필요', '전화번호 인증을 완료해주세요.');
            return;
        }

        // 회원가입 요청
        try {
            const response = await axiosInstance.post('/signup',
                {
                "loginId": id,
                "password": password,
                "name": name,
                "email": email,
                "phoneNumber": phone
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200||response.status === 201) {
                console.log('회원가입 성공: ', response.data);
                Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
                // 로그인 화면으로 이동
                navigation.navigate('Login');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    Alert.alert('회원가입 실패', '이미 존재하는 아이디입니다.');
                    idRef.current?.focus();
                } else if (error.response.status === 400 && error.response.data === "비밀번호는 문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.") {
                    Alert.alert('회원가입 실패', error.response.data);
                    passwordRef.current?.focus();
                } else {
                    Alert.alert('회원가입 실패', '회원가입에 실패하였습니다.');
                }
            } else {
                console.error('회원가입 실패: ', error);
                Alert.alert('회원가입 실패', '서버와의 연결에 실패하였습니다.');
            }
        }
    };

    // 입력 필드 테두리 색상 상태
    const getBorderColorClass = (value: string) =>  {
        if (isTouched) {
            return value ? 'border-blue-300' : 'border-red-600';
        }

        // 초기 상태는 회색 테두리
        return 'border-gray-300';
    };


    return (
        <View className="flex-1 justify-center items-center bg-white px-[35px]">
            <View className='flex flex-row justify-start w-full h-[3px] gap-[6px] mb-[22px]'>
                <View className='w-[33px] h-[3px] bg-[#3D47AA]'></View>
                <View className={`w-[33px] h-[3px] bg-[${step==1?'#EFEFEF':'#3D47AA'}]`}></View>
            </View>
            <View className='flex flex-row w-full items-start'>
                <Text className="text-[32px] font-bold mb-2 pr-1">
                    회원가입 
                </Text>
                <Image
                        source={require('../images/common/footprint.png')}
                        />
            </View>
            <View className='flex flex-row w-full items-start mb-11'>
                <View className='flex flex-col gap-0 items-start'>
                    <Text className="text-[#717171] text-left">
                        트윗 마이 펫의 회원이 되어주세요!
                    </Text>
                </View>
                    
            </View>
            {step==1?<View className='w-full mb-[200px]'>
            <TextInput
                    ref={idRef}
                    className={`border ${getBorderColorClass(id as string)} rounded-xl p-3 mb-4 w-full`}
                    placeholder="아이디 입력"
                    placeholderTextColor="#d1d5db"
                    value={id as string}
                    onChangeText={setId}
                    autoCapitalize="none"
                />
                <TextInput
                    ref={passwordRef}
                    className={`border ${getBorderColorClass(password as string)} rounded-xl p-3 mb-4 w-full`}
                    placeholder="비밀번호 입력"
                    placeholderTextColor="#d1d5db"
                    value={password as string}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry
                />
                <TextInput
                    ref={passwordCheckRef}
                    className={`border ${getBorderColorClass(password as string)} rounded-xl p-3 mb-4 w-full`}
                    placeholder="비밀번호 다시 입력"
                    placeholderTextColor="#d1d5db"
                    value={passwordCheck as string}
                    onChangeText={setPasswordCheck}
                    autoCapitalize="none"
                    secureTextEntry
                />
        </View>:<View className='w-full flex flex-col gap-[7px]'>
            <TextInput
                    ref = {nameRef}
                    className={`border ${getBorderColorClass(name as string)} rounded-xl p-3 w-full`}
                    placeholder="이름 입력"
                    placeholderTextColor="#d1d5db"
                    value={name as string}
                    onChangeText={setName}
                    autoCapitalize="none"
                />
                <TextInput
                    ref = {emailRef}
                    className={`border ${getBorderColorClass(name as string)} rounded-xl p-3 w-full`}
                    placeholder="이메일 입력"
                    placeholderTextColor="#d1d5db"
                    value={email as string}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <View className={`flex flex-row w-[289px] h-[44px]`}>
                    <TextInput
                        ref = {phoneRef}
                        className={`border ${getBorderColorClass(phone as string)} rounded-xl w-[235px] h-[44px] py-3 px-4 mb-4 font-medium mr-[7px]`}
                        placeholder="전화번호 입력"
                        placeholderTextColor="#d1d5db"
                        value={phone as string}
                        onChangeText={setPhone}
                        keyboardType={'phone-pad'}
                        editable={!isAuthCodeVerified}
                    />
                    <TouchableOpacity 
                        onPress={handlePhoneAuth}
                        className={`bg-[#3D47AA] w-[71px] h-[44px] py-3 rounded-xl mb-4`}
                        disabled={isAuthCodeVerified}>
                        <Text className="text-center text-white font-bold text-[14px]">인증</Text>
                    </TouchableOpacity>
                </View>
                { isAuthCodeSent && (
                    <View className="flex-row justify-between h-[44px] w-full">
                        <TextInput
                            className="border border-blue-300 rounded-xl p-3 w-3/4 mr-[7px]"
                            placeholder="인증번호 입력"
                            value={authCode as string}
                            onChangeText={setAuthCode}
                            keyboardType={'number-pad'}
                            editable={!isAuthCodeVerified}
                        />
                        <TouchableOpacity
                            onPress={handleAuthCodeVerification}
                            className="bg-[#3D47AA] py-3 px-6 rounded-xl"
                            disabled={isAuthCodeVerified}
                        >
                            <Text className="text-center text-white font-bold text-[14px]">확인</Text>

                        </TouchableOpacity>
                    </View>
                    
                )}
                <View className={`mb-[128px] ${isAuthCodeSent?'':'invisible'}`}>
                    <Text className='text-left text-[#3D47AA] text-[12px] font-medium mt-1'>{isAuthCodeVerified?'인증이 완료되었습니다':authTime!==300?`남은 시간 ${getTimer(authTime)}`:""}</Text>
                </View>
                

                
        </View>}

                

                <TouchableOpacity
                    onPress={()=>{step==1?handleSignUp1():handleSignUp2()}}
                    className="bg-[#3D47AA] py-3 px-6 rounded-xl shadow-lg w-full mb-[11px]"
                >
                    <Text className="text-white text-lg font-semibold text-center">{step==1?'다음':'회원가입'}</Text>
                </TouchableOpacity>
                <View className="flex-row justify-center gap-2">
                    <Text className="text-sm text-gray-500 font-medium">이미 회원이신가요?</Text><TouchableOpacity onPress={()=>{navigation.navigate('Login');}}><Text className="text-sm text-gray-500 font-medium underline">로그인 하러가기</Text></TouchableOpacity>
                </View>
            </View>
    );
};

export default SignUpScreen;