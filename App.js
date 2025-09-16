import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import AppContainer from './src/routes/routes';
import { colors } from './src/utils/colors';
import FlashMessage from 'react-native-flash-message';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/utils/Notification';

// expo-font
import { useFonts } from 'expo-font';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  // Load fonts
  const [fontsLoaded] = useFonts({
    TrajanPro: require('./src/assets/font/TrajanPro-Regular.ttf'),
    TrajanProBold: require('./src/assets/font/TrajanPro-Bold.otf'),
    DancingScript: require('./src/assets/font/DancingScript.ttf'),
    DMSerif: require('./src/assets/font/DMSerif.ttf'),
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification Received:', notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification Response:', response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Show loader until fonts are ready
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.headerbackground}
      />
      <AppContainer />
      <FlashMessage position="top" />
    </>
  );
}
