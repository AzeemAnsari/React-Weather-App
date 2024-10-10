import React from 'react';
import Form from './Form';
import Weather from './Weather';
import InvalidCity from './InvalidCity';
import LocationError from './LocationError';
import Loader from './Loader';

import moment from 'moment';
import axios from 'axios';
import './Weather.css';
import loader from './images/loader.svg';
import 'weather-icons/css/weather-icons.css';

const API_KEY = process.env.REACT_APP_API_KEY;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      coords: { latitude: '', longitude: '' },
      icon: '',
      locationError: false,
      cityError: null,
      loading: false,
      time: '',
      sunrise: '',
      sunset: '',
      date: '',
      currLoc: null,
      hour: '',
      tempToggle: false,
      inputError: false,
      reload: false,
      currCity:'',
    };

    // Defining Icons
    this.weatherIcon = {
      Thunderstorm: 'wi-thunderstorm',
      Drizzle: 'wi-sleet',
      Rain: 'wi-storm-showers',
      Snow: 'wi-snow',
      Atmosphere: 'wi-fog',
      Clear: 'wi-day-sunny',
      Clouds: 'wi-day-fog',
      NightThunderstorm: 'wi-night-thunderstorm',
      NightDrizzle: 'wi-night-sleet',
      NightRain: 'wi-night-storm-showers',
      NightSnow: 'wi-night-snow',
      NightAtmosphere: 'wi-night-fog',
      NightClear: 'wi-night-clear',
      NightClouds: 'wi-night-fog',
    };
  }

  // Defining Icons based on Condtion and Day/Night
  get_Icons(icons, rangeId, curTime) {
    switch (true) {
      case rangeId >= 200 && rangeId < 232:
        this.setState({
          icon:
            curTime > 6 && curTime < 19
              ? icons.Thunderstorm
              : icons.NightThunderstorm,
        });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({
          icon:
            curTime > 6 && curTime < 19 ? icons.Drizzle : icons.NightDrizzle,
        });
        break;
      case rangeId >= 500 && rangeId <= 521:
        this.setState({
          icon: curTime > 6 && curTime < 19 ? icons.Rain : icons.NightRain,
        });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({
          icon: curTime > 6 && curTime < 19 ? icons.Snow : icons.NightSnow,
        });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({
          icon:
            curTime > 6 && curTime < 19
              ? icons.Atmosphere
              : icons.NightAtmosphere,
        });
        break;
      case rangeId === 800:
        this.setState({
          icon: curTime > 6 && curTime < 19 ? icons.Clear : icons.NightClear,
        });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({
          icon: curTime > 6 && curTime < 19 ? icons.Clouds : icons.NightClouds,
        });
        break;
      default:
        this.setState({ icon: icons.Clouds });
    }
  }

  // Function to load the Google Maps API dynamically
  loadGoogleMaps = (callback) => {
    if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB92GtjvARSZx6p0KGsNpWzxexcJt-I9vg&libraries=places`;
      script.async = true;
      script.defer = true;

      // Execute callback when the script is loaded
      script.onload = () => {
        if (callback) callback();
      };

      script.onerror = () => {
        console.error('Error loading Google Maps API');
      };

      document.head.appendChild(script);
    } else {
      // Google Maps API is already loaded, just call the callback
      if (callback) callback();
    }
  };

  handleCurrentLocation = () => {
    const storedCoords = sessionStorage.getItem('curLocation');
  
    if (storedCoords) {
      // If coordinates exist in sessionStorage, use them
      const coords = JSON.parse(storedCoords);
      
      // Call the weather API with the stored coordinates
      this.fetchWeatherData(coords);
    } else {
      // Handle case where coordinates are not available
      console.error('No coordinates found in session storage. Please enable location access or fetch the coordinates.');
      window.location.reload();
    }
  };

  fetchWeatherData = (coords) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${API_KEY}`
      )
      .then((res) => {
        const geocoder = new window.google.maps.Geocoder();
        const latLng = { lat: coords.latitude, lng: coords.longitude };
  
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const addressComponents = results[0].address_components;
  
            // Find and extract the city name from the address components
            const city = addressComponents.find((component) =>
              component.types.includes('locality')
            )?.long_name;
  
            if (city) {
              this.setState({ currCity: city });
              let weatherInfo = {
                city: city,
                country: res.data.sys.country,
                temp: Math.round(res.data.main.temp),
                minTemp: Math.round(res.data.main.temp_min),
                maxTemp: Math.round(res.data.main.temp_max),
                desc: res.data.weather[0].description,
                wind: res.data.wind.speed,
                humidity: res.data.main.humidity,
                pressure: res.data.main.pressure,
              };
              this.setState({ data: weatherInfo, currLoc: true, tempToggle: false });
              const timeZone = res.data.timezone / 60;
              // Update date and time based on the API response
              const currDate = moment().format('dddd, Do MMMM YYYY');
              // const currTime = moment()
              //   .utcOffset(res.data.timezone / 60)
              //   .format('hh:mm A');
              const currTime = moment().utcOffset(timeZone).format('h:mm A'); //Z to get the Timezone
              const sunriseTime = moment(new Date(res.data.sys.sunrise * 1000))
                .utcOffset(res.data.timezone / 60)
                .format('hh:mm A');
              const sunsetTime = moment(new Date(res.data.sys.sunset * 1000))
                .utcOffset(res.data.timezone / 60)
                .format('hh:mm A');
  
              this.setState({
                date: currDate,
                time: currTime,
                sunrise: sunriseTime,
                sunset: sunsetTime,
                loading: false,
                locationError: false,
              });
  
              const getHours = moment()
                .utcOffset(res.data.timezone / 60)
                .hours();
              this.get_Icons(this.weatherIcon, res.data.weather[0].id, getHours);
              this.setState({ hour: getHours });
            } else {
              console.error('City not found in the address components.');
            }
          } else {
            console.error('Geocoder failed due to:', status);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  componentDidMount() {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Macintosh)/)) {
      if (window.localStorage) {
        if (!localStorage.getItem('firstLoad')) {
          localStorage.setItem('firstLoad', 'true');
          // No page reload here
        } else {
          localStorage.removeItem('firstLoad');
        }
      }
    }

    // Getting Current location
    this.setState({ loading: true });
    this.loadGoogleMaps(() => {
      // Once the API is loaded, initialize the map and geocoder
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.setState({ coords: newCoords });
          if(!sessionStorage.getItem('curLocation')){
            sessionStorage.setItem('curLocation', JSON.stringify(newCoords));
          }
          this.fetchWeatherData(newCoords);
        },
        (error) => {
          console.log(error);
          // If location permission is denied or another error occurs
          this.setState({ locationError: true, loading: false });
        }
      );
    });
    
  }

  //   Temprature Unit Switch
  celToFeh = () => {
    this.setState({ tempToggle: false });
  };

  fehToCel = () => {
    this.setState({ tempToggle: true });
  };

  // Weather Info on Input
  onCityChange = (e, cityInput) => {
    console.log(e, cityInput);
    
    this.setState({ inputError: false });
    // e.preventDefault();
    // let cityInput = e.target.elements.cityName.value;
    if (cityInput === '') {
      this.setState({ inputError: true });
      e.preventDefault();
    }
    if (cityInput !== '') {
      this.setState({
        loading: true,
        tempToggle: false,
        cityError: null,
        locationError: null,
      });
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${API_KEY}`
        )
        .then((res) => {
          // console.log(res);
          this.setState({ loading: false });
          let weatherInfo = {
            city: res.data.name,
            country: res.data.sys.country,
            temp: Math.round(res.data.main.temp),
            minTemp: Math.round(res.data.main.temp_min),
            maxTemp: Math.round(res.data.main.temp_max),
            desc: res.data.weather[0].description,
            wind: res.data.wind.speed,
            humidity: res.data.main.humidity,
            pressure: res.data.main.pressure,
          };
          this.setState({ data: weatherInfo, currLoc: false });

          // const date = new Date(res.data.dt * 1000);

          const timeZone = res.data.timezone / 60;

          const currDate = moment()
            .utcOffset(timeZone)
            .format('dddd, Do MMMM YYYY');
          const currTime = moment().utcOffset(timeZone).format('h:mm A'); //Z to get the Timezone
          const sunriseTime = moment(new Date(res.data.sys.sunrise * 1000))
            .utcOffset(res.data.timezone / 60)
            .format('hh:mm A');
          const sunsetTime = moment(new Date(res.data.sys.sunset * 1000))
            .utcOffset(res.data.timezone / 60)
            .format('hh:mm A');

          this.setState({
            date: currDate,
            time: currTime,
            sunrise: sunriseTime,
            sunset: sunsetTime,
          });

          const getHours = moment().utcOffset(timeZone).hours();

          this.get_Icons(this.weatherIcon, res.data.weather[0].id, getHours);
          this.setState({ hour: getHours });
        })
        .catch((err) => {
          // console.log(err);
          this.setState({ cityError: err, loading: false });
        });
      // e.target.elements.cityName.value = '';
      // e.target.elements.cityName.blur();
    }
  };

  // Combinig all the info and showing on Condtions
  getWeather() {
    const {
      city,
      country,
      temp,
      minTemp,
      maxTemp,
      desc,
      humidity,
      pressure,
      wind,
    } = this.state.data;
    const {
      locationError,
      cityError,
      date,
      time,
      sunrise,
      sunset,
      currLoc,
    } = this.state;
    if (locationError) {
      return <LocationError />;
    }
    if (cityError) {
      return <InvalidCity />;
    }

    return (
      <Weather
        city={city}
        country={country}
        weatherIcon={this.state.icon}
        temp={temp}
        minTemp={minTemp}
        maxTemp={maxTemp}
        desc={desc}
        date={date}
        time={time}
        sunrise={sunrise}
        sunset={sunset}
        currLoc={currLoc}
        wind={wind}
        humidity={humidity}
        pressure={pressure}
        tempToggle={this.state.tempToggle}
        celToFeh={this.celToFeh}
        fehToCel={this.fehToCel}
      />
    );
  }

  render() {
    // const { temp, desc } = this.state.data;
    const { locationError, cityError, loading } = this.state;
    const dayTime = locationError || cityError ? 'error' : '';

    return (
      <React.Fragment>
        <div className={`weatherContainer ${dayTime}`}>
          {loading ? <Loader image={loader} alt="weather web app" /> : ''}
          <div className="main">
            <Form
              onFormSubmit={this.onCityChange}
              inputError={this.state.inputError}
              handleCurrentLocation={this.handleCurrentLocation}
            />
            <div className="card bg-primary mt-5 w-75">{this.getWeather()}</div>
          </div>
        </div>
        <footer>
          &copy; {new Date().getFullYear()} -{' '}
          <a
            href="https://www.azeemansari.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            Azeem Ansari
          </a>
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
