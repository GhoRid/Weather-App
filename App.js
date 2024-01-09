import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import time from "./time";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "121d5907c58b019d48687445659da13d";

const icons = {
  Clouds: "cloudy",
  Rain: "rain",
  Sunny: "day-sunny",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [currentWeather, setCurrentWeather] = useState([]);
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    //foreground permission: 앱이 foreground에 있을 때만 위치 정보를 가져옴
    //background permission: 앱이 background에 있을 때도 위치 정보를 가져옴
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    } else {
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      const location = await Location.reverseGeocodeAsync(
        {
          longitude,
          latitude,
        },
        //(useGoogleMaps = false)
        (useGoogleMaps = false)
      );
      if (location && location.length > 0) {
        setCity(location[0].city);
      }
      const currentWeatherJson = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      ).then((reponse) => reponse.json());
      setCurrentWeather(currentWeatherJson);

      const forcastJson = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      ).then((reponse) => reponse.json());

      setDays(
        forcastJson.list.filter((item, index) => {
          if (item.dt < currentWeatherJson.dt) {
            return;
          } else {
            return item;
          }
        })
      );
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityname}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {currentWeather.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          <View style={styles.day}>
            <Text style={styles.current}>현재 날씨</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Text style={styles.temp}>
                {parseFloat(currentWeather.main.temp).toFixed(1)}
              </Text>
              <Fontisto
                name={icons[currentWeather.weather[0].main]}
                size={68}
                color="white"
              />
            </View>
            <Text style={styles.description}>
              {currentWeather.weather[0].main}
            </Text>
            <Text style={styles.tinyDescription}>
              {currentWeather.weather[0].description}
            </Text>
          </View>
        )}
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.dayname}>
                {time(day.dt).year}-{time(day.dt).month}-{time(day.dt).day}
              </Text>
              <Text style={styles.time}>
                {time(day.dt).hours}:{time(day.dt).minutes}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "90%",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyDescription}>
                {day.weather[0].description}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityname: {
    fontSize: 38,
    fontWeight: "500",
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingLeft: 20,
  },
  current: {
    fontSize: 30,
    color: "white",
    marginTop: 30,
  },
  dayname: {
    fontSize: 20,
    color: "white",
  },
  time: {
    fontSize: 30,
    color: "white",
    // marginTop: -30,
  },
  temp: {
    fontSize: 158,
    fontWeight: "500",
    color: "white",
  },
  description: {
    fontSize: 60,
    marginTop: -30,
    fontWeight: "500",
    color: "white",
  },
  tinyDescription: {
    fontSize: 20,
    color: "white",
  },
});
