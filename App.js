import Searching from "./views/SearchStudent"
import Toast from 'react-native-toast-message';
import { RootSiblingParent } from 'react-native-root-siblings';
import Connect from './views/Connect';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardStyleInterpolators } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import DisplayStudent from './views/DisplayStudent';

const Stack = createStackNavigator();

const ToastWrapper = React.forwardRef((props, ref) => {
  return <Toast ref={ref} />;
});

function AppNavigation() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    setIsAuthenticated(false);
    AsyncStorage.clear();
    const checkToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
          setIsAuthenticated(true);
          SplashScreen.hideAsync();
        }
      } catch (error) {
        SplashScreen.hideAsync();
        console.error(error);
      }
    };

    checkToken();
  }, []);

  return (
    <>
      <NavigationContainer>
        <RootSiblingParent>
          <Stack.Navigator>
            {isAuthenticated ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={Searching}
                  options={{
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                  }}
                />
                <Stack.Screen
                  name='Student Informations'
                  component={DisplayStudent}
                  options={{
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                  }}
                />
              </>
            ) : (
              <Stack.Screen
                name="Login"
                component={Connect}
                options={{
                  cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
                }}
              />
            )}
          </Stack.Navigator>
        </RootSiblingParent>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
      <ToastWrapper />
    </AuthProvider>
  );
}
