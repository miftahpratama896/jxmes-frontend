import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ScanStatus() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post('http://172.16.200.28:3000/setting-sewingQTY', {
          D_DATE: '2024-02-17',
          D_ASSY_LINE: '01',
          D_ASSY_TARGET: 0,
          D_SEWING_LINE: '45-1',
          D_SETTING_MARKET: 1,
          D_DI_CUTTING: 1,
          D_DONE_DI_UPS: 1,
          D_AVAIABLE_SETTING: 1,
          D_ACTION: '',
          D_REMARKS: '',
          D_SAVE: 0
        });

        setData(response.data);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Dependensi kosong, jadi hanya dipanggil sekali saat komponen dipasang
  console.log(data)
  return (
    <div>
      <h1>Scan Status</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Render data jika data tidak kosong */}
      {data && data.length > 0 && (
        <div>
          {data[0].map(item => (
            <div key={item.ASSY_LINE}>
              <p>{item.LINE}</p>
              <p>{item.D_MODEL}</p>
              {/* Tampilkan data lainnya sesuai kebutuhan */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScanStatus;
