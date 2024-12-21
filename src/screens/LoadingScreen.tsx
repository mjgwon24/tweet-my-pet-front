import React, {useEffect, useRef, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View,Image} from 'react-native';
import axios, {AxiosInstance} from 'axios';
import config from '../config/config';
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import { RootStackParamList } from '../navigation/AppNavigator';


//LoadingStackParamList 타입 정의
type LoadingStackParamList = {
    NonLogMain: undefined;
    Main: undefined;
    Login: undefined;
    Loading: undefined; 
};
type NavigationProp = StackNavigationProp<LoadingStackParamList, 'Loading'>;
/**
 * 시작 화면
 * @since 2024.12.21
 * @latest 2024.12.21
 * @author 김이현
 */
const LoadingScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const handleStart = () => {navigation.navigate('Main')}

    return (
        <View className='flex-1 flex-row items-center bg-white w-full h-full'>
            <View className="flex flex-col justify-between pt-[127px] w-full h-full">
                <View className="flex flex-row justify-end px-[40px]">
                    <View className="flex flex-col justify-center">
                        <Text className='text-[36px] font-bold text-right'>트윗</Text>
                        <Text className='text-[36px] font-bold text-right'>마이 펫</Text>
                        <Text className='text-[#717171] font-bold text-[14px] text-right'>나와 반려견과</Text>
                        <Text className='text-[#717171] font-bold text-[14px] text-right'>행복한 여행</Text>
                    </View>
                </View>
                
                <View className='flex flex-row justify-start pt-[307px] w-full px-[35px]'>
                    <Image className="w-[150px] h-[103.61px] mb-[-7px] z-10"
                                source={require("../images/common/tweetmypet.png")}/>
                </View>
                
                <View
                    className="bg-blue-700 shadow-lg hover:bg-blue-800 w-full h-[117px]"
                >
                </View>
            </View>
            
        </View>
    );
};

export default LoadingScreen;