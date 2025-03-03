import React, { useState, useEffect, useRef } from 'react';
import {View, Text, TouchableOpacity, Dimensions, Alert, Linking, Modal, Image, SafeAreaView} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as Location from 'expo-location';
import config from "../config/config";
import BarbecueIcon from '../images/common/barbecue-icon.png';
import ParkingIcon from '../images/common/parking-icon.png';
import DogParkIcon from '../images/common/dog-park-icon.png';
import DogSwimmingPoolIcon from '../images/common/dog-swimming-pool-icon.png';
import InternetIcon from '../images/common/internet-icon.png';
import FoodPackingIcon from '../images/common/food-packing-icon.png';
import ToiletDivisionIcon from '../images/common/toilet-division-icon.png';
import WaitingPlaceIcon from '../images/common/waiting-place-icon.png';
import LargeDogIcon from '../images/common/large-dog-icon.png';
import MediumDogIcon from '../images/common/medium-dog-icon.png';
import SmallDogIcon from '../images/common/small-dog-icon.png';
import KidSeatIcon from '../images/common/kid-seat-icon.png';
type NavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import handleSortByDistance from '../screens/StoreListScreen';


const MapScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState<Location[]>([]);
    const webViewRef = useRef<WebView>(null);
    const [webViewReady, setWebViewReady] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
    const [pressedFilter, setPressedFilter] = useState<number | null>(null);

    interface Features {
        isSmallDog: boolean;
        isMediumDog: boolean;
        isLargeDog: boolean;
        isParking: boolean;
        isDogPark: boolean;
        isDogSwimmingPool: boolean;
        isInternet: boolean;
        isBarbecue: boolean;
        isToiletDivision: boolean;
        isFoodPacking: boolean;
        isWaitingPlace: boolean;
        isKidSeat: boolean;
    }

    interface Location {
        name: string;
        coords: { lat: number; lng: number };
        rating: number;
        reviewCount: number;
        location: string;
        features: Features;
        price: string;
        distance?: number;
        Category: string;
        thumbPath?: string;
    }

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };


    const filterOptions = [
        { label: '숙소', icon: 'hotel', category: 'ACCOMMODATION' },
        { label: '식당', icon: 'restaurant', category: 'RESTAURANT' },
        { label: '카페', icon: 'coffee', category: 'CAFE' },
        { label: '캠핑', icon: 'terrain', category: 'CAMPSITE' },
    ];

    const featureList = [
        { key: 'isLargeDog', icon: LargeDogIcon, label: '대형견' },
        { key: 'isMediumDog', icon: MediumDogIcon, label: '중형견' },
        { key: 'isSmallDog', icon: SmallDogIcon, label: '소형견' },
        { key: 'isParking', icon: ParkingIcon, label: '주차장' },
        { key: 'isDogPark', icon: DogParkIcon, label: '애견놀이터' },
        { key: 'isDogSwimmingPool', icon: DogSwimmingPoolIcon, label: '애견수영장' },
        { key: 'isInternet', icon: InternetIcon, label: '무선인터넷' },
        { key: 'isBarbecue', icon: BarbecueIcon, label: '바베큐' },
        { key: 'isToiletDivision', icon: ToiletDivisionIcon, label: '남/녀화장실 구분' },
        { key: 'isFoodPacking', icon: FoodPackingIcon, label: '포장' },
        { key: 'isWaitingPlace', icon: WaitingPlaceIcon, label: '대기장소' },
        { key: 'isKidSeat', icon: KidSeatIcon, label: '유아용의자' },
    ];

    const getFilteredLocations = () => {
        if (selectedFilter === null) return locations; // 필터 선택되지 않음 → 모든 마커 표시
        const selectedCategory = filterOptions[selectedFilter].category;
        return locations.filter(location => location.Category === selectedCategory);
    };
    const filteredLocations = getFilteredLocations();
    useEffect(() => {
        if (webViewReady && webViewRef.current) {
            const script = `
                updateMarkers(${JSON.stringify(filteredLocations)});
            `;
            webViewRef.current.injectJavaScript(script);
        }
    }, [filteredLocations, webViewReady]);
    const gap = 8;
    const buttonWidth = (screenWidth * 0.9 - gap * (filterOptions.length - 1)) / filterOptions.length;

    const handleWebViewLoad = () => {
        setWebViewReady(true);
    };

    const getUserLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low,
            });

            setMapCenter({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            });



            // 위치 가져온 후 fetchLocations 호출
            fetchLocations(location.coords.latitude, location.coords.longitude);
        } catch (error) {
            Alert.alert('Error', 'Failed to retrieve user location.');
            console.error("Get User Location Error:", error);
        } finally {
            setLoading(false);
        }
    };


    const moveToMyLocation = () => {
        if (!webViewReady || !mapCenter || !webViewRef.current) return;

        const script = `
            moveToMyLocation(${mapCenter.lat}, ${mapCenter.lng});
        `;

        webViewRef.current.injectJavaScript(script);
    };

    const fetchLocations = async (latitude, longitude) => {
        try {
            const response = await fetch(`${config.baseURL}api/store/coordinates`);
            const responseData = await response.json();

            if (responseData && Array.isArray(responseData.data)) {
                const transformedData = responseData.data.map((store: any) => {
                    const distance = latitude && longitude
                        ? haversineDistance(
                            latitude,
                            longitude,
                            store.latitude,
                            store.longitude
                        )
                        : null;

                    return {
                        name: store.name,
                        coords: { lat: store.latitude, lng: store.longitude },
                        rating: store.rating || 0,
                        reviewCount: store.reviewCount || 0,
                        Category: store.storeCategory,
                        location: store.location || "Location unavailable",
                        thumbPath: store.thumbPath,
                        price: store.price || "0원",
                        distance: distance ? parseFloat(distance.toFixed(1)) : null,
                        features: {
                            isSmallDog: store.smallDog || false,
                            isMediumDog: store.mediumDog || false,
                            isLargeDog: store.largeDog || false,
                            isParking: store.parking || false,
                            isDogPark: store.dogPark || false,
                            isDogSwimmingPool: store.dogSwimmingPool || false,
                            isInternet: store.internet || false,
                            isBarbecue: store.barbecue || false,
                            isToiletDivision: store.toiletDivision || false,
                            isFoodPacking: store.foodPacking || false,
                            isWaitingPlace: store.waitingPlace || false,
                            isKidSeat: store.kidSeat || false,
                        },
                    };
                });

                setLocations(transformedData);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch store information.');
            console.error("Fetch Locations Error:", error);
        }
    };


    useEffect(() => {
        getUserLocation();
    }, []);

    const kakaoMapHTML = mapCenter
        ? `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=ac0f83c7a2433e270a24c37513e776e7"></script>
    <style> 
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; }
        #map { width: 100%; height: 100%; } 
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        var map;
        var markers = []; // 기존 마커를 관리하는 배열

        // 맵 초기화
        var map = new kakao.maps.Map(document.getElementById('map'), { 
            center: new kakao.maps.LatLng(${mapCenter.lat}, ${mapCenter.lng}), 
            level: 3 
        });

        // React에서 전달받은 위치로 맵 중심 이동
        window.moveToMyLocation = function(lat, lng) {
            var moveLatLng = new kakao.maps.LatLng(lat, lng);
            map.setCenter(moveLatLng);
        };

        // 마커를 업데이트하는 함수
        function updateMarkers(newLocations) {
            // 기존 마커 삭제
            markers.forEach(marker => marker.setMap(null)); // 마커 제거
            markers = []; // 배열 초기화

            // 새 마커 추가
            newLocations.forEach(function(location) {
                if (location.coords) {
                    var marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(location.coords.lat, location.coords.lng),
                        map: map
                    });

                    // 마커 클릭 이벤트 추가
                    kakao.maps.event.addListener(marker, 'click', function() {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            name: location.name,
                            coords: location.coords,
                            rating: location.rating,
                            reviewCount: location.reviewCount,
                            location: location.location,
                            features: location.features,
                            price: location.price,
                            thumbPath: location.thumbPath,
                            distance: location.distance,
                        }));
                    });

                    // 마커 배열에 추가
                    markers.push(marker);
                }
            });
        }

        // React에서 호출할 수 있도록 updateMarkers 함수를 전역으로 등록
        window.updateMarkers = updateMarkers;

        // React로 초기 맵 중심 정보를 전달
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapCenter', 
            lat: ${mapCenter.lat}, 
            lng: ${mapCenter.lng}
        }));
    </script>
</body>
</html>

` : '';
    const handleFilterPress = (index: number) => {
        setSelectedFilter(selectedFilter === index ? null : index);
    };
    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* WebView 영역 */}
            <View className="flex-1">
                <WebView
                    originWhitelist={['*']}
                    source={{ html: kakaoMapHTML }}
                    className="flex-1"
                    ref={webViewRef}
                    onLoad={handleWebViewLoad}
                    onMessage={(event) => {
                        try {
                            const data = JSON.parse(event.nativeEvent.data);

                            if (data.name) {
                                setSelectedLocation(data);
                            }
                        } catch (error) {
                            console.error("Invalid JSON from WebView:", event.nativeEvent.data);
                        }
                    }}
                />
            </View>

            {/* TouchableWithoutFeedback으로 전체 화면 감싸기 */}
            {selectedLocation && (
                <View
                    className="absolute bottom-0 left-0 w-full bg-white rounded-t-lg shadow-lg z-50"
                    style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        height: '38%',
                    }}
                >

                <TouchableOpacity
                        onPress={() => setSelectedLocation(null)}
                        activeOpacity={0.7}
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 10,
                        }}
                    >
                        <MaterialIcons name="close" size={24} color="#BFBFBF" />
                    </TouchableOpacity>

                    {/* 길찾기 버튼 */}
                    <TouchableOpacity
                        onPress={() => {
                            const url = `https://map.kakao.com/link/to/${selectedLocation?.name},${selectedLocation?.coords.lat},${selectedLocation?.coords.lng}`;
                            Linking.openURL(url);
                        }}
                        className="z-50 absolute right-3 top-12 bg-[#3D47AA] rounded-full px-4 py-2 flex-row items-center"
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="directions" size={18} color="#FFFFFF" />
                        <Text className="text-white text-xs font-bold ml-2">길찾기</Text>
                    </TouchableOpacity>

                    <View
                        className="flex-row items-start pl-2 pt-8 rounded-xl"
                    >
                        <Image
                            source={{ uri: selectedLocation?.thumbPath || 'https://via.placeholder.com/150' }}
                            className="w-28 h-28 rounded-lg mr-4"
                        />

                        {/* 텍스트 데이터 + 아이콘 */}
                        <View className="flex-1">
                            {/* 텍스트 데이터 */}
                            <View className="mb-2">
                                <Text className="font-bold text-xl">{selectedLocation?.name || "No Name Available"}</Text>
                                <Text className="text-gray-400 text-sm">
                                    ⭐ {selectedLocation?.rating || 0} ({selectedLocation?.reviewCount || 0})
                                </Text>
                                <Text className="text-neutral-400 text-sm">{selectedLocation?.location || "No Location Available"}</Text>
                                {selectedLocation?.distance !== undefined && (
                                    <Text className="text-gray-400 z-50 text-xs">
                                        거리: {selectedLocation.distance} km
                                    </Text>
                                )}
                            </View>

                            {/* Features Section */}
                            <View className="flex-row flex-wrap">
                                {featureList
                                    .filter((feature) => selectedLocation.features?.[feature.key])
                                    .slice(0, 3)
                                    .map((feature) => (
                                        <View key={feature.key} className="flex items-center w-1/4 p-1">
                                            <Image
                                                source={feature.icon}
                                                resizeMode="contain"
                                                className="w-5 h-5 "
                                            />
                                            <Text className="text-xs text-gray-600">{feature.label}</Text>
                                        </View>
                                    ))}
                            </View>
                        </View>
                    </View>
                </View>
            )}

            <View className="absolute top-8 left-5 right-5 flex-row items-center">
                <TouchableOpacity
                    className="flex-row bg-white rounded-md px-3.5 py-3.5 shadow-xl"
                    style={{ width: screenWidth * 0.9, height: screenHeight * 0.06 }}
                    onPress={() => navigation.navigate('MapSearch')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="search" size={20} color="gray" style={{ marginTop: 2 }} />
                    <Text className="flex-1 text-gray-400 text-base ml-2">
                        장소를 검색하세요.
                    </Text>
                </TouchableOpacity>


            </View>

            <View
                className="absolute top-24 left-5 right-5 flex-row items-center"
                style={{ width: screenWidth * 0.74, justifyContent: 'space-between' }}
            >
                {filterOptions.map((option, idx) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => handleFilterPress(idx)}
                        onPressIn={() => setPressedFilter(idx)}
                        onPressOut={() => setPressedFilter(null)}
                        className="flex-row items-center justify-center border rounded-lg px-2 py-1"
                        style={{
                            width: buttonWidth,
                            marginRight: idx < filterOptions.length - 1 ? gap : 0,
                            backgroundColor: pressedFilter === idx
                                ? 'rgba(61, 71, 170, 0.8)'
                                : selectedFilter === idx ? '#3D47AA' : '#FFFFFF',
                            borderColor: '#3D47AA',
                        }}
                    >
                        <MaterialIcons
                            name={option.icon}
                            size={16}
                            color={selectedFilter === idx ? '#FFFFFF' : '#3D47AA'}
                        />
                        <Text
                            className="ml-1 text-sm"
                            style={{
                                color: selectedFilter === idx ? '#FFFFFF' : '#3D47AA',
                            }}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 버튼 영역 */}
            <View className="absolute bottom-24 left-0 w-full flex-row items-start px-5 z-50">
                {/* 내 위치 버튼 */}
                {!selectedLocation && (
                    <TouchableOpacity
                        className="bg-[#3D47AA] rounded-lg items-center justify-center"
                        style={{ width: screenWidth * 0.13, height: screenWidth * 0.13 }}
                        onPress={() => {
                            moveToMyLocation();
                        }}
                        activeOpacity={0.5}
                    >
                        <Ionicons name="locate" size={22} color="white" />
                        <Text className="text-white text-xs font-medium mt-1">내 위치</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* 전체보기 버튼 */}
            <View className="absolute bottom-24 left-0 w-full items-center z-30">
                <TouchableOpacity
                    className="bg-white rounded-lg shadow-md px-5 py-2"
                    onPress={() => navigation.navigate('Accommodation')}
                >
                    <Text className="text-[#3D47AA] font-semibold text-lg">전체보기</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default MapScreen;