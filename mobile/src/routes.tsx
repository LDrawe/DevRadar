import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './screens/Main';
import Profile from './screens/Profile';
import { StatusBar } from 'expo-status-bar';
import { StackParamsProps } from './types/Navigation';

const Stack = createStackNavigator<StackParamsProps>();

export default function Routes() {
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName="Main" screenOptions={{
                headerTitle: 'DevRadar',
                headerTitleAlign: 'center',
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20
                },
                headerStyle: {
                    backgroundColor: '#780bd0',
                    height: 80
                }
            }}>
                <Stack.Screen name="Main" component={Main} />
                <Stack.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        headerTitle: 'Perfil do GitHub'
                    }}
                />
            </Stack.Navigator>
            <StatusBar style="light" />
        </NavigationContainer>
    )
}