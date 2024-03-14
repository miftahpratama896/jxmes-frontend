

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import Logo from "../../assets/img/New Logo White.png";

function NotFound() {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fungsi untuk mengambil data dari backend
  const fetchData = async () => {
    try {
      setUpdating(true);
      const response = await axios.post('http://172.16.200.28:3000/po-balance', {
        FROM_RLS: '010124',
        TO_RLS: '110224',
        PO: '',
        STYLE: '',
        MODEL: ''
      });
      setData(response.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
      
    } finally {
      setUpdating(false);
    }
  };

  // Mengambil data saat komponen dimount dan mengatur interval untuk auto update
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

    // Membersihkan interval pada unmount atau saat dependencies berubah
    return () => clearInterval(intervalId);
  }, [autoUpdate]);

  console.log(data);

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
          max-height: 100vh;
          overflow-y: auto;
        }
      `}
      </style>

      <main className="py-12">
        <div className="mx-auto max-w-full px-6 lg:px-1">
          <div className="px-4 sm:px-6 lg:px-8">
            <div>{/* Your component JSX code goes here */}</div>
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  PO Balance
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the PO Balance
                </p>
              </div>
              

              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label
                  htmlFor="autoUpdateCheckbox"
                  className="block text-sm font-medium text-gray-700"
                >
                  {`Last updated:`}
                </label>
                <label
                  htmlFor="autoUpdateCheckbox"
                  className="block text-sm font-medium text-gray-700"
                >
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
                            <th
                              scope="col"
                              rowSpan={2}
                              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              JX LINE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              RELEASE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              PO
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              STYLE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              MODEL
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              OGAC
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              OGAC UPDATE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              ASSY DATE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              SPK
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              BALANCE
                            </th>
                          </tr>
                          <tr>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              CUTTING
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              SEWING
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              W/H
                            </th>
                          </tr>
                          <tr>
                            <th
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500"
                              colSpan={8}
                            >
                              TOTAL
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
                          {data && data.map((item, index) => (
                            <tr key={index}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                                {item.JXLINE}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.RLS}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.PO}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.STYLE}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.MODEL}
                              </td>
                              
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

export default NotFound;

