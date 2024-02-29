import React, { useState } from 'react';
import axios from 'axios';

function ProductDailyProdTrend() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://172.16.200.28:3000/product-daily-prod-trend', {
        dateFrom: '2024-02-29',
        dateTo: '2024-02-29',
        wc: 'SEWING',
        plant: 'ALL'
      });
      setData(response.data);
    } catch (err) {
      setError('Internal server error');
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };
  console.log(data)
  return (
    <div>
      <h1>Product Daily Production Trend</h1>
      <button onClick={fetchData}>Fetch Data</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data.length > 0 && (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              Product: {item.product}, Production Count: {item.productionCount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductDailyProdTrend;
