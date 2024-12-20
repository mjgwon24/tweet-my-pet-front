import React, {useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import { Dimensions } from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import {Simulate} from "react-dom/test-utils";
import cancel = Simulate.cancel;
import clsx from "clsx";

const StoreListScreen = () => {
    const [activeFilter, setActiveFilter] = useState("숙소");
    const [sortToggle, setSortToggle] = useState(false);
    const [nowArrayState, setNowArrayState] = useState("거리순");
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const contentWidth = screenWidth - 152;
    const lineWidth = screenWidth - 40;

    const filterOptions: { label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
        { label: '숙소', icon: 'hotel' },
        { label: '식당', icon: 'restaurant' },
        { label: '카페', icon: 'coffee' },
        { label: '캠핑', icon: 'terrain' },
    ];

    const arrayOptions: { label: string }[] = [
        { label: '거리순' },
        { label: '평점순' },
        { label: '낮은 가격순' },
    ];

    // 거리순 정렬 버튼 클릭 이벤트
    const handleSortByDistance = () => {
        setSortToggle(!sortToggle);
    }

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
                    {filterOptions.map((filter) => (
                        <TouchableOpacity
                            key={filter.label}
                            activeOpacity={1}
                            onPress={() => setActiveFilter(filter.label)}
                            className={clsx(
                                "flex-row items-center justify-center rounded-[6px] w-[65px] h-[30px]",
                                activeFilter === filter.label ? "bg-[#3D47AA]" : "bg-[#F5F5F5]"
                            )}>
                            <MaterialIcons
                                name={filter.icon} size={16}
                                color={activeFilter === filter.label ? "#FFFFFF" : "#3D47AA"} />
                            <Text className={`text-${activeFilter === filter.label ? "white" : ""} font-bold ml-1.5`}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
                <View className="flex flex-col bg-white z-40 py-2 px-5 w-full">
                    <View className="flex flex-row justify-end w-full py-4">
                        <TouchableOpacity className="flex flex-row items-center gap-0.5"
                                          onPress={handleSortByDistance}>
                            <Text className="text-[#70756D] font-semibold">{nowArrayState}</Text>
                            <Image className="w-[8px] h-[10px]" source={require("../images/common/top-bottom-arrow-black.png")}/>
                        </TouchableOpacity>
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

            <View className="absolute" style={{zIndex: 50, top: screenHeight - 230}}>
                <View className="bg-white rounded-[8px] py-2.5 px-6" style={{boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.20)"}}>
                    <Text className="font-bold text-[16px] text-[#3D47AA]">지도보기</Text>
                </View>
            </View>

            <View className="absolute" style={{zIndex: 50, top: screenHeight - 165}}>
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

            <View className={clsx(
                "absolute top-0 bg-[#0000001A]",
                sortToggle === false ? "hidden" : "block")}
                  style={{zIndex: 100, width: screenWidth, height: screenHeight}}
            >
            </View>

            <View className={clsx("absolute", sortToggle === false ? "hidden" : "block")}
                  style={{zIndex: 100, top: screenHeight - 260}}>
                <View className="bg-white rounded-t-xl flex flex-col items-center h-[260px] px-7 py-6"
                      style={{width: screenWidth}}>
                    <View className="flex flex-row justify-between px-7 pb-5" style={{width: screenWidth}}>
                        <Text className="font-bold text-[18px]">
                            정렬 기준
                        </Text>
                        <TouchableOpacity onPress={handleSortByDistance} activeOpacity={1}>
                            <MaterialIcons name={"close"} size={18} color={"#B8B8B8"}/>
                        </TouchableOpacity>
                    </View>

                    <View className="flex flex-row justify-between px-7" style={{width: screenWidth}}>
                        {arrayOptions.map((array) => (
                            <TouchableOpacity key={array.label} activeOpacity={1}
                                              onPress={() => {
                                                  handleSortByDistance();
                                                  setNowArrayState(array.label);
                                              }}
                                              className={clsx(
                                                  "border-[1.5px] bg-white rounded-lg w-[85px] h-[30px] items-center justify-center",
                                                  nowArrayState === array.label ? "border-[#3D47AA]" : "border-[#818181]"
                                              )}>
                                <Text className={clsx(
                                    "font-semibold text-[16px]",
                                    nowArrayState === array.label ? "text-[#3D47AA]" : "text-[#818181]"
                                )}>
                                    {array.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>
            </View>

        </View>
    );
};

export default StoreListScreen;