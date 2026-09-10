// app/welcome.tsx
import { View, Text, Button } from 'react-native';
import { useLocationPermissions } from '@/hooks/useLocationPermissions';

export default function WelcomeScreen() {
  const { hasPermission, requestPermissions } = useLocationPermissions();

  const handleContinue = async () => {
    if (!hasPermission) {
      await requestPermissions();
    }
    // Navigate to dashboard
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Welcome to Movana Rider</Text>
      <Text>We need location access to find deliveries near you.</Text>
      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
}