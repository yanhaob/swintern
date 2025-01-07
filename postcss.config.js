import React, { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState({ from: 2020, to: 2024 });
  const [revenueRange, setRevenueRange] = useState({ min: 0, max: 999999999999 });
  const [netIncomeRange, setNetIncomeRange] = useState({ min: 0, max: 999999999999 });
  const [sortField, setSortField] = useState('date');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetch('https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=kz6VkaomhUNzkaHqEOhjerWh2reOWSJg')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error);
  }, []);

  const filteredData = data.filter(item => {
    const year = parseInt(item.date.split('-')[0], 10);
    return (
      year >= dateRange.from &&
      year <= dateRange.to &&
      item.revenue >= revenueRange.min &&
      item.revenue <= revenueRange.max &&
      item.netIncome >= netIncomeRange.min &&
      item.netIncome <= netIncomeRange.max
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === 'date') {
      return sortAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    return sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
  });

  return (
    <div className="p-4">
      {/* Simple filtering controls */}
      <div className="mb-4">
        <label className="mr-2">Date From:</label>
        <input
          type="number"
          value={dateRange.from}
          onChange={e => setDateRange({ ...dateRange, from: +e.target.value })}
          className="border p-1 mr-4"
        />
        <label className="mr-2">Date To:</label>
        <input
          type="number"
          value={dateRange.to}
          onChange={e => setDateRange({ ...dateRange, to: +e.target.value })}
          className="border p-1 mr-4"
        />
        {/* Similar inputs for revenueRange and netIncomeRange... */}
      </div>

      {/* Sorting controls */}
      <div className="mb-4">
        <button
          className="mr-2 p-2 border"
          onClick={() => {
            setSortField('date');
            setSortAsc(!sortAsc);
          }}
        >
          Sort by Date
        </button>
        {/* Similar buttons for revenue, netIncome, etc. */}
      </div>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Revenue</th>
            <th className="p-2 text-left">Net Income</th>
            <th className="p-2 text-left">Gross Profit</th>
            <th className="p-2 text-left">EPS</th>
            <th className="p-2 text-left">Operating Income</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(item => (
            <tr key={item.date} className="border-b">
              <td className="p-2">{item.date}</td>
              <td className="p-2">{item.revenue}</td>
              <td className="p-2">{item.netIncome}</td>
              <td className="p-2">{item.grossProfit}</td>
              <td className="p-2">{item.eps}</td>
              <td className="p-2">{item.operatingIncome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// It appears this file contains a React component instead of PostCSS configuration. Please verify the file content and its intended purpose.
