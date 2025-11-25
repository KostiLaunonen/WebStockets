import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, ionicons } from '@expo/vector-icons'
import { useEffect, useState, useRef } from 'react';
import { fetchPrices, socket } from './api';
import { styles } from './styles';

export default function App() {
  const [prices, setPrices] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sideBarVisible, setSideBarVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(-300)).current;

  // REST API call for initialization
  useEffect(() => {
    async function loadPrices() {
      try {
        const data = await fetchPrices();
        console.log(data);
        setPrices(data);
      } catch (err) {
        console.error("Error fetching prices from API", err.message);
        setPrices([
          { symbol: "Test", price: 123.45 },
          { symbol: "Test", price: 123.45 },
          { symbol: "Test", price: 123.45 },
          { symbol: "Test", price: 123.45 }
        ])
      }
    }
    loadPrices();

    // Websocket 
    socket.onmessage = (event) => {
      const { symbol, price } = JSON.parse(event.data);
      console.log(`${symbol}: ${price}`);
      setPrices(oldPrice => {
        const updated = oldPrice.filter(p => p.symbol !== symbol);
        return [...updated, { symbol, price }];
      });
    };
  }, []);

  // detailsBox animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: selectedStock ? 0 : -30,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedStock]);

  return (
    <View style={styles.container}>

      <View style={{ alignItems: 'flex-start', width: '100%' }}>
        <TouchableOpacity
          style={styles.sideWidget}
          onPress={() => setSideBarVisible(!sideBarVisible)}
        >
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {sideBarVisible && (
        <View style={styles.sideBar}>
          <View style={styles.sideBarHeader}>
            <Text style={styles.baseText}>
              Sidebar
            </Text>
            <TouchableOpacity onPress={() => setSideBarVisible(!sideBarVisible)}>
              <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.sideBarContent}>
            <TouchableOpacity style={styles.sideBarItem}>
              <Ionicons name="checkbox" size={26} color="white" />
              <Text style={styles.baseText}> Toggle Stocks </Text>
            </TouchableOpacity>

            <View style={styles.sideBarDivider} />
            <TouchableOpacity style={styles.sideBarItem}>
              <Ionicons name="settings-outline" size={26} color="white" />
              <Text style={styles.baseText}> Settings </Text>
            </TouchableOpacity>
            <View style={styles.sideBarDivider} />
          </View>
        </View>
      )}

      <Text style={styles.title}>WebStocket</Text>
      <View style={styles.divider} />
      <Text style={styles.baseText}>Stock Prices</Text>

      <View style={styles.row}>
        {prices.map(({ symbol, price }) => (
          <TouchableOpacity
            key={symbol}
            style={styles.priceBox}

            // Close or open the details box for given symbol if it's the same or not
            onPress={() => {
              if (selectedStock && selectedStock.symbol === symbol) {
                setSelectedStock(null);
              } else {
                setSelectedStock({ symbol, price })
              }
            }}>

            <Text style={styles.priceText}>{symbol}: {price}$</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedStock && (
        <Animated.View
          style={[
            styles.detailsBox,
            {
              transform: [{ translateY: slideAnim }],
              opacity: selectedStock ? 1 : 0,
            }
          ]}>
          <Text style={styles.detailsTitle}>{selectedStock.symbol} - Analytics</Text>
          <Text style={styles.baseText}>Price: {selectedStock.price}</Text>
          <Text style={styles.baseText}>Work in progress!</Text>
        </Animated.View>
      )}

    </View>
  );
}