import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";

function ProductSewingMesinCounter() {
    useEffect(() => {
      const user_id = localStorage.getItem('user_id');
        const sendDataToBackend = async () => {
          try {
            const data = {
              division: 'JXMES-WEB',
              menuName: 'PRODUCT',
              programName: 'PRODUCT - SEWING MESIN COUNTER',
              userID: user_id,
            };
    
            // Kirim data ke backend
            const response = await axios.post('http://172.16.200.28:3000/api/log-menu-access', data);
            console.log('Response:', response.data);
          } catch (error) {
            console.error('Error:', error);
          }
        };
    
        // Panggil fungsi untuk mengirim data ke backend
        sendDataToBackend();
      }, []);
    
      const history = useHistory();
    
      useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect ke halaman login jika tidak ada token
          history.push('/');
        }
      }, [history]);

  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const currentDate = new Date();
  const [dateFrom, setDateFrom] = useState(formatDate(currentDate));
    
  // Menetapkan dateTo ke tanggal sekarang
  const [dateTo, setDateTo] = useState(formatDate(currentDate));
  const [numColumns, setNumColumns] = useState(0);

  const fetchData = async () => {
    try {
      setUpdating(true);
      const response = await axios.post('http://172.16.200.28:3000/product-sewing-mesin-counter', {
        dateFrom: dateFrom, // Ganti dengan tanggal yang sesuai dari inputan pengguna
        dateTo: dateTo,   // Ganti dengan tanggal yang sesuai dari inputan pengguna
      });
      setData(response.data);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data.');
    } finally {
        setUpdating(false);
      }
  };

  useEffect(() => {
    let intervalId;
  
    const fetchDataAndInterval = async () => {
      fetchData();
      
  
      intervalId = setInterval(() => {
        fetchData();
      }, 30000);
    };
  
    if (autoUpdate) {
      fetchDataAndInterval();
    } else {
      fetchData();
    }
  
    // Cleanup the interval on unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [dateFrom, dateTo]);

  // Mendapatkan nama kolom secara dinamis dari data yang memiliki format waktu
  const getColumnNames = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(key => key.match(/^\d{2}:\d{2}$/));
  };

  useEffect(() => {
    const columns = getColumnNames();
    setNumColumns(columns.length);
  }, [data]); // Jika data berubah, perbaharui jumlah kolom
  const columns = getColumnNames();

  console.log(data)
  return (
     <>
    <style>
      {`
        /* CSS Styles */
        .sticky-header thead th {
          position: sticky;
          top: 0;
          background-color: #1F2937;
          z-index: 1;
          
        }
        .sticky-header th,
        .sticky-header td {
          white-space: nowrap;
        }
        .sticky-header thead tr:first-child th {
         color: #D1D5DB;
        }
        .sticky-header thead tr:nth-child(2) th {
         position: sticky;
         top: 48px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
         background-color: #FA7625;
         z-index: 3;
       }
        .table-container {
            max-height: 70vh;
            max-width: 197vh;
            overflow-y: auto;
            overflow-x: auto;
        }
      `}
    </style>

    <main className="py-12">
      

      <div className="mx-auto max-w-full px-6 lg:px-1">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center py-3">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">Product</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the Product sewing Mesin Counter
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
                              <label htmlFor="productOption" className="block text-sm font-medium text-gray-700">
                                  DATE FROM
                              </label>  
                              <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                              />
                          </div>
                          <div className="mt-4 sm:mt-0 sm:ml-4">
                              <label htmlFor="productOption" className="block text-sm font-medium text-gray-700">
                                  DATE TO
                              </label> 
                              <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                              />  
                        </div>
                     <div className="mt-4 sm:mt-0 sm:ml-4">
                          <label htmlFor="autoUpdateCheckbox" className="block text-sm font-medium text-gray-700">
                            {`Last updated:`}
                          </label>
                          <label htmlFor="autoUpdateCheckbox" className="block text-sm font-medium text-gray-700">
                            {` ${new Date().toLocaleString()}`}
                          </label>
                          <input
                            type="checkbox"
                            id="autoUpdateCheckbox"
                            checked={autoUpdate}
                            onChange={() => setAutoUpdate(!autoUpdate)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                          />
              </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <div className="table-container">
                    <table className="min-w-full divide-y divide-neutral-950 sticky-header border border-slate-500 ">
                      <thead className="bg-slate-300">
                        <tr>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            LINE 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            MESIN ID  
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            WORK CENTER 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            PROCESS NAME 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            PROCESS CODE 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TYPE 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TOTAL 
                          </th>
                          {columns.map((columnName, index) => (
                                  <th key={index} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                                    {columnName}
                                  </th>
                                  ))}
                        </tr>
                        
                      </thead>
                      {updating && (
                          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <img
                                      className="max-h-28 w-auto animate-bounce animate-infinite"
                                      src={Logo}
                                      alt="Your Company"
                                    />
                          </div>
                        )}
                      <tbody className="divide-y divide-neutral-950 bg-white">
                        
                        {data.map(item => (
                          <tr key={item.index} style={{ backgroundColor: item.ID === 'SUB.TOTAL' ? '#B84600' : 'inherit' }}>
                            <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                              {item.LINE}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.ID}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.MESIN_GUBUN}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.PROCESS_NAME}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.PROCESS_CODE}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.MESIN_TYPE}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.MESIN_SORT}</td>
                            {columns.map((columnName) => (
                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}>
                                    {item[columnName]}
                                </td>
                            ))}

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </>
  );
}

export default ProductSewingMesinCounter;
