import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Button } from 'react-native';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import config from '../config/config'; // baseURL 가져오기

interface RecentSearchTerm {
    searchTerm: string;
}

const SearchScreen: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [recentSearchTerms, setRecentSearchTerms] = useState<string[]>([]);
    const [popularSearchTerms, setPopularSearchTerms] = useState<string[]>([]);

    useEffect(() => {
        fetchRecentSearchTerms();
        fetchPopularSearchTerms();
    }, []);


    const fetchRecentSearchTerms = async () => {
        try {
            const response = await axios.get<{ searchTerm: string }[]>(
                `${config.baseURL}api/search/recent`,
                { params: { userId: 1 } }
            );

            const uniqueSearchTerms = Array.from(
                new Set(response.data.map((term) => term.searchTerm))
            );

            setRecentSearchTerms(uniqueSearchTerms); // 타입이 string[]로 보장됨
        } catch (error) {
            console.error('Error fetching recent search terms:', error);
            setRecentSearchTerms([]);
        }
    };


    const fetchPopularSearchTerms = async () => {
        try {
            const response = await axios.get(`${config.baseURL}api/search/popular`);
            setPopularSearchTerms(response.data.length > 0 ? response.data.slice(0, 10) : []);
        } catch (error) {
            console.error('Error fetching popular search terms:', error);
            setPopularSearchTerms([]);
        }
    };

    const handleSearchChange = (text: string) => {
        setSearchText(text);
    };

    const handleCancel = () => {
        setSearchText('');
    };

    const handleSearchSubmit = async () => {
        if (searchText.trim() === '') return;

        try {
            console.log('searchText being sent: ', searchText);

            await axios.post(`${config.baseURL}api/search`, null, {
                params: {
                    userId: 1,
                    searchTerm: searchText,
                },
            });

            console.log('POST successful');

            // 검색 후 최신화
            fetchRecentSearchTerms();
            fetchPopularSearchTerms();
        } catch (error) {
            console.error('Error saving search term:', error);
        }

        setSearchText('');
    };

    return (
        <View style={styles.container}>
            <SearchBar
                onChangeText={handleSearchChange}
                onCancel={handleCancel}
                value={searchText}
            />
            <Button title="검색" onPress={handleSearchSubmit} />

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
                        {recentSearchTerms.length > 0 ? (
                            recentSearchTerms.map((term, index) => (
                                <TouchableOpacity key={index} style={styles.keyword}>
                                    <Text style={styles.keywordText}>{term}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>최근 검색어가 없습니다.</Text>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>인기 검색어</Text>
                    <View style={styles.keywordContainer}>
                        {popularSearchTerms.length > 0 ? (
                            popularSearchTerms.map((term, index) => (
                                <TouchableOpacity key={index} style={styles.keyword}>
                                    <Text style={styles.keywordText}>{term}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>인기 검색어가 없습니다.</Text>
                        )}
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
        fontSize: 15,
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
        fontSize: 18,
        color: 'black',
    },
    noDataText: {
        fontSize: 14,
        color: '#A0A0A0',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default SearchScreen;
