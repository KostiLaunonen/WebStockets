import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, ionicons } from '@expo/vector-icons'
import { useEffect, useState, useRef } from 'react';
import { fetchPrices, socket, postSymbol, deleteSymbol, fetchSubscriptions, getActiveSubs } from './api';
import { styles } from './styles';

export default function App() {
  const [prices, setPrices] = useState([]);
  const [allSubscriptions, setAllSubscriptions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [toggleStocks, setToggleStocks] = useState(false);
  const [symbolState, setSymbolState] = useState({});

  // Dynamic state toggling for each subscribed symbol
  const toggleSymbol = (symbol) => {
    setSymbolState(prev => {
      const newState = !prev[symbol];

      if (newState) {
        postSymbol(symbol);
      } else {
        deleteSymbol(symbol);
      }

      return { ...prev, [symbol]: newState };
    });
  };

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
          { symbol: "Test2", price: 123.45 },
          { symbol: "Test3", price: 123.45 },
          { symbol: "Test4", price: 123.45 }
        ])
      }
    }
    loadPrices();

    // Websocket 
    socket.onmessage = (event) => {
      const { symbol, price } = JSON.parse(event.data);
      console.log(`${symbol}: ${price}`);
      setPrices(oldPrice =>
        oldPrice.map(p => p.symbol === symbol ? { ...p, price } : p)
      );
    };

    return () => {
      socket.close()
    }

  }, []);

  // detailsBox animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: selectedStock ? 0 : -30,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedStock]);

  useEffect(() => {
    async function loadAll() {
      const subs = await fetchSubscriptions();
      setAllSubscriptions(subs);
      const activeSubs = await getActiveSubs();
      console.log(activeSubs);

      const initialState = allSubscriptions;
      subs.forEach(symbol => {
        initialState[symbol] = activeSubs.includes(symbol);
      });
      setSymbolState(initialState);
    }
    loadAll();
  }, []);

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
            <TouchableOpacity style={styles.sideBarItem}
              onPress={() => setToggleStocks(!toggleStocks)}
            >
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
      )
      }

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

      {
        selectedStock && (
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
        )
      }

      {
        toggleStocks && (
          <>
            <View style={styles.globalDarken} />
            <View style={styles.stockWindow}>
              <View style={styles.stockWindowHeader}>
                <Text style={styles.baseText}>Toggle Stocks</Text>
                <TouchableOpacity onPress={() => setToggleStocks(false)}>
                  <Ionicons name="close" size={26} color="white" />
                </TouchableOpacity>

              </View>

              <View style={styles.divider} />

              <View style={{ flexDirection: 'column' }}>
                {allSubscriptions.map(symbol => (
                  <View key={symbol} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.stockWindowItem}>
                      <Text style={styles.baseText}>{symbol}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleSymbol(symbol)}>
                      <Ionicons
                        name={symbolState[symbol] ? "eye-outline" : "eye-off-outline"} size={26} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.smallText}>{symbolState[symbol] ? `${symbol} Will now be displayed` : `${symbol} Will now be hidden`} </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )
      }

    </View >
  );
}