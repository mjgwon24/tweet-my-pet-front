import React, {useState} from "react";
import { View, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import config from "../config/config"; // 백엔드 URL이 포함된 설정 파일
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList, "NaverLogin">;

const NaverLogin: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { url } = route.params as { url: string };

    const [isRequestSent, setIsRequestSent] = useState(false);

    const sendCodeToBackend = async (code: string, state: string) => {
        if (isRequestSent) return; // 이미 요청이 진행 중이면 중단
        setIsRequestSent(true);

        try {
            console.log(code, state);
            const response = await axios.post(`${config.baseURL}/naver/callback`, {
                code,
                state,
            });

            const { authToken, refreshToken } = response.data;

            console.log("Response Data:", response.data);
            if (authToken) {
                await AsyncStorage.setItem("authToken", authToken);
                await AsyncStorage.setItem("refreshToken", refreshToken);
                Alert.alert("로그인 성공", "토큰이 저장되었습니다.");
                navigation.navigate('Main');
            } else {
                Alert.alert("로그인 실패", "토큰 발급에 실패했습니다.");
            }
        } catch (error) {
            console.error("백엔드 요청 중 오류 발생:", error);
            Alert.alert("로그인 실패", "백엔드와 연결에서 문제가 발생했습니다.");
        }
    };

    const handleWebViewNavigationStateChange = (navState: any) => {
        const { url } = navState;
        if (url.includes("code=") && url.includes("state=")) {
            const code = url.split("code=")[1].split("&")[0];
            const state = url.split("state=")[1].split("&")[0];
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
