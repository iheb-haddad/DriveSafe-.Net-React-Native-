import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Linking, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportsScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // To store the filtered list
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    // Filter products whenever searchQuery changes
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.149:7027/Products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      // Filter the products based on the search query
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://192.168.1.149:7027/Products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`
        },
      });
      if (response.ok) {
        console.log('Product deleted successfully');
        // Update the product list after successful deletion
        setProducts(products.filter(product => product.id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reported Incidents</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={getAllProducts}>
        <Ionicons name="refresh" size={24} color="white" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Search incidents..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007bff" />
      ) : (
        <ScrollView contentContainerStyle={styles.productContainer}>
          {filteredProducts.map((product, index) => (
            <TouchableOpacity key={index} style={styles.productItem}
            onPress={() => Linking.openURL(`https://www.google.com/maps?q=${product.latitude},${product.longitude}`)}>
              <TouchableOpacity onPress={() => handleDelete(product.id)} style={styles.deleteButton}>
                <Ionicons name="close-circle-outline" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.productDetails}>
                <Text style={styles.text}>Name: {product.name}</Text>
                <Text style={styles.text}>Incident: {product.incident}</Text>
                <Text style={styles.text}>Details: {product.details}</Text>
                <Text style={styles.text}>Latitude: <Text>{product.latitude}</Text></Text>
                <Text style={styles.text}>Longitude: <Text>{product.longitude}</Text></Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#f9f9f9', // Softer background color for a clean look
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50', // Modern green color for better contrast
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Adds a modern shadow
    marginBottom: 20,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loader: {
    marginTop: 20,
  },
  productContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Adds slight depth to the container
  },
  productItem: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items for a cleaner layout
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
  },
  text: {
    fontSize: 16,
    color: '#555', // Softer text color for a modern look
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336', // Red background for delete action
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Subtle shadow for better feedback
  },
});


export default ReportsScreen;
