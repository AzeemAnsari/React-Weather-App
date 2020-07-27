import React from 'react';

class Form extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.onFormSubmit}>
        <input
          type="search"
          className="form-control"
          name="cityName"
          placeholder="Enter City Name"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        {this.props.inputError ? (
          <div className="inputError">City name cannot be empty!</div>
        ) : (
          ''
        )}
      </form>
    );
  }
}

export default Form;
