import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessTokenContext } from '../OauthAccessToken/AccessTokenContext';

type RootStackParamList = {
    NonLoginMain: undefined;
    Main: undefined;
    Login: undefined;
    SignUp: undefined;
    KakaoLogin: undefined;
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'NonLoginMain'>;

const NonLoginMainScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);

    const handleKakaoLogin = () => {
        navigation.navigate('KakaoLogin');
    };

    const handleNaverLogin = () => console.log('네이버 로그인 시도');
    const handleGoogleLogin = () => console.log('구글 로그인 시도');

    const handleLogout = async () => {
        try {
            // 액세스 토큰 유효성 확인 (카카오 사용자 정보 가져오기 API 호출)
            const validateResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // 현재 저장된 액세스 토큰 사용
                },
            });

            if (validateResponse.status === 200) {
                console.log('Access Token is valid.');

                // 액세스 토큰 유효성을 확인한 후 로그아웃 요청
                const response = await axios.post('http://10.10.2.196:8080/auth/kakao/logout', {
                    accessToken: accessToken, // 현재 액세스 토큰 전달
                });

                if (response.status === 200) {
                    Alert.alert('로그아웃 성공', '사용자가 로그아웃되었습니다.');
                    setAccessToken(''); // 클라이언트 측에서 토큰 초기화
                    await AsyncStorage.removeItem('accessToken'); //
                } else {
                    Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
                }
            } else {
                console.error('Access Token is invalid.');
                Alert.alert('로그아웃 실패', '유효하지 않은 토큰입니다.');
            }
        } catch (error) {
            console.error('로그아웃 실패:', error);
            Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 16 }}>
            <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#1F2937', marginBottom: 20 }}>트윗 마이 펫 🐾</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={{ backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, borderWidth: 1, borderColor: '#3B82F6', marginRight: 8 }}
                >
                    <Text style={{ color: '#3B82F6', fontSize: 18, fontWeight: 'bold' }}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}
                    style={{ backgroundColor: '#3B82F6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 }}
                >
                    <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>회원가입</Text>
                </TouchableOpacity>
            </View>

            <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity
                    onPress={handleGoogleLogin}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', width: 300, height: 50, borderRadius: 10, marginBottom: 10 }}
                >
                    <Image
                        source={require('../image/GoogleLoginButton.png')}
                        style={{ width: 24, height: 24, marginRight: 10 }}
                        resizeMode="contain"
                    />
                    <Text style={{ color: '#3C4043', fontSize: 16, fontWeight: 'bold' }}>Google 계정으로 가입</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleKakaoLogin}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE500', width: 300, height: 50, borderRadius: 10, marginBottom: 10 }}
                >
                    <Image
                        source={require('../image/KakaoLoginButton.png')}
                        style={{ width: 24, height: 24, marginRight: 10 }}
                        resizeMode="contain"
                    />
                    <Text style={{ color: '#3A1D1D', fontSize: 16, fontWeight: 'bold' }}>카카오 회원가입</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleNaverLogin}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#03C75A', width: 300, height: 50, borderRadius: 10, marginBottom: 10 }}
                >
                    <Image
                        source={require('../image/NaverLoginButton.png')}
                        style={{ width: 24, height: 24, marginRight: 10 }}
                        resizeMode="contain"
                    />
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>네이버로 간편가입</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={handleLogout}
                style={{ backgroundColor: '#F44336', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 }}
            >
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>로그아웃</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NonLoginMainScreen;
