import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Add this for gradient support

// Import Screens
import Auth from "./Auth";
import NewUser from "./NewUser";
import SafetyTipsScreen from './SafetyTipsScreen';
import ReportsScreen from './ReportsScreen';
import ReportIncidentScreen from './ReportIncidentScreen';
import PotholeProximityAlert from './PotholeProximityAlert'; // Import the PotholeProximityAlert component

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
    source={require('./assets/background.jpg')}
    style={styles.backgroundImage}
    resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Safe Drive</Text>
        <Text style={styles.subtitle}>Drive Safely, Arrive Safely</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ReportsScreen')}
          >
            <Text style={styles.buttonText}>Reported Incidents</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ReportIncident')}
          >
            <Text style={styles.buttonText}>Report Incident</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('PotholeProximityAlert')}
          >
            <Text style={styles.buttonText}>Pothole Proximity Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SafetyTips')}
          >
            <Text style={styles.buttonText}>Safety Tips</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="NewUser" component={NewUser} />
        <Stack.Screen name="SafetyTips" component={SafetyTipsScreen} />
        <Stack.Screen name="ReportsScreen" component={ReportsScreen} />
        <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
        <Stack.Screen name="PotholeProximityAlert" component={PotholeProximityAlert} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#f0f0f0',
    fontSize: 18,
    marginBottom: 30,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#6a11cb',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
