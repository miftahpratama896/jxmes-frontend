import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DailyHourProd() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://172.16.206.4:3000/daily-prod-report', {
        PROD_DATE: '2024-02-17', // Ganti dengan nilai yang sesuai
        TO_DATE: '2024-02-17',    // Ganti dengan nilai yang sesuai
        PLANT: 'ALL',  // Ganti dengan nilai yang sesuai
        TYPE: 'INPUT'     // Ganti dengan nilai yang sesuai
      });
      setData(response.data);
    } catch (error) {
      setError('Terjadi kesalahan dalam mengambil data.');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []); // Kosongkan dependency array agar efek hanya dijalankan sekali saat komponen dimuat
  console.log(data)
  return (
    <div>
      <h1>Fetch Data from Server</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {item.JX_LINE}: {item.MODEL} {/* Ganti dengan nama kolom yang sesuai */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DailyHourProd;
