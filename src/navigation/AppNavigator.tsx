import React, {useState, useEffect, createContext} from 'react';
import {createStackNavigator, StackNavigationOptions} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import NonLoginMainScreen from '../screens/NonLoginMainScreen';
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MapScreen from "../screens/MapScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DevLoadingView from "expo/build/environment/DevLoadingView";

// Stack Navigator 타입 정의
type RootStackParamList = {
    NonLogMain: undefined; // 비로그인 메인 페이지
    Main: undefined; // 메인 페이지
    Login: undefined; // 로그인 페이지
    SignUp: undefined; // 회원가입 페이지
};

const Stack = createStackNavigator();

// AuthContext 생성
export const AuthContext = createContext<{
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>} | undefined>(undefined);

/**
 * 내비게이션 설정
 * @since 2024.10.20
 * @latest 2024.11.02
 */
const AppNavigator: React.FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * 로그인 여부에 따라 화면을 분기
     * - 컴포넌트가 처음 렌더링될 때만 실행
     */
    useEffect(() => {
        const checkLoginStatus = async () => {
            const login = await fetchLoginStatus();
            setIsLogin(login);
            setIsLoading(false);
        };

        checkLoginStatus();
    }, []);

    // 로딩 중일 때
    if (isLoading) {
        return <DevLoadingView />;
    }

    return (
        <AuthContext.Provider value={{isLogin, setIsLogin}}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={isLogin ? "Main" : "NonLoginMain"}>
                    <Stack.Screen name="NonLoginMain" component={NonLoginMainScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="Login" component={LoginScreen} options={{title: '로그인'}}/>
                    <Stack.Screen name="SignUp" component={SignUpScreen} options={{title: '회원가입'}}/>
                    <Stack.Screen name="Main" component={MainScreen}/>
                    <Stack.Screen name="Map" component={MapScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
};

/**
 * 로그인 상태 확인 함수
 */
const fetchLoginStatus = async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('authToken');
    return token !== null;
};

export default AppNavigator;