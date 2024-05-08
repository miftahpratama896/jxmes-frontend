import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import Logo from "../../assets/img/New Logo White.png";

function InventorySummary() {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "WIP",
          programName: "INVENTORY - SUMMARY",
          userID: user_id,
        };

        // Kirim data ke backend
        const response = await axios.post(
          "http://172.16.200.28:3000/api/log-menu-access",
          data
        );
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Panggil fungsi untuk mengirim data ke backend
    sendDataToBackend();
  }, []);

  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect ke halaman login jika tidak ada token
      history.push("/");
    }
  }, [history]);

  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [numColumns, setNumColumns] = useState(0);
  const [totalAllRows, setTotalAllRows] = useState(0);
  const [selectedWC, setSelectedWC] = useState("Cutting");
  const [selectedFilter, setSelectedFilter] = useState("0");

  // Format tanggal ke format YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // Mendapatkan tanggal sekarang
  const currentDate = new Date();

  const [dateFrom, setDateFrom] = useState(formatDate(currentDate));

  const fetchData = async () => {
    try {
      setUpdating(true);
      const parsedFilter = parseInt(selectedFilter);
      const response = await axios.get(
        "http://172.16.200.28:3000/inventory-summary",
        {
          params: {
            stockDate: dateFrom, // Ganti dengan tanggal yang sesuai
            workCenter: selectedWC, // Ganti dengan kode work center yang sesuai
            checkValue: parsedFilter, // Ganti dengan nilai cek yang sesuai
          },
        }
      );
      setData(response.data); // Menyimpan data yang diterima dari server
    } catch (error) {
      console.error("Error fetching data:", error);
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
  }, [autoUpdate, selectedWC, dateFrom, selectedFilter]);

  const getColumnNames = () => {
    if (data.length === 0) return [];
    const columnNames = Object.keys(data[0]);
    const numericColumns = columnNames.filter((key) => key.match(/^\d+$/));
    const numericTColumns = columnNames.filter((key) => key.match(/^\d+T$/));
    const combinedColumns = [];

    for (
      let i = 0;
      i < Math.max(numericColumns.length, numericTColumns.length);
      i++
    ) {
      if (numericColumns[i]) combinedColumns.push(numericColumns[i]);
      if (numericTColumns[i]) combinedColumns.push(numericTColumns[i]);
    }

    return combinedColumns;
  };

  useEffect(() => {
    const columns = getColumnNames();
    setNumColumns(columns.length);
  }, [data]); // Jika data berubah, perbaharui jumlah kolom
  const columns = getColumnNames();

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
    let total = 0;

    data?.forEach((item) => {
      const totalColumnValue = columns.reduce((total, columnName) => {
        return total + item[columnName];
      }, 0);

      total += totalColumnValue;
    });

    setTotalAllRows(total);
  }, [data, columns]);

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
                  Inventory
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the Inventory Summary
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  STOCK DATE
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="W-full z-10 mt-1 rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  WORK CENTER
                </label>
                <select
                  value={selectedWC}
                  onChange={(e) => {
                    setSelectedWC(e.target.value);
                  }}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                >
                  <option value="Cutting">Cutting</option>
                  <option value="Sewing">Sewing</option>
                  <option value="W/H">W/H</option>
                </select>
              </div>
              {selectedWC !== "Cutting" && (
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label
                    htmlFor="filter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    FILTER
                  </label>
                  <select
                    id="filter"
                    name="filter"
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    value={selectedFilter}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  >
                    <option value="0">ALL</option>
                    <option value="1">LINE</option>
                    {/* Add other factory options as needed */}
                  </select>
                </div>
              )}
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
                              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              STOCK DATE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              WORK CENTER
                            </th>
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                JX2 LINE
                              </th>
                            )}
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              JX LINE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              RELEASE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              STYLE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              MODEL
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              GENDER
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              TOTAL
                            </th>
                            {columns.map((columnName, index) => (
                              <th
                                key={index}
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                {columnName}
                              </th>
                            ))}
                          </tr>
                          <tr>
                            <th
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500"
                              colSpan={7}
                            >
                              TOTAL
                            </th>
                            <th
                              scope="col"
                              className={`px-3 py-3.5 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                            >
                              {totalAllRows.toLocaleString()}
                            </th>
                            {columns.map((columnName, index) => (
                              <th
                                key={index}
                                scope="col"
                                className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
                              >
                                {calculateColumnTotal(
                                  columnName
                                ).toLocaleString()}
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
                          {data?.map((item, index) => {
                            const totalColumnValue = columns.reduce(
                              (total, columnName) => {
                                return total + item[columnName];
                              },
                              0
                            );

                            const rowClass =
                              item.WC === "SUB_TOTAL" ? "bg-gray-400" : ""; // Menentukan kelas tambahan untuk baris berdasarkan kondisi

                            return (
                              <tr key={index} className={rowClass}>
                                {" "}
                                {/* Tambahkan kelas tambahan di sini */}
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900`}
                                >
                                  {item.STOCK_DATE
                                    ? new Date(item.STOCK_DATE)
                                        .toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "long",
                                          year: "numeric",
                                        })
                                        .replace(/\//g, "-")
                                    : ""}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}
                                >
                                  {item.WC}
                                </td>
                                {selectedWC !== "Cutting" && (
                                  <td
                                    className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}
                                  >
                                    {item.JX2_LINE}
                                  </td>
                                )}
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}
                                >
                                  {item.JX_LINE}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}
                                >
                                  {item.RELEASE}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}
                                >
                                  {item.STYLE}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}
                                >
                                  {item.MODEL}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}
                                >
                                  {item.GEN}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium`}
                                >
                                  {totalColumnValue.toLocaleString()}
                                </td>
                                {columns.map((columnName) => (
                                  <td
                                    className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6 ${
                                      item.WC === "SUB_TOTAL"
                                        ? ""
                                        : item[columnName]
                                        ? ""
                                        : ""
                                    }`}
                                  >
                                    {item[columnName]}
                                  </td>
                                ))}
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

export default InventorySummary;
