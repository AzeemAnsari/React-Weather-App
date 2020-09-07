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

  componentDidMount() {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
      (function () {
      if (window.localStorage) {
        if (!localStorage.getItem('firstLoad')) {
          localStorage['firstLoad'] = true;
          window.location.reload();
          console.log('loaded');
        } else localStorage.removeItem('firstLoad');
      }
    })();  
    }
    

    // Getting Current location
    this.setState({ loading: true });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({ coords: newCoords });
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${this.state.coords.latitude}&lon=${this.state.coords.longitude}&units=metric&appid=${API_KEY}`
          )
          .then((res) => {
            // console.log(res);
            this.setState({ loading: false, locationError: false });
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
            this.setState({ data: weatherInfo, currLoc: true });
            // this.get_Icons(this.weatherIcon, res.data.weather[0].id, new Date().getHours());

            const currDate = moment().format('dddd, Do MMMM YYYY');
            const currTime = moment()
              .utcOffset(res.data.timezone / 60)
              .format('hh:mm A');
            const sunriseTime = moment(new Date(res.data.sys.sunrise * 1000))
              .utcOffset(res.data.timezone / 60)
              .format('hh:mm A');
            const sunsetTime = moment(new Date(res.data.sys.sunset * 1000))
              .utcOffset(res.data.timezone / 60)
              .format('hh:mm A');
            // console.log(sunriseTime, sunsetTime);

            this.setState({
              date: currDate,
              time: currTime,
              sunrise: sunriseTime,
              sunset: sunsetTime,
            });

            const getHours = moment()
              .utcOffset(res.data.timezone / 60)
              .hours();
            this.get_Icons(this.weatherIcon, res.data.weather[0].id, getHours);
            this.setState({ hour: getHours });
          });
      },
      (error) => {
        this.setState({ locationError: true, loading: false });
      }
    );
  }

  //   Temprature Unit Switch
  celToFeh = () => {
    this.setState({ tempToggle: false });
  };

  fehToCel = () => {
    this.setState({ tempToggle: true });
  };

  // Weather Info on Input
  onCityChange = (e) => {
    this.setState({ inputError: false });
    e.preventDefault();
    let cityInput = e.target.elements.cityName.value;
    if (cityInput === '') {
      this.setState({ inputError: true });
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
      e.target.elements.cityName.value = '';
      e.target.elements.cityName.blur();
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
            />
            <div className="card bg-primary mt-5 w-75">{this.getWeather()}</div>
          </div>
        </div>
        <footer>
          &copy; 2020 -{' '}
          <a
            href="https://www.azeemansari.me"
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
