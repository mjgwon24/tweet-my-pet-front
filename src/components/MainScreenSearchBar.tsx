import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * 메인 화면
 * @since 2024.11.9
 * @latest 2024.11.9
 * @author 임석진
 */

interface MainScreenSearchBarProps {
    onPress: () => void;
}

const MainScreenSearchBar: React.FC<MainScreenSearchBarProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Ionicons name="search" size={24} color="gray" style={styles.icon} />
            <Text style={styles.placeholder}>검색어를 입력하세요</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        margin: 16,
    },
    icon: {
        marginRight: 8,
    },
    placeholder: {
        fontSize: 16,
        color: 'gray',
    },
});

export default MainScreenSearchBar;
