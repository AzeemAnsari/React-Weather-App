import React from 'react';

const Loader = (props) => {
  return (
    <div className="loader">
      <span>
        <img src={props.image} alt={props.alt} />{' '}
        <span className="loadingText">Loading...</span>
      </span>
    </div>
  );
};

export default Loader;
