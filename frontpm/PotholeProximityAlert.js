import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Audio } from "expo-av";
import { Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error("Location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("Received locations:", locations);
  }
});

const PotholeProximityAlert = () => {
  const [potholes, setPotholes] = useState([]);
  const [sound, setSound] = useState();
  const [potholeAlert, setPotholeAlert] = useState(false);
  const [nbrPotholesDetected, setNbrPotholesDetected] = useState(0);
  const [potholesDetected, setPotholesDetected] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.1.149:7027/Products");
        if (!response.ok) {
          throw new Error("Failed to fetch potholes");
        }
        const data = await response.json();
        setPotholes(data);
      } catch (error) {
        console.error("Error fetching potholes:", error.message);
      }
    };

    fetchData();

    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require("./alert.mp3"));
      setSound(sound);
    };
    loadSound();

    (async () => {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        showsBackgroundLocationIndicator: true,
      });
    })();

    return () => {
      (async () => {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (sound) {
          sound.unloadAsync();
        }
      })();
    };
  }, []);

  useEffect(() => {
    setNbrPotholesDetected(0);
    setPotholesDetected([]);
    if (potholes.length > 0) {
      Location.getCurrentPositionAsync({}).then(({ coords }) => {
        console.log("User position:", coords.latitude, coords.longitude);
        potholes.forEach((pothole) => {
          const distance = calculateDistance(
            coords.latitude,
            coords.longitude,
            pothole.latitude,
            pothole.longitude
          );
          console.log("Distance to pothole:", distance);
          if (distance < 0.1) {
            setPotholeAlert(true);
            setNbrPotholesDetected((prev) => prev + 1);
            setPotholesDetected((prev) => [...prev, pothole]);
          }
        });
      });
    }
  }, [potholes, sound]);

  useEffect(() => {
    if (potholeAlert) {
      // console.log("Pothole alert!");
      // Alert.alert("Proximity Alert", "You are close to a pothole!");
      if (sound) {
        sound.replayAsync();
        setTimeout(() => {
          sound.stopAsync();
        }, 1200);
      }
    }
  }, [potholeAlert]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [nbrPotholesDetected]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <ImageBackground
      source={require("./assets/background.jpg")}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <LinearGradient colors={["#FF416C", "#FF4B2B"]} style={styles.gradient}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.gradient}>
            <Icon
              name="alert-circle"
              size={40}
              color="#FFF"
              style={styles.icon}
            />
            <Text style={styles.title}>Pothole Alert</Text>
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>{nbrPotholesDetected}</Text>
              <Text style={styles.subtitle}>Potholes Detected</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            {potholesDetected.map((product, index) => (
              <TouchableOpacity
                key={index}
                style={styles.productItem}
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps?q=${product.latitude},${product.longitude}`
                  )
                }
              >
                <View style={styles.productDetails}>
                  <Text style={styles.text}>Name: {product.name}</Text>
                  <Text style={styles.text}>Incident: {product.incident}</Text>
                  <Text style={styles.text}>Details: {product.details}</Text>
                  <Text style={styles.text}>
                    Latitude: <Text>{product.latitude}</Text>
                  </Text>
                  <Text style={styles.text}>
                    Longitude: <Text>{product.longitude}</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  gradient: {
    padding: 25,
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 15,
  },
  counterContainer: {
    alignItems: "center",
  },
  counterText: {
    color: "#FFF",
    fontSize: 48,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#FFF",
    fontSize: 16,
    opacity: 0.9,
    marginTop: 5,
  },
  productContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Adds slight depth to the container
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  productItem: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start", // Align items for a cleaner layout
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
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
    color: "#555", // Softer text color for a modern look
    marginBottom: 5,
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    paddingTop : "40%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "90%",
  },
});

export default PotholeProximityAlert;
