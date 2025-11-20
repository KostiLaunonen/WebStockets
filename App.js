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
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
