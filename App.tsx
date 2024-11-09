import React from 'react';
import { AccessTokenProvider } from './src/OauthAccessToken/AccessTokenContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
      <AccessTokenProvider>
        <AppNavigator />
      </AccessTokenProvider>
  );
}
