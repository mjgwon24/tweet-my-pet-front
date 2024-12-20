import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as Location from 'expo-location';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const MapsScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedLocation] = useState('');
    const [loading, setLoading] = useState(true);

    const getUserLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Error', '위치 권한이 필요합니다.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setMapCenter({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            });
        } catch (error) {
            Alert.alert('Error', '위치 정보를 가져올 수 없습니다.');
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    useEffect(() => {
        getUserLocation();
    }, []);

    const filterOptions: { label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
        { label: '숙소', icon: 'hotel' },
        { label: '식당', icon: 'restaurant' },
        { label: '카페', icon: 'coffee' },
        { label: '캠핑', icon: 'terrain' },
    ];



    const openKakaoMap = () => {
        const kakaoMapURL = `https://map.kakao.com/link/to/${encodeURIComponent(selectedLocation)},${mapCenter.lat},${mapCenter.lng}`;
        Linking.openURL(kakaoMapURL).catch((err) =>
            Alert.alert("Error", "Failed to open Kakao Map: " + err.message)
        );
    };

    const kakaoMapHTML = mapCenter
        ? `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=9dab16bb968b4eafb714cbb910e15ac3"></script>
    <style> body, html { margin: 0; padding: 0; width: 100%; height: 100%; } #map { width: 100%; height: 100%; } </style>
</head>
<body>
    <div id="map"></div>
    <script>
        var map = new kakao.maps.Map(document.getElementById('map'), { 
            center: new kakao.maps.LatLng(${mapCenter.lat}, ${mapCenter.lng}), 
            level: 3 
        });
                       
    var locations = [
        { name: "료미", coords: { lat: 35.835555418, lng: 129.209822015 } },
        { name: "여정1998", coords: { lat: 35.881710147, lng: 129.223305260 } },
        { name: "오늘을 담다", coords: { lat: 35.842056153, lng: 129.215413870 } },
        { name: "줄리스", coords: { lat: 35.837745912, lng: 129.210509813 } },
        { name: "황남두꺼비식당", coords: { lat: 35.834492399, lng: 129.210916962 } },
        { name: "계림주막", coords: { lat: 35.834939291, lng: 129.211955666 } },
        { name: "손가맥집", coords: { lat: 35.835060662, lng: 129.212282326 } },
        { name: "삐또레", coords: { lat: 35.865036137, lng: 129.212160825 } },
        { name: "르씨엘", coords: { lat: 35.85042094571064, lng: 129.19725658882717 } },
        { name: "서점 북미", coords: { lat: 35.847463057, lng: 129.215413870 } },
        { name: "오버랩", coords: { lat: 35.839814867, lng: 129.206284350 } },
        { name: "태를지", coords: { lat: 35.839149499, lng: 129.208649333 } },
        { name: "미실카페", coords: { lat: 35.838139673, lng: 129.209246196 } },
        { name: "카페솔", coords: { lat: 35.835423787, lng: 129.214659877 } },
        { name: "이이로", coords: { lat: 35.835157988, lng: 129.212708086 } }
];

        locations.forEach(function(location) {
            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(location.coords.lat, location.coords.lng),
                map: map
            });

            var infowindow = new kakao.maps.InfoWindow({
                content: '<div style="padding:5px;">' + location.name + '</div>'
            });

            kakao.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
        });
    </script>
</body>
</html>
` : '';


    return (
        <View className="flex-1">
            <WebView originWhitelist={['*']} source={{ html: kakaoMapHTML }} className="flex-1" />

                <TouchableOpacity
                    className="absolute top-8 left-5 right-5 flex-row bg-white rounded-md px-4 py-2 shadow-lg"
                    onPress={() => navigation.navigate('MapSearchScreen')}
                    style={{ width: screenWidth * 0.74 }}
                >
                    <Ionicons name="search" size={20} color="gray" />
                    <Text className="flex-1 text-gray-400 text-base ml-2">장소를 검색하세요</Text>
                    <Ionicons name="mic-outline" size={20} color="gray" />
                </TouchableOpacity>

            <TouchableOpacity
                className="absolute top-8 right-4 bg-indigo-600 rounded-full items-center justify-center p-2"
                style={{ width: screenWidth * 0.13, height: screenWidth * 0.13 }}
                onPress={openKakaoMap}
            >
                <MaterialIcons name="turn-right" size={20} color="white" />
                <Text className="text-white text-xs mt-1">길찾기</Text>
            </TouchableOpacity>

            {/* 필터 버튼 */}
            <View className="absolute top-24 left-5 right-5 flex-row gap-4"
                  style={{ width: screenWidth * 0.13, height: screenWidth * 0.13 }}>
                {['숙소', '식당', '카페', '캠핑'].map((label, idx) => (
                    <TouchableOpacity
                        key={idx}
                        className="flex-row items-center justify-center border border-indigo-600 bg-white rounded-lg px-2 py-1"
                    >
                        <MaterialIcons name="location-on" size={16} color="#3D47AA" />
                        <Text className="ml-1 text-indigo-600 text-sm">{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 전체보기 버튼 */}
            <TouchableOpacity
                className="absolute bottom-5 self-center bg-white rounded-lg shadow-md px-5 py-2"
            >
                <Text className="text-indigo-600 font-bold text-lg">전체보기</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MapsScreen;