import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function PhotoStorageApp() {
  const [images, setImages] = useState([]); // Store images with metadata
  const [title, setTitle] = useState(''); // Title input
  const [description, setDescription] = useState(''); // Description input
  const [tags, setTags] = useState(''); // Tags input
  const [searchQuery, setSearchQuery] = useState(''); // Search input

  // Open the camera to take a picture
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      const savedImagePath = await saveImage(result.uri);
      if (savedImagePath) {
        // Add image to the list with metadata (empty for now)
        setImages((prevImages) => [
          ...prevImages,
          {
            path: savedImagePath,
            title: '',
            description: '',
            tags: [],
          },
        ]);
      }
    }
  };

  // Save the image in the app's local directory
  const saveImage = async (imageUri) => {
    const fileName = imageUri.split('/').pop();
    const newPath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      await FileSystem.moveAsync({
        from: imageUri,
        to: newPath,
      });
      return newPath;
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  // Add metadata (title, description, tags) to the last added image
  const addMetadata = () => {
    if (!title || !description || !tags) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      const lastImage = updatedImages[updatedImages.length - 1];

      lastImage.title = title;
      lastImage.description = description;
      lastImage.tags = tags.split(',').map(tag => tag.trim());

      return updatedImages;
    });

    // Reset form fields after saving metadata
    setTitle('');
    setDescription('');
    setTags('');
  };

  // Search images by title, description, or tags
  const searchImages = () => {
    return images.filter((image) =>
      image.title.includes(searchQuery) ||
      image.description.includes(searchQuery) ||
      image.tags.some((tag) => tag.includes(searchQuery))
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo Storage App</Text>

      {/* Button to open camera and take picture */}
      <Button title="Take a Picture" onPress={openCamera} />

      {/* Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />

      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />

      {/* Tags Input */}
      <TextInput
        style={styles.input}
        placeholder="Tags (comma-separated)"
        value={tags}
        onChangeText={(text) => setTags(text)}
      />

      {/* Button to add metadata */}
      <Button title="Add Metadata" onPress={addMetadata} />

      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search by title, description, or tags"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Display the search results */}
      <FlatList
        data={searchImages()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.path }} style={styles.image} />
            <Text>Title: {item.title}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Tags: {item.tags.join(', ')}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    color: 'red',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    color: 'red',
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});
