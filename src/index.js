import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import LoadingScreen from "./LoadingScreen";

const API_KEY = "Your-api-key"; // Güvenlik açısından .env dosyasına taşıyın
const MODEL_NAME = "gemini-1.5-pro";

const Home = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);

      const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const prompt = `
        Name: ${data.name}
        Starting place: ${data.startingPlace}
        Destination: ${data.destination}
        Duration: ${data.duration}
        Budget: ${data.budget} 
      `;

      const result = await chatSession.sendMessage(prompt);
      const responses = result.response.text();

      if (responses && responses.length > 0) {
        // console.log(responses);
        navigation.navigate("Detail", {
          itinerary: responses,
          isLoading,
        });
      } else {
        console.log("No response received from the model.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Text style={styles.heading}>AI Travel Itinerary Generator</Text>
          <Controller
            control={control}
            rules={{ required: true }}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>This is required.</Text>
          )}

          <Controller
            control={control}
            name="startingPlace"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Starting Place"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.startingPlace && (
            <Text style={styles.errorText}>This is required.</Text>
          )}

          <Controller
            control={control}
            rules={{ required: true }}
            name="destination"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Destination"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.destination && (
            <Text style={styles.errorText}>This is required.</Text>
          )}

          <Controller
            control={control}
            rules={{ required: true }}
            name="duration"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Duration"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
            )}
          />
          {errors.duration && (
            <Text style={styles.errorText}>This is required.</Text>
          )}

          <Controller
            control={control}
            rules={{ required: true }}
            name="budget"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Budget"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
            )}
          />
          {errors.budget && (
            <Text style={styles.errorText}>This is required.</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Generate Itinerary</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    color: "white",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default Home;
