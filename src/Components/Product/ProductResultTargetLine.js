import React, { useState, useEffect } from "react";
import Logo from "../../assets/img/New Logo White.png";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ProductResultTarget = () => {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "PRODUCT",
          programName: "PRODUCT RESULT - TARGET LINE",
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
  const [updating, setUpdating] = useState(false); // State untuk menunjukkan apakah sedang dalam proses pembaruan
  const [selectedOption, setSelectedOption] = useState("Line");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);

    // Tambahkan logika navigasi sesuai dengan opsi yang dipilih
    if (e.target.value === "Line") {
      window.location.href = "/ProductResultTargetLine";
    } else if (e.target.value === "Model") {
      window.location.href = "/ProductResultTargetModel";
    } else if (e.target.value === "JXLine") {
      window.location.href = "/ProductResultTargetJXLine";
    } else if (e.target.value === "JXSPK") {
      window.location.href = "/ProductResultTargetJXSPK";
    } else if (e.target.value === "JXSPKAll") {
      window.location.href = "/ProductResultTargetJXSPKAll";
    }
  };

  // Format tanggal ke format YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // Mendapatkan tanggal sekarang
  const currentDate = new Date();

  // Menetapkan dateFrom ke 1 pada bulan ini
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const [dateFrom, setDateFrom] = useState(formatDate(firstDayOfMonth));

  // Menetapkan dateTo ke tanggal sekarang
  const [dateTo, setDateTo] = useState(formatDate(currentDate));

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  // Fungsi untuk menghitung Rate
  const calculateRate = (target, production) => {
    if (target === 0) {
      return 0;
    }
    return ((production / target) * 100).toFixed(2);
  };

  const fetchData = async () => {
    try {
      setUpdating(true); // Mulai proses pembaruan
      // Mengganti URL sesuai dengan endpoint Express.js Anda
      const response = await fetch(
        "http://172.16.200.28:3000/api/product-result-target",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DATEFROM: dateFrom,
            DATETO: dateTo,
            PLANT: "ALL",
            D_CEK: 3,
            D_ST: 1,
          }),
        }
      );

      const result = await response.json();

      // Menampilkan data di console
      console.log("Data from server:", result.result);

      // Mengupdate state dengan hasil data dari server
      setData(result.result);
    } catch (error) {
      console.error("Error fetching data:", error);
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
  }, [autoUpdate, dateFrom, dateTo]);

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
            background-color: #B84600;
            z-index: 2;
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
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Product
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the Product [Result - Target]
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <p className="bg-green-200 text-green-800 inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0">
                  RATE {">"}= 100
                </p>
                <p className="bg-yellow-200 text-yellow-800 inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0">
                  RATE {">"}= 98
                </p>
                <p className="bg-red-200 text-red-800 inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0">
                  RATE {"<"}= 97
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label
                  htmlFor="productOption"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="productOption"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="productOption"
                  className="block text-sm font-medium text-gray-700"
                >
                  FILTER
                </label>
                <select
                  id="productOption"
                  name="productOption"
                  onChange={handleOptionChange}
                  value={selectedOption}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                >
                  <option value="Line">JX/JX2 Line</option>
                  <option value="JXLine">JX Line (Day)</option>
                  <option value="JXSPK">JX SPK (Day)</option>
                  <option value="JXSPKAll">JX SPK (All)</option>
                  <option value="Model">Model</option>
                </select>
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
                      <table className="min-w-full divide-y divide-neutral-950 sticky-header border border-slate-500">
                        <thead className="bg-slate-300">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              JX LINE
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              JX2 LINE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              TOTAL PLAN
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              TOTAL PROD
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              TOTAL DIFF
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              RATE
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
                              QTY
                            </th>
                          </tr>
                          {data?.map((item, index) =>
                            index === 0 ? (
                              <tr>
                                <th
                                  scope="col"
                                  colSpan={2}
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  TOTAL
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  {item.TARGET !== null &&
                                    item.TARGET !== undefined
                                    ? item.TARGET.toLocaleString()
                                    : ""}
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                  {item.PROD_QTY !== null &&
                                    item.PROD_QTY !== undefined
                                    ? item.PROD_QTY.toLocaleString()
                                    : ""}
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                  {item.DIFF !== null && item.DIFF !== undefined
                                    ? item.DIFF.toLocaleString()
                                    : ""}
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  style={{
                                    backgroundColor:
                                      item.DIFF !== null &&
                                        item.DIFF !== undefined
                                        ? calculateRate(
                                          item.TARGET,
                                          item.PROD_QTY
                                        ) >= 100
                                          ? "rgb(144,238,144)"
                                          : calculateRate(
                                            item.TARGET,
                                            item.PROD_QTY
                                          ) >= 98
                                            ? "rgb(255, 255, 128)"
                                            : "rgb(255, 128, 128)"
                                        : "",
                                  }}
                                >
                                  {item.DIFF !== null && item.DIFF !== undefined
                                    ? `${calculateRate(
                                      item.TARGET,
                                      item.PROD_QTY
                                    )}%`
                                    : ""}
                                </th>
                                <th
                                  scope="col"
                                  colSpan={4}
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                ></th>
                              </tr>
                            ) : null
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
                        <tbody className="divide-y divide-neutral-950 bg-white">
                          {data?.map((item, index) =>
                            index !== 0 ? (
                              <tr key={index}>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ${index === 0 ? "bg-yellow-500" : ""
                                    }`}
                                >
                                  {item.JX_LINE}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ${index === 0 ? "bg-yellow-500" : ""
                                    }`}
                                >
                                  {item.JX2_LINE}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ${index === 0 ? "bg-yellow-500" : ""
                                    }`}
                                >
                                  {item.TARGET !== null &&
                                    item.TARGET !== undefined
                                    ? item.TARGET.toLocaleString()
                                    : ""}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ${index === 0 ? "bg-yellow-500" : ""
                                    }`}
                                >
                                  {item.PROD_QTY !== null &&
                                    item.PROD_QTY !== undefined
                                    ? item.PROD_QTY.toLocaleString()
                                    : ""}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${item.DIFF < 0
                                    ? "text-red-700"
                                    : "text-gray-900"
                                    } text-black sm:pl-6 ${index === 0 ? "bg-yellow-500" : ""
                                    }`}
                                >
                                  {item.DIFF !== null && item.DIFF !== undefined
                                    ? item.DIFF.toLocaleString()
                                    : ""}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium ${index === 0 ? "bg-yellow-500" : ""
                                    }`}
                                  style={{
                                    backgroundColor:
                                      item.DIFF !== null &&
                                        item.DIFF !== undefined
                                        ? calculateRate(
                                          item.TARGET,
                                          item.PROD_QTY
                                        ) >= 100
                                          ? "rgb(144,238,144)"
                                          : calculateRate(
                                            item.TARGET,
                                            item.PROD_QTY
                                          ) >= 98
                                            ? "rgb(255, 255, 128)"
                                            : "rgb(255, 128, 128)"
                                        : "",
                                  }}
                                >
                                  {item.DIFF !== null && item.DIFF !== undefined
                                    ? `${calculateRate(
                                      item.TARGET,
                                      item.PROD_QTY
                                    )}%`
                                    : ""}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ${index === 0 ? "bg-yellow-500" : ""
                                    }`}
                                >
                                  {item.STYLE !== null &&
                                    item.STYLE !== undefined
                                    ? item.STYLE
                                    : ""}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ${index === 0 ? "bg-yellow-500" : ""
                                    }`}
                                >
                                  {item.MODEL_NAME !== null &&
                                    item.MODEL_NAME !== undefined
                                    ? item.MODEL_NAME
                                    : ""}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ${index === 0 ? "bg-yellow-500" : ""
                                    }`}
                                >
                                  {item.GENDER !== null &&
                                    item.GENDER !== undefined
                                    ? item.GENDER
                                    : ""}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ${index === 0 ? "bg-yellow-500" : ""
                                    }`}
                                >
                                  {item.QTY !== null && item.QTY !== undefined
                                    ? item.QTY.toLocaleString()
                                    : ""}
                                </td>
                              </tr>
                            ) : null
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
};

export default ProductResultTarget;
