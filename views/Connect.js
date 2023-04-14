import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import { INTRA_CLIENT_ID } from '@env';
import { getAccessToken, getStudents } from '../api/api';
import logo from "../assets/42Search.png";
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { AuthContext } from "../contexts/AuthContext";
import { ActivityIndicator } from 'react-native';


function getCodeFromUrl(url) {
  const queryString = url.split('?')[1];
  const params = queryString.split('&');

  for (const param of params) {
    const [key, value] = param.split('=');
    if (key === 'code') {
      return value;
    }
  }

  return null;
}

const SearchScreen = () => {
  const [login, setLogin] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { setIsAuthenticated } = useContext(AuthContext);


  const handleConnect = async () => {
    const scheme = 'grademecompanion';

    const redirectUri = `${scheme}://redirect`;
    const clientId = INTRA_CLIENT_ID;
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

    setIsLoading(true);
    await WebBrowser.dismissBrowser();
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    // console.log(result.url);
    if (result.type === 'success') {
      const code = getCodeFromUrl(result.url);
      if (code) {
        await AsyncStorage.setItem('token', code);
        if (await getAccessToken(code)) {
          setIsAuthenticated(true);
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: '🎉 Connected to 42 API',
            text2: 'You can now search for students',
          });
          console.log('user connected to 42 successfully ✅');
    setIsLoading(true);
        }
      }
      else {
        console.log('user decline the connection');
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: '🚫 Cannot connect to 42 API',
          text2: 'You decline the access',
        });
        await AsyncStorage.removeItem('token');
    setIsLoading(false);

      }
    }
    else {
      await AsyncStorage.removeItem('token');
      console.log('error while connecting to 42');
    setIsLoading(false);

    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={logo} resizeMode="contain" />

      <View style={styles.containersearch}>
        <Text style={styles.title}>Connect to 42 account</Text>
        {!isLoading &&
        <Button
          title="Connect to 42"
          onPress={handleConnect}
          buttonStyle={styles.button}
        />
        }
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  searchContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginBottom: 16,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
  },

  containersearch: {
    flex: 1,
    marginTop: 80,
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  image: {
    width: 1000,
    height: 200,
    marginTop: 50,
    marginBottom: 16,
  },
});

export default SearchScreen;
