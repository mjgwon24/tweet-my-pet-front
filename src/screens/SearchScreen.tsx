import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';


/**
 * 메인 화면
 * @since 2024.11.9
 * @latest 2024.11.9
 * @author 임석진
 */

const SearchScreen: React.FC = () => {
    const [searchText, setSearchText] = useState('');

    const handleSearchChange = (text: string) => {
        setSearchText(text);
    };

    const handleCancel = () => {
        setSearchText('');
    };

    return (
        <View style={styles.container}>
            <SearchBar onChangeText={handleSearchChange} onCancel={handleCancel} />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>추천 테마 및 사진</Text>
                    <View style={styles.themeContainer}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <View key={index} style={styles.themeCircle}>
                                <Text style={styles.themeText}>추천 테마 및 사진</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>최근 검색어</Text>
                    <View style={styles.keywordContainer}>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <TouchableOpacity key={index} style={styles.keyword}>
                                <Text style={styles.keywordText}>키워드</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>인기 검색어</Text>
                    <View style={styles.keywordContainer}>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <TouchableOpacity key={index} style={styles.keyword}>
                                <Text style={styles.keywordText}>키워드</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    contentContainer: {
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    themeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    themeCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    themeText: {
        fontSize: 12,
        textAlign: 'center',
        color: 'black',
    },
    keywordContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    keyword: {
        backgroundColor: '#D1D1D1',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    keywordText: {
        fontSize: 14,
        color: 'black',
    },
});

export default SearchScreen;
