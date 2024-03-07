import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InventorySummary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fungsi untuk mengambil data dari server
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.16.200.28:3000/inventory-summary', {
          params: {
            stockDate: '2024-03-07', // Ganti dengan tanggal yang sesuai
            workCenter: 'CUTTING', // Ganti dengan kode work center yang sesuai
            checkValue: 0 // Ganti dengan nilai cek yang sesuai
          }
        });
        setData(response.data); // Menyimpan data yang diterima dari server
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Memanggil fungsi fetchData saat komponen dipasang
    fetchData();

  }, []); // Perhatikan bahwa array dependencies kosong, artinya useEffect hanya akan dipanggil sekali setelah komponen dipasang
  console.log(data)
  return (
    <div>
      <h1>Inventory Summary</h1>
      <table>
        <thead>
          <tr>
            <th>Stock Date</th>
            <th>Work Center</th>
            <th>JX2 Line</th>
            <th>JX Line</th>
            <th>Release</th>
            {/* Tambahkan kolom lain sesuai kebutuhan */}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.NUM}>
              <td>{item.STOCK_DATE}</td>
              <td>{item.WC}</td>
              <td>{item.JX2_LINE}</td>
              <td>{item.JX_LINE}</td>
              <td>{item.RELEASE}</td>
              {/* Tambahkan kolom lain sesuai kebutuhan */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventorySummary;
