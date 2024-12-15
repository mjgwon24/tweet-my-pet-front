import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Dimensions, Modal, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import mapData from '../data/mapdata.json';

const screenWidth = Dimensions.get('window').width;

const MapsScreen = () => {
    const [mapCenter, setMapCenter] = useState({ lat: 35.8562, lng: 129.2247 });
    const [selectedRegion, setSelectedRegion] = useState('경주시');
    const [selectedLocation, setSelectedLocation] = useState('황성동');
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState('');

    const handleLocationSelect = (region, location) => {
        const regionData = mapData.find((r) => r.name === region);
        const locationData = regionData?.locations.find((l) => l.name === location);

        if (locationData) {
            setSelectedRegion(region);
            setSelectedLocation(location);
            setMapCenter(locationData.coords);
            setModalVisible(false);
        }
    };

    const openKakaoMap = () => {
        const destinationName = "료미";
        const destinationCoords = { lat: 35.835555418, lng: 129.209822015 };
        const kakaoMapURL = `https://map.kakao.com/link/to/${encodeURIComponent(destinationName)},${destinationCoords.lat},${destinationCoords.lng}`;

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
    <title>Kakao Map</title>
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=9dab16bb968b4eafb714cbb910e15ac3"></script>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        #map {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        var mapContainer = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(${mapCenter.lat}, ${mapCenter.lng}),
            level: 3
        };
        var map = new kakao.maps.Map(mapContainer, options);

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



        function addMarker(location) {
            var coords = new kakao.maps.LatLng(location.coords.lat, location.coords.lng);
            
            var marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });

            var infowindow = new kakao.maps.InfoWindow({
                content: '<div style="padding:5px;">' + location.name + '</div>'
            });

            kakao.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
        }
        
        locations.forEach(addMarker);
    </script>
</body>
</html>
`;

    const filterOptions = ['숙소', '식당', '카페', '캠핑'];

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="검색어를 입력하세요"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
                {filterOptions.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterButton,
                            activeFilter === filter && styles.activeFilterButton,
                        ]}
                        onPress={() => setActiveFilter(filter === activeFilter ? '' : filter)}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                activeFilter === filter && styles.activeFilterButtonText,
                            ]}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.mapContainer}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: kakaoMapHTML }}
                    style={{ flex: 1 }}
                    mixedContentMode="always"
                />
                {/* 길찾기 버튼 */}
                <TouchableOpacity
                    style={styles.directionsButton}
                    onPress={openKakaoMap}
                >
                    <Text style={styles.directionsButtonText}>길찾기</Text>
                </TouchableOpacity>

                {/* 전체보기 버튼 */}
                <TouchableOpacity
                    style={styles.overviewButton}
                    onPress={() => console.log('전체보기')}
                >
                    <Text style={styles.overviewButtonText}>전체보기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    searchBar: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    searchInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#0000FF',
    },
    filterButtonText: {
        color: '#0000FF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeFilterButton: {
        backgroundColor: '#0000FF',
    },
    activeFilterButtonText: {
        color: '#FFFFFF',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    directionsButton: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: '#70756D',
        borderRadius: 20,
    },
    directionsButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    overviewButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: '#0000FF',
        borderRadius: 20,
    },
    overviewButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default MapsScreen;
