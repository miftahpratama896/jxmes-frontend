import React, { useState, useEffect } from "react";
import Logo from "../../assets/img/New Logo White.png";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ProductResultTargetModel = () => {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "PRODUCT",
          programName: "PRODUCT RESULT - TARGET MODEL",
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
  const [selectedOption, setSelectedOption] = useState("Model");

  const handleDateChange = (type, value) => {
    if (type === "from") {
      setDateFrom(value);
    } else if (type === "to") {
      if (new Date(value) < new Date(dateFrom)) {
        alert("Date To cannot be earlier than Date From");
        setDateTo(dateTo);
      } else if (new Date(value) > new Date(dateFrom)) {
        setDateTo(value);
      } else {
        alert("Date To cannot be the same as Date From");
      }
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);

    if (e.target.value === "Line") {
      window.location.href = "/ProductResultTargetLine";
    } else if (e.target.value === "Model") {
      window.location.href = "/ProductResultTargetModel";
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const [dateFrom, setDateFrom] = useState(formatDate(firstDayOfMonth));
  const [dateTo, setDateTo] = useState(formatDate(currentDate));

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const fetchData = async () => {
    try {
      setUpdating(true);
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
            D_CEK: 2,
            D_ST: 1,
          }),
        }
      );

      const result = await response.json();

      console.log("Data from server:", result.result);
      setData(result.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setUpdating(false);
    }
  };

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
  }, [autoUpdate, dateFrom, dateTo]);

  const dynamicColumns = Object.keys(data[0] || {}).filter(
    (key) => key !== "MODEL"
  );

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
                  onChange={(e) => handleDateChange("from", e.target.value)}
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
                  onChange={(e) => handleDateChange("to", e.target.value)}
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
                  <option value="Line">Line</option>
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
              <div className="relative -mx-4 -my-2 overflow-y-scroll overflow-x-scroll sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className=" shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <div className="max-h-[70vh] max-w-screen ">
                      <table className="min-w-full divide-y divide-neutral-950 border border-slate-500 ">
                        <thead className="bg-slate-300 ">
                          <tr className="sticky top-0 text-white z-20 bg-gray-900 whitespace-nowrap">
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky left-0 top-0 bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6 "
                            >
                              MODEL
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky left-[170px] top-0 bg-gray-900  py-3.5 pr-3 text-center  text-sm font-semibold sm:pl-6"
                            >
                              TOTAL PLAN
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky left-[275px] top-0 bg-gray-900 py-3.5 pl-4 pr-3 text-center  text-sm font-semibold 0 sm:pl-6"
                            >
                              TOTAL PROD
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky left-[383px] top-0 bg-gray-900 py-3.5 pl-4 pr-3 text-center  text-sm font-semibold sm:pl-6"
                            >
                              TOTAL DIFF
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky left-[480px] top-0 bg-gray-900 py-3.5 pl-4 pr-3 text-center  text-sm font-semibold sm:pl-6"
                            >
                              RATE
                            </th>
                            {dynamicColumns.map((column, index) => (
                              <React.Fragment key={index}>
                                <th
                                  key={index}
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-sm font-semibold sm:pl-6 text-center"
                                  style={{
                                    backgroundColor:
                                      index % 12 < 3
                                        ? "#374151" // Kolom pertama
                                        : index % 12 < 6
                                        ? "#1f2937" // Kolom kedua
                                        : index % 12 < 9
                                        ? "#374151" // Kolom ketiga
                                        : "#1f2937", // Kolom keempat
                                  }}
                                >
                                  {column.endsWith("_1")
                                    ? `[PLAN]`
                                    : column.endsWith("_2")
                                    ? `[PROD]`
                                    : column.endsWith("_3")
                                    ? `[DIFF]`
                                    : column}
                                </th>
                              </React.Fragment>
                            ))}
                          </tr>
                          <tr className="sticky top-12 text-white bg-gray-900 whitespace-nowrap">
                            {dynamicColumns.map((column, index) => (
                              <React.Fragment key={index}>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-sm font-semibold sm:pl-6 text-center"
                                  style={{
                                    backgroundColor:
                                      index % 12 < 3
                                        ? "#374151" // Kolom pertama
                                        : index % 12 < 6
                                        ? "#1f2937" // Kolom kedua
                                        : index % 12 < 9
                                        ? "#374151" // Kolom ketiga
                                        : "#1f2937", // Kolom keempat
                                  }}
                                >
                                  {column.endsWith("_1") ||
                                  column.endsWith("_3") ? (
                                    <span style={{ color: "rgba(0, 0, 0, 0)" }}>
                                      okay
                                    </span>
                                  ) : (
                                    // Ubah format tanggal dari YYYY-MM-DD menjadi DD-MM-YYYY
                                    new Date(column.replace(/_2$/, ""))
                                      .toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .replace(/\//g, "-")
                                  )}
                                </th>
                              </React.Fragment>
                            ))}
                          </tr>

                          {data?.map((item, index) =>
                            index === 0 ? (
                              <tr
                                key={index}
                                className="sticky top-24 z-20 bg-orange-500 whitespace-nowrap"
                              >
                                <th
                                  className={`sticky left-0 top-0 bg-orange-500 whitespace-nowrap text-center py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ${
                                    index === 0 ? "" : ""
                                  }`}
                                >
                                  {item.MODEL}
                                </th>
                                {/* TOTAL PLAN */}
                                <th
                                  className={`sticky left-[170px] top-0 bg-orange-500 whitespace-nowrap py-4 pl-4 pr-3 text-center text-xs font-medium text-gray-900 sm:pl-6  ${
                                    index === 0 ? "" : ""
                                  }`}
                                >
                                  {dynamicColumns
                                    .reduce((total, column) => {
                                      const value =
                                        item[
                                          column.endsWith("_1") ? column : ""
                                        ] || 0;
                                      return total + value;
                                    }, 0)
                                    .toLocaleString()}
                                </th>
                                {/* TOTAL PROD */}
                                <th
                                  className={`sticky left-[275px] top-0 bg-orange-500 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6  ${
                                    index === 0 ? "" : ""
                                  }`}
                                >
                                  {dynamicColumns
                                    .reduce((total, column) => {
                                      const value =
                                        item[
                                          column.endsWith("_2") ? column : ""
                                        ] || 0;
                                      return total + value;
                                    }, 0)
                                    .toLocaleString()}
                                </th>
                                {/* TOTAL DIFF */}
                                <th
                                  className={`sticky left-[383px] top-0 bg-orange-500 whitespace-nowrap py-4 pl-4 pr-3 text-center text-xs font-medium sm:pl-6 ${
                                    dynamicColumns.reduce((total, column) => {
                                      const value =
                                        item[
                                          column.endsWith("_3") ? column : ""
                                        ] || 0;
                                      return total + value;
                                    }, 0) < 0
                                      ? "text-red-700"
                                      : ""
                                  } ${index === 0 ? "" : ""}`}
                                >
                                  {dynamicColumns
                                    .reduce((total, column) => {
                                      const value =
                                        item[
                                          column.endsWith("_3") ? column : ""
                                        ] || 0;
                                      return total + value;
                                    }, 0)
                                    .toLocaleString()}
                                </th>
                                {/* RATE */}
                                <th
                                  className={`sticky left-[480px] top-0 bg-orange-500 whitespace-nowrap py-4 pl-4 pr-3 ttext-center text-xs font-medium sm:pl-6 ${
                                    isFinite(
                                      (
                                        (dynamicColumns.reduce(
                                          (total, column) => {
                                            const prodValue =
                                              item[
                                                column.endsWith("_2")
                                                  ? column
                                                  : ""
                                              ] || 0;
                                            const planValue =
                                              item[
                                                column.endsWith("_1")
                                                  ? column
                                                  : ""
                                              ] || 0;
                                            return total + prodValue;
                                          },
                                          0
                                        ) /
                                          dynamicColumns.reduce(
                                            (total, column) => {
                                              const value =
                                                item[
                                                  column.endsWith("_1")
                                                    ? column
                                                    : ""
                                                ] || 0;
                                              return total + value;
                                            },
                                            0
                                          )) *
                                        100
                                      ).toFixed(2)
                                    )
                                      ? (
                                          (dynamicColumns.reduce(
                                            (total, column) => {
                                              const prodValue =
                                                item[
                                                  column.endsWith("_2")
                                                    ? column
                                                    : ""
                                                ] || 0;
                                              const planValue =
                                                item[
                                                  column.endsWith("_1")
                                                    ? column
                                                    : ""
                                                ] || 0;
                                              return total + prodValue;
                                            },
                                            0
                                          ) /
                                            dynamicColumns.reduce(
                                              (total, column) => {
                                                const value =
                                                  item[
                                                    column.endsWith("_1")
                                                      ? column
                                                      : ""
                                                  ] || 0;
                                                return total + value;
                                              },
                                              0
                                            )) *
                                          100
                                        ).toFixed(2) >= 100
                                        ? "five-column bg-green-400"
                                        : (
                                            (dynamicColumns.reduce(
                                              (total, column) => {
                                                const prodValue =
                                                  item[
                                                    column.endsWith("_2")
                                                      ? column
                                                      : ""
                                                  ] || 0;
                                                const planValue =
                                                  item[
                                                    column.endsWith("_1")
                                                      ? column
                                                      : ""
                                                  ] || 0;
                                                return total + prodValue;
                                              },
                                              0
                                            ) /
                                              dynamicColumns.reduce(
                                                (total, column) => {
                                                  const value =
                                                    item[
                                                      column.endsWith("_1")
                                                        ? column
                                                        : ""
                                                    ] || 0;
                                                  return total + value;
                                                },
                                                0
                                              )) *
                                            100
                                          ).toFixed(2) >= 98
                                        ? "five-column bg-yellow-400"
                                        : "five-column bg-red-400"
                                      : "five-column bg-red-400"
                                  } ${
                                    index === 0
                                      ? "five-column bg-yellow-500"
                                      : ""
                                  }`}
                                >
                                  {isFinite(
                                    (
                                      (dynamicColumns.reduce(
                                        (total, column) => {
                                          const prodValue =
                                            item[
                                              column.endsWith("_2")
                                                ? column
                                                : ""
                                            ] || 0;
                                          const planValue =
                                            item[
                                              column.endsWith("_1")
                                                ? column
                                                : ""
                                            ] || 0;
                                          return total + prodValue;
                                        },
                                        0
                                      ) /
                                        dynamicColumns.reduce(
                                          (total, column) => {
                                            const value =
                                              item[
                                                column.endsWith("_1")
                                                  ? column
                                                  : ""
                                              ] || 0;
                                            return total + value;
                                          },
                                          0
                                        )) *
                                      100
                                    ).toFixed(2)
                                  )
                                    ? `${(
                                        (dynamicColumns.reduce(
                                          (total, column) => {
                                            const prodValue =
                                              item[
                                                column.endsWith("_2")
                                                  ? column
                                                  : ""
                                              ] || 0;
                                            const planValue =
                                              item[
                                                column.endsWith("_1")
                                                  ? column
                                                  : ""
                                              ] || 0;
                                            return total + prodValue;
                                          },
                                          0
                                        ) /
                                          dynamicColumns.reduce(
                                            (total, column) => {
                                              const value =
                                                item[
                                                  column.endsWith("_1")
                                                    ? column
                                                    : ""
                                                ] || 0;
                                              return total + value;
                                            },
                                            0
                                          )) *
                                        100
                                      ).toFixed(2)}%`
                                    : "0%"}
                                </th>
                                {dynamicColumns.map((column, columnIndex) => (
                                  <th
                                    key={columnIndex}
                                    className={`whitespace-nowrap text-center py-4 pl-4 pr-3 text-xs font-medium sm:pl-6 ${
                                      item[column] && item[column] < 0
                                        ? "text-red-700"
                                        : "text-gray-900"
                                    } ${index === 0 ? "" : ""}`}
                                  >
                                    {item[column]
                                      ? item[column].toLocaleString()
                                      : 0}
                                  </th>
                                ))}
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
                                  className={`sticky left-0 bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-center text-xs font-medium text-gray-900 sm:pl-6 ${
                                    index === 0 ? "bg-yellow-500" : ""
                                  }`}
                                >
                                  {item.MODEL}
                                </td>
                                {/* TOTAL PLAN */}
                                <td
                                  className={`sticky left-[170px] bg-gray-50 py-4 pl-4 pr-3 text-center text-xs font-medium text-gray-900 sm:pl-6  ${
                                    index === 0 ? "bg-yellow-500" : ""
                                  }`}
                                >
                                  {dynamicColumns
                                    .reduce((total, column) => {
                                      const value =
                                        item[
                                          column.endsWith("_1") ? column : ""
                                        ] || 0;
                                      return total + value;
                                    }, 0)
                                    .toLocaleString()}
                                </td>
                                {/* TOTAL PROD */}
                                <td
                                  className={`sticky left-[275px] bg-gray-50 py-4 pl-4 pr-3 text-center text-xs font-medium text-gray-900 sm:pl-6  ${
                                    index === 0 ? "bg-yellow-500" : ""
                                  }`}
                                >
                                  {dynamicColumns
                                    .reduce((total, column) => {
                                      const value =
                                        item[
                                          column.endsWith("_2") ? column : ""
                                        ] || 0;
                                      return total + value;
                                    }, 0)
                                    .toLocaleString()}
                                </td>
                                {/* TOTAL DIFF */}
                                <td
                                  className={`sticky left-[383px] bg-gray-50 py-4 pl-4 pr-3 text-center text-xs font-medium sm:pl-6 ${
                                    dynamicColumns.reduce((total, column) => {
                                      const value =
                                        item[
                                          column.endsWith("_3") ? column : ""
                                        ] || 0;
                                      return total + value;
                                    }, 0) < 0
                                      ? "text-red-700"
                                      : ""
                                  } ${index === 0 ? "bg-yellow-500" : ""}`}
                                >
                                  {dynamicColumns
                                    .reduce((total, column) => {
                                      const value =
                                        item[
                                          column.endsWith("_3") ? column : ""
                                        ] || 0;
                                      return total + value;
                                    }, 0)
                                    .toLocaleString()}
                                </td>
                                {/* RATE */}
                                <td
                                  className={`sticky left-[480px] bg-gray-50 py-4 pl-4 pr-3 text-center text-xs font-medium sm:pl-6 ${
                                    isFinite(
                                      (
                                        (dynamicColumns.reduce(
                                          (total, column) => {
                                            const prodValue =
                                              item[
                                                column.endsWith("_2")
                                                  ? column
                                                  : ""
                                              ] || 0;
                                            const planValue =
                                              item[
                                                column.endsWith("_1")
                                                  ? column
                                                  : ""
                                              ] || 0;
                                            return total + prodValue;
                                          },
                                          0
                                        ) /
                                          dynamicColumns.reduce(
                                            (total, column) => {
                                              const value =
                                                item[
                                                  column.endsWith("_1")
                                                    ? column
                                                    : ""
                                                ] || 0;
                                              return total + value;
                                            },
                                            0
                                          )) *
                                        100
                                      ).toFixed(2)
                                    )
                                      ? (
                                          (dynamicColumns.reduce(
                                            (total, column) => {
                                              const prodValue =
                                                item[
                                                  column.endsWith("_2")
                                                    ? column
                                                    : ""
                                                ] || 0;
                                              const planValue =
                                                item[
                                                  column.endsWith("_1")
                                                    ? column
                                                    : ""
                                                ] || 0;
                                              return total + prodValue;
                                            },
                                            0
                                          ) /
                                            dynamicColumns.reduce(
                                              (total, column) => {
                                                const value =
                                                  item[
                                                    column.endsWith("_1")
                                                      ? column
                                                      : ""
                                                  ] || 0;
                                                return total + value;
                                              },
                                              0
                                            )) *
                                          100
                                        ).toFixed(2) >= 100
                                        ? "sticky-five-row bg-green-400"
                                        : (
                                            (dynamicColumns.reduce(
                                              (total, column) => {
                                                const prodValue =
                                                  item[
                                                    column.endsWith("_2")
                                                      ? column
                                                      : ""
                                                  ] || 0;
                                                const planValue =
                                                  item[
                                                    column.endsWith("_1")
                                                      ? column
                                                      : ""
                                                  ] || 0;
                                                return total + prodValue;
                                              },
                                              0
                                            ) /
                                              dynamicColumns.reduce(
                                                (total, column) => {
                                                  const value =
                                                    item[
                                                      column.endsWith("_1")
                                                        ? column
                                                        : ""
                                                    ] || 0;
                                                  return total + value;
                                                },
                                                0
                                              )) *
                                            100
                                          ).toFixed(2) >= 98
                                        ? "sticky-five-row bg-yellow-400"
                                        : "sticky-five-row bg-red-400"
                                      : "sticky-five-row bg-red-400"
                                  } ${
                                    index === 0
                                      ? "sticky-five-row bg-yellow-500"
                                      : ""
                                  }`}
                                >
                                  {isFinite(
                                    (
                                      (dynamicColumns.reduce(
                                        (total, column) => {
                                          const prodValue =
                                            item[
                                              column.endsWith("_2")
                                                ? column
                                                : ""
                                            ] || 0;
                                          const planValue =
                                            item[
                                              column.endsWith("_1")
                                                ? column
                                                : ""
                                            ] || 0;
                                          return total + prodValue;
                                        },
                                        0
                                      ) /
                                        dynamicColumns.reduce(
                                          (total, column) => {
                                            const value =
                                              item[
                                                column.endsWith("_1")
                                                  ? column
                                                  : ""
                                              ] || 0;
                                            return total + value;
                                          },
                                          0
                                        )) *
                                      100
                                    ).toFixed(2)
                                  )
                                    ? `${(
                                        (dynamicColumns.reduce(
                                          (total, column) => {
                                            const prodValue =
                                              item[
                                                column.endsWith("_2")
                                                  ? column
                                                  : ""
                                              ] || 0;
                                            const planValue =
                                              item[
                                                column.endsWith("_1")
                                                  ? column
                                                  : ""
                                              ] || 0;
                                            return total + prodValue;
                                          },
                                          0
                                        ) /
                                          dynamicColumns.reduce(
                                            (total, column) => {
                                              const value =
                                                item[
                                                  column.endsWith("_1")
                                                    ? column
                                                    : ""
                                                ] || 0;
                                              return total + value;
                                            },
                                            0
                                          )) *
                                        100
                                      ).toFixed(2)}%`
                                    : "0%"}
                                </td>
                                {dynamicColumns.map((column, columnIndex) => (
                                  <td
                                    key={columnIndex}
                                    className={` text-center py-4 pl-4 pr-3 text-xs font-medium sm:pl-6 ${
                                      item[column] && item[column] < 0
                                        ? "text-red-700"
                                        : "text-gray-900"
                                    } ${index === 0 ? "bg-yellow-500" : ""}`}
                                  >
                                    {item[column]
                                      ? item[column].toLocaleString()
                                      : 0}
                                  </td>
                                ))}
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

export default ProductResultTargetModel;
