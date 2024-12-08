import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * 메인 화면
 * @since 2024.11.9
 * @latest 2024.11.9
 * @author 임석진
 */

interface SearchBarProps {
    onPress?: () => void;
    onChangeText?: (text: string) => void;
    onCancel?: () => void;
    placeholder?: string;
    editable?: boolean;
    value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onPress, onChangeText, onCancel, placeholder = "검색어를 입력하세요", editable = true }) => {
    const [inputText, setInputText] = useState('');

    const handleTextChange = (text: string) => {
        setInputText(text);
        onChangeText && onChangeText(text);
    };

    const handleCancel = () => {
        setInputText('');
        onCancel && onCancel();
    };

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={24} color="gray" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={inputText}
                onFocus={onPress}
                onChangeText={handleTextChange}
                editable={editable}
            />
            {onCancel && (
                <TouchableOpacity onPress={handleCancel}>
                    <Ionicons name="close" size={24} color="gray" style={styles.icon} />
                </TouchableOpacity>
            )}
        </View>
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
    input: {
        flex: 1,
        fontSize: 16,
        color: 'black',
    },
});

export default SearchBar;
