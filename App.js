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
      <StatusBar style="auto" />
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
