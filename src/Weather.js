import React from 'react';

class Weather extends React.Component {
  render() {
    const {
      city,
      country,
      temp,
      minTemp,
      maxTemp,
      desc,
      date,
      time,
      sunrise,
      sunset,
      currLoc,
      wind,
      humidity,
      pressure,
    } = this.props;

    return (
      <div>
        {country ? (
          <div className="location">
            {city}, {country}
          </div>
        ) : (
          <div className="location">{city}</div>
        )}
        {currLoc ? (
          <div className="dateTime">
            <div className="date">{date}</div>
            <div className="center time">
              <span className="badge badge-lg badge-success">{time}</span>
            </div>
          </div>
        ) : !currLoc && country ? (
          <div className="dateTime">
            <div className="date">{date}</div>
            <div className="flex center">
              <span className="time badge badge-lg badge-success">{time}</span>
            </div>
          </div>
        ) : (
          ''
        )}
        <div className="weather-details">
          <div className="left">
            {this.props.tempToggle ? (
              <div className="temp">
                {Math.round((temp * 9) / 5 + 32)}&deg;F
              </div>
            ) : (
              <div className="temp">{temp}&deg;C</div>
            )}
            {this.props.tempToggle ? (
              <div className="minmax">
                <i className="wi wi-direction-down"></i>&nbsp;
                {Math.round((minTemp * 9) / 5 + 32)}
                &deg;F &nbsp;
                <i className="wi wi-direction-up"></i>&nbsp;
                {Math.round((maxTemp * 9) / 5 + 32)}
                &deg;F
              </div>
            ) : (
              <div className="minmax">
                <i className="wi wi-direction-down"></i> {minTemp}&deg;C &nbsp;
                <i className="wi wi-direction-up"></i> {maxTemp}&deg;C
              </div>
            )}

            <div className="tempSwitch">
              <button
                className={`btn btn-primary cel ${
                  !this.props.tempToggle && 'selected'
                }`}
                type="button"
                onClick={this.props.celToFeh}
                title="Celcius"
              >
                &deg;C
              </button>
              <button
                className={`btn btn-primary fahr ${
                  this.props.tempToggle && 'selected'
                }`}
                type="button"
                onClick={this.props.fehToCel}
                title="Celcius"
              >
                &deg;F
              </button>
            </div>
          </div>
          <div className="center">
            <div className="icon">
              <i className={`wi ${this.props.weatherIcon}`}></i>
            </div>
            <div className="desc">{desc}</div>
          </div>
        </div>
        <div className="right">
          <div className="wh">
            <div className="card bg-primary shadow-soft border-light">
              <span className="icon">
                <i className="wi wi-sunrise"></i>
              </span>
              <span className="text">Sunrise</span>
              <span className="data">{sunrise}</span>
            </div>
            <div className="card bg-primary shadow-soft border-light">
              <span className="icon">
                <i className="wi wi-sunset"></i>
              </span>
              <span className="text">Sunset</span>
              <span className="data">{sunset}</span>
            </div>
            <div className="card bg-primary shadow-soft border-light">
              <span className="icon">
                <i className="wi wi-humidity"></i>
              </span>
              <span className="text">Humidity</span>
              <span className="data">{humidity}%</span>
            </div>
            <div className="card bg-primary shadow-soft border-light">
              <span className="icon">
                <i className="wi wi-strong-wind"></i>
              </span>
              <span className="text">Wind</span>
              <span className="data">{wind} km/h</span>
            </div>
            <div className="card bg-primary shadow-soft border-light">
              <span className="icon">
                <i className="wi wi-barometer"></i>
              </span>
              <span className="text">Atmospheric Pressure</span>
              <span className="data">{pressure} hPa</span>
            </div>
            <div className="card bg-primary shadow-soft border-light desktop-hide">
              <span className="icon">ℹ</span>
              <span className="text">Created by</span>
              <span className="data">Azeem Ansari</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Weather;
