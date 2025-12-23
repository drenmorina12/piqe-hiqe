import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { onAppOpened } from '../utils/appUsage';

function AppLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      onAppOpened(user);
    }
  }, [user]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}
