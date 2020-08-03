import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import AppConfig from "../AppConfig";
import { scaleSize } from "../constants/Layout";
import { useStocksContext } from "../contexts/StocksContext";

function ListItem(props) {
  function handleOnPress(symbol) {
    props.addToWatchlist(symbol);

    props.navigation.navigate("Stocks");
  }

  var stock = props.stock.item;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        handleOnPress(stock.symbol);
      }}
    >
      <View style={styles.listItem}>
        <Text style={styles.symbol}>{stock.symbol}</Text>
        <Text style={styles.name}>{stock.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

function StocksList(props) {
  return (
    <FlatList
      data={props.stocks}
      renderItem={(stock) => (
        <ListItem
          style={styles.ListItem}
          stock={stock}
          navigation={props.navigation}
          addToWatchlist={props.addToWatchlist}
        />
      )}
      keyExtractor={(stock) => stock.symbol}
    />
  );
}

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [state, setState] = useState({ stocks: [], filteredStocks: [] });

  function onSearchType(searchString) {
    const stocks = state.stocks;

    if (searchString.length === 0) {
      setState({ stocks: stocks, filteredStocks: stocks });
    } else {
      let fs = [];

      for (let i = 0; i < stocks.length; i++) {
        let symbol = stocks[i].symbol.toLowerCase();
        let name = stocks[i].name.toLowerCase();
        let ss = searchString.toLowerCase();

        if (name.includes(ss) || symbol.includes(ss)) {
          fs.push(stocks[i]);
        }
      }

      setState({ stocks: stocks, filteredStocks: fs });
    }
  }

  useEffect(() => {
    // https://reactnative.dev/docs/network
    // fetch usage

    fetch(AppConfig.ServiceUrl + AppConfig.allStock)
      .then((response) => response.json())
      .then((json) => {
        const stocks = json;
        const filteredStocks = [...stocks];

        setState({ stocks: stocks, filteredStocks: [] });
      })
      .catch((error) => {
        // console.error(error);
      });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.searchTitle}>
          Type a company name or stock symbol
        </Text>

        <View style={styles.searchSection}>
          <Ionicons style={styles.searchIcon} name="md-search" size={22} />

          <TextInput
            style={styles.input}
            onChangeText={(searchString) => {
              onSearchType(searchString);
            }}
          />
        </View>

        <StocksList
          stocks={state.filteredStocks}
          navigation={navigation}
          addToWatchlist={addToWatchlist}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listItem: {},

  searchTitle: {
    color: "white",
    textAlign: "center",
    marginTop: 3,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: scaleSize(14),
  },

  symbol: {
    paddingTop: 2,
    paddingLeft: 5,
    color: "#fff",
    fontSize: scaleSize(16),
  },

  name: {
    paddingLeft: 4,
    color: "#fff",
    fontSize: scaleSize(12),
  },

  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333333",
  },

  searchIcon: {
    padding: 8,
    marginLeft: 6,
    backgroundColor: "#333333",
    color: "#fff",
  },

  input: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    backgroundColor: "#333333",
    color: "#FFF",
    fontSize: scaleSize(17),
  },

  listItem: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
});
