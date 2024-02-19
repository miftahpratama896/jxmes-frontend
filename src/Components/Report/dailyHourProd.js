import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DailyHourProd() {
  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {

    try {
      setUpdating(true);
      const response = await axios.post('http://172.16.200.28:3000/daily-prod-report', {
        PROD_DATE: '2024-02-17', // Ganti dengan nilai yang sesuai
        TO_DATE: '2024-02-17',    // Ganti dengan nilai yang sesuai
        PLANT: 'ALL',  // Ganti dengan nilai yang sesuai
        TYPE: 'INPUT'     // Ganti dengan nilai yang sesuai
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
  }, [autoUpdate]);

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
          z-index: 2;
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
          background-color: #1F2937;
          z-index: 2;
        }
        .sticky-header thead tr:nth-child(3) th {
          position: sticky;
          top: 96px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
          background-color: #1F2937;
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
                      <div className="sm:flex justify-between items-center py-3">
                        <div className="sm:flex-auto">
                          <h1 className="text-base font-semibold leading-6 text-gray-900">Product</h1>
                          <p className="mt-2 text-sm text-gray-700">
                            A list of all the Product - Time 
                          </p>
                        </div>
                        <div className="sm:flex sm:items-center">
                        
                        </div>
                      </div>
                      <div className="mt-8 flow-root">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                          <div className="table-container">
                            <table className="min-w-full divide-y divide-neutral-950 sticky-header">
                              <thead className="bg-slate-300 " >
                                <tr>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    JX Line
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    JX2 Line
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Model
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Gender
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Type
                                  </th>
                                  <th colSpan={4} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    PPIC PLAN
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
                                </tr>
                              </thead>
                              {updating && (
                              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                                  <span className="text-white">Loading data...</span>
                              </div>
                              )}
                               <tbody className="divide-y divide-neutral-950 bg-white">
                                    {data.map((item, index) => (
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

export default DailyHourProd;
