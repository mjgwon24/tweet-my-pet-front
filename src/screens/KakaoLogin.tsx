import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../config/config";

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

const REST_API_KEY = 'a2a94506e0145149299978c0c2cbee50';
const REDIRECT_URI = `${config.kakaoBaseURL}auth/kakao/callback`;
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KaKaoLogin = () => {
    const navigation = useNavigation<NavigationProp>();

    async function sendCodeToBackend(code: string) {
        try {
            const response = await axios.post(
                `${config.baseURL}auth/kakao/callback`,
                { code },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const { accessToken, email, nickname, gender } = response.data;
            await AsyncStorage.setItem('accessToken', accessToken);
3
            console.log('사용자 정보:');
            console.log(`Email: ${email}`);
            console.log(`Nickname: ${nickname}`);
            console.log(`Gender: ${gender}`);

            navigation.navigate('Main');
        } catch (error) {
            console.error('Failed to send code to backend:', error);
        }
    }


    function KakaoLoginWebView(data: string) {
        const exp = "code=";
        const condition = data.indexOf(exp);
        if (condition !== -1) {
            const authorize_code = data.substring(condition + exp.length);
            sendCodeToBackend(authorize_code);
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
                javaScriptEnabled={true}
                onMessage={event => KakaoLoginWebView(event.nativeEvent.url)}
            />
        </View>
    );
};

export default KaKaoLogin;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
        backgroundColor: '#fff',
    },
});
