import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const MapSearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [recentSearches, setRecentSearches] = useState([
        { id: '1', name: '석장동' },
        { id: '2', name: '무슨무슨 숙소' },
    ]);

    const filterOptions: { label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
        { label: '숙소', icon: 'hotel' },
        { label: '식당', icon: 'restaurant' },
        { label: '카페', icon: 'coffee' },
        { label: '캠핑', icon: 'terrain' },
    ];

    const renderRecentSearch = ({ item }) => (
        <View className="flex-row items-center py-2 border-b border-gray-200">
            <Ionicons name="search" size={16} color="#888" />
            <Text className="ml-2 text-gray-600 text-sm">{item.name}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            {/* 검색창 */}
            <View className="flex-row items-center mt-5 px-4">
                <TouchableOpacity className="mr-2">
                    <Ionicons name="chevron-back" size={20} color="#888" />
                </TouchableOpacity>

                {/* 검색창 안에 아이콘과 텍스트 */}
                <View className="flex-1 flex-row items-center h-10 bg-gray-100 rounded px-2">
                    <TextInput
                        className="flex-1 text-black"
                        placeholder="경주시 석장동"
                        placeholderTextColor="#aaa"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <Ionicons name="mic-outline" size={20} color="gray" style={{ marginLeft: 5 }} />
                </View>

                <TouchableOpacity className="bg-[#3D47AA] rounded px-2 py-1 items-center mx-2">
                    <MaterialIcons name="turn-right" size={20} color="#fff" />
                    <Text className="text-white text-xs font-bold mt-1">길찾기</Text>
                </TouchableOpacity>
            </View>



            {/* 필터 버튼 */}
            <View className="flex-row justify-around items-center py-2 border-t border-b border-gray-200 mt-2">
                {filterOptions.map((filter) => (
                    <TouchableOpacity key={filter.label} className="flex-row items-center">
                        <MaterialIcons name={filter.icon} size={20} color="#3D47AA" />
                        <Text className="ml-1 text-[#333] text-sm">{filter.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 최근 검색 */}
            <View className="mt-4 px-4">
                <Text className="text-gray-800 text-base mb-2">최근 검색</Text>
                <FlatList
                    data={recentSearches}
                    renderItem={renderRecentSearch}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
    );
};

export default MapSearchScreen;
