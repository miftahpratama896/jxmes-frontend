import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";

function ProductSPKBalance() {
    useEffect(() => {
        const sendDataToBackend = async () => {
          try {
            const data = {
              division: 'JXMES-WEB',
              menuName: 'PRODUCT',
              programName: 'PRODUCT - SPK BALANCE',
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
  const [numColumns, setNumColumns] = useState(0);

  const fetchData = async () => {
    setUpdating(true);
    try {
      const response = await axios.post('http://172.16.200.28:3000/product-spk-balance', {
        SPK_DATE_FROM: '2024-03-01',
        SPK_DATE_TO: '2024-03-01',
        WC: 'Cutting',
        STYLE: '',
        STYLE_NAME: '',
        GENDER: 'ALL',
        TYPE: 0,
        JXLINE: ''
      });
      setData(response.data);
    } catch (err) {
      setError(err.message);
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
  }, [autoUpdate]);

  const getColumnNames = () => {
    if (data.length === 0) return [];
    const columnNames = Object.keys(data[0][0]);
    const numericColumns = columnNames.filter(key => key.match(/^\d+$/));
    const numericTColumns = columnNames.filter(key => key.match(/^\d+T$/));
    const combinedColumns = [];
    
    for (let i = 0; i < Math.max(numericColumns.length, numericTColumns.length); i++) {
        if (numericColumns[i]) combinedColumns.push(numericColumns[i]);
        if (numericTColumns[i]) combinedColumns.push(numericTColumns[i]);
    }
    
    return combinedColumns;
};



  useEffect(() => {
    if (data.length > 0 && data[0]) {
        const columns = getColumnNames();
        setNumColumns(columns.length);
    }
    }, [data]);

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
            overflow-x: auto;;
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
                A list of all the Product SPK Balance 
              </p>
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
                            WORK CENTER
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            JX LINE 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            STYLE 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            MODEL 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            GENDER 
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
                        
                      {data.length > 0 && data[0].map(item => (
                          <tr key={item.index}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                              {item.WC}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.STYLE}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.MODEL}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.GENDER}</td>
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

export default ProductSPKBalance;
