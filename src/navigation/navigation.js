import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/index';
import ReportsScreen from '../screens/reports';

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: 'indigo',
                    tabBarInactiveTintColor: 'indigo',
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Reports') {
                            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa' }} />
                <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Raporlar' }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigation;