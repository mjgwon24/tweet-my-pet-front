import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import { Dimensions } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import clsx from 'clsx';
import config from '../config/config';
import axios, {AxiosInstance} from "axios";
import {ActivityIndicator} from "nativewind/dist/preflight";
import * as Location from 'expo-location';

const StoreListScreen = () => {
    const [activeFilter, setActiveFilter] = useState<string>('숙소');
    const [activeSort, setActiveSort] = useState<string>('거리순');
    const [sortToggle, setSortToggle] = useState<boolean>(false);
    const [storeList, setStoreList] = useState<any[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [userPosition, setUserPosition] = useState<{ pointX: number, pointY: number }>({ pointX: 0, pointY: 0 });
    const [locationName, setLocationName] = useState<string>('경주시 석장동');

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const contentWidth = screenWidth - 152;
    const lineWidth = screenWidth - 40;

    const filterOptions: { label: string; value: string, icon: keyof typeof MaterialIcons.glyphMap }[] = [
        { label: '숙소', value: 'ACCOMMODATION', icon: 'hotel' },
        { label: '식당', value: 'RESTAURANT', icon: 'restaurant' },
        { label: '카페', value: 'CAFE', icon: 'coffee' },
        { label: '캠핑', value: 'CAMPSITE', icon: 'terrain' }
    ];

    const sortOptions: { label: string, value: string }[] = [
        { label: '거리순', value: 'distance' },
        { label: '평점순', value: 'rating' }
    ];

    const axiosInstance: AxiosInstance = axios.create({
        baseURL: config.baseURL,
        responseType: 'json',
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
    });

    // 거리순 정렬 버튼 클릭 이벤트
    const handleSortByDistance = () => {
        setSortToggle(!sortToggle);
    }

    // 카테고리 값 반환
    const getCategoryValue = (label) => {
        const selected = filterOptions.find((option) => option.label === label);
        return selected ? selected.value : 'ACCOMMODATION';
    }

    // 정렬기준 값 반환
    const getSortValue = (label) => {
        const selected = sortOptions.find((option) => option.label === label);
        return selected ? selected.value : 'distance';
    }

    // 사용자 위치 정보 반환
    const getUserLocation = async () => {
        console.log("=== [4] getUserLocation called ===");
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('위치 권한이 필요합니다.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setUserPosition({
                pointX: location.coords.longitude,
                pointY: location.coords.latitude,
            });
        } catch (error) {
            console.error(error);
        }
    }

    // 사용자 위치명 반환
    const getUserLocationName = async () => {
        try {
            const response = await axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${userPosition.pointX}&y=${userPosition.pointY}`, {
                headers: {
                    Authorization: `KakaoAK ${config.kakaoAPIKey}`
                }
            });

            const { region_1depth_name, region_2depth_name, region_3depth_name } = response.data.documents[0].address;

            setLocationName(`${region_1depth_name} ${region_2depth_name} ${region_3depth_name}`);
        } catch (error) {
            setLocationName('경주시 석장동 아닌데..');
            console.error(error);
        }
    };

    // 가게 목록 데이터 반환
    const fetchStoreList = useCallback(async () => {
        console.log("=== [5] fetchStoreList called ===");

        setIsLoading(true);
        const category = getCategoryValue(activeFilter);
        const sort = getSortValue(activeSort);

        try {
            console.log("=== [7] api call ===");
            const response = await axiosInstance.get('/api/store/list', {
                params: {
                    "storeCategory": category,
                    "sort": sort,
                    "pointX": userPosition.pointX,
                    "pointY": userPosition.pointY,
                    pageNumber,
                    "size": 5
                }
            });

            const {status, msg, data} = response.data;

            if (status === 'SUCCESS' && data) {
                console.log("=== [8] SUCCESS response ===");
                const {stores, currentPage, totalPages} = data;

                if (stores && stores.length > 0) {
                    setStoreList((prev) => [...prev, ...stores]);
                    setPageNumber(currentPage + 1);

                    if (currentPage + 1 >= totalPages) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false);
                }
            } else {
                console.error("매장 목록 조회 실패:", msg);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [activeFilter, activeSort, pageNumber, isLoading, hasMore, userPosition]);

    // const handleEndReached = useCallback(() => {
    //     console.log("=== handleEndReached called ===");
    //     if (!isLoading && hasMore) {
    //         fetchStoreList();
    //     }
    // }, [hasMore, fetchStoreList]);

    // 가게 목록 데이터 초기화
    const resetStoreList = useCallback(async () => {
        console.log("=== [3] resetStoreList called ===");
        if (userPosition.pointX === 0 && userPosition.pointY === 0) await getUserLocation();
        setStoreList([]);
        setPageNumber(0);
        setHasMore(true);
    }, [userPosition]);

    // 가게 목록 초기화 함수 호출
    const initializeStoreList = useCallback(async () => {
        console.log("=== [2] initializeStoreList called ===");
        resetStoreList();
    }, [resetStoreList]);

    // 사용자 위치명 렌더링
    useEffect(() => {
        if (userPosition.pointX !== 0 && userPosition.pointY !== 0) {
            console.log("=== [4.1] useEffect called ===");
            getUserLocationName();
        }
    }, [userPosition]);

    // 초기 렌더링
    useEffect(() => {
        console.log("=== [1] useEffect called ===");
        initializeStoreList();
    }, [activeFilter, activeSort, initializeStoreList]);

    useEffect(() => {
        console.log("=== [5] fetchStoreList useEffect called ===");
        if (!isLoading && hasMore && userPosition.pointX !== 0 && userPosition.pointY !== 0) {
            fetchStoreList();
        }
    }, [hasMore, fetchStoreList, userPosition]);

    // 매장 개별 렌더링
    const renderStoreItem = ({item}) => (
        <View className="flex flex-col items-center px-5">
            <View className="flex flex-row gap-3">
                <Image className="w-[100px] h-[100px] rounded-xl" source={{uri : item.thumbPath}}/>

                <View className="flex flex-col" style={{ width: contentWidth }}>
                    <View className="flex flex-col items-start">
                        <Text className="font-bold text-[17px] pb-0.5">{item.storeName}</Text>
                        <View className="flex flex-row gap-0.5 pb-1">
                            <Text className="font-bold">⭐ {item.rating || "0.0"}</Text>
                            <Text className="font-semibold text-[13px] text-[#3D3D3D]">({item.reviewCount || 0})</Text>
                            <Text className="font-semibold text-[13px] text-[#3D3D3D]">· {item.distanceSpacing + "km" || "0km"}</Text>
                        </View>
                        <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">{item.location || ""}</Text>
                        <Text className="font-semibold text-[14px] text-[#70756D] pb-0.5">{item.feature || ""}</Text>
                    </View>

                    {["ACCOMMODATION", "CAMPSITE"].includes(item.storeCategory) && (
                        <View className="flex flex-col items-end">
                            <Text className="font-semibold text-[14px] text-[#303030] pb-0.5">1박</Text>
                            <Text className="font-bold text-[17px] pb-0.5">{new Intl.NumberFormat('ko-KR').format(item.lowerPrice || 0)}원</Text>
                        </View>
                    )}
                </View>
            </View>

            <View className="h-[1px] bg-[#E7E7E7] my-4" style={{ width: lineWidth }}></View>
        </View>
    );

    // 정렬 헤더 렌더링
    const renderListHeader = () => (
        <View className="flex flex-row justify-end w-full py-4 px-5">
            <TouchableOpacity className="flex flex-row items-center gap-0.5"
                              onPress={handleSortByDistance}>
                <Text className="text-[#70756D] font-semibold">{activeSort}</Text>
                <Image className="w-[8px] h-[10px]" source={require("../images/common/top-bottom-arrow-black.png")}/>
            </TouchableOpacity>
        </View>
    );

    // 로딩 푸터 렌더링
    const renderListFooter = () => {
        if (!isLoading) return null;

        return <ActivityIndicator size="large" color="#3D47AA" />;
    }

    // 빈 목록 메시지 렌더링
    const renderEmptyListMessage = () => (
        <View className="flex flex-col items-center justify-center py-5">
            <Text className="font-bold text-[20px] text-[#70756D]">등록된 {activeFilter} 목록이 없습니다</Text>
        </View>
    );

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
                        <Text className="font-bold text-[20px]">{locationName}</Text>
                        <Image className="w-[15px] h-[15px]" source={require("../images/common/bottom-toggle-black.png")}/>
                    </View>
                </View>

                <View className="flex flex-row items-center gap-4 py-1">
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

            <View className="flex flex-col bg-white z-40 py-2 w-full h-full">
                <FlatList data={storeList}
                          renderItem={renderStoreItem}
                          keyExtractor={(item, index) => `${item.id}-${index}`}
                          // onEndReached={handleEndReached}
                          onEndReachedThreshold={0.3}
                          ListHeaderComponent={renderListHeader}
                          ListFooterComponent={renderListFooter}
                          ListEmptyComponent={renderEmptyListMessage}
                          contentContainerStyle={{ paddingBottom: 340 }}
                />
            </View>

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
                        {sortOptions.map((array) => (
                            <TouchableOpacity key={array.label} activeOpacity={1}
                                              onPress={() => {
                                                  handleSortByDistance();
                                                  setActiveSort(array.label);
                                              }}
                                              className={clsx(
                                                  "border-[1.5px] bg-white rounded-lg w-[145px] h-[30px] items-center justify-center",
                                                  activeSort === array.label ? "border-[#3D47AA]" : "border-[#9E9E9E]"
                                              )}>
                                <Text className={clsx(
                                    "font-semibold text-[16px]",
                                    activeSort === array.label ? "text-[#3D47AA]" : "text-[#9E9E9E]"
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