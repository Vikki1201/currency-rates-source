//Home.js
import React, { Component, useEffect, useState } from 'react';
import CurrencyTable from './CurrencyTable';
import { currencyNames } from './CurrencyNames';
import {checkStatus, json} from './utils';
import CurrencyConverter from './CurrencyConverter';


class Home extends Component {
  constructor (props) {
    super (props);
    this.state = {
      base: 'USD',
      rates: null,
      date: '',
      error: null,
    }
  }

  componentDidMount() {
    this.fetchRates();
  }

  fetchRates = () => {
    const { base } = this.state;
    fetch(`https://api.frankfurter.app/latest?from=${base}`)
    .then(checkStatus)
    .then(json)
    .then((data) => {
      this.setState ({
        rates: data.rates,
        date: data.date,
      });
    })
    .catch((error) => {
      this.setState({ error: error.message });
      console.log(error);
    })
  }

  handleBaseChange = (event) => {
    this.setState ({ base: event.target.value}, this.fetchRates);
  };

  render () {
    const { base, rates, date, error} = this.state;

    return (
      <React.Fragment>
        <h6 className="ms-3 mt-3 mb-3">Date: {date}</h6>
        <CurrencyConverter />
        <div className="container">
          <div className="row">
            <form className="p-3 bg-light form-inline justify-content-center">
              <h6 className="p-3">Base currency: <b className="mr-2">{base}</b></h6>
              <select value={base} onChange={this.handleBaseChange} className="form-control form-control-lg mb-2">
              {Object.keys(currencyNames).map((currency) => (
                <option key={currency} value={currency}>
                  {currencyNames[currency]}({currency})
                </option>
                ))}
              </select>
            </form>
            
          </div>
        </div>
        
        {error && <p className="error">{error}</p>}
        {rates ? (
          <CurrencyTable base={base} rates={rates} />
        ) : (
          <p>Loading...</p>
        )}
        
      </React.Fragment>
    );
  }
}

export default Home;