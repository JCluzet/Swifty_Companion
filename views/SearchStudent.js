import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import { SearchBar } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';
import { getStudents } from "../api/api";
import Toast from 'react-native-toast-message';
import logo from "../assets/42Search.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from "../contexts/AuthContext";


const SearchScreen = (props) => {
  const [login, setLogin] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { setIsAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const maxLogin = (login) => {
    if (login.includes(" ")) {
      login = login.replace(" ", "");
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '🤨 No spaces',
        text2: 'A login can\'t contain spaces',
      });
      return;
    }
    if (login.length > 20) {
      login = login.substring(0, 20);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '🤨 Max 20 characters',
        text2: 'A login can\'t be longer than 20 characters',
      });
      return;
    } else {
      setLogin(login);
    }
  }

  const logout = () => {
    setIsAuthenticated(false);
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: '👋 Bye',
      text2: 'You have been logged out',
    });
  }

  const handleSearch = () => {
    if (login === "") {
      Toast.show({
        type: 'error',
        text1: '🥱 No login provided',
        position: 'bottom',
        text2: 'Please enter a login',
      });
      return;
    }
    setIsLoading(true);
    console.log(login);
    console.log(AsyncStorage.getItem('accessToken'));
    getStudents(login).then((students) => {
      console.log("successfully catch " + login + " student");
      props.navigation.navigate('StudentInfo', { student: students });
      setIsLoading(false);

    }).catch((error) => {
      console.log("Erreur lors de la récupération des étudiants :", error);
      if (error.response.status === 401) {
        logout();
        Toast.show({
          type: 'error',
          text1: '🤨 Unauthorized',
          position: 'bottom',
          text2: 'You have been logged out',
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: '🤨 Not find',
        position: 'bottom',
        text2: login + ' is not a 42 login',
      });
      setIsLoading(false);

    });
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={logo} resizeMode="contain" />

      <View style={styles.containersearch}>
        <SearchBar
          placeholder="Entrez le login"
          onChangeText={text => maxLogin(text)}
          value={login}
          autoCorrect={false}
          autoCapitalize="none"
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          platform={Platform.OS === 'ios' ? 'ios' : 'android'}
        />
        {!isLoading &&
          <Button
            title="Search"
            onPress={handleSearch}
            buttonStyle={styles.button}
          />
        }
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
      <Button title="Logout" onPress={logout} buttonStyle={styles.buttonlogout} />
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
  buttonlogout: {
    backgroundColor: '#FF0000',
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
