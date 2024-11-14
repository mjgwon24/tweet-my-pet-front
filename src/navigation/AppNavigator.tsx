import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import KakaoLogin from '../screens/KakaoLogin';
import NonLoginMainScreen from '../screens/NonLoginMainScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SearchScreen from '../screens/SearchScreen';
import MapScreen from '../screens/MapScreen';

export type RootStackParamList = {
    NonLoginMain: undefined;
    Main: undefined;
    Login: undefined;
    SignUp: undefined;
    KakaoLogin: undefined;
    Search: undefined;
    Map: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="NonLoginMain">
                <Stack.Screen name="NonLoginMain" component={NonLoginMainScreen} options={{ title: '비로그인 메인' }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ title: '로그인' }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: '회원가입' }} />
                <Stack.Screen name="KakaoLogin" component={KakaoLogin} options={{ title: '카카오 로그인' }} />

                {/* BottomTabNavigator를 포함하여 Main, Search, Map 등의 화면을 관리 */}
                <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />

                {/* SearchScreen과 MapScreen을 독립적으로 추가 */}
                <Stack.Screen name="Search" component={SearchScreen} options={{ title: '검색' }} />
                <Stack.Screen name="Map" component={MapScreen} options={{ title: '지도' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
