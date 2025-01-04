import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccessTokenContext } from "../OauthAccessToken/AccessTokenContext";
import config from "../config/config";

type RootStackParamList = {
    NonLoginMain: undefined;
    Main: undefined;
    Login: undefined;
    SignUp: undefined;
    KakaoLogin: undefined;
    NaverLogin: { url: string }; // [추가] 네이버 로그인 화면
};

type NavigationProps = StackNavigationProp<RootStackParamList, "NonLoginMain">;

const CLIENT_ID = "nXb79lqS7yHzCZBcTqrL"; // 네이버에서 제공된 Client ID
const REDIRECT_URI = encodeURIComponent("http://192.168.154.29:8081/auth/naver/callback"); // URL 인코딩

const NonLoginMainScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);

    // [기존] 카카오 로그인 핸들러
    const handleKakaoLogin = () => {
        navigation.navigate("KakaoLogin");
    };

    // [추가] 네이버 로그인 핸들러
    const handleNaverLogin = () => {
        const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=random_state`;
        navigation.navigate("NaverLogin", { url: naverLoginUrl });
    };

    // [기존] 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${config.baseURL}/logout`, {
                accessToken,
            });

            if (response.status === 200) {
                Alert.alert("로그아웃 성공", "사용자가 로그아웃되었습니다.");
                setAccessToken("");
                await AsyncStorage.removeItem("accessToken");
            }
        } catch (error) {
            console.error("로그아웃 실패:", error);
            Alert.alert("로그아웃 실패", "로그아웃 중 오류가 발생했습니다.");
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4F6", padding: 16 }}>
            <Text style={{ fontSize: 36, fontWeight: "bold", color: "#1F2937", marginBottom: 20 }}>트윗 마이 펫 🐾</Text>

            {/* 기존 로그인 및 회원가입 버튼 */}
            <View style={{ flexDirection: "row", justifyContent: "center", width: "100%", marginBottom: 20 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                    style={{
                        backgroundColor: "#FFFFFF",
                        paddingVertical: 12,
                        paddingHorizontal: 24,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#3B82F6",
                        marginRight: 8,
                    }}
                >
                    <Text style={{ color: "#3B82F6", fontSize: 18, fontWeight: "bold" }}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                    style={{
                        backgroundColor: "#3B82F6",
                        paddingVertical: 12,
                        paddingHorizontal: 24,
                        borderRadius: 10,
                    }}
                >
                    <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>회원가입</Text>
                </TouchableOpacity>
            </View>

            {/* 각 로그인 버튼들 */}
            <View style={{ width: "100%", alignItems: "center", marginBottom: 20 }}>
                {/* Google 로그인 버튼 */}
                <TouchableOpacity
                    onPress={() => console.log("구글 로그인 시도")}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#FFFFFF",
                        width: 300,
                        height: 50,
                        borderRadius: 10,
                        marginBottom: 10,
                    }}
                >
                    <Image
                        source={require("../images/authImages/GoogleLoginButton.png")}
                        style={{ width: 24, height: 24, marginRight: 10 }}
                        resizeMode="contain"
                    />
                    <Text style={{ color: "#3C4043", fontSize: 16, fontWeight: "bold" }}>Google 계정으로 가입</Text>
                </TouchableOpacity>

                {/* Kakao 로그인 버튼 */}
                <TouchableOpacity
                    onPress={handleKakaoLogin}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#FEE500",
                        width: 300,
                        height: 50,
                        borderRadius: 10,
                        marginBottom: 10,
                    }}
                >
                    <Image
                        source={require("../images/authImages/KakaoLoginButton.png")}
                        style={{ width: 24, height: 24, marginRight: 10 }}
                        resizeMode="contain"
                    />
                    <Text style={{ color: "#3A1D1D", fontSize: 16, fontWeight: "bold" }}>카카오 회원가입</Text>
                </TouchableOpacity>

                {/* Naver 로그인 버튼 */}
                <TouchableOpacity
                    onPress={handleNaverLogin} // [추가] 네이버 로그인 이벤트 핸들러 연결
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#03C75A",
                        width: 300,
                        height: 50,
                        borderRadius: 10,
                        marginBottom: 10,
                    }}
                >
                    <Image
                        source={require("../images/authImages/NaverLoginButton.png")}
                        style={{ width: 24, height: 24, marginRight: 10 }}
                        resizeMode="contain"
                    />
                    <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>네이버로 간편가입</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate('Main')}
                style={{ backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, marginBottom: 10 }}
            >
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>메인 화면으로 이동</Text>
            </TouchableOpacity>


            {/* 로그아웃 버튼 */}
            <TouchableOpacity
                onPress={handleLogout}
                style={{ backgroundColor: "#F44336", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 }}
            >
                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>로그아웃</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NonLoginMainScreen;