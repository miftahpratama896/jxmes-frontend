import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ScanStatus() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://172.16.206.4:3000/scan-jx2-jx', {
        FROM_DATE: '2024-02-16',
        TO_DATE: '2024-02-16',
        LINE_JX2: 'ALL',
        CELL_JX: 'ALL',
        PLANT: 'ALL',
        D_STYLE: '',
        D_MODEL: '',
        D_GENDER: 'ALL',
        D_RLS: '',
        D_BARCODE: '',
        D_CHEK: 1,
        CEK_IP: '172.16.208.33'
      });

      setData(response.data); // Simpan data respons ke dalam state
    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Panggil fetchData saat komponen dipasang
  }, []); // Dependensi kosong, jadi hanya dipanggil sekali saat komponen dipasang
  console.log(data)
  return (
    <div>
      <h1>Scan Status</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Render data jika data tidak kosong */}
      {data.length > 0 && (
        <div>
          {data.map(item => (
            <div key={item.BARCODE}>
              <p>Barcode: {item.BARCODE}</p>
              <p>Model: {item.MODEL}</p>
              <p>Gender: {item.GENDER}</p>
              {/* Tampilkan data lainnya sesuai kebutuhan */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScanStatus;
