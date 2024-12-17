import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import mapData from '../data/mapdata.json';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const screenWidth = Dimensions.get('window').width;

const MapsScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [mapCenter, setMapCenter] = useState({ lat: 35.8562, lng: 129.2247 });
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState('');

    const handleLocationSelect = (region, location) => {
        const regionData = mapData.find((r) => r.name === region);
        const locationData = regionData?.locations.find((l) => l.name === location);

        if (locationData) {
            setSelectedRegion(region);
            setSelectedLocation(location);
            setMapCenter(locationData.coords);
        }
    };

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

    const kakaoMapHTML = `
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
`;

    return (
        <View style={styles.container}>
            {/* Kakao Map */}
            <WebView originWhitelist={['*']} source={{ html: kakaoMapHTML }} style={{ flex: 1 }} />

            {/* Search Bar */}
            <TouchableOpacity
                style={styles.searchBarContainer}
                onPress={() => navigation.navigate('MapSearchScreen')}
            >
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                    <Text style={styles.searchPlaceholder}>장소를 검색하세요</Text>
                    <Ionicons name="mic-outline" size={20} color="gray" style={styles.voiceIcon} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.routeButton} onPress={openKakaoMap}>
                <MaterialIcons name="turn-right" size={18} color="white" />
                <Text style={styles.routeButtonText}>길찾기</Text>
            </TouchableOpacity>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
                {filterOptions.map((filter) => (
                    <TouchableOpacity
                        key={filter.label}
                        style={[
                            styles.filterButton,
                            activeFilter === filter.label && styles.activeFilterButton, // 활성화 상태 스타일 적용
                        ]}
                        onPress={() => setActiveFilter(filter.label === activeFilter ? '' : filter.label)}
                    >
                        <MaterialIcons
                            name={filter.icon}
                            size={16}
                            color={activeFilter === filter.label ? '#fff' : '#3D47AA'} // 아이콘 색상
                        />
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === filter.label && styles.activeFilterText, // 활성화 상태 스타일 적용
                            ]}
                        >
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>





            {/* 전체보기 버튼 */}
            <TouchableOpacity
                style={styles.overviewButton}
                onPress={() => navigation.navigate('Accommodation')}
            >
                <Text style={styles.overviewButtonText}>전체보기</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1 },
    searchBarContainer: {
        position: 'absolute',
        top: 30,
        left: 20,
        right: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        elevation: 5,
        height: 45,
        width: 300,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 16,
        color: '#aaa',
    },
    searchIcon: { marginRight: 8 },
    voiceIcon: { marginLeft: 8 },

    searchInput: { flex: 1, fontSize: 16 },
    filterContainer: {
        position: 'absolute',
        top: 85,
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 65,
        height: 35,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#3D47AA',
        marginLeft: 13,

    },
    filterText: {
        marginLeft: 5,
        color: '#000',
        fontSize: 11,
    },
    activeFilterButton: {
        backgroundColor: '#3D47AA',
    },
    activeFilterText: {
        color: '#fff',
    },
    routeButton: {
        position: 'absolute',
        top: 30,
        right: 10,
        backgroundColor: '#3D47AA',
        borderRadius: 20,
        padding: 10,
        width: 56,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    routeButtonText: { fontSize: 10,color: '#fff',marginBottom: 1},
    overviewButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

    },
    overviewButtonText: { color: '#3D47AA', fontSize: 16 },
});

export default MapsScreen;
