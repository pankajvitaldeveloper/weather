import React, { useState, useEffect, useCallback } from 'react';
import './Weather.css';
import drizzle from '../Assets/drizzle.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    city: 'Delhi',
    temperature: '°C',
    realFeel: '°C',
    humidity: '20',
    icon: '',
    wind: 's',
    weatherDescription: 'Description',
    time: new Date().toLocaleTimeString(), // Initialize with current time
  });

  const api_key = 'd05211ffe0dc336edcee960c14192f99';

  const mapConditionToIcon = (conditionCode) => {
    return `https://openweathermap.org/img/wn/${conditionCode}.png`;
  };

  const fetchWeatherData = useCallback(async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${api_key}`
      );
      const data = await response.json();
      const iconUrl = mapConditionToIcon(data.weather[0].icon);
      setWeatherData({
        city: data.name,
        temperature: data.main.temp + '°C',
        realFeel: data.main.feels_like + '°C',
        humidity: data.main.humidity + '%',
        wind: data.wind.speed + ' m/s',
        icon: iconUrl,
        weatherDescription: data.weather[0].description,
        time: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Please Enter Correct City Name.');
    }
  }, []);

  useEffect(() => {
    // Fetch Delhi weather data on component mount
    fetchWeatherData('Delhi');

    // Update the time every second
    const interval = setInterval(() => {
      setWeatherData((prevWeatherData) => ({
        ...prevWeatherData,
        time: new Date().toLocaleTimeString(),
      }));
    }, 1000);

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, [fetchWeatherData]);

  const search = (e) => {
    e.preventDefault();
    const cityInput = document.querySelector('.weather__searchform');
    if (cityInput.value === '') {
      alert('Please enter a city name');
      return;
    }
    fetchWeatherData(cityInput.value); // Fetch weather data for the entered city
  };

  return (
    <div className="container">
      <h3>Weather App</h3>

      <div className="weather__header" style={{ marginTop: '1rem' }}>

        
        <form className="weather__search">
          <input
            type="text"
            placeholder="Search for a city..."
            className="weather__searchform"
          />
          <i className="fa-solid fa-magnifying-glass" />
          <button onClick={search} className="search-btn">
            Search
          </button>
        </form>
        <div className="weather__units">
          <span className="weather_unit_celsius">°C</span>
          <span className="weather_unit_fahrenheit">°F</span>
        </div>
      </div>
      <div className="weather__body">
        <h1 className="weather__city">{weatherData.city}</h1>
        {/* Display the weather icon using the icon URL */}
        <img
          src={weatherData.icon || drizzle} // Use the 'drizzle' image as the default
          alt="Weather Icon"
          className="weather__icon"
        />
        <p className="weather__temperature">{weatherData.temperature}</p>
        {/* Display the weather description */}
        <p className="weather__description">{weatherData.weatherDescription}</p>
      </div>
      <div className="weather__info">
        <div className="weather__card">
          <i className="fa-solid fa-temperature-full" />
          <div>
            <p>Real Feel</p>
            <p className="weather__realfeel">{weatherData.realFeel}</p>
          </div>
        </div>
        <div className="weather__card">
          <i className="fa-solid fa-droplet" />
          <div>
            <p>Humidity</p>
            <p className="weather__humidity">{weatherData.humidity}</p>
          </div>
        </div>
        <div className="weather__card">
          <i className="fa-solid fa-wind" />
          <div>
            <p>Wind</p>
            <p className="weather__wind">{weatherData.wind}</p>
          </div>
        </div>
        <div className="weather__card">
          <i className="fa-solid fa-wind" />
          <div>
            <p>Time</p>
            <p className="weather__time">{weatherData.time}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather