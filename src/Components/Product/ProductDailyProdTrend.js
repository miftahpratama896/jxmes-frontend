import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";

function ProductDailyProdTrend() {
  useEffect(() => {
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: 'JXMES-WEB',
          menuName: 'PRODUCT',
          programName: 'PRODUCT - DAILY PROD TREND',
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
  const [error, setError] = useState(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [numColumns, setNumColumns] = useState(0);
  const [selectedFactory, setSelectedFactory] = useState('ALL');
  const [selectedWC, setSelectedWC] = useState('Sewing');

    // Format tanggal ke format YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    // Mendapatkan tanggal sekarang
    const currentDate = new Date();
  
    // Menetapkan dateFrom ke 1 pada bulan ini
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const [dateFrom, setDateFrom] = useState(formatDate(firstDayOfMonth));
  
    // Menetapkan dateTo ke tanggal sekarang
    const [dateTo, setDateTo] = useState(formatDate(currentDate));

  const fetchData = async () => {
    setUpdating(true);
    try {
      const response = await axios.post('http://172.16.200.28:3000/product-daily-prod-trend', {
        dateFrom: dateFrom,
        dateTo: dateTo,
        wc: selectedWC,
        plant: selectedFactory
      });
      setData(response.data);
    } catch (err) {
      setError('Internal server error');
      console.error('Error fetching data:', err);
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
  }, [autoUpdate, dateFrom, dateTo, selectedFactory, selectedWC]);

  const getColumnNames = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(key => key.match(/^\d{4}-\d{2}-\d{2}_\d+$/));
  };

  const calculateColumnTotal = (columnName) => {
    // Menggunakan reduce untuk menjumlahkan nilai-nilai dalam kolom columnName
    const total = data.reduce((accumulator, currentItem) => {
      return accumulator + currentItem[columnName];
    }, 0);
    
    // Kembalikan total
    return total;
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
         top: 49px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
         background-color: #B84600;
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
          <div>
            {/* Your component JSX code goes here */}
          </div>
          <div className="sm:flex sm:items-center py-3">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">PO Balance</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the PO Balance
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
                                <option value="ALL">All</option>
                                <option value="F1">Factory 1</option>
                                <option value="F2">Factory 2</option>
                                {/* Add other factory options as needed */}
                              </select>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">WORK CENTER</label>
                <select
                  value={selectedWC}
                  onChange={(e) => setSelectedWC(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                >
                  <option value="Sewing">Sewing</option>
                  <option value="W/H">W/H</option>
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
                            JX LINE 
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            JX2 LINE 
                          </th>
                          {columns.map((columnName, index) => {
                                  // Memeriksa apakah columnName berakhir dengan "_1"
                                  if (columnName.endsWith('_1')) {
                                      const displayName = columnName.replace(/_1$/, '');
                                      const bgColor = index % 2 === 1 ? '' : '#374151';
                                      return (
                                          <th 
                                              colSpan={3}
                                              key={index} 
                                              scope="col" 
                                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" 
                                              style={{ backgroundColor:bgColor}}
                                          >
                                              {displayName}
                                          </th>
                                      );
                                  }
                                  // Jika tidak, maka tidak merender elemen <th>
                                  return null;
                              })}
                            <th scope="col"  colSpan={4} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                              TOTAL
                            </th>
                            <th scope="col"  colSpan={4} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{ backgroundColor: '#374151' }}>
                              AVERAGE
                            </th>
                        </tr>
                        <tr>
                        {columns.map((columnName, index) => {
                            let displayText = columnName;
                            let bgColor = index % 6 < 3 ? '#374151' : '#1F2937'; // Memeriksa apakah indeks adalah ganjil atau genap per set grup tiga kolom
                            if (columnName.endsWith('_1')) {
                                displayText = 'PLAN';
                            } else if (columnName.endsWith('_2')) {
                                displayText = 'PROD';
                            } else if (columnName.endsWith('_3')) {
                                displayText = 'DIFF';
                            }

                            return (
                                <th key={index} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{ backgroundColor: bgColor }}>
                                    {displayText}
                                </th>
                            );
                        })}
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TOTAL PLAN 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TOTAL PROD 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TOTAL DIFF 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TOTAL RATE 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            AVG PLAN 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" >
                            AVG PROD 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" >
                            AVG DIFF 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" >
                            AVG RATE 
                          </th>
                        </tr>
                        <tr>
                        <th scope="col" colSpan={3} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" >
                            TOTAL
                        </th>
                        {columns.map((columnName, index) => (
                                  <th key={index} scope="col" className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}>
                                    {calculateColumnTotal(columnName).toLocaleString()}
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
                        
                      {data.map((item, index) => {
                          let totalPlan = 0; // variabel untuk menyimpan total penjumlahan
                          let totalProd = 0;
                          let totalDiff = 0;
                          let totalRate = 0;
                          let avgPlan = 0;
                          let avgProd = 0;
                          let avgDiff = 0;
                          let avgRate = 0;
                          const countColumnName_1 = columns.filter(columnName => columnName.endsWith('_1')).length;
                          const countColumnName_2 = columns.filter(columnName => columnName.endsWith('_2')).length;
                          const countColumnName_3 = columns.filter(columnName => columnName.endsWith('_3')).length;
                          return (
                              <tr key={index}>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                                      {item.PLANT}
                                  </td>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.JX_LINE}</td>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.LINE}</td>
                                  {columns.map((columnName, colIndex) => {
                                      if (columnName.endsWith('_1')) { // Hanya menjumlahkan nilai dari kolom yang memiliki akhiran "_1"
                                        const value = parseFloat(item[columnName]) || 0; // mengambil nilai dan mengonversi ke float, jika tidak valid maka 0
                                        totalPlan += value; // menambahkan nilai ke total
                                      }
                                      if (columnName.endsWith('_2')) { // Hanya menjumlahkan nilai dari kolom yang memiliki akhiran "_1"
                                        const valueProd = parseFloat(item[columnName]) || 0; // mengambil nilai dan mengonversi ke float, jika tidak valid maka 0
                                        totalProd += valueProd; // menambahkan nilai ke total
                                      }
                                      if (columnName.endsWith('_3')) { // Hanya menjumlahkan nilai dari kolom yang memiliki akhiran "_1"
                                        const valueDiff = parseFloat(item[columnName]) || 0; // mengambil nilai dan mengonversi ke float, jika tidak valid maka 0
                                        totalDiff += valueDiff; // menambahkan nilai ke total
                                      }
                                      totalRate = ((totalProd / totalPlan) * 100).toFixed(2)
                                      avgPlan = (totalPlan / countColumnName_1).toFixed(0)
                                      avgProd = (totalProd / countColumnName_2).toFixed(0)
                                      avgDiff = (totalDiff / countColumnName_3).toFixed(0)
                                      avgRate = ((avgProd / avgPlan) * 100).toFixed(2)
                                      return (
                                          <td key={colIndex} className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}>
                                              {item[columnName]?.toLocaleString()}
                                          </td>
                                      );
                                  })}
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6 " >
                                      {totalPlan?.toLocaleString()} {/* menampilkan total */}
                                  </td>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6 " >
                                      {totalProd?.toLocaleString()} {/* menampilkan total */}
                                  </td>
                                  <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6 ${totalDiff < 0 ? 'text-red-700' : 'text-green-700'}`}>
                                      {totalDiff?.toLocaleString()} {/* menampilkan total */}
                                  </td>
                                  <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${totalRate >= 100 ? 'bg-green-400' : totalRate >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>
                                      {totalRate}% {/* menampilkan total */}
                                  </td>
                                  <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium`}>
                                      {avgPlan?.toLocaleString()} {/* menampilkan total */}
                                  </td>
                                  <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium`}>
                                      {avgProd?.toLocaleString()} {/* menampilkan total */}
                                  </td>
                                  <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${avgDiff < 0 ? 'text-red-700' : 'text-green-700'}`}>
                                      {avgDiff?.toLocaleString()} {/* menampilkan total */}
                                  </td>
                                  <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${avgRate >= 100 ? 'bg-green-400' : avgRate >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>
                                      {avgRate}% {/* menampilkan total */}
                                  </td>
                              </tr>
                          );
                      })}

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

export default ProductDailyProdTrend;
