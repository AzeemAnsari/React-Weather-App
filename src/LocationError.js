import React from 'react';

const LocationError = () => {
  return (
    <div className="locError card bg-primary shadow-soft border-light">
      Please Turn On Location Services to Get the Current Weather in Your City
      <br />
      <span className="text-warning">- OR -</span>
      <br />
      <span className="text-primary">
        Enter City Name to Get the Current Weather of the City
      </span>
    </div>
  );
};

export default LocationError;
