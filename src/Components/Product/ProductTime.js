import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Logo from "../../assets/img/New Logo White.png";
import axios from "axios";

const ProductTime = () => {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "PRODUCT",
          programName: "PRODUCT TIME",
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
  const [apiResponse, setApiResponse] = useState([]);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false); // State untuk menunjukkan apakah sedang dalam proses pembaruan
  const [autoUpdate, setAutoUpdate] = useState(false);
  const calculateTotal = (item) => {
    const columnsToSum = getColumnNames();

    const total = columnsToSum.reduce((accumulator, column) => {
      const columnValue = item[column];

      // Only add numeric values to the total
      if (!isNaN(columnValue) && columnValue !== null) {
        accumulator += parseFloat(columnValue);
      }

      return accumulator;
    }, 0);

    // Format total with dot as thousand separator
    return total.toLocaleString();
  };

  const today = new Date(); // mendapatkan tanggal hari ini
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // mendapatkan tanggal kemarin
  // Format tanggal menjadi string dalam format 'YYYY-MM-DD'
  const formattedToday = today.toISOString().split("T")[0];
  const formattedYesterday = yesterday.toISOString().split("T")[0];
  // States for filters
  const [selectedFactory, setSelectedFactory] = useState("ALL");
  const [selectedYesdayDate, setSelectedYesdayDate] =
    useState(formattedYesterday);
  const [selectedTodayDate, setSelectedTodayDate] = useState(formattedToday);
  const [selectedWC, setSelectedWC] = useState("Cutting");
  const [selectedCTime, setSelectedCTime] = useState("ALL");
  const [numColumns, setNumColumns] = useState(0);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const callStoredProcedure = async () => {
    try {
      setUpdating(true); // Mulai proses pembaruan
      const requestBody = {
        YESDAY_DATE: selectedYesdayDate,
        TODAY_DATE: selectedTodayDate,
        PLANT: selectedFactory,
        WC: selectedWC,
        C_TIME: selectedCTime,
      };

      const response = await fetch(
        "http://172.16.200.28:3000/api/call-stored-procedure",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();
      setApiResponse(responseData);
    } catch (error) {
      console.error("Error:", error.message);
      setError("Error fetching data from the server");
    } finally {
      setUpdating(false); // Selesai proses pembaruan
    }
  };

  // Menggunakan useEffect untuk memanggil callStoredProcedure saat komponen dipasang
  useEffect(() => {
    if (autoUpdate) {
      callStoredProcedure();

      // Set interval untuk melakukan pembaruan setiap 30 detik
      const intervalId = setInterval(() => {
        callStoredProcedure();
      }, 30000);

      // Membersihkan interval pada saat komponen unmount
      return () => clearInterval(intervalId);
    } else {
      // Pemanggilan pertama kali saat komponen dipasang
      callStoredProcedure();
    }
  }, [
    autoUpdate,
    selectedFactory,
    selectedYesdayDate,
    selectedTodayDate,
    selectedWC,
    selectedCTime,
  ]);

  const getColumnNames = () => {
    if (apiResponse.length === 0) return [];
    return Object.keys(apiResponse[0][0]).filter((key) =>
      key.match(/^\d{2}:\d{2}$/)
    );
  };

  useEffect(() => {
    const columns = getColumnNames();
    setNumColumns(columns.length);
  }, [apiResponse[0]]); // Jika data berubah, perbaharui jumlah kolom
  const columns = getColumnNames();

  console.log("Data from server:", apiResponse);

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
          background-color: #B84600;
          z-index: 2;
        }
        .sticky-header thead tr:nth-child(3) th {
          position: sticky;
          top: 96px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
          background-color: #f1f5f9;
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
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Product
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the Product - Time
                </p>
              </div>
              <div className="sm:flex sm:items-center">
                {/* Combobox for selecting PLANT */}
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label
                    htmlFor="plant"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                {/* Combobox for selecting Yesterday Date */}
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label
                    htmlFor="yesdayDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    FROM DATE
                  </label>
                  <input
                    type="date"
                    id="yesdayDate"
                    name="yesdayDate"
                    value={selectedYesdayDate}
                    onChange={(e) => setSelectedYesdayDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  />
                </div>
                {/* Combobox for selecting Today Date */}
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label
                    htmlFor="todayDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    TO DATE
                  </label>
                  <input
                    type="date"
                    id="todayDate"
                    name="todayDate"
                    value={selectedTodayDate}
                    onChange={(e) => setSelectedTodayDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  />
                </div>
                {/* Combobox for selecting WC */}
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label
                    htmlFor="wc"
                    className="block text-sm font-medium text-gray-700"
                  >
                    WORK CENTER
                  </label>
                  <select
                    id="wc"
                    name="wc"
                    onChange={(e) => setSelectedWC(e.target.value)}
                    value={selectedWC}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  >
                    <option value="CUTTING">Cutting</option>
                    <option value="SEWING">Sewing</option>
                    <option value="W/H">W/H</option>
                    {/* Add other WC options as needed */}
                  </select>
                </div>
                {/* Combobox for selecting C Time */}
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <label
                    htmlFor="cTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    TIME
                  </label>
                  <select
                    id="cTime"
                    name="cTime"
                    onChange={(e) => setSelectedCTime(e.target.value)}
                    value={selectedCTime}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  >
                    <option value="ALL">All Time</option>
                    <option value="07:00">7 AM</option>
                    <option value="08:00">8 AM</option>
                    <option value="09:00">9 AM</option>
                    <option value="10:00">10 AM</option>
                    <option value="11:00">11 AM</option>
                    <option value="13:00">1 PM</option>
                    <option value="14:00">2 PM</option>
                    <option value="15:00">3 PM</option>
                    <option value="16:00">4 PM</option>
                    <option value="17:00">5 PM</option>
                    {/* Add other C Time options as needed */}
                  </select>
                </div>
                {/* CheckBox for automatic updates */}
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
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <div className="table-container">
                      <table className="min-w-full divide-y divide-neutral-950 sticky-header border border-slate-500">
                        <thead className="bg-slate-300 ">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              PLANT
                            </th>
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
                              JX2 LINE
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
                              DAY
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
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              TOTAL [ALL TIME]
                            </th>
                          </tr>
                          {apiResponse[0] &&
                            apiResponse[0].length > 0 &&
                            apiResponse[0][0].FACTORY == "TOTAL" &&
                            (apiResponse[0][0].DAY !== "TODAY" ||
                              apiResponse[0][0].DAY !== "YESTERDAY") && (
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  {apiResponse[0][0].FACTORY}
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  {apiResponse[0][0].JX_LINE}
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  {apiResponse[0][0].LINE}
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                  {apiResponse[0][0].MODEL}
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                  {apiResponse[0][0].GENDER}
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                  {apiResponse[0][0].DAY}
                                </th>
                                {columns.map((columnName) => (
                                  <th
                                    className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
                                  >
                                    {apiResponse[0][0][
                                      columnName
                                    ]?.toLocaleString()}
                                  </th>
                                ))}
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                  {calculateTotal(apiResponse[0][0])}
                                </th>
                              </tr>
                            )}
                          {apiResponse[0] &&
                            apiResponse[0].length > 0 &&
                            apiResponse[0][1].FACTORY == "TOTAL" &&
                            (apiResponse[0][1].DAY !== "TODAY" ||
                              apiResponse[0][1].DAY !== "YESTERDAY") && (
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  {apiResponse[0][1].FACTORY}
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  {apiResponse[0][0].JX_LINE}
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  {apiResponse[0][0].LINE}
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                  {apiResponse[0][1].MODEL}
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                  {apiResponse[0][1].GENDER}
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                  {apiResponse[0][1].DAY}
                                </th>
                                {columns.map((columnName) => (
                                  <th
                                    className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
                                  >
                                    {apiResponse[0][1][
                                      columnName
                                    ]?.toLocaleString()}
                                  </th>
                                ))}
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                  {calculateTotal(apiResponse[0][1])}
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
                        {error && <div style={{ color: "red" }}>{error}</div>}
                        {apiResponse && apiResponse.length > 0 ? (
                          <tbody className="divide-y divide-neutral-950 bg-white">
                            {apiResponse[0]?.map(
                              (item, index) =>
                                item.FACTORY !== "TOTAL" && (
                                  <tr
                                    key={index}
                                    className={`${
                                      item.FACTORY === "TOTAL"
                                        ? "bg-yellow-500 text-center"
                                        : "text-center "
                                    } ${index > 0 ? "sticky-row" : ""}`}
                                  >
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6">
                                      {item.FACTORY}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                      {item.JX_LINE}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                      {item.LINE}
                                    </td>
                                    <td
                                      className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ${
                                        item.DAY === "YESTERDAY"
                                          ? "bg-orange-500 text-center"
                                          : ""
                                      }`}
                                    >
                                      {item.MODEL}
                                    </td>

                                    <td
                                      className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ${
                                        item.DAY === "YESTERDAY"
                                          ? "bg-orange-500 text-center"
                                          : ""
                                      }`}
                                    >
                                      {item.GENDER}
                                    </td>
                                    <td
                                      className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ${
                                        item.DAY === "YESTERDAY"
                                          ? "bg-orange-500 text-center"
                                          : ""
                                      }`}
                                    >
                                      {item.DAY}
                                    </td>
                                    {columns.map((columnName) => (
                                      <td
                                        className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ${
                                          item.DAY === "YESTERDAY"
                                            ? "bg-orange-500 text-center"
                                            : ""
                                        }`}
                                      >
                                        {item[columnName]}
                                      </td>
                                    ))}
                                    <td
                                      className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ${
                                        item.DAY === "YESTERDAY"
                                          ? "bg-orange-500 text-center"
                                          : "Wtext-center"
                                      }`}
                                    >
                                      {calculateTotal(item)}
                                    </td>
                                  </tr>
                                )
                            )}
                          </tbody>
                        ) : (
                          <tbody>
                            {/* Render some content when apiResponse is empty */}
                          </tbody>
                        )}
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

export default ProductTime;
