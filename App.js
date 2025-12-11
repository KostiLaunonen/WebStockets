import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState, useRef } from 'react';
import { fetchPrices, socket, postSymbol, deleteSymbol, fetchSubscriptions, getActiveSubs, getQuote } from './api';
import { styles, colors } from './styles';

export default function App() {
  const [prices, setPrices] = useState([]);
  const [allSubscriptions, setAllSubscriptions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quote, setQuote] = useState(null);
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [toggleStocks, setToggleStocks] = useState(false);
  const [symbolState, setSymbolState] = useState({});
  const [settingsBox, setSettingsBox] = useState(false);
  const [dynamicColor, setDynamicColor] = useState(colors.default);
  const [dynamicHighlight, setDynamicHighlight] = useState(colors.defaultHighlight);

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

  useEffect(() => {
    async function fetchQuote() {
      if (!selectedStock) return;
      const res = await getQuote(selectedStock.symbol)
      setQuote(res);
    }
    fetchQuote();
  }, [selectedStock])

  return (
    <View style={[styles.container, { backgroundColor: dynamicColor }]}>

      <View style={{ alignItems: 'flex-start', width: '100%' }}>
        <TouchableOpacity
          style={styles.sideWidget}
          onPress={() => setSideBarVisible(!sideBarVisible)}
        >
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {sideBarVisible && (
        <View style={[styles.sideBar, { backgroundColor: dynamicHighlight }]}>
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
            <TouchableOpacity style={styles.sideBarItem}
              onPress={() => setSettingsBox(!settingsBox)}>
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
            style={[styles.priceBox, { backgroundColor: dynamicHighlight }]}

            // Close or open the details box for given symbol if it's the same or not
            onPress={() => {
              if (selectedStock && selectedStock.symbol === symbol) {
                setSelectedStock(null);
              } else {
                setSelectedStock({ symbol })
              }
            }}>

            <Text style={styles.priceText}>{symbol}: {price}$</Text>
          </TouchableOpacity>
        ))}
      </View>

      {
        toggleStocks && (
          <>
            <View style={styles.globalDarken} />
            <View style={[styles.stockWindow, { backgroundColor: dynamicHighlight }]}>
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


      {selectedStock && (
        <Animated.View
          style={[
            styles.detailsBox,
            {
              transform: [{ translateY: slideAnim }],
              opacity: selectedStock ? 1 : 0,
              backgroundColor: dynamicHighlight,
            }
          ]}>
          <Text style={styles.detailsTitle}>{selectedStock.symbol} - Analytics</Text>

          {quote ? (
            <View style={{ borderWidth: 2, borderRadius: 6, borderColor: 'white' }}>
              <Text style={[styles.baseText, { padding: 10, fontStyle: 'italic' }]}>
                Current price: <Text style={{ color: quote.d >= 0 ? 'limegreen' : '#e44d4d' }}>
                  {quote.c}
                </Text>
              </Text>

              <View style={[styles.divider, { marginLeft: 10 }]} />

              <Text style={[styles.baseText, { padding: 10, fontStyle: 'italic' }]}>
                Change: <Text style={{ color: quote.d >= 0 ? 'limegreen' : '#e44d4d' }}>
                  {quote.d}$</Text>
              </Text>

              <View style={[styles.divider, { marginLeft: 10 }]} />

              <Text style={[styles.baseText, { padding: 10, fontStyle: 'italic' }]}>
                Percent change: <Text style={{ color: quote.d >= 0 ? 'limegreen' : '#e44d4d' }}>
                  {quote.dp}%</Text>
              </Text>

              <View style={[styles.divider, { marginLeft: 10 }]} />

              <Text style={[styles.baseText, { padding: 10, fontStyle: 'italic' }]}>
                High price of the day: <Text>
                  {quote.h}$</Text>
              </Text>

              <View style={[styles.divider, { marginLeft: 10 }]} />

              <Text style={[styles.baseText, { padding: 10, fontStyle: 'italic' }]}>
                Lowest price of the day: <Text>
                  {quote.l}$</Text>
              </Text>

              <View style={[styles.divider, { marginLeft: 10 }]} />

              <Text style={[styles.baseText, { padding: 10, fontStyle: 'italic' }]}>
                Previous close price: <Text>
                  {quote.pc}$</Text>
              </Text>
            </View>

          ) : (
            <Text style={styles.baseText}>Loading…</Text>
          )}
        </Animated.View>
      )}

      {
        settingsBox && (
          <>
            <View style={styles.globalDarken} />
            <View style={[styles.stockWindow, { backgroundColor: dynamicHighlight }]}>
              <View style={styles.stockWindowHeader}>
                <Text style={styles.baseText}>Settings</Text>
                <TouchableOpacity onPress={() => setSettingsBox(false)}>
                  <Ionicons name="close" size={26} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <Text style={[styles.baseText]}>Choose your theme!</Text>
              <View style={{ flexDirection: 'row', padding: 2 }}>
                <TouchableOpacity
                  onPress={() => {
                    setDynamicColor(colors.default);
                    setDynamicHighlight(colors.defaultHighlight);
                  }}>
                  <View style={[styles.themeBox, { backgroundColor: colors.default }]} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setDynamicColor(colors.blue);
                    setDynamicHighlight(colors.blueHighlight);
                  }}>
                  <View style={[styles.themeBox, { backgroundColor: colors.blue }]} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setDynamicColor(colors.green);
                    setDynamicHighlight(colors.greenHighlight);
                  }}>
                  <View style={[styles.themeBox, { backgroundColor: colors.green }]} />
                </TouchableOpacity>

              </View>
            </View>


          </>
        )
      }

    </View >
  );
}