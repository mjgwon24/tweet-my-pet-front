import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 메인 화면
 * @since 2024.10.15
 * @latest 2024.10.15
 * @author 임석진
 */
type RootStackParamList = {
    NonLogMain: undefined;
    Main: undefined;
    Login: undefined;
    SignUp: undefined;
    KakaoLogin: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'KakaoLogin'>;

// Kakao API 정보
const REST_API_KEY = '8e01f42a3bba6e24a2bd08de811a7172';
const REDIRECT_URI = 'http://10.10.2.196:8081/auth/kakao/callback';
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KaKaoLogin = () => {
    const navigation = useNavigation<NavigationProp>();

    // 백엔드에 인증 코드를 전달하여 액세스 토큰을 가져오는 함수
    async function sendCodeToBackend(code: string) {
        try {
            console.log('Sending Authorization Code to Backend:', code); // 로그 추가
            const response = await axios.post(`http://10.10.2.196:8080/auth/kakao/callback`, { code });
            const { accessToken } = response.data;
            console.log('Received Access Token from Backend:', accessToken); // 액세스 토큰 로그 추가
            await AsyncStorage.setItem('accessToken', accessToken); // AsyncStorage에 토큰 저장
            navigation.navigate('Main'); // 로그인 후 메인 화면으로 이동
        } catch (error) {
            console.error('Failed to send code to backend:', error);
        }
    }

    // WebView에서 인증 코드를 받아 처리
    function KakaoLoginWebView(data: string) {
        console.log('URL Data:', data); // URL 로그 추가
        const exp = "code=";
        const condition = data.indexOf(exp);
        if (condition !== -1) {
            const authorize_code = data.substring(condition + exp.length);
            sendCodeToBackend(authorize_code); // 백엔드에 인증 코드 보내기
        }
    }

    return (
        <View style={Styles.container}>
            <WebView
                style={{ flex: 1 }}
                originWhitelist={['*']}
                scalesPageToFit={false}
                source={{
                    uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
                }}
                injectedJavaScript={INJECTED_JAVASCRIPT}
                javaScriptEnabled
                onLoadStart={() => console.log('WebView is starting to load...')} // WebView 로드 시작 로그
                onLoadEnd={() => console.log('WebView finished loading.')} // WebView 로드 완료 로그
                onMessage={event => KakaoLoginWebView(event.nativeEvent.url)}
            />
        </View>
    );

}

export default KaKaoLogin;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
        backgroundColor: '#fff',
    },
});
