//CurrencyTable.js
import React from 'react';
import { currencyNames } from './CurrencyNames';

const CurrencyTable = ({ base, rates}) => {

  if (!rates) {
    return null;
  }

  return (
    <div className="container">
      <div className="row">
      <table className="table table-sm bg-dark mt-4 ms-3">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col" className="text-right pr-4 py-2">1.00 {base}</th>
        </tr>
      </thead>
      <tbody>
      {Object.entries(rates).map(([currency, rate]) => (
            <tr key={currency}>
              <td className="p-2">{currencyNames[currency]}<small className="ms-2"><b>({currency})</b></small></td>
              
              <td>{rate}</td>
            </tr>
          ))}
      </tbody>
    </table>
      </div>
    </div>
    
  )
}

export default CurrencyTable;