import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;

const MapsScreen = () => {
    const [mapCenter, setMapCenter] = useState({ lat: 35.8562, lng: 129.2247 });
    const [selectedRegion, setSelectedRegion] = useState('경주시');
    const [selectedLocation, setSelectedLocation] = useState('황성동');
    const [isModalVisible, setModalVisible] = useState(false);

    const gyeongbukRegionData = [
        {
            name: '경주시',
            locations: [
                { name: '성건동', coords: { lat: 35.8428, lng: 129.2117 } },
                { name: '황성동', coords: { lat: 35.8562, lng: 129.2247 } },
                { name: '현곡면', coords: { lat: 35.8952, lng: 129.1998 } },
            ],
        },
        {
            name: '포항시',
            locations: [
                { name: '양덕동', coords: { lat: 36.0323, lng: 129.3605 } },
                { name: '흥해읍', coords: { lat: 36.1046, lng: 129.3492 } },
            ],
        },
        // 더 많은 데이터 추가 가능...
    ];

    const kakaoMapHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Kakao Map</title>
            <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=9dab16bb968b4eafb714cbb910e15ac3"></script>
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

                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(${mapCenter.lat}, ${mapCenter.lng})
                });
                marker.setMap(map);
            </script>
        </body>
        </html>
    `;

    const handleLocationSelect = (region, location) => {
        const regionData = gyeongbukRegionData.find((r) => r.name === region);
        const locationData = regionData?.locations.find((l) => l.name === location);

        if (locationData) {
            setSelectedRegion(region);
            setSelectedLocation(location);
            setMapCenter(locationData.coords);
            setModalVisible(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.locationButton}
            >
                <Text style={styles.locationButtonText}>
                    {`${selectedRegion} ${selectedLocation}`}
                </Text>
            </TouchableOpacity>

            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>경상북도 지역 선택</Text>
                    <ScrollView>
                        {gyeongbukRegionData.map((region) => (
                            <View key={region.name} style={styles.regionContainer}>
                                <Text style={styles.regionTitle}>{region.name}</Text>
                                {region.locations.map((location) => (
                                    <TouchableOpacity
                                        key={location.name}
                                        onPress={() => handleLocationSelect(region.name, location.name)}
                                        style={styles.locationItem}
                                    >
                                        <Text
                                            style={[
                                                styles.locationText,
                                                selectedRegion === region.name &&
                                                selectedLocation === location.name &&
                                                styles.selectedLocationText,
                                            ]}
                                        >
                                            {location.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <View style={styles.mapContainer}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: kakaoMapHTML }}
                    style={{ width: screenWidth, height: '100%' }}
                    mixedContentMode="always"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    locationButton: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    locationButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    mapContainer: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    regionContainer: {
        marginBottom: 16,
    },
    regionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    locationItem: {
        paddingVertical: 8,
    },
    locationText: {
        fontSize: 14,
    },
    selectedLocationText: {
        color: '#FF5733',
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 16,
        backgroundColor: '#70756D',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {  
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default MapsScreen;
