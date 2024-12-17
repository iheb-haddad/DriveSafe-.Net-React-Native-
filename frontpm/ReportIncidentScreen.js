import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';

const ReportIncidentScreen = () => {
  const [incidentDetails, setIncidentDetails] = useState({
    name: '',
    incident: '',
    details: '',
    latitude: null,
    longitude: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setIncidentDetails((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleGetPosition = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setIncidentDetails((prevState) => ({
        ...prevState,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      }));
      Alert.alert('Success', 'Current position obtained successfully!');
    } catch (error) {
      Alert.alert('Error', 'Error getting current location.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!incidentDetails.name.trim() || !incidentDetails.incident.trim() || !incidentDetails.details.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);

    fetch('http://192.168.1.149:7027/Products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidentDetails),
    })
      .then((response) => {
        if (response.ok) {
          Alert.alert('Success', 'Incident reported successfully!');
          setIncidentDetails({ name: '', incident: '', details: '', latitude: null, longitude: null });
        } else {
          Alert.alert('Error', 'Failed to report incident.');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to report incident. Check your internet connection.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Incident</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="#aaa"
        value={incidentDetails.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Incident Title"
        placeholderTextColor="#aaa"
        value={incidentDetails.incident}
        onChangeText={(text) => handleChange('incident', text)}
      />
      <TextInput
        style={[styles.input, styles.detailsInput]}
        placeholder="Details of the Incident"
        placeholderTextColor="#aaa"
        multiline
        value={incidentDetails.details}
        onChangeText={(text) => handleChange('details', text)}
      />
      <TouchableOpacity
        style={styles.getPositionButton}
        onPress={handleGetPosition}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.getPositionButtonText}>Get Current Position</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text style={styles.submitButtonText}>Submit</Text>
            <AntDesign name="arrowright" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  getPositionButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  getPositionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default ReportIncidentScreen;
