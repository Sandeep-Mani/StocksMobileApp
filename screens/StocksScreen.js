import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import AppConfig from "../AppConfig";
import { scaleSize } from "../constants/Layout";
import { useStocksContext } from "../contexts/StocksContext";

function ListItem(props) {
  function handleOnPress(symbol, clickHandler) {
    clickHandler(symbol);
  }

  var stock = props.stock.item;
  var open = stock.open;
  var close = stock.close;
  var diff = close - open;

  var change = ((close - open) / open).toFixed(2) + "%";
  var selected = false;

  var selectedStock = props.selectedStock;

  if ("symbol" in selectedStock) {
    var symbol = selectedStock.symbol;

    if (stock.symbol === symbol) {
      selected = true;
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        handleOnPress(stock.symbol, props.clickHandler);
      }}
    >
      <View style={selected ? styles.listItemSelected : styles.listItem}>
        <Text style={styles.symbol}>{stock.symbol}</Text>
        <View style={styles.closingContainer}>
          <Text style={styles.closing}>{stock.close}</Text>
          <View
            style={diff >= 0 ? styles.changeViewGreen : styles.changeViewRed}
          >
            <Text style={styles.change}>{change}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function StocksList(props) {
  return (
    <FlatList
      style={styles.listView}
      data={props.stocks}
      renderItem={(stock) => (
        <ListItem
          style={styles.ListView}
          stock={stock}
          clickHandler={props.clickHandler}
          selectedStock={props.selectedStock}
        />
      )}
      keyExtractor={(stock) => stock.symbol}
    />
  );
}

function StockDetails(props) {
  var stock = props.stock;

  return (
    <View style={styles.detailsView}>
      <Text style={styles.stockName}>{stock.name}</Text>
      <View style={styles.detailsRow}>
        <View style={styles.innerRow}>
          <Text style={styles.title}>OPEN</Text>
          <Text style={styles.value}>{stock.open}</Text>
        </View>
        <View style={styles.innerRow}>
          <Text style={styles.title}>LOW</Text>
          <Text style={styles.value}>{stock.low}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.innerRow}>
          <Text style={styles.title}>CLOSE</Text>
          <Text style={styles.value}>{stock.close}</Text>
        </View>
        <View style={styles.innerRow}>
          <Text style={styles.title}>HIGH</Text>
          <Text style={styles.value}>{stock.high}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.innerRow}>
          <Text style={styles.title}>VOLUME</Text>
          <Text style={styles.value}>{stock.volumes}</Text>
        </View>
        <View style={styles.innerRow}>
          <Text></Text>
          <Text></Text>
        </View>
      </View>
    </View>
  );
}

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState({ stocks: [], selectedStock: {} });

  useEffect(() => {
    let symbols = watchList.symbols;
    let stocks = state.stocks;

    for (let i = 0; i < symbols.length; i++) {
      let URL = ServerURL + AppConfig.history + symbols[i];

      fetch(URL)
        .then((response) => response.json())
        .then((json) => {
          // this function is getting called twice

          let stocks = state.stocks;
          let selectedStock = state.selectedStock;
          let exist = false;

          for (let j = 0; j < stocks.length; j++) {
            if (json[0].symbol === stocks[j].symbol) {
              exist = true;
            }
          }

          if (!exist) {
            stocks.push(json[0]);
          }

          setState({ stocks: stocks, selectedStock: selectedStock });
        })

        .catch((error) => {
          // console.error(error);
        });
    }
  }, [watchList]);

  function listClickHandler(symbol) {
    var stocks = state.stocks;

    for (let i = 0; i < stocks.length; i++) {
      if (stocks[i].symbol === symbol) {
        const selectedStock = stocks[i];
        setState({ stocks: stocks, selectedStock: selectedStock });
        break;
      }
    }
  }

  return (
    <View style={styles.container}>
      <StocksList
        stocks={state.stocks}
        clickHandler={listClickHandler}
        selectedStock={state.selectedStock}
      />
      <StockDetails stock={state.selectedStock} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
  },

  detailsView: {
    flex: 0.65,
    backgroundColor: "#2b2b2b",
  },

  stockName: {
    paddingTop: 7,
    paddingBottom: 7,
    textAlign: "center",
    fontSize: scaleSize(17),
    color: "#fff",
  },

  detailsRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#808080",
  },

  innerRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    padding: 5,
    color: "#808080",
  },

  value: {
    padding: 5,
    color: "#fff",
    textAlign: "center",
  },

  listItemSelected: {
    borderBottomColor: "#808080",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#454545",
  },

  listItem: {
    borderBottomColor: "#808080",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
  },

  symbol: {
    flex: 1,
    padding: 10,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: scaleSize(18),
    color: "#fff",
  },

  closingContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  closing: {
    padding: 10,
    marginRight: 15,
    fontSize: scaleSize(16),
    color: "#fff",
  },

  changeViewGreen: {
    marginBottom: 6,
    marginRight: 12,
    borderRadius: 6,
    borderColor: "#48a84c",
    borderWidth: 1,
    alignSelf: "flex-end",
    backgroundColor: "#48a84c",
  },

  changeViewRed: {
    marginBottom: 6,
    marginRight: 12,
    borderRadius: 6,
    borderColor: "#eb4536",
    borderWidth: 1,
    alignSelf: "flex-end",
    backgroundColor: "#eb4536",
  },
  change: {
    padding: 5,
    color: "#fff",
  },
});
