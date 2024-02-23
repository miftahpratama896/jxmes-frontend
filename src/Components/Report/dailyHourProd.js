import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";

function DailyHourProd() {
  useEffect(() => {
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: 'JXMES-WEB',
          menuName: 'REPORT',
          programName: 'DAILY HOUR PRODUCTION',
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
  const [ProdDatefrom, setProdDatefrom] = useState(new Date().toISOString().split('T')[0]);
  const [ProdDateto, setProdDateto] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFactory, setSelectedFactory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('INPUT');
  const [numColumns, setNumColumns] = useState(0);

  const [totalAllRows, setTotalAllRows] = useState(0);
  const [averagePercentage, setAveragePercentage] = useState(0);
  const [TotalAvgHour, setTotalAvgHour] = useState(0);
  const [TotalAvgPercent, setTotalAvgHourPercent] = useState(0);

  const fetchData = async () => {

    try {
      setUpdating(true);
      const response = await axios.post('http://172.16.200.28:3000/daily-prod-report', {
        PROD_DATE: ProdDatefrom, // Ganti dengan nilai yang sesuai
        TO_DATE: ProdDateto,    // Ganti dengan nilai yang sesuai
        PLANT: selectedFactory,  // Ganti dengan nilai yang sesuai
        TYPE: selectedType     // Ganti dengan nilai yang sesuai
      });
      setData(response.data);
    } catch (error) {
      setError('Terjadi kesalahan dalam mengambil data.');
    } finally {
      setUpdating(false); // Selesai proses pembaruan
    }

  };

  useEffect(() => {
    if (autoUpdate) {
        fetchData();
      
      // Set interval untuk melakukan pembaruan setiap 30 detik
      const intervalId = setInterval(() => {
        fetchData();
      }, 30000);
      
      // Membersihkan interval pada saat komponen unmount
      return () => clearInterval(intervalId);
    } else {
      // Pemanggilan pertama kali saat komponen dipasang
      fetchData();
    }
  }, [autoUpdate, selectedFactory, ProdDatefrom, ProdDateto, selectedType]);
  
   // Mendapatkan nama kolom secara dinamis dari data yang memiliki format waktu
   const getColumnNames = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(key => key.match(/^\d{2}:\d{2}$/));
  };

  // Fungsi untuk menghitung total dari kolom tertentu
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

  useEffect(() => {
    let total = 0;
    let totalPercent = 0;
    let totalAvgHourValue = 0; // Menyimpan jumlah total avgHourValue
    let totalAvgHourValuePercent = 0;
  
    data.forEach((item) => {
      const totalColumnValue = columns.reduce((total, columnName) => {
        return total + item[columnName];
      }, 0);
  
      total += totalColumnValue;
  
      // Menghitung total persentase
      const percentage = (totalColumnValue / item.TARG_DAY * 100);
      totalPercent += percentage;
  
      // Menghitung avgHourValue
      const colymng = columns.length;
      const avgHourValue = (totalColumnValue / colymng).toFixed(0);
      totalAvgHourValue += Number(avgHourValue); // Menambahkan nilai avgHourValue ke totalAvgHourValue
      
      // Menghitung avgHourValuePercent
      const avgHour = avgHourValue * (100 / item.TARG_HOUR);
      totalAvgHourValuePercent += avgHour;
    });
  
    setTotalAllRows(total);
    setAveragePercentage(totalPercent / data.length); // Menghitung rata-rata persentase
    setTotalAvgHour(totalAvgHourValue); // Menyimpan jumlah total avgHourValue ke dalam state
    setTotalAvgHourPercent(totalAvgHourValuePercent / data.length);
  }, [data, columns]);
  
    
  const totalDailyProd = data.reduce((total, item) => {
    return total + item.TARG_DAY;
  }, 0);

  const totalHourTarget = data.reduce((total, item) => {
    return total + item.TARG_HOUR;
  }, 0);

  const totalPlanHour = data.reduce((total, item) => {
    return total + item.WORK_HOUR;
  }, 0);

  const averagePlanHour = totalPlanHour / data.length;

  const totalActureHour = data.reduce((total, item) => {
    return total + item.ACTURE_HOUR;
  }, 0);

  const averageActureHour = totalActureHour / data.length;

  console.log(data)
  return (
    <>
    <style>
    {`
        /* CSS Styles */
        .sticky-header thead th {
          position: sticky;
          top: 0;
          z-index: 2;
        }
        
        .sticky-header th,
        .sticky-header td {
          white-space: nowrap;
        }
        
        .sticky-header thead tr:first-child th {
          background-color: #1F2937;
          color: #D1D5DB;
        }
        
        .sticky-header thead tr:nth-child(2) th {
          color: #D1D5DB;
          position: sticky;
          top: 48px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
          background-color: #1F2937;
          z-index: 2;
        }
        .sticky-header thead tr:nth-child(3) th {
          position: sticky;
          top: 95px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
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
                      <div className="sm:flex justify-between items-center py-3">
                        <div className="sm:flex-auto">
                          <h1 className="text-base font-semibold leading-6 text-gray-900">Product</h1>
                          <p className="mt-2 text-sm text-gray-700">
                            A list of all the Product - Time 
                          </p>
                        </div>
                        
                        <div className="sm:flex sm:items-center">
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
                              <label htmlFor="plant" className="block text-sm font-medium text-gray-700">
                                TYPE
                              </label>
                              <select
                                id="plant"
                                name="plant"
                                onChange={(e) => setSelectedType(e.target.value)}
                                value={selectedType}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                              >
                                <option value="INPUT">INPUT</option>
                                <option value="OUTPUT">OUTPUT</option>
                                {/* Add other factory options as needed */}
                              </select>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                            <label htmlFor="yesdayDate" className="block text-sm font-medium text-gray-700">
                              PROD FROM
                            </label>
                            <input
                              type="date"
                              id="yesdayDate"
                              name="yesdayDate"
                              value={ProdDatefrom}
                              onChange={(e) => setProdDatefrom(e.target.value)}
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                            />
                          </div>
                          {/* Combobox for selecting Today Date */}
                          <div className="mt-4 sm:mt-0 sm:ml-4">
                            <label htmlFor="todayDate" className="block text-sm font-medium text-gray-700">
                              PROD TO
                            </label>
                            <input
                              type="date"
                              id="todayDate"
                              name="todayDate"
                              value={ProdDateto}
                              onChange={(e) => setProdDateto(e.target.value)}
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
                      </div>
                      <div className="mt-8 flow-root">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                          <div className="table-container">
                            <table className="min-w-full divide-y divide-neutral-950 border border-slate-500 sticky-header">
                              <thead className="bg-slate-300 " >
                                <tr>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 ">
                                    JX LINE
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    JX2 LINE
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    MODEL
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    GENDER
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    TYPE
                                  </th>
                                  <th colSpan={4} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    PPIC PLAN
                                  </th>
                                  <th colSpan={numColumns} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 " 
                                  style={{
                                    backgroundColor:'#374151'}}>
                                    PROD QTY PER HOUR
                                  </th>
                                  <th rowSpan={2} colSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    TOTAL
                                  </th>
                                  <th rowSpan={2} colSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    AVG {numColumns} HOUR
                                  </th>
                                </tr>
                                <tr>
                                  <th  scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    DAILY PROD
                                  </th>
                                  <th  scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    HOUR TARGET
                                  </th>
                                  <th  scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    PLAN HOUR
                                  </th>
                                  <th  scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    ACTURE HOUR
                                  </th>
                                  {columns.map((columnName, index) => (
                                  <th key={index} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                                    {columnName}
                                  </th>
                                  ))}
                                </tr>
                                <tr>
                                  <th colSpan={5}  scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 bg-orange-700 ">
                                       TOTAL
                                  </th>
                                  <th  scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 bg-orange-700 ">
                                       {totalDailyProd.toLocaleString()}
                                  </th>
                                  <th  scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 bg-orange-700 ">
                                       {totalHourTarget.toLocaleString()}
                                  </th>
                                  <th  scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 bg-orange-700 ">
                                       {averagePlanHour.toFixed(2)}
                                  </th>
                                  <th  scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 bg-orange-700 ">
                                       {averageActureHour.toFixed(2)}
                                  </th>
                                  {columns.map((columnName, index) => (
                                  <th key={index} scope="col" className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${((calculateColumnTotal(columnName) / totalHourTarget) * 100) === 0 || isNaN((calculateColumnTotal(columnName) / totalHourTarget) * 100) ? 'bg-gray-50' : ((calculateColumnTotal(columnName) / totalHourTarget) * 100) >= 100 ? 'bg-green-400' : ((calculateColumnTotal(columnName) / totalHourTarget) * 100) >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>
                                    {calculateColumnTotal(columnName).toLocaleString()}
                                  </th>
                                ))}
                                  <th scope="col" className={`px-3 py-3.5 text-center text-sm font-semibold text-gray-900 ${averagePercentage >= 100 ? 'bg-green-400' : averagePercentage >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>
                                    {totalAllRows.toLocaleString() }
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 bg-orange-700 ">
                                    {averagePercentage.toFixed(2)}%
                                  </th>
                                  <th scope="col" className={`px-3 py-3.5 text-center text-sm font-semibold text-gray-900 ${TotalAvgPercent >= 100 ? 'bg-green-400' : TotalAvgPercent >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>
                                    {TotalAvgHour.toLocaleString()}
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 bg-orange-700">
                                    {TotalAvgPercent.toFixed(2)}%
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
                               {data && data.length > 0 && (
                                  data
                                    // Mengurutkan data berdasarkan nilai SCAN_CELL
                                    .slice() // Salin array untuk menghindari perubahan langsung pada data asli
                                    .sort((a, b) => a.SCAN_CELL - b.SCAN_CELL)
                                    // Pemetaan dan rendering data yang sudah diurutkan
                                    .map((item, index) => {
                                      // Menghitung total nilai dari semua kolom
                                      const totalColumnValue = columns.reduce((total, columnName) => {
                                        return total + item[columnName];
                                      }, 0);

                                      // Menghitung persentase 
                                      const percentage = ((totalColumnValue / item.TARG_DAY) * 100).toFixed(2);

                                      // Menghitung avgHourValue
                                      const colymng = columns.length;
                                      const avgHourValue = (totalColumnValue / colymng).toFixed(0)
                                      // Menghitung avgHourValue
                                      const avgHour = (avgHourValue * (100 / item.TARG_HOUR)).toFixed(2)
                                  return (
                                    <tr key={index}>
                                      <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                                        {item.JX_LINE}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.SCAN_CELL}</td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.MODEL}</td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.GENDER}</td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.TYPE}</td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.TARG_DAY}</td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.TARG_HOUR}</td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.WORK_HOUR}</td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.ACTURE_HOUR}</td>
                                      {columns.map((columnName) => (
                                        <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${((item[columnName] / item.TARG_HOUR) * 100) === 0 || isNaN((item[columnName] / item.TARG_HOUR) * 100) ? 'bg-gray-50' : ((item[columnName] / item.TARG_HOUR) * 100) >= 100 ? 'bg-green-400' : ((item[columnName] / item.TARG_HOUR) * 100) >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>
                                          {item[columnName]}
                                        </td>
                                      ))}

                                      <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${percentage >= 100 ? 'bg-green-400' : percentage >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>
                                        {totalColumnValue.toLocaleString()}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{percentage}%</td>
                                      <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${avgHour >= 100 ? 'bg-green-400' : avgHour >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>
                                        {avgHourValue}</td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{avgHour}%</td>
                                    </tr>
                                    );
                                  })
                              )}
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

export default DailyHourProd;
