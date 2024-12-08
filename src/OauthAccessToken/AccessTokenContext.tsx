// src/OauthAccessToken/AccessTokenContext.tsx
import React, { createContext, useState, FC, ReactNode } from 'react';

interface AccessTokenContextProps {
    accessToken: string;
    setAccessToken: (token: string) => void;
}

export const AccessTokenContext = createContext<AccessTokenContextProps>({
    accessToken: '',
    setAccessToken: () => {},
});

interface AccessTokenProviderProps {
    children: ReactNode; // 올바르게 타입을 지정
}

export const AccessTokenProvider: FC<AccessTokenProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState('');

    return (
        <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AccessTokenContext.Provider>
    );
};
