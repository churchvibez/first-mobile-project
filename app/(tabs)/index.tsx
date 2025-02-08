import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';

export default function LabOne() {
  // Function to show the welcome dialog
  const showWelcomeDialog = () => {
    Alert.alert(
      "Welcome!", // Dialog title
      "", // No message
      [{ text: "OK", onPress: () => console.log("Dialog closed") }] // Close button
    );
  };

  return (
    <View style={styles.container}>
      {/* Button to show the welcome message */}
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
