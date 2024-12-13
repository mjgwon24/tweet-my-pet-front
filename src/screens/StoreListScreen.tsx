import React from 'react';
import {Image, ScrollView, Text, View} from "react-native";
import { Dimensions } from 'react-native';

const StoreListScreen = () => {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const contentWidth = screenWidth - 152;
    const lineWidth = screenWidth - 40;

    return (
        <View className="flex flex-col items-center">
            <View className="flex flex-col items-center bg-white w-full p-2 z-50"
                  style={{boxShadow: "0px 4px 7px 0px rgba(0, 0, 0, 0.07)"}}>
                <View className="flex flex-row items-center justify-center w-full py-3.5">
                    <View className="absolute left-0">
                        <Image className="w-[23px] h-[30px]"
                               source={require("../images/common/left-arrow-black.png")}/>
                    </View>

                    <View className="flex flex-row items-center gap-0.5">
                        <Text className="font-bold text-[20px]">경주시 석장동</Text>
                        <Image className="w-[15px] h-[15px]" source={require("../images/common/bottom-toggle-black.png")}/>
                    </View>
                </View>

                <View className="flex flex-row items-center gap-2.5 py-1">
                    <View className="flex-row items-center justify-center bg-[#3D47AA] rounded-[6px] w-[65px] h-[30px]">
                        <Image className="w-[10px] h-[10px] mr-1.5"
                               source={require("../images/facilities/accommodation-white.png")} />
                        <Text className="text-white font-bold">숙소</Text>
                    </View>

                    <View className="flex-row items-center justify-center bg-[#F5F5F5] rounded-[6px] w-[65px] h-[30px]">
                        <Image className="w-[12px] h-[12px] mr-1.5"
                               source={require("../images/facilities/restaurant-blue.png")} />
                        <Text className="font-semibold">식당</Text>
                    </View>

                    <View className="flex flex-row items-center justify-center bg-[#F5F5F5] rounded-[6px] w-[65px] h-[30px]">
                        <Image className="w-[10px] h-[10px] mr-1.5"
                               source={require("../images/facilities/cafe-blue.png")} />
                        <Text className="font-semibold">카페</Text>
                    </View>

                    <View className="flex flex-row items-center justify-center bg-[#F5F5F5] rounded-[6px] w-[65px] h-[30px]">
                        <Image className="w-[10px] h-[10px] mr-1.5"
                               style={{ margin: 0, padding: 0 }}
                               source={require("../images/facilities/camping-blue.png")} />
                        <Text className="font-semibold">캠핑</Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
                <View className="flex flex-col bg-white z-40 py-2 px-5 w-full">
                    <View className="flex flex-row justify-end w-full py-4">
                        <View className="flex flex-row items-center gap-0.5">
                            <Text className="text-[#70756D] font-semibold">거리순</Text>
                            <Image className="w-[8px] h-[10px]" source={require("../images/common/top-bottom-arrow-black.png")}/>
                        </View>
                    </View>

                    <View className="flex flex-col items-center">
                        <View className="flex flex-row gap-3">
                            <View className="bg-gray-200 rounded-xl w-[100px] h-[100px]"></View>

                            <View className="flex flex-col" style={{ width: contentWidth }}>
                                <View className="flex flex-col items-start">
                                    <Text className="font-bold text-[17px] pb-0.5">경주 숙소</Text>
                                    <View className="flex flex-row gap-0.5 pb-1">
                                        <Text className="font-bold">⭐ 4.4</Text>
                                        <Text className="font-semibold text-[13px] text-[#3D3D3D]">(3)</Text>
                                    </View>
                                    <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">경상북도 경주시 석장동 어딘가.....</Text>
                                    <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">모든 견종 • 애견동반 • 주차장 </Text>
                                </View>

                                <View className="flex flex-col items-end">
                                    <Text className="font-semibold text-[14px] text-[#303030] pb-0.5">1박</Text>
                                    <Text className="font-bold text-[17px] pb-0.5">30,000원</Text>
                                </View>
                            </View>
                        </View>

                        <View className="h-[1px] bg-[#E7E7E7] my-4" style={{ width: lineWidth }}></View>

                        <View className="flex flex-row gap-3">
                            <View className="bg-gray-200 rounded-xl w-[100px] h-[100px]"></View>

                            <View className="flex flex-col" style={{ width: contentWidth }}>
                                <View className="flex flex-col items-start">
                                    <Text className="font-bold text-[17px] pb-0.5">경주 숙소</Text>
                                    <View className="flex flex-row gap-0.5 pb-1">
                                        <Text className="font-bold">⭐ 4.4</Text>
                                        <Text className="font-semibold text-[13px] text-[#3D3D3D]">(3)</Text>
                                    </View>
                                    <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">경상북도 경주시 석장동 어딘가.....</Text>
                                    <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">모든 견종 • 애견동반 • 주차장 </Text>
                                </View>

                                <View className="flex flex-col items-end">
                                    <Text className="font-semibold text-[14px] text-[#303030] pb-0.5">1박</Text>
                                    <Text className="font-bold text-[17px] pb-0.5">30,000원</Text>
                                </View>
                            </View>
                        </View>

                        <View className="h-[1px] bg-[#E7E7E7] my-4" style={{ width: lineWidth }}></View>

                        <View className="flex flex-row gap-3">
                            <View className="bg-gray-200 rounded-xl w-[100px] h-[100px]"></View>

                            <View className="flex flex-col" style={{ width: contentWidth }}>
                                <View className="flex flex-col items-start">
                                    <Text className="font-bold text-[17px] pb-0.5">경주 숙소</Text>
                                    <View className="flex flex-row gap-0.5 pb-1">
                                        <Text className="font-bold">⭐ 4.4</Text>
                                        <Text className="font-semibold text-[13px] text-[#3D3D3D]">(3)</Text>
                                    </View>
                                    <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">경상북도 경주시 석장동 어딘가.....</Text>
                                    <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">모든 견종 • 애견동반 • 주차장 </Text>
                                </View>

                                <View className="flex flex-col items-end">
                                    <Text className="font-semibold text-[14px] text-[#303030] pb-0.5">1박</Text>
                                    <Text className="font-bold text-[17px] pb-0.5">30,000원</Text>
                                </View>
                            </View>
                        </View>

                        <View className="h-[1px] bg-[#E7E7E7] my-4" style={{ width: lineWidth }}></View>

                        <View className="flex flex-row gap-3">
                            <View className="bg-gray-200 rounded-xl w-[100px] h-[100px]"></View>

                            <View className="flex flex-col" style={{ width: contentWidth }}>
                                <View className="flex flex-col items-start">
                                    <Text className="font-bold text-[17px] pb-0.5">경주 숙소</Text>
                                    <View className="flex flex-row gap-0.5 pb-1">
                                        <Text className="font-bold">⭐ 4.4</Text>
                                        <Text className="font-semibold text-[13px] text-[#3D3D3D]">(3)</Text>
                                    </View>
                                    <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">경상북도 경주시 석장동 어딘가.....</Text>
                                    <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">모든 견종 • 애견동반 • 주차장 </Text>
                                </View>

                                <View className="flex flex-col items-end">
                                    <Text className="font-semibold text-[14px] text-[#303030] pb-0.5">1박</Text>
                                    <Text className="font-bold text-[17px] pb-0.5">30,000원</Text>
                                </View>
                            </View>
                        </View>

                        <View className="h-[1px] bg-[#E7E7E7] my-4" style={{ width: lineWidth }}></View>

                        <View className="flex flex-row gap-3">
                            <View className="bg-gray-200 rounded-xl w-[100px] h-[100px]"></View>

                            <View className="flex flex-col" style={{ width: contentWidth }}>
                                <View className="flex flex-col items-start">
                                    <Text className="font-bold text-[17px] pb-0.5">경주 숙소</Text>
                                    <View className="flex flex-row gap-0.5 pb-1">
                                        <Text className="font-bold">⭐ 4.4</Text>
                                        <Text className="font-semibold text-[13px] text-[#3D3D3D]">(3)</Text>
                                    </View>
                                    <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">경상북도 경주시 석장동 어딘가.....</Text>
                                    <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">모든 견종 • 애견동반 • 주차장 </Text>
                                </View>

                                <View className="flex flex-col items-end">
                                    <Text className="font-semibold text-[14px] text-[#303030] pb-0.5">1박</Text>
                                    <Text className="font-bold text-[17px] pb-0.5">30,000원</Text>
                                </View>
                            </View>
                        </View>

                        <View className="h-[1px] bg-[#E7E7E7] my-4" style={{ width: lineWidth }}></View>
                    </View>
                </View>
            </ScrollView>

            <View className="absolute z-50" style={{top: screenHeight - 230}}>
                <View className="bg-white rounded-[8px] py-2.5 px-6" style={{boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.20)"}}>
                    <Text className="font-bold text-[16px] text-[#3D47AA]">지도보기</Text>
                </View>
            </View>

            <View className="absolute z-50" style={{top: screenHeight - 165}}>
                <View className="flex flex-row justify-between bg-white border-[#E7E7E7] h-[165px] pt-3.5 px-5"
                      style={{boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.20)", width: screenWidth}}>
                    <View className="flex flex-col items-center w-[50px]">
                        <Image className="w-[12px] h-[12px] mb-1"
                               source={require("../images/common/map-icon-gray.png")}/>
                        <Text className="font-bold text-[13px] text-[#BEBEBE]">지도</Text>
                    </View>

                    <View className="flex flex-col items-center w-[50px]">
                        <Image className="w-[12px] h-[12px] mb-1"
                               source={require("../images/common/search-icon-gray.png")}/>
                        <Text className="font-bold text-[13px] text-[#BEBEBE]">검색</Text>
                    </View>

                    <View className="flex flex-col items-center w-[50px]">
                        <Image className="w-[16px] h-[15px] mb-0.5"
                               source={require("../images/common/home-icon-gray.png")}/>
                        <Text className="font-bold text-[13px] text-[#BEBEBE]">홈</Text>
                    </View>

                    <View className="flex flex-col items-center w-[50px]">
                        <Image className="w-[13px] h-[13px] mb-1"
                               source={require("../images/common/community-icon-gray.png")}/>
                        <Text className="font-bold text-[13px] text-[#BEBEBE]">커뮤니티</Text>
                    </View>

                    <View className="flex flex-col items-center w-[50px]">
                        <Image className="w-[13px] h-[13px] mb-1"
                               source={require("../images/common/mypage-icon-gray.png")}/>
                        <Text className="font-bold text-[13px] text-[#BEBEBE]">마이홈</Text>
                    </View>
                </View>
            </View>

        </View>
    );
};

export default StoreListScreen;