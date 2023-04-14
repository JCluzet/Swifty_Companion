// import { AsyncLocalStorage } from 'async_hooks';
import axios from 'axios';
import { INTRA_CLIENT_ID, INTRA_CLIENT_SECRET } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const qs = require('querystring');

const instance = axios.create({
  baseURL: 'https://api.intra.42.fr',
});


export const getAccessToken = async (code) => {
  const data = qs.stringify({
    grant_type: 'authorization_code',
    client_id: INTRA_CLIENT_ID,
    client_secret: INTRA_CLIENT_SECRET,
    code: code,
    redirect_uri: 'grademecompanion://redirect',
  });

  const config = {
    method: 'post',
    url: 'https://api.intra.42.fr/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  let response;

  try {
    response = await axios(config);
    // console.dir(response.data);
    AsyncStorage.setItem('accessToken', response.data.access_token);
    // console.log("BRO" + response.data.access_token);
    // AsyncStorage.setItem('accessToken', response.data.access_token);
    return response.data;
  } catch (error) {
    if (response) {
      console.dir(response.data);
      console.log(response.data.access_token);
    }
    console.error(error);
    throw error;
  }
}


export const getStudents = async (userId) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  // console.log("URGENT > " + accessToken);

  const response = await instance.get(`https://api.intra.42.fr/v2/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
