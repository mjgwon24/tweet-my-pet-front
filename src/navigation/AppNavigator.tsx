import React, {createContext, useEffect, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import KakaoLogin from '../screens/KakaoLogin';
import NonLoginMainScreen from '../screens/NonLoginMainScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SearchScreen from '../screens/SearchScreen';
import MapScreen from '../screens/MapScreen';
import StoreListScreen from '../screens/StoreListScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DevLoadingView from "expo/build/environment/DevLoadingView";
import MapSeacrhScreen from "../screens/MapSeacrhScreen";
import NaverLogin from "../screens/NaverLogin";
import FindIdScreen from '../screens/FindIdScreen';
import FindIdSuccessScreen from '../screens/FindIdSuccessScreen';
import FindPasswordScreen from '../screens/FindPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
export type RootStackParamList = {
    NonLoginMain: undefined;
    Main: undefined;
    Login: undefined;
    SignUp: undefined;
    KakaoLogin: undefined;
    Search: undefined;
    Map: undefined;
    Accommodation: undefined;
    NaverLogin: { url: string };
    FindId:undefined;
    FindIdSuccess:{ userId: string };
    FindPassword:undefined;
    ChangePassword:undefined;
    MapSearch: undefined;
};

// login 여부 관리 Context
export const AuthContext = createContext<{
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>} | undefined>(undefined);

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * 로그인 여부에 따라 화면 전환
     * - 컴포넌트가 처음 마운트될 때 실행
     */
    useEffect(() => {
        const checkLoginStatus = async () => {
            const login = await fetchLoginStatus();
            setIsLogin(login);
            setIsLoading(false);
        };

        checkLoginStatus();
    }, []);

    // if (isLoading) {
    //     return <DevLoadingView />;
    // }

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin }}>
            <NavigationContainer>
                <Stack.Navigator id={undefined} initialRouteName="NonLoginMain">
                    <Stack.Screen name="NonLoginMain" component={NonLoginMainScreen} options={{ title: '비로그인 메인' }} />
                    <Stack.Screen name="Login" component={LoginScreen} options={{ title: '로그인' }} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: '회원가입' }} />
                    <Stack.Screen name="KakaoLogin" component={KakaoLogin} options={{ title: '카카오 로그인' }} />
                    <Stack.Screen name="NaverLogin" component={NaverLogin} options={{title: '네이버 로그인'}} />

                    {/* BottomTabNavigator를 포함하여 Main, Search, Map 등의 화면을 관리 */}
                    <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />

                    {/* SearchScreen과 MapScreen을 독립적으로 추가 */}
                    <Stack.Screen name="Search" component={SearchScreen} options={{ title: '검색' }} />
                    <Stack.Screen name="Map" component={MapScreen} options={{ title: '지도' }} />
                    <Stack.Screen name="Accommodation" component={StoreListScreen} options={{ title: '매장 리스트' }} />
                    <Stack.Screen name="FindId" component={FindIdScreen} options={{ title: '아이디 찾기' }} />
                    <Stack.Screen name="FindIdSuccess" component={FindIdSuccessScreen} options={{ title: '아이디 찾기 성공' }} />
                    <Stack.Screen name="FindPassword" component={FindPasswordScreen} options={{ title: '비밀번호 찾기' }} />
                    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: '비밀번호 변경' }} />
                    <Stack.Screen name="MapSearch" component={MapSeacrhScreen} options={{ title: '지도 검색' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
};

/**
 * 로그인 상태 확인 함수
 */
const fetchLoginStatus = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    return token !== null;
}

export default AppNavigator;

export class StackNavigationProp {
}