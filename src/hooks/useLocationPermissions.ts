// hooks/useLocationPermissions.ts
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Platform, Alert, Linking } from 'react-native';

export function useLocationPermissions() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkPermissions = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status === 'granted') {
        // For iOS, also check background permission
        if (Platform.OS === 'ios') {
          const { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
          setHasPermission(backgroundStatus === 'granted');
        } else {
          setHasPermission(true);
        }
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermissions = async (showAlert = true): Promise<boolean> => {
    try {
      // Request foreground permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        if (showAlert) {
          Alert.alert(
            'Location Permission Required',
            'Movana needs location access to find nearby deliveries and track your rides.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
        }
        setHasPermission(false);
        return false;
      }

      // Request background permission for iOS
      if (Platform.OS === 'ios') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          if (showAlert) {
            Alert.alert(
              'Background Location Required',
              'Movana needs background location to track your deliveries even when the app is closed.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() }
              ]
            );
          }
          setHasPermission(false);
          return false;
        }
      }

      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      setHasPermission(false);
      return false;
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return { 
    hasPermission, 
    isLoading, 
    requestPermissions, 
    checkPermissions 
  };
}