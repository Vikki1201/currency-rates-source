// CurrencyConverter.js
import React, { Component } from 'react';
import { Chart } from 'chart.js';
import { checkStatus, json } from './utils';
import { currencyNames } from './CurrencyNames';



class CurrencyConverter extends Component {
    constructor(props) {
      super(props);

      this.state = {
        base: 'USD',
        target: 'EUR',
        amount: 1,
        convertedAmount: null,
        rates: null,
        error: null,
      };

      this.chartRef = React.createRef();
    }

    componentDidMount() {
      const { base, target } = this.state;
      this.fetchRates();
      this.getHistoricalRates(base, target);
    }

    fetchRates = () => {
      const { base } = this.state;
      fetch(`https://api.frankfurter.app/latest?from=${base}`)
        .then(checkStatus)
        .then(json)
        .then((data) => {
          this.setState({ rates: data.rates, error: null });
        })
        .catch((error) => {
          this.setState({ error: error.message });
          console.log(error);
        });
    };

    getHistoricalRates = (base, quote) => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date((new Date()).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${quote}`)
          .then(checkStatus)
          .then(json)
          .then(data => {
              if (data.error) {
                  throw new Error(data.error);
              }
              const chartLabels = Object.keys(data.rates);
              const chartData = Object.values(data.rates).map(rate => rate[quote]);
              const chartLabel = `${base}/${quote}`;
              this.setState({ historicalRates: { labels: chartLabels, data: chartData, label: chartLabel } });
              this.buildChart(chartLabels, chartData, chartLabel);
          })
          .catch(error => console.error(error.message));
    }

  buildChart = (labels, data, label) => {
    const chartRef = this.chartRef.current.getContext("2d");
    if (this.chart) {
        this.chart.destroy();
    }
    this.chart = new Chart(this.chartRef.current, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: label,
                    data,
                    fill: false,
                    tension: 0.1,
                }
            ]
        },
        options: {
            responsive: true,
        }
    });
  }

  handleBaseChange = (event) => {
    const newBase = event.target.value;
    this.setState({ base: newBase }, () => {
        this.fetchRates();
        this.getHistoricalRates(newBase, this.state.target);
    });
  };

  handleTargetChange = (event) => {
    this.setState({ target: event.target.value }, () => {
        this.getHistoricalRates(this.state.base, this.state.target);
    });
  };

  handleAmountChange = (event) => {
    this.setState({ amount: event.target.value });
  };

  handleConversion = () => {
    const { amount, target, rates } = this.state;
      if (rates) {
        const rate = rates[target];
        this.setState({ convertedAmount: (amount * rate).toFixed(2) });
      }
  };

  handleSwap = () => {
    this.setState(
      (prevState) => ({
        base: prevState.target,
        target: prevState.base,
        convertedAmount: null,
      }),
      () => {
        this.fetchRates();
        this.getHistoricalRates(this.state.base, this.state.target);
      }
    );
  };

  render() {
    const { base, target, amount, convertedAmount, error } = this.state;

    return (
        <div className="container">
            <div className="row">
                <form className="p-3 bg-2 form-inline col-12">
                    <div className="row respons">
                        <div className="col">
                            <h6 className="p-3">Amount: <b className="mr-2">{amount}</b></h6>
                            <input
                                type="number"
                                value={amount}
                                onChange={this.handleAmountChange}
                                className="form-control form-control-lg mb-2"
                            />
                        </div>

                        <div className="col">
                            <h6 className="p-3">Base currency: <b className="mr-2">{base}</b></h6>
                            <select value={base} onChange={this.handleBaseChange} className="form-control form-control-lg mb-2">
                                {Object.keys(currencyNames).map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currencyNames[currency]} ({currency})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-1 align-content-end center-button">
                            <button type="button" onClick={this.handleSwap} className="btn btn-dark form-control mb-3 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                                </svg>
                            </button>
                        </div>

                        <div className="col">
                            <h6 className="p-3">Target currency: <b className="mr-2">{target}</b></h6>
                            <select value={target} onChange={this.handleTargetChange} className="form-control form-control-lg mb-2">
                                {Object.keys(currencyNames).map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currencyNames[currency]} ({currency})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col text-center">
                        <button type="button" onClick={this.handleConversion} className="btn btn-dark mt-3 convert-button">Convert</button>
                    </div>
                </form>
                {convertedAmount !== null && (
                    <div className="p-3">
                        <h6 className="converted-amount">Converted Amount: {convertedAmount} {target}</h6>
                    </div>
                )}
                {error &&
                    <p className="error">{error}</p>
                }
            </div>
            <canvas ref={this.chartRef} className="mt-3 mb-3" />
        </div>
    );
  }
}
    
export default CurrencyConverter;