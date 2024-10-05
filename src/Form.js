import React from 'react';
import {Autocomplete, usePlacesWidget} from "react-google-autocomplete";
import currLocation from './images/curr_location.svg';

const Form = (props) => {
  const { ref, autocompleteRef } = usePlacesWidget({
    apiKey:"AIzaSyB92GtjvARSZx6p0KGsNpWzxexcJt-I9vg",
    onPlaceSelected: (place) => {
      // console.log(place);
      // console.log(autocompleteRef);
      if(!place.name){
        props.onFormSubmit(place?.address_components[0]?.long_name);
      }
      if (ref.current) {
        ref.current.value = "";
      }
    },
    options: {
      types: ['(cities)'], // You can limit the autocomplete to cities
    },
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

    return (
      <>
        <form onSubmit={props.onFormSubmit}>
          {/* <Autocomplete
            apiKey={process.env.REACT_APP_GMAP_KEY}
            
            className="form-control"
            onPlaceSelected={(place) => {
              console.log(place);
              console.log(place.formatted_address);
              props.onFormSubmit(place?.address_components[0]?.long_name);
            }}
          /> */}
          <input
            ref={ref}
            type="search"
            className="form-control"
            name="cityName"
            placeholder="Enter City Name"
            onKeyDown={handleKeyDown}
          />
          <button type='button' className='btn btn-primary' style={{padding:'0 1.5rem'}} onClick={props.handleCurrentLocation}>
            <img src={currLocation} alt="Current Location" style={{width:'27px'}} />
          </button>
          {/* <button type="submit" className="btn btn-primary">
            Search
          </button> */}
          {props.inputError ? (
            <div className="inputError">City name cannot be empty!</div>
          ) : (
            ''
          )}
        </form>
      </>
    );
  }

export default Form;
