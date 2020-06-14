import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // https://reactnative.dev/docs/asyncstorage

  storeData = async (str) => {
    try {
      await AsyncStorage.setItem("SYMBOLS", str);
    } catch (error) {
      console.log(error);
    }
  };

  retrieveData = async () => {
    try {
      // await AsyncStorage.removeItem("SYMBOLS");
      const value = await AsyncStorage.getItem("SYMBOLS");
      if (value !== null) {
        setState({ symbols: JSON.parse(value) });
      } else {
        const symbols = [];
        setState({ symbols: symbols });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function addToWatchlist(newSymbol) {
    let symbols = state.symbols;

    if (!symbols.includes(newSymbol)) {
      symbols.push(newSymbol);
      symbols = symbols.sort();
      setState({ symbols: symbols });
      storeData(JSON.stringify(symbols));
    }
  }

  useEffect(() => {
    retrieveData();
  }, []);

  return {
    ServerURL: "http://131.181.190.87:3001",
    watchList: state,
    addToWatchlist,
  };
};
