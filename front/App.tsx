import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import RootNavigator from './src/navigations/Root/RootNavigator';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './src/api/queryClient';
import { AuthProvider } from '@/hooks/AuthContext';

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
