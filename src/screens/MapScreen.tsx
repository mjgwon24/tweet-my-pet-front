import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;

/**
 * 메인 화면
 * @since 2024.11.10
 * @latest 2024.11.10
 * @author 임석진
 */


const MapsScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 35.8562, lng: 129.2247 });
    const [showLocation, setShowLocation] = useState(true);

    // 카테고리 선택 핸들러
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const kakaoMapHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Kakao Map</title>
            <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=ac0f83c7a2433e270a24c37513e776e7"></script>
        </head>
        <body>
            <div id="map" style="width: 100%; height: 100vh;"></div>
            <script>
                var mapContainer = document.getElementById('map');
                var options = {
                    center: new kakao.maps.LatLng(${mapCenter.lat}, ${mapCenter.lng}),
                    level: 3
                };
                var map = new kakao.maps.Map(mapContainer, options);

                // 마커 추가
                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(${mapCenter.lat}, ${mapCenter.lng})
                });
                marker.setMap(map);
            </script>
        </body>
        </html>
    `;

    return (
        <View style={styles.container}>

            <View style={styles.topSection}>
                <TouchableOpacity onPress={() => setShowLocation(!showLocation)} style={styles.locationToggle}>
                    <Text style={styles.locationText}>
                        {showLocation ? '경주시 석장동' : '위치 표시 꺼짐'}
                    </Text>
                    <Text style={styles.locationIcon}>{showLocation ? '▼' : '▲'}</Text>
                </TouchableOpacity>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {['숙소', '식당', '카페', '캠핑'].map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={styles.categoryButton}
                            onPress={() => handleCategorySelect(category)}
                        >
                            <View style={[
                                styles.categoryIcon,
                                selectedCategory === category && styles.selectedCategoryIcon
                            ]} />
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category && styles.selectedCategoryText
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>

                    ))}
                </ScrollView>
            </View>

            {/* 지도 표시 */}
            <View style={styles.mapContainer}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: kakaoMapHTML }}
                    style={{ width: screenWidth, height: '100%' }}
                    mixedContentMode="always"
                />
                <TouchableOpacity style={styles.researchButton} onPress={() => console.log('이 지역 재검색')}>
                    <Text style={styles.researchButtonText}>이 지역 재검색</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listButton} onPress={() => console.log('목록보기')}>
                    <Text style={styles.listButtonText}>목록보기</Text>
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
    topSection: {
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    locationToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    locationIcon: {
        fontSize: 12,
        color: '#333',
    },
    categoryScroll: {
        flexDirection: 'row',
    },
    categoryButton: {
        width: 85,
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 1,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        marginRight: 12,
    },
    categoryIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FFF',
        marginRight: 8,
    },
    selectedCategoryIcon: {
        backgroundColor: '#70756d',
    },
    categoryText: {
        color: '#666',
        fontSize: 14,
        marginBottom: 2,
    },
    selectedCategoryText: {
        color: '#666',
        marginBottom: 1,
        fontSize: 14,
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    researchButton: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        paddingVertical: 9,
        paddingHorizontal: 22,
        backgroundColor: '#70756D',
        borderRadius: 20,
        zIndex: 1,
    },
    researchButtonText: {
        color: 'white',
        fontSize: 14,
        marginBottom: 3,
    },
    listButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: '#70756d',
        borderRadius: 20,
        zIndex: 1,
    },
    listButtonText: {
        color: 'white',
        fontSize: 14,
        marginBottom: 1,
    },
});

export default MapsScreen;
