import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import Toast from "react-native-toast-message";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      Toast.show({
        type: 'info',
        text1: notification.request.content.title || "Notificación",
        text2: notification.request.content.body || "",
        position: 'top',
        visibilityTime: 4000,
        text2Style: { fontSize: 18 }
      });
    });
    return () => subscription.remove();
  }, []);

  return (
    <>

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
            title: "Inicio",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="historial"
          options={{
            title: "Historial",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="history" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pendientes"
          options={{
            title: "Entregas Pendientes",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person" color={color} />
            ),
          }}
        />
      </Tabs>
      <Toast/>
    </>
  );
}
