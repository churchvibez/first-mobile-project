import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;


export default function LabOne() {
  const showWelcomeDialog = () => {
    Alert.alert(
      "Welcome!",
      "",
      [{ text: "OK", onPress: () => console.log("Dialog closed") }]
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Click Me" onPress={showWelcomeDialog} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
