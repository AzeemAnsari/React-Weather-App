import React from 'react';

const LocationError = () => {
  return (
    <div className="locError card bg-primary shadow-soft border-light">
      Please allow location access to get the current weather in your city
      <br />
      <span className="text-warning">- OR -</span>
      <br />
      <span className="text-primary">
        Enter city name to get the current weather of the city
      </span>
    </div>
  );
};

export default LocationError;
