import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DOMParser } from 'xmldom';
import iconv from 'iconv-lite';

interface ExchangeRate {
  nominal: number;
  value: number;
}

type ExchangeRates = {
  [currencyCode: string]: ExchangeRate;
};

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<string>("1");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [result, setResult] = useState<string | null>(null);

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
      const buffer = Buffer.from(uint8Array);
      const decodedText = iconv.decode(buffer, 'windows-1251');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(decodedText, 'text/xml');
      const valutes = xmlDoc.getElementsByTagName('Valute');
  
      let tempCurrencies: string[] = [];
      let tempExchangeRates: ExchangeRates = {};
      for (let i = 0; i < valutes.length; i++) {
        const charCode = valutes[i].getElementsByTagName('CharCode')[0].textContent!;
        const nominal = parseFloat(valutes[i].getElementsByTagName('Nominal')[0].textContent!);
        const value = parseFloat(
          valutes[i].getElementsByTagName('Value')[0].textContent!.replace(',', '.')
        );
  
        tempCurrencies.push(charCode);
        tempExchangeRates[charCode] = { nominal, value };
      }
  
      tempCurrencies.push('RUB');
      tempExchangeRates['RUB'] = { nominal: 1, value: 1 };
  
      setCurrencies(tempCurrencies);
      setExchangeRates(tempExchangeRates);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch exchange rate data.');
    }
  };

  const convertCurrency = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      Alert.alert('Invalid Input', 'Please enter a valid number.');
      return;
    }

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      Alert.alert('Error', 'Please select valid currencies.');
      return;
    }
  
    const fromRate = exchangeRates[fromCurrency].value / exchangeRates[fromCurrency].nominal;
    const toRate = exchangeRates[toCurrency].value / exchangeRates[toCurrency].nominal;
    const convertedAmount = (numericAmount * fromRate) / toRate;
    
    setResult(convertedAmount.toFixed(2));
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    fetchData();
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>Currency Converter</Text>

        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={text => setAmount(text)}
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={convertCurrency}
        />

        <View style={styles.pickerContainer}>
          <View style={styles.pickerBox}>
            <Text style={styles.pickerLabel}>From:</Text>
            <Picker
              selectedValue={fromCurrency}
              style={styles.picker}
              onValueChange={itemValue => setFromCurrency(itemValue)}
              mode="dropdown"
            >
              {currencies.map(currency => (
                <Picker.Item key={currency} label={currency} value={currency} color="black" />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerBox}>
            <Text style={styles.pickerLabel}>To:</Text>
            <Picker
              selectedValue={toCurrency}
              style={styles.picker}
              onValueChange={itemValue => setToCurrency(itemValue)}
              mode="dropdown"
            >
              {currencies.map(currency => (
                <Picker.Item key={currency} label={currency} value={currency} color="black" />
              ))}
            </Picker>
          </View>
        </View>

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
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerBox: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
    textAlign: 'center',
  },
  picker: {
    height: 190,
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  result: {
    marginTop: 40,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
});
