import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";

const ProductNosewMesin = () => {
    useEffect(() => {
        const sendDataToBackend = async () => {
          try {
            const data = {
              division: 'JXMES-WEB',
              menuName: 'PRODUCT',
              programName: 'PRODUCT - NOSEW MESIN',
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

  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFactory, setSelectedFactory] = useState('ALL');
  const [selectedShift, setSelectedShift] = useState('ALL');

  
    const fetchData = async () => {
      try {
        setUpdating(true);
        const response = await axios.get('http://172.16.200.28:3000/product-nosew-mesin', {
          params: {
            TODAY: date,
            D_SHIFT: selectedShift,
            D_PLANT: selectedFactory
          }
        });
        setData(response.data);
      } catch (error) {
        setError(error.message);
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
      }, [autoUpdate, date, selectedFactory, selectedShift]);

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
          color: #D1D5DB;
        }
        .sticky-header th,
        .sticky-header td {
          white-space: nowrap;
        }
        .sticky-header thead tr:first-child th {
         
        }
        .sticky-header thead tr:nth-child(2) th {
         position: sticky;
         top: 48px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
         background-color: #374151;
         z-index: 3;
       }
        .table-container {
          max-height: 100vh;
          overflow-y: auto;
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
                A list of all the Product - Nosew Mesin
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label htmlFor="todayDate" className="block text-sm font-medium text-gray-700">
                    DATE 
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
                              <label htmlFor="plant" className="block text-sm font-medium text-gray-700">
                                PLANT
                              </label>
                              <select
                                id="plant"
                                name="plant"
                                onChange={(e) => setSelectedFactory(e.target.value)}
                                value={selectedFactory}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                              >
                                <option value="ALL">ALL</option>
                                <option value="F1">FACTORY 1</option>
                                {/* Add other factory options as needed */}
                              </select>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4">
                              <label htmlFor="shift" className="block text-sm font-medium text-gray-700">
                                SHIFT
                              </label>
                              <select
                                id="shift"
                                name="shift"
                                onChange={(e) => setSelectedShift(e.target.value)}
                                value={selectedShift}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                              >
                                <option value="ALL">ALL</option>
                                <option value="1">SHIFT 1</option>
                                <option value="2">SHIFT 2</option>
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
                          <th scope="col" rowSpan={2} className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                            PLANT 
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            LINE 
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            DAILY TARGET 
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            HOUR TARGET 
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            NOW TARGET 
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TOTAL
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            RATE 
                          </th>
                          <th scope="col" colSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            LEFT MESIN 
                          </th>
                          <th scope="col" colSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            RIGT MESIN 
                          </th>
                        </tr>
                        <tr>
                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" >
                                QTY 
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                RATE  
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                QTY 
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                RATE  
                            </th>
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
                          <tr key={item.index}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                              {item.FACTORY}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.LINE}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.D_TARGET?.toLocaleString()}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.H_TRAGET?.toLocaleString()}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.NOW_TARGET?.toLocaleString()}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.TOTAL?.toLocaleString()}</td>
                            <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${item.RATIO >= 100 ? 'bg-green-400' : item.RATIO >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>{item.RATIO}%</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.L_OUTPUT_QTY}</td>
                            <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${item.L_RATIO >= 100 ? 'bg-green-400' : item.L_RATIO >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>{item.L_RATIO}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.R_OUTPUT_QTY}</td>
                            <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${item.R_RATIO >= 100 ? 'bg-green-400' : item.R_RATIO >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>{item.R_RATIO}%</td>
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
};

export default ProductNosewMesin;
