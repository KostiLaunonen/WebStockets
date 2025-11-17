<<<<<<< HEAD
import { StatusBar} from 'expo-status-bar';
import { StyleSheet, Text, View,  } from 'react-native';
import {  useEffect, useState } from 'react';
import { fetchPrices } from './api';

export default function App() {
  // Need to use hooks as the http request returns a promise instead of a value
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    async function loadPrices() {
      const data = await fetchPrices();
      console.log(data);
      setPrices(data);
    }
    loadPrices();
  }, []);

  return (
    <View style={styles.container}>
      <Text>REST API prices:</Text>
      {prices.map(({ symbol, price }) => (
       <Text key={symbol}>{symbol}: {price}</Text> 
      ))}
=======
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const axios = require('axios');
const WebSocket = require('ws');
const backendUrl = process.env.BACKEND_IP;
const socket = new WebSocket(`ws://${backendUrl}`);

fetchPrices();

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
>>>>>>> dde0bd6ac341521fb91d46071ce7030374c0ba1e
      <StatusBar style="auto" />
    </View>
  );
}

<<<<<<< HEAD
=======
async function fetchPrices() {
    // Import the subscription array from backend
    const res = await axios.get('http://localhost:3000/subscriptions');
    const subscriptions = res.data;

    // Iterate over the array and get prices for each stock
    for (const symbol of subscriptions) {
        try {
            const response = await axios.get(`http://localhost:3000/quote/`, {
                params: { symbol }
            });
            const price = response.data.c;
            console.log(`${symbol} hinta:`, price);
        } catch (err) {
            console.error(`Error in symbol ${symbol}:`, err.message);
        }
    }
};

socket.onmessage = (event) => {
    const { symbol, price } = JSON.parse(event.data);
    console.log(`${symbol}: ${price}`);
};

>>>>>>> dde0bd6ac341521fb91d46071ce7030374c0ba1e
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
