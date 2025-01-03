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
                tabBarIcon: ({ color}) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Search') {
                        iconName = 'search';
                    } else if (route.name === 'Map') {
                        iconName = 'map';
                    } else if (route.name === 'Community') {
                        iconName = 'chatbubbles-outline';
                    } else if (route.name === 'MyPage') {
                        iconName = 'person';
                    }

                    return <Ionicons name={iconName} size={17} color={color}/>;
                },
                tabBarActiveTintColor: '#121D82',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingTop: 5,
                    zIndex: 1000,
                }
            })}
         id={undefined}>
            <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: '지도' }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: '검색' }} />
            <Tab.Screen name="Home" component={MainScreen} options={{ tabBarLabel: '홈' }} />
            <Tab.Screen name="Community" component={MainScreen} options={{ tabBarLabel: '커뮤니티' }} />
            <Tab.Screen name="MyPage" component={MainScreen} options={{ tabBarLabel: '마이홈' }} />
        </Tab.Navigator>


    );
};

export default BottomTabNavigator;
