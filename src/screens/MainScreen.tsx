import React, { useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, StatusBar, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import SearchBar from '../components/SearchBar';
import SearchScreen from '../screens/SearchScreen';
import { Ionicons } from '@expo/vector-icons';

/**
 * 메인 화면
 * @since 2024.10.27
 * @latest 2024.10.27
 * @author 김진수
 */

const screenWidth = Dimensions.get('window').width;

const MainScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isModalVisible, setModalVisible] = useState(false);

    const openSearchModal = () => setModalVisible(true);
    const closeSearchModal = () => setModalVisible(false);

    const navigateToMap = () => {
        navigation.navigate('Map');
    };

    const navigateToAccommodation = () => {
        navigation.navigate('Accommodation');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

            <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                <SearchBar onPress={openSearchModal} />

                {/* 주요 공지 사항 및 이벤트 영역 */}
                <View style={{ backgroundColor: '#E0E0E0', borderRadius: 10, padding: 24, marginTop: 16, height: 160, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, textAlign: 'center', color: '#4A4A4A' }}>주요 공지 사항, 이벤트 안내</Text>
                </View>

                {/* 카테고리 아이콘 섹션 */}
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                    {['지도', '숙소', '음식점', '카페', '캠핑', '미용실', '병원', '반려용품'].map((category) => (
                        <View key={category} style={{ width: '23%', padding: 8 }}>
                            <View style={{ backgroundColor: '#E0E0E0', borderRadius: 10, height: 80, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={category === '지도' ? navigateToMap
                                        : category === '숙소' ? navigateToAccommodation
                                        : undefined}
                                    style={{ backgroundColor: '#E0E0E0', borderRadius: 10, height: 80, justifyContent: 'center', alignItems: 'center' }}
                                >
                                <Text style={{ textAlign: 'center', color: '#4A4A4A' }}>{category}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* 이달의 리뷰 Top 4 */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#4A4A4A' }}>이달의 리뷰 Top 4 모아보기 😎</Text>
                </View>

                {/* 슬라이드 가능한 리뷰 카드 섹션 */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                    {[1, 2, 3, 4].map((item) => (
                        <View key={item} style={{ width: screenWidth * 0.6, padding: 8 }}>
                            <View style={{ backgroundColor: '#E0E0E0', borderRadius: 10, height: 128 }} />
                        </View>
                    ))}
                </ScrollView>
            </ScrollView>

            <Modal visible={isModalVisible} animationType="slide" transparent={false}>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                        <TouchableOpacity onPress={closeSearchModal}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, marginLeft: 10 }}>검색</Text>
                    </View>
                    <SearchScreen />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

export default MainScreen;
