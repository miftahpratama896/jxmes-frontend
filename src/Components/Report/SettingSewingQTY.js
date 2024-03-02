import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";
import * as XLSX from 'xlsx';

function ScanStatus() {
  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: 'JXMES-WEB',
          menuName: 'REPORT',
          programName: 'SETTING SEWING QTY',
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
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchData = async () => {
      

      try {
        setUpdating(true);
        const response = await axios.post('http://172.16.200.28:3000/setting-sewingQTY', {
          D_DATE: date,
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
    }, [autoUpdate, date]);
    const exportToExcel = () => {
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const ws = XLSX.utils.json_to_sheet(data[0]); // Assuming data[0] contains table data
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: fileType });
      const fileName = 'scan_status' + fileExtension;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    };
  
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
          color: #D1D5DB;
         position: sticky;
         top: 48px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
         z-index: 3;
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
              <h1 className="text-base font-semibold leading-6 text-gray-900">Report</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the Setting Sewing QTY
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
                            ASSY LINE
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            ASSY TARGET
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            UPPER STOCK (JX+JX2)
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            SEW LINE 
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            MODEL
                          </th>
                          <th scope="col" rowSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TARGET PRODUCTION
                          </th>
                          <th scope="col" colSpan={4} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                            WIP 
                          </th>
                          <th scope="col" colSpan={3} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            ESTIMATED SETTING QTY 
                          </th>
                          <th scope="col" colSpan={2} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                            TARGET SETTING 
                          </th>
                        </tr>
                        <tr>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}> 
                            SETTING (MARKET)
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                            DI CUTTING 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                            DONE DI UPS 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                            SELISIH
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            AVAILABLE SETTING 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            DAY 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            ACTION 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                            DAY 
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                            REMARKS 
                          </th>
                        </tr>
                        <tr>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            TOTAL
                          </th>
                          {data && data.length > 0 && (
                            data[2].map(item => (
                              <>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  {item.ASSY_TARGET?.toLocaleString()} 
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  {item.STOCK?.toLocaleString()} 
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  
                                </th>
                              </>
                            ))
                          )}

                          {data && data.length > 0 && (
                            data[3].map(item => (
                              <>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  {item.TARGET?.toLocaleString()} 
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  {item.SETTING_MARKET?.toLocaleString()} 
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  {item.DI_CUTTING} 
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  {item.DONE_DI_UPS?.toLocaleString()} 
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  {item.SELISIH?.toLocaleString()} 
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  {item.AVAIABLE_SETTING?.toLocaleString()} 
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  {item.SETTTING_DAY.toFixed(2)}
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                   
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  {item.TARGET_DAY.toFixed(2)}
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                   
                                </th>
                              </>
                            ))
                          )}
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
                          data[0].map(item => (
                            <tr key={item.ASSY_LINE}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {item.ASSY_LINE}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.ASSY_TARGET}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.STOCK}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.LINE}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.D_MODEL}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.TARGET}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.SETTING_MARKET}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.DI_CUTTING}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.DONE_DI_UPS}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.SELISIH}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.AVAIABLE_SETTING}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.DAY.toFixed(2)}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.ACTION}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.TARGET_QTY.toFixed(2)}</td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.REMARKS}</td>
                            </tr>
                          ))
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

export default ScanStatus;
