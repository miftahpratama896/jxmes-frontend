import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/img/New Logo White.png";

function ProductCSS() {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "PRODUCT",
          programName: "PRODUCT - CSS",
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
  const [error, setError] = useState(null);
  const [numColumns, setNumColumns] = useState(0);
  const [totalAllRows, setTotalAllRows] = useState(0);

  const fetchData = async () => {
    setUpdating(true);

    try {
      const response = await axios.post(
        "http://172.16.200.28:3000/product-css",
        {
          dateFrom: "2024-03-26",
          dateTo: "2024-03-26",
          jxLine: "ALL",
          jx2Line: "ALL",
          rls: "",
          model: "",
          style: "",
          gender: "ALL",
          cekRls: 1,
          type: "INPUT",
        }
      );
      setData(response.data);
    } catch (error) {
      setError(error.message);
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
  }, [autoUpdate]);

  // Mendapatkan nama kolom secara dinamis dari data yang memiliki format waktu
  const getColumnNames = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter((key) => key.match(/^\d{2}:\d{2}$/));
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
      <main className="py-12">
        <div className="mx-auto max-w-full px-6 lg:px-1">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Product
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the Product CSS
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
              <div className="relative -mx-4 -my-2 overflow-y-scroll overflow-x-scroll sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className=" shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <div className="max-h-[70vh] max-w-screen ">
                      <table className="min-w-full divide-y divide-neutral-950 border border-slate-500 ">
                        <thead className="bg-slate-300 ">
                          <tr className="sticky top-0 text-white z-10 bg-gray-900 whitespace-nowrap">
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                            >
                              JX LINE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              JX2 LINE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              RELEASE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              STYLE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              MODEL
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              GENDER
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              TOTAL
                            </th>
                            {columns.map((columnName, index) => (
                              <th
                                key={index}
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold "
                              >
                                {columnName}
                              </th>
                            ))}
                          </tr>
                          <tr>
                            <th
                              scope="col"
                              colSpan={6}
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              TOTAL
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
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
                            return (
                              <tr key={item.index}>
                                <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                                  {item.SCAN_LINEJX}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.SCAN_LINEJX2}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.RLS}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.STYLE}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.MODEL}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.GENDER}
                                </td>
                                <td className="py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {totalColumnValue.toLocaleString()}
                                </td>
                                {columns.map((columnName) => (
                                  <td
                                    className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
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

export default ProductCSS;
