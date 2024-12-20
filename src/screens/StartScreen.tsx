import React, {useEffect, useRef, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View,Image} from 'react-native';
import axios, {AxiosInstance} from 'axios';
import config from '../config/config';
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import { RootStackParamList } from '../navigation/AppNavigator';


//StartStackParamList 타입 정의
type StartStackParamList = {
    NonLogMain: undefined;
    Main: undefined;
    Login: undefined;
    Start: undefined; 
};
type NavigationProp = StackNavigationProp<StartStackParamList, 'Start'>;
/**
 * 시작 화면
 * @since 2024.12.20
 * @latest 2024.12.21
 * @author 김이현
 */
const LoadingScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const handleStart = () => {navigation.navigate('Main')}

    return (
        <View className='flex-1 flex-row items-center bg-white px-4 w-full'>
            <View className="flex flex-col justify-between gap-[13px] pt-[127px] w-full">
                <View className="flex flex-row px-4 justify-center">
                    <View className="flex flex-col justify-center">
                        <Text className='text-[36px] font-bold'>트윗 마이 펫</Text>
                    </View>
                    <View className="flex flex-col justify-center">
                        <Image className="w-[37px] h-[37px] ml-[10px]"
                            source={require("../images/common/footprint.png")}/>
                    </View>
                </View>
                <View className="flex flex-col justify-center text-[14px]">
                    <Text className='text-center text-[#717171] font-bold text-[14px]'>내 강아지와 어딜 갈지 고민된다면?</Text>
                    <Text className='text-center text-[#717171] font-bold text-[14px]'><Text className='text-[#3D47AA] font-bold text-[14px]'>여행지 추천</Text>부터 <Text className='text-[#3D47AA] font-bold text-[14px]'>리뷰</Text>까지 한눈에!</Text>
                    <Text className='text-center text-[#717171] font-bold text-[14px]'>지금 바로 <Text className='text-[#3D47AA] font-bold text-[14px]'>트윗 마이 펫</Text>을 시작해보세요!</Text>
                    
                </View>
                <View className='flex flex-row justify-center pt-[83px] pb-[127px] w-full'>
                    <Image className="w-[150px] h-[103.61px]"
                                source={require("../images/common/tweetmypet.png")}/>
                </View>
                <TouchableOpacity
                    onPress={handleStart}
                    className="bg-blue-700 py-3 px-6 rounded-lg shadow-lg hover:bg-blue-800 w-full"
                >
                    <Text className="text-white text-lg font-semibold text-center">시작하기</Text>
                </TouchableOpacity>
               
            </View>
        </View>
    );
};

export default LoadingScreen;