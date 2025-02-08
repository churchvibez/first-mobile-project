import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LabTwo() {
  const [playerScore, setPlayerScore] = useState(0);
  const [appScore, setAppScore] = useState(0);
  const [result, setResult] = useState('');
  const [winningScore, setWinningScore] = useState(5); // Default winning score

  const choices = ['Rock', 'Paper', 'Scissors'];

  // Function to handle the game logic
  const playGame = (playerChoice: string) => {
    const appChoice = choices[Math.floor(Math.random() * 3)];
    let message = '';

    if (playerChoice === appChoice) {
      message = "It's a draw!";
    } else if (
      (playerChoice === 'Rock' && appChoice === 'Scissors') ||
      (playerChoice === 'Scissors' && appChoice === 'Paper') ||
      (playerChoice === 'Paper' && appChoice === 'Rock')
    ) {
      message = `You won! The app chose ${appChoice}.`;
      setPlayerScore(playerScore + 1);
    } else {
      message = `You lost! The app chose ${appChoice}.`;
      setAppScore(appScore + 1);
    }

    setResult(message);

    // Check if either the player or the app has reached the winning score
    if (playerScore + 1 === winningScore) {
      Alert.alert('Game Over!', 'You won the game!');
      resetGame();
    } else if (appScore + 1 === winningScore) {
      Alert.alert('Game Over!', 'The app won the game!');
      resetGame();
    }
  };

  // Function to reset the game scores
  const resetGame = () => {
    setPlayerScore(0);
    setAppScore(0);
    setResult('');
  };

  // Function to adjust the winning score
  const changeWinningScore = () => {
    Alert.prompt(
      'Set Winning Score',
      'Enter the number of points required to win:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (input) => {
            const score = parseInt(input ?? '');
            if (!isNaN(score) && score > 0) {
              setWinningScore(score);
              resetGame(); // Reset the game after changing the score limit
            } else {
              Alert.alert('Invalid Input', 'Please enter a valid number.');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <View style={styles.container}>
      {/* Settings Button (Top Left) */}
      <TouchableOpacity onPress={changeWinningScore} style={styles.settingsButton}>
        <Ionicons name="settings-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Reset Button (Top Right) */}
      <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
        <Ionicons name="refresh-outline" size={30} color="white" />
      </TouchableOpacity>

      <Text style={styles.header}>Rock, Paper, Scissors</Text>
      <Text style={styles.result}>{result}</Text>

      <View style={styles.iconContainer}>
        {/* Rock Button */}
        <TouchableOpacity onPress={() => playGame('Rock')}>
          <Ionicons name="bowling-ball-outline" size={70} color="white" />
        </TouchableOpacity>

        {/* Paper Button */}
        <TouchableOpacity onPress={() => playGame('Paper')}>
          <Ionicons name="hand-right" size={70} color="white" />
        </TouchableOpacity>

        {/* Scissors Button */}
        <TouchableOpacity onPress={() => playGame('Scissors')}>
          <Ionicons name="cut" size={70} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.score}>Player: {playerScore} - App: {appScore}</Text>
      <Text style={styles.winningScore}>Winning Score: {winningScore}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212', // Optional background color for better contrast
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red',
  },
  result: {
    fontSize: 18,
    marginVertical: 20,
    color: 'red',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  winningScore: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  resetButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});
