import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/img/New Logo White.png";
import { TEChart } from "tw-elements-react";

export default function DailyProdQTYTrend() {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "REPORT",
          programName: "DAILY QTY PROD TREND",
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
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Data");

  // Format tanggal ke format YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // Mendapatkan tanggal sekarang
  const currentDate = new Date();

  // Mendapatkan tanggal pertama di bulan ini
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Mengonversi tanggal pertama di bulan ini ke dalam format yang diinginkan
  const defaultDateFrom = formatDate(firstDayOfMonth);

  const [dateFrom, setDateFrom] = useState(defaultDateFrom);

  // Menetapkan dateTo ke tanggal hari ini
  const [dateTo, setDateTo] = useState(formatDate(currentDate));

  const fetchData = async () => {
    setUpdating(true);
    try {
      const response = await axios.post(
        "http://172.16.200.28:3000/daily-prod-qty-trend",
        {
          fromDate: dateFrom,
          toDate: dateTo,
        }
      );
      setData(response.data);
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
  }, [autoUpdate, dateFrom, dateTo]);

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
          z-index: 3;
        }
          .table-container {
            max-height: 100vh;
            overflow-y: auto;
          }
        `}
      </style>
      <main className="py-12">
        <div className="mx-auto max-w-full py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Report
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the Daily Prod QTY Trend
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
                  onChange={(e) => setSelectedOption(e.target.value)}
                  value={selectedOption}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                >
                  <option value="Data">DATA</option>
                  <option value="Chart">CHART</option>
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
          </div>
          {updating && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
              <img
                className="max-h-28 w-auto animate-bounce animate-infinite"
                src={Logo}
                alt="Your Company"
              />
            </div>
          )}
          {selectedOption === "Data" && (
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
                              PROD DATE
                            </th>
                            <th
                              scope="col"
                              colSpan={3}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              style={{ backgroundColor: "#374151" }}
                            >
                              TARGET
                            </th>
                            <th
                              scope="col"
                              colSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              SEWING INPUT
                            </th>
                            <th
                              scope="col"
                              colSpan={3}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              style={{ backgroundColor: "#374151" }}
                            >
                              SEWING OUTPUT
                            </th>
                            <th
                              scope="col"
                              colSpan={3}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              TOTAL RATE
                            </th>
                          </tr>
                          <tr>
                            <th
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500"
                              style={{ backgroundColor: "#374151" }}
                            >
                              PROD - DAY
                            </th>
                            <th
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500"
                              style={{ backgroundColor: "#374151" }}
                            >
                              PROD - HOUR
                            </th>
                            <th
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500"
                              style={{ backgroundColor: "#374151" }}
                            >
                              PROD - LINE
                            </th>
                            <th className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500">
                              PROD - DAY
                            </th>
                            <th className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500">
                              PROD - RATE
                            </th>
                            <th
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500"
                              style={{ backgroundColor: "#374151" }}
                            >
                              PROD - DAY
                            </th>
                            <th
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500"
                              style={{ backgroundColor: "#374151" }}
                            >
                              PROD - HOUR
                            </th>
                            <th
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500"
                              style={{ backgroundColor: "#374151" }}
                            >
                              PROD - LINE
                            </th>
                            <th className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500">
                              PROD - DAY
                            </th>
                            <th className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500">
                              PROD - HOUR
                            </th>
                            <th className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 bg-yellow-500">
                              PROD - LINE
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-950 bg-white">
                          {data.map((item) => (
                            <tr key={item.index}>
                              <td
                                className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900`}
                              >
                                {item.TARGET_DATE
                                  ? new Date(item.TARGET_DATE)
                                    .toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "long", // Menggunakan "long" untuk nama bulan penuh
                                      year: "numeric",
                                    })
                                    .replace(/,/g, "") // Menghilangkan koma setelah nama bulan
                                  : ""}
                              </td>

                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.PROD_DAY}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.PROD_HOUR}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.PROD_HOUR_RATE}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.INPUT_ACT}
                              </td>
                              <td
                                className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.INPUT_RATE >= 100
                                    ? "bg-green-400"
                                    : item.INPUT_RATE >= 98
                                      ? "bg-yellow-400"
                                      : "bg-red-400"
                                  }`}
                              >
                                {item.INPUT_RATE}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.PROD_DAY_OUTPUT}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.PROD_HOUR_OUTPUT}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.PROD_H_OUTPUT}
                              </td>
                              <td
                                className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.PROD_DAY_OUTPUT_RATE >= 100
                                    ? "bg-green-400"
                                    : item.PROD_DAY_OUTPUT_RATE >= 98
                                      ? "bg-yellow-400"
                                      : "bg-red-400"
                                  }`}
                              >
                                {" "}
                                {item.PROD_DAY_OUTPUT_RATE}%
                              </td>
                              <td
                                className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.PROD_HOUR_OUTPUT_RATE >= 100
                                    ? "bg-green-400"
                                    : item.PROD_HOUR_OUTPUT_RATE >= 98
                                      ? "bg-yellow-400"
                                      : "bg-red-400"
                                  }`}
                              >
                                {item.PROD_HOUR_OUTPUT_RATE}%
                              </td>
                              <td
                                className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.PROD_H_OUTPUT_RATE >= 100
                                    ? "bg-green-400"
                                    : item.PROD_H_OUTPUT_RATE >= 98
                                      ? "bg-yellow-400"
                                      : "bg-red-400"
                                  }`}
                              >
                                {item.PROD_H_OUTPUT_RATE}%
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
          )}
          {selectedOption === "Chart" && (
            <div>
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <h6 className="uppercase text-blueGray-100 mb-1 text-xm font-semibold">
                  PROD QTY PER DAY UNIT
                </h6>
                <TEChart
                  type="line"
                  data={{
                    labels: data.map((item) => item.TARGET_DATE), // Misalnya, label diambil dari setiap item dalam array data
                    datasets: [
                      {
                        label: "TARGET",
                        data: data.map((item) => item.PROD_DAY), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#204075"],
                        borderColor: ["#204075"],
                      },
                      {
                        label: "ACTUAL",
                        data: data.map((item) => item.PROD_DAY_OUTPUT), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#8D1C2F"],
                        borderColor: ["#8D1C2F"],
                      },
                    ],
                  }}
                />
              </div>
              <div className="mx-auto max-w-7xl py-12 sm:px-6 lg:px-8">
                <h6 className="uppercase text-blueGray-100 mb-1 text-xm font-semibold">
                  PROD QTY PER DAY ACHIVE
                </h6>
                <TEChart
                  type="bar"
                  data={{
                    labels: data.map((item) => item.TARGET_DATE), // Misalnya, label diambil dari setiap item dalam array data
                    datasets: [
                      {
                        label: "TOTAL RATE",
                        data: data.map((item) => item.PROD_DAY_OUTPUT_RATE), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#204075"],
                        borderColor: ["#204075"],
                      },
                    ],
                  }}
                />
              </div>
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <h6 className="uppercase text-blueGray-100 mb-1 text-xm font-semibold">
                  PROD QTY PER HOUR UNIT
                </h6>
                <TEChart
                  type="line"
                  data={{
                    labels: data.map((item) => item.TARGET_DATE), // Misalnya, label diambil dari setiap item dalam array data
                    datasets: [
                      {
                        label: "TARGET",
                        data: data.map((item) => item.PROD_HOUR), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#204075"],
                        borderColor: ["#204075"],
                      },
                      {
                        label: "OUTPUT",
                        data: data.map((item) => item.PROD_HOUR_OUTPUT), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#8D1C2F"],
                        borderColor: ["#8D1C2F"],
                      },
                    ],
                  }}
                />
              </div>
              <div className="mx-auto max-w-7xl py-12 sm:px-6 lg:px-8">
                <h6 className="uppercase text-blueGray-100 mb-1 text-xm font-semibold">
                  PROD QTY PER HOUR ACHIVE
                </h6>
                <TEChart
                  type="bar"
                  data={{
                    labels: data.map((item) => item.TARGET_DATE), // Misalnya, label diambil dari setiap item dalam array data
                    datasets: [
                      {
                        label: "TOTAL RATE",
                        data: data.map((item) => item.PROD_HOUR_OUTPUT_RATE), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#204075"],
                        borderColor: ["#204075"],
                      },
                    ],
                  }}
                />
              </div>
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <h6 className="uppercase text-blueGray-100 mb-1 text-xm font-semibold">
                  PROD QTY PER LINE AVG UNIT
                </h6>
                <TEChart
                  type="line"
                  data={{
                    labels: data.map((item) => item.TARGET_DATE), // Misalnya, label diambil dari setiap item dalam array data
                    datasets: [
                      {
                        label: "TARGET",
                        data: data.map((item) => item.PROD_HOUR_RATE), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#204075"],
                        borderColor: ["#204075"],
                      },
                      {
                        label: "ACTUAL",
                        data: data.map((item) => item.PROD_H_OUTPUT), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#8D1C2F"],
                        borderColor: ["#8D1C2F"],
                      },
                    ],
                  }}
                />
              </div>
              <div className="mx-auto max-w-7xl py-12 sm:px-6 lg:px-8">
                <h6 className="uppercase text-blueGray-100 mb-1 text-xm font-semibold">
                  PROD QTY PER LINE AVG ACHIVE
                </h6>
                <TEChart
                  type="bar"
                  data={{
                    labels: data.map((item) => item.TARGET_DATE), // Misalnya, label diambil dari setiap item dalam array data
                    datasets: [
                      {
                        label: "TOTAL RATE",
                        data: data.map((item) => item.PROD_H_OUTPUT_RATE), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#204075"],
                        borderColor: ["#204075"],
                      },
                    ],
                  }}
                />
              </div>
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <h6 className="uppercase text-blueGray-100 mb-1 text-xm font-semibold">
                  PROD QTY TARGET INPUT QTY - OUTPUT QTY
                </h6>
                <TEChart
                  type="line"
                  data={{
                    labels: data.map((item) => item.TARGET_DATE), // Misalnya, label diambil dari setiap item dalam array data
                    datasets: [
                      {
                        label: "TARGET",
                        data: data.map((item) => item.PROD_DAY), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#204075"],
                        borderColor: ["#204075"],
                      },
                      {
                        label: "INPUT",
                        data: data.map((item) => item.INPUT_ACT), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#8D1C2F"],
                        borderColor: ["#8D1C2F"],
                      },
                      {
                        label: "OUTPUT",
                        data: data.map((item) => item.PROD_DAY_OUTPUT), // Misalnya, nilai diambil dari setiap item dalam array data
                        backgroundColor: ["#166534"],
                        borderColor: ["#166534"],
                      },
                    ],
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
