import { useState, useEffect } from "react";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [iconCode, setIconCode] = useState("");

  useEffect(() => {
    const defaultCity = "London";

    setLoading(true);

    let url = `https://api.shecodes.io/weather/v1/current?query=${defaultCity}&key=oa123466c5f9312d2cba18f04t3ef25d`;

    axios
      .get(url)
      .then((response) => {
        setWeather(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Weather API error:",
          error.response?.data || error.message,
        );
        setLoading(false);
      });
  }, []);

  function showTemperature(response) {
    setWeather(response.data);

    let icon = response.data.condition.icon_url;

    if (icon.includes("clear")) {
      setIconCode("01d");
    }

    if (icon.includes("few-clouds")) {
      setIconCode("02d");
    }

    if (icon.includes("scattered-clouds")) {
      setIconCode("03d");
    }

    if (icon.includes("broken-clouds") || icon.includes("overcast")) {
      setIconCode("04d");
    }

    if (icon.includes("shower") || icon.includes("drizzle")) {
      setIconCode("09d");
    }

    if (icon.includes("rain")) {
      setIconCode("10d");
    }

    if (icon.includes("thunderstorm")) {
      setIconCode("11d");
    }

    if (icon.includes("snow") || icon.includes("sleet")) {
      setIconCode("13d");
    }

    if (
      icon.includes("mist") ||
      icon.includes("fog") ||
      icon.includes("haze") ||
      icon.includes("smoke") ||
      icon.includes("dust")
    ) {
      setIconCode("50d");
    }
    setLoading(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    let url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=oa123466c5f9312d2cba18f04t3ef25d`;

    setLoading(true);
    axios
      .get(url)
      .then(showTemperature)
      .catch((error) => {
        console.error(
          "Weather API error:",
          error.response?.data || error.message,
        );
        setLoading(false);
      });
  }

  let weatherDisplay = null;

  if (loading) {
    weatherDisplay = (
      <div className="loader">
        <PuffLoader color="#000000" size={60} speedMultiplier={0.7} />
      </div>
    );
  }

  if (weather !== null && !loading) {
    const now = new Date();

    weatherDisplay = (
      <div className="weather-info">
        <div className="location-info">
          <h2>{weather.city}</h2>

          <p className="date-time">
            {now.toLocaleDateString("en-GB", {
              weekday: "long",
            })}{" "}
            |{" "}
            {now.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p className="description">{weather.condition.description}</p>
        </div>

        <div className="weather-details">
          <div className="temperature">
            <img
              src={weather.condition.icon_url}
              alt={weather.condition.description}
            />

            <h1>{Math.round(weather.temperature.current)}°C</h1>
          </div>

          <div className="additional-info">
            <p>Humidity: {weather.temperature.humidity}%</p>
            <p>Wind: {weather.wind.speed} km/h</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <div className="App">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Enter a city..."
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />

          <button type="submit">Search</button>
        </form>

        {weatherDisplay}
      </div>

      <footer className="footer">
        Coded by{" "}
        <a href="https://github.com/repos" target="_blank" rel="noreferrer">
          Milena
        </a>{" "}
        ·{" "}
        <a
          href="https://github.com/MillieBea/react-weather"
          target="_blank"
          rel="noreferrer"
        >
          Open-source code
        </a>
      </footer>
    </div>
  );
}
