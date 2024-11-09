// BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MainScreen from '../screens/MainScreen';
import SearchScreen from '../screens/SearchScreen';
import MapScreen from '../screens/MapScreen';
// import CommunityScreen from '../screens/CommunityScreen';
// import MyPageScreen from '../screens/MyPageScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            initialRouteName="Main"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Main') {
                        iconName = 'home';
                    } else if (route.name === 'Search') {
                        iconName = 'search';
                    } else if (route.name === 'Map') {
                        iconName = 'map';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Main" component={MainScreen} options={{ tabBarLabel: '홈' }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: '검색' }} />
            <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: '지도' }} />
            {/*
            <Tab.Screen name="Community" component={CommunityScreen} options={{ tabBarLabel: '커뮤니티' }} />
            <Tab.Screen name="MyPage" component={MyPageScreen} options={{ tabBarLabel: '마이페이지' }} />
            */}
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
