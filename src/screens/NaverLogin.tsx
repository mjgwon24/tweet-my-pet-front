import React, { useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import config from "../config/config";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList, "NaverLogin">;

const NaverLogin: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { url } = route.params as { url: string };

    // 앱 시작 시 자동 로그인 토큰 확인
    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                try {
                    // 토큰 유효성 검증 요청
                    const response = await axios.get(`${config.baseURL}/validate-token`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.status === 200) {
                        // 유효한 경우 메인 화면으로 이동
                        navigation.navigate("Main");
                    }
                } catch (error) {
                    console.log("자동 로그인 실패:", error);
                    // 유효하지 않은 토큰 삭제
                    await AsyncStorage.removeItem("authToken");
                }
            }
        };
        checkToken();
    }, []);

    // 네이버 로그인 코드와 state를 백엔드로 전달
    const sendCodeToBackend = async (code: string, state: string) => {
        try {
            const response = await axios.post(`${config.baseURL}/naver/callback`, { code, state });
            const { authToken } = response.data;

            if (authToken) {
                // 토큰 저장 및 메인 화면으로 이동
                await AsyncStorage.setItem("authToken", authToken);
                navigation.navigate("Main");
            } else {
                console.error("authToken이 응답에 포함되지 않았습니다:", response.data);
                Alert.alert("로그인 실패", "토큰 발급에 실패했습니다.");
            }
        } catch (error) {
            console.error("백엔드 요청 중 오류 발생:", error);
            Alert.alert("로그인 실패", "백엔드와 연결에서 문제가 발생했습니다.");
        }
    };

    // WebView의 URL 변경 감지
    const handleWebViewNavigationStateChange = (navState: any): void => {
        const { url } = navState;
        if (url.includes("code=") && url.includes("state=")) {
            const code = url.split("code=")[1].split("&")[0];
            const state = url.split("state=")[1].split("&")[0];

            sendCodeToBackend(code, state); // 백엔드로 코드와 state 전송
        }
    };

    return (
        <View style={styles.container}>
            <WebView
                style={{ flex: 1 }}
                source={{ uri: url }}
                javaScriptEnabled={true}
                onNavigationStateChange={handleWebViewNavigationStateChange}
            />
        </View>
    );
};

export default NaverLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
