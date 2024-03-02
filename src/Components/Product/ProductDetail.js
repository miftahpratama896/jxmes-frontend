import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDetail = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.16.200.28:3000/product-detail', {
          params: {
            DATEFROM: '2024-03-02',
            DATETO: '2024-03-02',
            WC: 'CUTTING',
            TYPE: 'INPUT',
            SCAN_LINE: 'ALL',
            RLS: '',
            STYLE_NAME: '',
            STYLE: '',
            GENDER: 'ALL',
            C_CEK: 1,
            PLANT: 'ALL'
          }
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log(data)

  return (
    <div>
      <h1>Data from Backend</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>SCAN_DATE</th>
              <th>PLANT</th>
              <th>SCAN_CELL</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {data[0].map((item, index) => (
              <tr key={index}>
                <td>{item.JX_CELL}</td>
                <td>{item.POPD_OPCD}</td>
                <td>{item.RELEASE}</td>
                <td>{item.STYLE_NAME}</td>
                {/* Add more table cells as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductDetail;
