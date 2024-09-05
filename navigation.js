import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createStackNavigator();

import { View, Text } from 'react-native'
import HomeScreen from './screens/homeScreen';

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false
            }} initialRouteName='Home'>
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
