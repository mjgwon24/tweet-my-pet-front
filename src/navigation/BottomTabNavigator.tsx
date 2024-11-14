// BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MainScreen from '../screens/MainScreen';
import SearchScreen from '../screens/SearchScreen';
import MapScreen from '../screens/MapScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Home') {
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
            <Tab.Screen name="Home" component={MainScreen} options={{ tabBarLabel: '홈' }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: '검색' }} />
            <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: '지도' }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
