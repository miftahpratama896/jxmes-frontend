import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";

const ProductPersonel = () => {
    useEffect(() => {
        const sendDataToBackend = async () => {
          try {
            const data = {
              division: 'JXMES-WEB',
              menuName: 'PRODUCT',
              programName: 'PRODUCT - PERSONNEL',
              userID: 'mesuser',
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

  const [data, setData] = useState(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFilter, setSelectedFilter] = useState('1');

  const fetchData = async () => {
    try {
      setUpdating(true);
      const parsedFilter = parseInt(selectedFilter);
      const response = await axios.post('http://172.16.200.28:3000/product-personel', {
        i_DATE: date,
        D_DEPTNAME_MAIN: 'TOTAL',
        D_DEPTNAME_MID: 'TOTAL',
        C_GUBUN: parsedFilter
      });
      setData(response.data.data);
    } catch (error) {
      setError('Error fetching data');
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
  }, [autoUpdate, date, selectedFilter]);
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
         top: 49px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
         z-index: 3;
         background-color: #B84600; 
       }
       .sticky-header thead tr:nth-child(3) th {
        position: sticky;
        top: 95px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
        z-index: 3;
        background-color: #B84600; 
      }
        .table-container {
          max-height: 70vh;
          max-width: 195vh;
          overflow-y: auto;
          overflow-x: auto;
        }
      `}
    </style>

    <main className="py-12">
      

      <div className="mx-auto max-w-full px-6 lg:px-1">
        <div className="px-4 sm:px-6 lg:px-8">
          <div>
            {/* Your component JSX code goes here */}
          </div>
          <div className="sm:flex sm:items-center py-3">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">Product</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the Product - Personnel
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label htmlFor="todayDate" className="block text-sm font-medium text-gray-700">
                    WORK DATE 
                  </label>
                  <input
                    type="date"
                    id="todayDate"
                    name="todayDate"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
                              <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                                FILTER
                              </label>
                              <select
                                id="filter"
                                name="filter"
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                value={selectedFilter}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                              >
                                <option value="1">SUMMARY</option>
                                <option value="2">DETAIL</option>
                                {/* Add other factory options as needed */}
                              </select>
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
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                            DEPARTMENT
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TOTAL
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TOTAL ABSEN
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            RATE
                          </th>
                        </tr>
                        {data && data.length > 0 && data[0].HDPT_NAME === 'TOTAL' && (
                            <tr>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {data[0].HDPT_NAME}
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {data[0].TOTAL}
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {data[0].TOTAL_ABSEN}
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {data[0].RATE}%
                                </th>
                            </tr>
                        )}

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
                        {data && data.map(item => (
                            // Menambahkan kondisi untuk memfilter item dengan HDPT_NAME tidak sama dengan 'TOTAL'
                            item.HDPT_NAME !== 'TOTAL' && (
                                <tr key={item.HDPT_NAME}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {item.HDPT_NAME}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.TOTAL}</td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.TOTAL_ABSEN}</td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.RATE}%</td>
                                </tr>
                            )
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
};

export default ProductPersonel;
