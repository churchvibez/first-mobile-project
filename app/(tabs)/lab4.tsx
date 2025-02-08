import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function PhotoStorageApp() {
  const [images, setImages] = useState<
    {
      path: string;
      title: string;
      description: string;
      tags: string[];
    }[]
  >([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const savedImagePath = await saveImage(imageUri);
      if (savedImagePath) {
        setImages((prevImages) => [
          ...prevImages,
          { path: savedImagePath, title: '', description: '', tags: [] },
        ]);
      }
    }
  };

  const saveImage = async (imageUri: string) => {
    const fileName = imageUri.split('/').pop();
    if (!fileName) {
      Alert.alert('Error', 'Could not determine file name.');
      return;
    }
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

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (selectedIndex !== null) {
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[selectedIndex] = {
          ...updatedImages[selectedIndex],
          title: newTitle,
        };
        return updatedImages;
      });
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
    if (selectedIndex !== null) {
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[selectedIndex] = {
          ...updatedImages[selectedIndex],
          description: newDescription,
        };
        return updatedImages;
      });
    }
  };

  const handleTagsChange = (newTags: string) => {
    setTags(newTags);
    if (selectedIndex !== null) {
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[selectedIndex] = {
          ...updatedImages[selectedIndex],
          tags: newTags.split(',').map((tag) => tag.trim()),
        };
        return updatedImages;
      });
    }
  };

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

      <Button title="Take a Picture" onPress={openCamera} />

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="black"
        value={title}
        onChangeText={handleTitleChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="black"
        value={description}
        onChangeText={handleDescriptionChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma-separated)"
        placeholderTextColor="black"
        value={tags}
        onChangeText={handleTagsChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Search by title, description, or tags"
        placeholderTextColor="black"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        key="3"
        data={searchImages()}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.imageContainer,
              selectedIndex === index && styles.selectedImage,
            ]}
            onPress={() => {
              setSelectedIndex(index);
              setTitle(item.title);
              setDescription(item.description);
              setTags(item.tags.join(', '));
            }}
          >
            <Image source={{ uri: item.path }} style={styles.image} />
            <Text style={styles.imageText}>Title: {item.title}</Text>
            <Text style={styles.imageText}>Desc: {item.description}</Text>
            <Text style={styles.imageText}>Tags: {item.tags.join(', ')}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    color: 'black',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    maxWidth: '30%',
  },
  selectedImage: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  imageText: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
  },
});
