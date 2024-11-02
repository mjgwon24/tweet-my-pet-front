import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from "react-native";
import axios, {AxiosInstance} from "axios";
import config from "../config/config";

/**
 * 로그인 화면
 * @since 2024.10.26
 * @latest 2024.11.02
 * @author 권민지
 */
const LoginScreen: React.FC = () => {
    // 상태 변수 생성
    const [id, setId] = useState<String>('');
    const [password, setPassword] = useState<String>('');
    const [isTouched, setIsTouched] = useState<boolean>(false);

    // ref 객체 생성
    const idRef = React.createRef<TextInput>();
    const passwordRef = React.createRef<TextInput>();

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
     * 로그인 버튼 클릭 이벤트
     */
    const handleLogin = async (): Promise<void> => {
        setIsTouched(true);

        // 입력 필드 유효성 검증
        if (!id.trim() || !password.trim()) {
            Alert.alert('빈칸 존재', '아이디 또는 비밀번호를 입력해주세요.');

            // 빈 필드에 포커스
            if (!id.trim()) {
                idRef.current?.focus();
                return;
            } else {
                passwordRef.current?.focus();
                return;
            }
        }

        // 로그인 요청
        try {
            const response = await axiosInstance.post('/login',
                {
                    "loginId": id,
                    "password": password
                });

            if (response.status === 200) {
                Alert.alert('로그인 성공', '환영합니다.');
            }
        } catch (error) {
            Alert.alert('로그인 실패', '아이디 또는 비밀번호를 다시한번 확인해주세요.');
        }
    };

    // 입력 필드 테두리 색상 상태
    const getBorderColorClass = (value: string) => {
        if (isTouched) {
            return value ? 'border-gray-300' : 'border-red-600';
        }

        // 초기 상태는 회색 테두리
        return 'border-gray-300';
    }

    return (
        <View className="flex-1 justify-center bg-white px-4">
            <View className="mb-40">
                <Text className="text-3xl font-bold mb-6 text-center text-blue-600">로그인</Text>
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

                <TouchableOpacity
                    onPress={handleLogin}
                    className="bg-blue-700 py-3 px-6 rounded-lg shadow-lg hover:bg-blue-800"
                >
                    <Text className="text-white text-lg font-semibold text-center">로그인</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;
