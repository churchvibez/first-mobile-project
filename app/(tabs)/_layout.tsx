import React from 'react';
import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface TabBarIconProps {
  color: string;
  focused: boolean;
  size?: number; // if size is provided, otherwise you can omit it
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
  screenOptions={{
    tabBarActiveTintColor: 'black', // Set active icon color to black
    headerShown: false,
  }}
>
  {/* Your tab screens */}
  <Tabs.Screen
    name="index"
    options={{
      title: 'Lab 1',
      tabBarIcon: ({ color, focused, size }: TabBarIconProps) => (
        <TabBarIcon
          name={focused ? 'heart' : 'heart-outline'}
          color={color}
          size={size}
        />
      ),
    }}
  />
  <Tabs.Screen
    name="lab2"
    options={{
      title: 'Lab 2',
      tabBarIcon: ({ color, focused, size }: TabBarIconProps) => (
        <TabBarIcon
          name={focused ? 'code-slash' : 'code-slash-outline'}
          color={color}
          size={size}
        />
      ),
    }}
  />
  <Tabs.Screen
    name="lab3"
    options={{
      title: 'Lab 3',
      tabBarIcon: ({ color, focused, size }: TabBarIconProps) => (
        <TabBarIcon
          name={focused ? 'home' : 'home-outline'}
          color={color}
          size={size}
        />
      ),
    }}
  />
  <Tabs.Screen
    name="lab4"
    options={{
      title: 'Lab 4',
      tabBarIcon: ({ color, focused, size }: TabBarIconProps) => (
        <TabBarIcon
          name={focused ? 'home' : 'home-outline'}
          color={color}
          size={size}
        />
      ),
    }}
  />
</Tabs>

  );
}
