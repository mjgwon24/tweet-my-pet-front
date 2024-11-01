import React, {useRef, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import axios, {AxiosInstance} from 'axios';
import config from '../config/config';

/**
 * 회원가입 화면
 * @since 2024.10.26
 * @latest 2024.10.27
 * @author 권민지
 */
const SignUpScreen: React.FC = () => {
    // 상태 변수 생성
    const [id, setId] = useState<String>('');
    const [password, setPassword] = useState<String>('');
    const [passwordCheck, setPasswordCheck] = useState<String>('');
    const [name, setName] = useState<String>('');
    const [phone, setPhone] = useState<String>('');
    const [isTouched, setIsTouched] = useState<boolean>(false);
    const [authCode, setAuthCode] = useState<String>('');
    const [isAuthCodeSent, setIsAuthCodeSent] = useState<boolean>(false);
    const [isAuthCodeVerified, setIsAuthCodeVerified] = useState<boolean>(false);

    // ref 객체 생성
    const idRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const passwordCheckRef = useRef<TextInput>(null);
    const nameRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);

    /**
     * Axios 인스턴스 생성
     */
    const axiosInstance: AxiosInstance = axios.create({
        baseURL: config.baseURL,
        responseType: 'json',
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
    });

    /**
     * 전화번호 인증 버튼 클릭 이벤트
     */
    const handlePhoneAuth = async (): Promise<void> => {
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
            setIsAuthCodeSent(true);
            Alert.alert('인증번호 전송 성공', '인증번호가 전송되었습니다.');
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
                { "phoneNumber": phone, "authCode": authCode },
                { headers: { 'Content-Type': 'application/json'}});
            setIsAuthCodeVerified(true);
            Alert.alert('인증 성공', '인증번호 확인이 완료되었습니다');

            // 인증번호 확인 후 인증번호 입력 필드 비활성화

        } catch (error) {
            Alert.alert('인증 실패', '인증 번호가 일치하지 않습니다.');
        }
    }

    /**
     * 회원가입 버튼 클릭 이벤트
     */
    const handleSignUp = async (): Promise<void> => {
        console.log('===== 회원가입 요청 =====');
        setIsTouched(true);

        // 입력 필드 유효성 검증
        // if (!id.trim() || !password.trim() || !name.trim() || !phone.trim()) {
        //     Alert.alert('입력폼 빈칸 존재', '모든 입력폼을 채워주세요.');
        //
        //     // 빈 필드에 포커스
        //     if (!id.trim()) {
        //         idRef.current?.focus();
        //     } else if (!password.trim()) {
        //         passwordRef.current?.focus();
        //     } else if (!passwordCheck.trim()) {
        //         passwordCheckRef.current?.focus();
        //     } else if (!name.trim()) {
        //         nameRef.current?.focus();
        //     } else if (!phone.trim()) {
        //         phoneRef.current?.focus();
        //     }
        //     return;
        // }

        // 비밀번호 문자, 숫자, 특수문자 포함 여부 확인 && 길이 8자 이상
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,}$/.test(password as string)) {
            Alert.alert('비밀번호 형식 오류', '비밀번호는 문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.');
            setPassword('');
            setPasswordCheck('');
            passwordRef.current?.focus();
            return;
        }

        // // 비밀번호 폼과 비밀번호 확인 폼 일치 여부 확인
        // if (password !== passwordCheck) {
        //     Alert.alert('비밀번호 불일치', '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        //     setPasswordCheck('');
        //     passwordCheckRef.current?.focus();
        //     return;
        // }

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
                "phoneNumber": phone
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('회원가입 성공: ', response.data);
            Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
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
        <View className="flex-1 justify-center bg-white px-4">
            <View className="mb-40">
                <Text className="text-3xl font-bold mb-6 text-center text-blue-600">회원가입</Text>
                <TextInput
                    ref={idRef}
                    className={`border ${getBorderColorClass(id as string)} rounded-lg p-3 mb-4`}
                    placeholder="아이디"
                    value={id as string}
                    onChangeText={setId}
                    autoCapitalize="none"
                />
                <TextInput
                    ref={passwordRef}
                    className={`border ${getBorderColorClass(password as string)} rounded-lg p-3 mb-4`}
                    placeholder="비밀번호"
                    value={password as string}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    ref={passwordCheckRef}
                    className={`border ${getBorderColorClass(password as string)} rounded-lg p-3 mb-4`}
                    placeholder="비밀번호 확인"
                    value={passwordCheck as string}
                    onChangeText={setPasswordCheck}
                    secureTextEntry
                />
                <TextInput
                    ref = {nameRef}
                    className={`border ${getBorderColorClass(name as string)} rounded-lg p-3 mb-4`}
                    placeholder="이름"
                    value={name as string}
                    onChangeText={setName}
                    secureTextEntry
                />
                <View className="flex-row justify-between mb-6 w-full">
                    <TextInput
                        ref = {phoneRef}
                        className={`border ${getBorderColorClass(phone as string)} rounded-lg p-3 w-3/4`}
                        placeholder="전화번호"
                        value={phone as string}
                        onChangeText={setPhone}
                        keyboardType={'phone-pad'}
                        editable={!isAuthCodeVerified}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        onPress={handlePhoneAuth}
                        className="bg-blue-700 py-3 px-6 rounded-lg hover:bg-blue-800"
                        disabled={!isAuthCodeVerified}
                    >
                        <Text className="text-white font-semibold text-center text-base leading-none"
                        >인증</Text>
                    </TouchableOpacity>
                </View>
                { isAuthCodeSent && (
                    <View className="flex-row justify-between mb-6 w-full">
                        <TextInput
                            className="border border-blue-300 rounded-lg p-3 w-3/4"
                            placeholder="인증번호 입력"
                            value={authCode as string}
                            onChangeText={setAuthCode}
                            keyboardType={'number-pad'}
                            editable={!isAuthCodeVerified}
                        />
                        <TouchableOpacity
                            onPress={handleAuthCodeVerification}
                            className="bg-blue-700 py-3 px-6 rounded-lg hover:bg-blue-800"
                            disabled={!isAuthCodeVerified}
                        >
                            <Text className="text-white font-semibold text-center text-base leading-none"
                            >확인</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    onPress={handleSignUp}
                    className="bg-blue-700 py-3 px-6 rounded-lg shadow-lg hover:bg-blue-800"
                >
                    <Text className="text-white text-lg font-semibold text-center">회원가입</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignUpScreen;