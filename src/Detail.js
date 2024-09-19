import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingScreen from "./LoadingScreen";
import translate from "translate";

const translateText = async (text) => {
  if (!text) return "";
  try {
    const res = await translate(text, { from: "en", to: "tr" });
    if (!res) {
      throw new Error("Translation not found");
    } // Çeviri bulunamadığında hata fırlat
    return res;
  } catch (error) {
    // console.error("Çeviri hatası:", error);
    return text; // Hata durumunda orijinal metni döndür
  }
};

const renderItinerary = async (item) => {
  const formattedText = item.replace(/\*\*/g, "").replace(/\*/g, "");
  const dayWiseItinerary = [];
  const lines = formattedText.split("\n");

  let currentDayDetails = [];
  let currentDayTitle = "";

  for (let i = 0; i < lines.length; i++) {
    const trim = lines[i].trim();
    if (trim.length > 0) {
      let translatedText = await translateText(trim);

      if (lines[i].startsWith("Day")) {
        if (currentDayDetails.length > 0) {
          dayWiseItinerary.push({
            day: currentDayTitle,
            details: currentDayDetails,
          });
        }
        currentDayTitle = translatedText; // Gün başlığını çevir
        currentDayDetails = [];
      } else {
        currentDayDetails.push(
          <Text key={i} style={styles.itinerary}>
            {translatedText}
          </Text>
        );
      }
    }
  }

  // Son gün detaylarını ekle
  if (currentDayDetails.length > 0) {
    dayWiseItinerary.push({
      day: currentDayTitle,
      details: currentDayDetails,
    });
  }

  return dayWiseItinerary.map((dayData, index) => (
    <View key={index} style={styles.dayContainer}>
      <Text style={styles.day}>{dayData.day}</Text>
      {dayData.details}
    </View>
  ));
};

function Detail({ route }) {
  const navigation = useNavigation();
  const { itinerary, isLoading } = route.params;
  const [translatedItinerary, setTranslatedItinerary] = useState([]);

  useEffect(() => {
    const translateItinerary = async () => {
      const translated = await renderItinerary(itinerary);
      setTranslatedItinerary(translated);
    };

    translateItinerary();
  }, [itinerary]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Seyahat Programı</Text>
          </View>
          <FlatList
            data={[translatedItinerary]}
            renderItem={({ item }) => item}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1E90FF",
    borderRadius: 10,
    height: 60,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginLeft: 10,
  },
  dayContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  day: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "bold",
  },
  itinerary: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 5,
    marginBottom: 10,
    fontWeight: "bold",
  },
});

export default Detail;
