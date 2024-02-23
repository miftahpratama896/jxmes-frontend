import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import Logo from "../../assets/img/New Logo White.png";
import axios from 'axios';

const FetchData = () => {
  useEffect(() => {
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: 'JXMES-WEB',
          menuName: 'MONITORING',
          programName: 'DAILY MONITORING',
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

  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [key, setKey] = useState(0);
  // Mendapatkan tanggal pertama dari bulan ini
  const firstDayOfPreviousMonth = new Date();
  firstDayOfPreviousMonth.setDate(1); // Set tanggal menjadi 1
  firstDayOfPreviousMonth.setMonth(firstDayOfPreviousMonth.getMonth()); // Set bulan menjadi bulan sebelumnya
  const firstDayOfPreviousMonthISO = firstDayOfPreviousMonth.toISOString().split('T')[0];

  // Mendapatkan tanggal hari ini
  const todayISO = new Date().toISOString().split('T')[0];

  const [dateFrom, setDateFrom] = useState(firstDayOfPreviousMonthISO);
  const [dateTo, setDateTo] = useState(todayISO);

  const [wc, setWC] = useState('SEWING');
  const [plant, setPlant] = useState('ALL');
  const [columns, setColumns] = useState([]);
  const [filterType, setFilterType] = useState('Line');
 
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const getDateRangeArray = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect ke halaman login jika tidak ada token
      history.push('/');
    }
  }, [history]);
  useEffect(() => {
    const startMonth = new Date(dateFrom).getMonth();
    const endMonth = new Date(dateTo).getMonth();
    const monthDiff = endMonth - startMonth + 1;

    const dateArray = getDateRangeArray(new Date(dateFrom), new Date(dateTo));

    const newColumns = dateArray.map(date => {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}-${day}`;
    });

        setColumns(newColumns);
    }, [dateFrom, dateTo]);

  const getRdoCekValue = (filterType) => {
    switch (filterType) {
      case 'Line':
        return 0;
      case 'Line-Model':
        return 2;
      case 'Model':
        return 1;
      default:
        return 0;
    }
  };
  const fetchData = async () => {
    try {
      const apiUrl = 'http://172.16.200.28:3000/getDailyProductionStatus';
      const requestBody = {
        DATEFROM: dateFrom,
        DATETO: dateTo,
        WC: wc,
        PLANT: plant,
        RDO_CEK: getRdoCekValue(filterType),
      };

      setUpdating(true);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('Data fetched successfully:', result);
      setData(result);
      setKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setUpdating(false);
    }
  };

  const totalColumn = columns.reduce((acc, column) => {
  return acc + data.reduce((rowAcc, item) => {
    return rowAcc + (item[column] !== null && !isNaN(item[column]) ? parseFloat(item[column]) : 0);
  }, 0);
  }, 0);

  useEffect(() => {
    if (autoUpdate) {
      fetchData();
      const intervalId = setInterval(() => {
        fetchData();
      }, 30000);
      return () => clearInterval(intervalId);
    } else {
      fetchData();
    }
  }, [autoUpdate, dateFrom, dateTo, wc, plant, filterType]);

  return (
    <>
      <style>
      {`
      /* CSS Styles */
      .sticky-header thead th {
      }
      
      .sticky-header th,
      .sticky-header td {
        white-space: nowrap;
      }
      
      .sticky-header thead tr:first-child th {
        position: sticky;
        top: 0;
        background-color: #1F2937;
        z-index: 2;
        color: #D1D5DB;
      }

      .sticky-header thead tr:first-child th.sticky-main-first-column {
        left: 0;
        position: sticky;
        top: 0;
        z-index: 3;
        color: #D1D5DB;
      }

      .sticky-header thead tr:first-child th.sticky-main-second-column {
        position: sticky;
        top: 0;
        z-index: 3;
        color: #D1D5DB;
      }

      .sticky-header thead tr:first-child th.sticky-main-third-column {
        position: sticky;
        top: 0;
        z-index: 3;
        color: #D1D5DB;
      }

      .sticky-header thead tr:first-child th.sticky-main-fourth-column {
        position: sticky;
        top: 0;
        z-index: 3;
        color: #D1D5DB;
      }
      
      .sticky-header thead tr:nth-child(2) th {
        position: sticky;
        top: 48px; 
        background-color: #B84600;
        z-index: 2;
      }
      
      .sticky-header thead tr:nth-child(2) th.sticky-first-column {
        left: 0;
        position: sticky;
        top: 48px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
        background-color: #B84600;
        z-index: 3;
      }
      .sticky-header thead tr:nth-child(2) th.sticky-second-column {
        position: sticky;
        top: 48px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
        background-color: #B84600;
        z-index: 3;
      }
      
      .table-container {
        max-height: 70vh;
        max-width: 195vh;
        overflow-y: auto;
        overflow-x: auto;
      }
      
      /* Menjadikan sel pertama dalam tbody tetap diam ketika discroll */
      .sticky-first-row {
        position: sticky;
        left: 0;
        z-index:1;
      }
      .sticky-second-row {
        position: sticky;
        z-index:1;
      }
      .sticky-third-row {
        position: sticky;
        z-index:1;
      }
      .sticky-fourth-row {
        position: sticky;

        z-index:1;
      }
  `}
      </style>
      <main className="py-12">
        <div className="mx-auto max-w-full px-6 lg:px-1">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">Monitoring</h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the daily process
                </p>
              </div>
              <div className="sm:flex sm:items-center">
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label htmlFor="yesdayDate" className="block text-sm font-medium text-gray-700">
                    FROM DATE
                  </label>
                  <input
                    type="date"
                    id="yesdayDate"
                    name="yesdayDate"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  />
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label htmlFor="todayDate" className="block text-sm font-medium text-gray-700">
                    TO DATE 
                  </label>
                  <input
                    type="date"
                    id="todayDate"
                    name="todayDate"
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
                    onChange={(e) => setPlant(e.target.value)}
                    value={plant}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  >
                    <option value="ALL">All</option>
                    <option value="F1">Factory 1</option>
                    <option value="F2">Factory 2</option>
                  </select>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label htmlFor="wc" className="block text-sm font-medium text-gray-700">
                    WORK CENTER
                  </label>
                  <select
                    id="wc"
                    name="wc"
                    onChange={(e) => setWC(e.target.value)}
                    value={wc}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  >
                    <option value="CUTTING">Cutting</option>
                    <option value="SEWING">Sewing</option>
                    <option value="W/H">W/H</option>
                  </select>
                </div>
                {wc !== 'CUTTING' && (
                <div className="mt-4 sm:mt-0 sm:ml-4">
                    <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                    FILTER
                    </label>
                    <select
                    id="filter"
                    name="filter"
                    onChange={(e) => setFilterType(e.target.value)}
                    value={filterType}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                    >
                    <option value="Line">Line</option>
                    <option value="Line-Model">Line-Model</option>
                    <option value="Model">Model</option>
                    </select>
                </div>
                )}
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
                      <table key={key} className="min-w-full divide-y divide-neutral-950 sticky-header border border-slate-500">
                        <thead className="bg-slate-300">
                          <tr>
                            <th scope="col" className="sticky-main-first-column px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                              PLANT
                            </th>
                            <th scope="col" className="sticky-main-second-column left-20 px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                {wc === 'SEWING' || wc === 'W/H' ? (filterType === 'Line' || filterType === 'Line-Model') ? 'JX LINE' : 'MODEL' : 'MODEL'}
                                </th>
                            <th scope="col" className="sticky-main-third-column left-32 px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                {wc === 'SEWING' || wc === 'W/H' ? (filterType === 'Line' || filterType === 'Line-Model') ? 'JX2 LINE' : 'GENDER' : 'GENDER'}
                            </th>
                            <th scope="col" className="sticky-main-fourth-column left-48 px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                              TOTAL
                            </th>
                            {columns.map((column, index) => (
                              <th key={index} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                {column}
                              </th>
                            ))}
                          </tr>
                          <tr>
                            <th className="sticky-first-column py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                GRAND TOTAL
                            </th>
                            <th className="sticky-second-column left-20 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                
                            </th>
                            <th className="sticky-second-column left-32 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                
                            </th>
                            <th className="sticky-second-column left-48 px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                {totalColumn.toLocaleString()}
                            </th>
                            {columns.map((column, colIndex) => (
                                <th key={colIndex} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                {data.reduce((acc, item) => {
                                    return acc + (item[column] !== null && !isNaN(item[column]) ? parseFloat(item[column]) : 0);
                                }, 0).toLocaleString()}
                                </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-950 bg-white">
                          {updating && (
                            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                               <img
                                      className="max-h-28 w-auto animate-bounce animate-infinite"
                                      src={Logo}
                                      alt="Your Company"
                                    />
                            </div>
                          )}
                          {data.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                {item.WC}
                              </td>
                              <td className="sticky-second-row left-20 bg-gray-50  py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                {wc === 'SEWING' || wc === 'W/H' ? (filterType === 'Line' || filterType === 'Line-Model') ? item.JX_LINE : item.SCAN_CELL : item.SCAN_CELL}
                            </td>
                            <td className="sticky-third-row bg-gray-50 left-32 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                {wc === 'SEWING' || wc === 'W/H' ? (filterType === 'Line' || filterType === 'Line-Model') ? item.SCAN_CELL : item.GENDER : item.GENDER}
                            </td>
                              <td className="sticky-fourth-row left-48 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6" style={{ backgroundColor: '#FA7625' }}>
                                {item.TOTAL.toLocaleString()}
                              </td>
                              {columns.map((column, colIndex) => (
                                <td key={colIndex} className=" py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item[column] !== null && !isNaN(item[column]) ? parseFloat(item[column]).toLocaleString() : 0}
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
};

export default FetchData;
