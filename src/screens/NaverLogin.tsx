import React from "react";
import {View, StyleSheet, Alert} from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import config from "../config/config";

type NavigationProp = StackNavigationProp<RootStackParamList, "NaverLogin">;

const NaverLogin: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { url } = route.params as { url: string };

    const sendCodeToBackend = async (code: string, state: string) => {
        try {
            console.log("Sending request to:", `${config.baseURL}/naver/callback`);
            console.log("Request data:", { code, state });

            // 백엔드로 코드와 상태값 전송
            const response = await axios.post(
                `${config.baseURL}/naver/callback`,
                { code, state });

            console.log("Backend response:", response.data);

            const { accessToken } = response.data; // 백엔드에서 accessToken 반환
            if (!accessToken) {
                throw new Error("No accessToken received from backend.");
            }

            // 토큰 저장 후 메인 화면 이동
            await AsyncStorage.setItem("authToken", accessToken);
            navigation.navigate("Main");
        } catch (error) {
            console.error("Failed to send code to backend:", error);
            Alert.alert("로그인 실패", "백엔드와 연결에서 문제가 발생했습니다.");
        }
    };



    const handleWebViewNavigationStateChange = (navState: any): void => {
        const { url } = navState;
        if (url.includes("code=") && url.includes("state=")) {
            // code와 state를 URL에서 추출
            const code = url.split("code=")[1].split("&")[0];
            const state = url.split("state=")[1].split("&")[0];

            // 두 개의 인자를 sendCodeToBackend에 전달
            sendCodeToBackend(code, state);
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
