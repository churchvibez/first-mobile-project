import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert, Button } from 'react-native';
import { DOMParser } from 'xmldom'; // XML parser
import { TextDecoder } from 'text-encoding';
import { Picker } from '@react-native-picker/picker'; // Modal dropdown picker

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]); // Store currency options
  const [fromCurrency, setFromCurrency] = useState('USD'); // Default from currency
  const [toCurrency, setToCurrency] = useState('EUR'); // Default to currency
  const [amount, setAmount] = useState(1); // Amount to convert
  const [exchangeRates, setExchangeRates] = useState({});
  const [result, setResult] = useState(null); // Result after conversion

  // Fetch currency data from the Central Bank of Russia
  const fetchData = async () => {
    try {
      const response = await fetch('https://www.cbr.ru/scripts/XML_daily.asp');
      if (!response.ok) {
        console.error('Network response was not ok', response.status);
        Alert.alert('Error', `Failed to fetch data. Status code: ${response.status}`);
        return;
      }

      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const decoder = new TextDecoder('windows-1251');
      const decodedText = decoder.decode(uint8Array);

      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(decodedText, 'text/xml');
      const valutes = xmlDoc.getElementsByTagName('Valute');

      // Extract currency data
      let tempCurrencies = [];
      let tempExchangeRates = {};
      for (let i = 0; i < valutes.length; i++) {
        const charCode = valutes[i].getElementsByTagName('CharCode')[0].textContent;
        const nominal = parseFloat(valutes[i].getElementsByTagName('Nominal')[0].textContent);
        const value = parseFloat(valutes[i].getElementsByTagName('Value')[0].textContent.replace(',', '.'));

        tempCurrencies.push(charCode);
        tempExchangeRates[charCode] = { nominal, value };
      }

      // Add RUB (Russian Ruble) to the list of currencies
      tempCurrencies.push('RUB');
      tempExchangeRates['RUB'] = { nominal: 1, value: 1 }; // 1 RUB = 1 RUB

      setCurrencies(tempCurrencies);
      setExchangeRates(tempExchangeRates);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch exchange rate data.');
    }
  };

  // Perform the conversion
  const convertCurrency = () => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      Alert.alert('Error', 'Please select valid currencies.');
      return;
    }

    const fromRate = exchangeRates[fromCurrency].value / exchangeRates[fromCurrency].nominal;
    const toRate = exchangeRates[toCurrency].value / exchangeRates[toCurrency].nominal;
    const convertedAmount = (amount * fromRate) / toRate;
    
    setResult(convertedAmount.toFixed(2)); // Display result rounded to 2 decimal places
  };

  // Trigger conversion whenever amount or currency changes
  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Dismiss keyboard when tapping outside
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>Currency Converter</Text>

        {/* Amount input */}
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount.toString()}
          onChangeText={text => setAmount(parseFloat(text))}
          returnKeyType="done"         // Add "Done" button on the keyboard
          blurOnSubmit={true}          // Close keyboard on "Done"
          onSubmitEditing={convertCurrency} // Trigger conversion on "Done"
        />

        {/* From and To currency pickers wrapped in separate boxes */}
        <View style={styles.pickerContainer}>
          <View style={styles.pickerBox}>
            <Text>From:</Text>
            <Picker
              selectedValue={fromCurrency}
              style={styles.picker}
              onValueChange={itemValue => setFromCurrency(itemValue)}
              mode="dropdown"
            >
              {currencies.map(currency => (
                <Picker.Item key={currency} label={currency} value={currency} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerBox}>
            <Text>To:</Text>
            <Picker
              selectedValue={toCurrency}
              style={styles.picker}
              onValueChange={itemValue => setToCurrency(itemValue)}
              mode="dropdown"
            >
              {currencies.map(currency => (
                <Picker.Item key={currency} label={currency} value={currency} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Display the result */}
        {result && (
          <Text style={styles.result}>
            {amount} {fromCurrency} = {result} {toCurrency}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerBox: {
    flex: 1,
    marginHorizontal: 10,
  },
  picker: {
    height: 150,
    width: '100%',
    marginBottom: 20,
  },
  result: {
    marginTop: 55,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
