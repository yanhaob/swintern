import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FinancialData {
  date: string;
  revenue: number;
  netIncome: number;
  grossProfit: number;
  eps: number;
  operatingIncome: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<FinancialData[]>([]);
  const [filteredData, setFilteredData] = useState<FinancialData[]>([]);
  const [dateRange, setDateRange] = useState({ start: 2015, end: 2025 });
  const [revenueRange, setRevenueRange] = useState({ min: 0, max: Infinity });
  const [netIncomeRange, setNetIncomeRange] = useState({ min: 0, max: Infinity });
  const [sortKey, setSortKey] = useState<keyof FinancialData>('date');
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = import.meta.env.REACT_APP_FMP_API_KEY;
      const url = `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${apiKey}`;
      const res = await axios.get(url);
      const apiData = res.data.map((item: any) => ({
        date: item.date,
        revenue: item.revenue,
        netIncome: item.netIncome,
        grossProfit: item.grossProfit,
        eps: item.eps,
        operatingIncome: item.operatingIncome
      }));
      setData(apiData);
      setFilteredData(apiData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let temp = data.filter(item => {
      const year = parseInt(item.date.substring(0, 4));
      return (
        year >= dateRange.start &&
        year <= dateRange.end &&
        item.revenue >= revenueRange.min &&
        item.revenue <= revenueRange.max &&
        item.netIncome >= netIncomeRange.min &&
        item.netIncome <= netIncomeRange.max
      );
    });
    temp.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      }
    });
    setFilteredData(temp);
  }, [data, dateRange, revenueRange, netIncomeRange, sortKey, sortOrder]);

  return (
    <div className="p-4 max-w-4xl mx-auto text-sm">
      <h1 className="text-xl font-bold mb-4">Financial Data Filtering App</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label>Date Range:</label>
          <div className="flex space-x-2">
            <input
              type="number"
              className="border px-2"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: +e.target.value })}
            />
            <input
              type="number"
              className="border px-2"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: +e.target.value })}
            />
          </div>
        </div>
        <div>
          <label>Revenue Range:</label>
          <div className="flex space-x-2">
            <input
              type="number"
              className="border px-2"
              placeholder="Min"
              onChange={(e) => setRevenueRange({ ...revenueRange, min: +e.target.value })}
            />
            <input
              type="number"
              className="border px-2"
              placeholder="Max"
              onChange={(e) => setRevenueRange({ ...revenueRange, max: +e.target.value || Infinity })}
            />
          </div>
        </div>
        <div>
          <label>Net Income Range:</label>
          <div className="flex space-x-2">
            <input
              type="number"
              className="border px-2"
              placeholder="Min"
              onChange={(e) => setNetIncomeRange({ ...netIncomeRange, min: +e.target.value })}
            />
            <input
              type="number"
              className="border px-2"
              placeholder="Max"
              onChange={(e) => setNetIncomeRange({ ...netIncomeRange, max: +e.target.value || Infinity })}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mb-2 space-x-4">
        <span>Sort by:</span>
        <select
          className="border px-2"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as keyof FinancialData)}
        >
          <option value="date">Date</option>
          <option value="revenue">Revenue</option>
          <option value="netIncome">NetIncome</option>
        </select>
        <select
          className="border px-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Revenue</th>
            <th className="border p-2">Net Income</th>
            <th className="border p-2">Gross Profit</th>
            <th className="border p-2">EPS</th>
            <th className="border p-2">Operating Income</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, idx) => (
            <tr key={idx} className="text-center hover:bg-gray-100">
              <td className="border p-2">{item.date}</td>
              <td className="border p-2">{item.revenue.toLocaleString()}</td>
              <td className="border p-2">{item.netIncome.toLocaleString()}</td>
              <td className="border p-2">{item.grossProfit.toLocaleString()}</td>
              <td className="border p-2">{item.eps}</td>
              <td className="border p-2">{item.operatingIncome.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;