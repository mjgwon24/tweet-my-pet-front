import React, { useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessTokenContext } from './OauthAccessToken/AccessTokenContext';

const AppInitializer: React.FC = () => {
    const { setAccessToken } = useContext(AccessTokenContext);

    useEffect(() => {
        const loadAccessToken = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (token) {
                    setAccessToken(token);
                    console.log('AccessToken loaded from AsyncStorage:', token);
                }
            } catch (error) {
                console.error('Failed to load accessToken from AsyncStorage:', error);
            }
        };

        loadAccessToken();
    }, [setAccessToken]);

    return null; // UI가 필요 없는 컴포넌트
};

export default AppInitializer;
