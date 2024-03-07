import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import Logo from "../../assets/img/New Logo White.png";

const InventoryMesin = () => {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "WIP",
          programName: "INVENTORY - MESIN",
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

  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState("ALL");
  const [selectedWC, setSelectedWC] = useState("ALL");
  const [selectedJXLine, setSelectedJXLine] = useState("ALL");
  const [filteredJXLineOptions, setFilteredJXLineOptions] = useState([]);
  const [numColumns, setNumColumns] = useState(0);
  const [cekSEQ, setCekSEQ] = useState("0");
  const [totalAllRows, setTotalAllRows] = useState(0);
  const [selectedMesinName, setSelectedMesinName] = useState("");
  const [filteredMesinNameOptions, setFilteredMesinNameOptions] = useState([]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleJXLineChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedJXLine(selectedValue);
  };

  const handleMesinNameChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedMesinName(selectedValue);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const currenDate = new Date();

  const [dateFrom, setDateFrom] = useState(formatDate(currenDate));

  const fetchData = async () => {
    try {
      setUpdating(true);
      const parsedFilter = parseInt(cekSEQ);
      const response = await axios.post(
        "http://172.16.200.28:3000/inventory-mesin",
        {
          D_DATE: dateFrom, // Sesuaikan dengan tanggal yang Anda inginkan
          D_PLANT: selectedFactory,
          D_WC: selectedWC,
          D_LINE: selectedJXLine,
          D_MESINCODE: "",
          D_MESINNAME: selectedMesinName,
          D_MESINBRAND: "",
          D_CEK_SEQ: parsedFilter,
        }
      );

      setData(response.data);
    } catch (error) {
      console.error(error);
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

    return () => clearInterval(intervalId);
  }, [
    autoUpdate,
    dateFrom,
    cekSEQ,
    selectedFactory,
    selectedWC,
    selectedJXLine,
    selectedMesinName,
  ]);

  // Mendapatkan nama kolom secara dinamis dari data yang memiliki format waktu
  const getColumnNames = () => {
    if (data.length === 0) return [];
    return data[0]?.map((item) => item.LINE);
  };

  useEffect(() => {
    const columns = getColumnNames();
    setNumColumns(columns.length);
  }, [data]); // Jika data berubah, perbaharui jumlah kolom
  const columns = getColumnNames();

  // Fungsi untuk menghitung total dari kolom tertentu
  const calculateColumnTotal = (columnName) => {
    // Menggunakan reduce untuk menjumlahkan nilai-nilai dalam kolom columnName
    const total = data[1]?.reduce((accumulator, currentItem) => {
      return accumulator + currentItem[columnName];
    }, 0);

    // Kembalikan total
    return total;
  };

  useEffect(() => {
    let total = 0;

    data[1]?.forEach((item) => {
      const totalColumnValue = columns.reduce((total, columnName) => {
        return total + item[columnName];
      }, 0);

      total += totalColumnValue;
    });

    setTotalAllRows(total);
  }, [data, columns]);

  useEffect(() => {
    if (data.length > 0) {
      const uniqueJXLineOptions = [
        ...new Set(data[0]?.map((item) => item.LINE)),
      ];
      setFilteredJXLineOptions(uniqueJXLineOptions);

      if (cekSEQ === "1") {
        const uniqueMesinNameOptions = [
          ...new Set(data[0]?.map((item) => item.MACHINE_TYPE)),
        ];
        setFilteredMesinNameOptions(uniqueMesinNameOptions);
      }
      if (cekSEQ === "0") {
        const uniqueMesinNameOptions = [
          ...new Set(data[1]?.map((item) => item.MACHINE_TYPE)),
        ];
        setFilteredMesinNameOptions(uniqueMesinNameOptions);
      }
    }
  }, [data]);

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

      .sticky-header thead tr:first-child th.first-column {
        position: sticky;
        left:0;
        top: 0;
        z-index: 4;
       }

       .sticky-header thead tr:first-child th.second-column {
        position: sticky;
        left:133px;
        top: 0;
        z-index: 4;
       }

       .sticky-header thead tr:first-child th.third-column {
        position: sticky;
        left:268px;
        top: 0;
        z-index: 4;
       }

      .sticky-header thead tr:nth-child(2) th {
       position: sticky;
       top: 49px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
       z-index: 3;
      }
      .sticky-header thead tr:nth-child(3) th {
        position: sticky;
        top: 97px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
        z-index: 3;
       }
       .sticky-header thead tr:nth-child(4) th {
        position: sticky;
        top: 145px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
        z-index: 3;
        background-color: #B84600;
        color: #020617;
       }
       
       .sticky-header thead tr:nth-child(4) th.first-column {
        position: sticky;
        left:0px;
        top: 145px;
        z-index: 5;
       }

       .sticky-header thead tr:nth-child(4) th.second-column {
        position: sticky;
        left:268px;
        top: 145px;
        z-index: 5;
       }

       .sticky-first-row {
        position: sticky;
        left: 0;
        z-index:3;
      }
      .sticky-second-row {
        position: sticky;
        left:133px;
        z-index:1;
      }
      .sticky-third-row {
        position: sticky;
        left:268px;
        z-index:1;
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
            <div>{/* Your component JSX code goes here */}</div>
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Inventory
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the Inventory Mesin
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
                <label
                  htmlFor="plant"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                  <option value="ALL">ALL</option>
                  <option value="Cutting">CUTTING</option>
                  <option value="EMB">EMB</option>
                  <option value="F1-ACCESSORY">F1-ACCESSORY</option>
                  <option value="F2-ACCESSORY">F2-ACCESSORY</option>
                  <option value="H/F">H/F</option>
                  <option value="LAMINATING">LAMINATING</option>
                  <option value="MCC">MCC</option>
                  <option value="NOSEW">NOSEW</option>
                  <option value="SABLON">SABLON</option>
                  <option value="SEWING">SEWING</option>
                  <option value="TPM">TPM</option>
                  <option value="TRANS(IR)">TRANS(IR)</option>
                  <option value="TRANS(JX)">TRANS(JX)</option>
                  <option value="TRANS(IR)">TRANS(IR)</option>
                  <option value="WAREHOUSE">WAREHOUSE</option>
 
                </select>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label
                  htmlFor="filter"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  USE SEQ?
                </label>
                <select
                  id="filter"
                  name="filter"
                  onChange={(e) => setCekSEQ(e.target.value)}
                  value={cekSEQ}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                >
                  <option value="0">Not Actived</option>
                  <option value="1">Actived</option>
                  {/* Add other factory options as needed */}
                </select>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <Combobox
                  as="div"
                  onChange={handleJXLineChange}
                  value={selectedJXLine}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    JX LINE
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={selectedJXLine}
                      displayValue={selectedJXLine}
                      onChange={(e) => handleJXLineChange(e.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {/* Option for All */}
                      <Combobox.Option
                        key="all"
                        value=""
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span
                              className={classNames(
                                "block truncate",
                                selected && "font-semibold"
                              )}
                            >
                              All
                            </span>
                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  active ? "text-white" : "text-indigo-600"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>

                      {/* Filtered options */}
                      {filteredJXLineOptions.map((JXLine) => (
                        <Combobox.Option
                          key={JXLine}
                          value={JXLine}
                          className={({ active }) =>
                            classNames(
                              "relative cursor-default select-none py-2 pl-3 pr-9",
                              active
                                ? "bg-indigo-600 text-white"
                                : "text-gray-900"
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span
                                className={classNames(
                                  "block truncate",
                                  selected && "font-semibold"
                                )}
                              >
                                {JXLine}
                              </span>
                              {selected && (
                                <span
                                  className={classNames(
                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                    active ? "text-white" : "text-indigo-600"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </div>
                </Combobox>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <Combobox
                  as="div"
                  onChange={handleMesinNameChange}
                  value={selectedMesinName}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    MACHINE TYPE
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={selectedMesinName}
                      displayValue={selectedMesinName}
                      onChange={(e) => handleMesinNameChange(e.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {/* Option for All */}
                      <Combobox.Option
                        key="all"
                        value=""
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span
                              className={classNames(
                                "block truncate",
                                selected && "font-semibold"
                              )}
                            >
                              All
                            </span>
                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  active ? "text-white" : "text-indigo-600"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>

                      {/* Filtered options */}
                      {filteredMesinNameOptions.map((MesinName) => (
                        <Combobox.Option
                          key={MesinName}
                          value={MesinName}
                          className={({ active }) =>
                            classNames(
                              "relative cursor-default select-none py-2 pl-3 pr-9",
                              active
                                ? "bg-indigo-600 text-white"
                                : "text-gray-900"
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span
                                className={classNames(
                                  "block truncate",
                                  selected && "font-semibold"
                                )}
                              >
                                {MesinName}
                              </span>
                              {selected && (
                                <span
                                  className={classNames(
                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                    active ? "text-white" : "text-indigo-600"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </div>
                </Combobox>
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
                  {` ${new Date()?.toLocaleString()}`}
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
                        {cekSEQ === "0" && (
                          <thead className="bg-slate-300">
                            <tr>
                              <th
                                scope="col"
                                rowSpan={3}
                                className="first-column py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                WORK CENTER
                              </th>
                              <th
                                scope="col"
                                rowSpan={3}
                                className="second-column px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                MACHINE TYPE
                              </th>
                              <th
                                scope="col"
                                rowSpan={3}
                                className="third-column px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                TOTAL
                              </th>
                              {data[0]?.map((item, index) => (
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  style={{
                                    backgroundColor:
                                      index % 2 === 0 ? "#374151" : "", // Memberikan background color jika index genap
                                  }}
                                >
                                  LINE {item.LINE}
                                </th>
                              ))}
                            </tr>
                            <tr>
                              {data[0]?.map((item, index) => (
                                <th
                                  className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 bg-yellow-500"
                                  style={{
                                    backgroundColor:
                                      index % 2 === 0 ? "#374151" : "", // Memberikan background color jika index genap
                                  }}
                                >
                                  {item.MODEL}
                                </th>
                              ))}
                            </tr>
                            <tr>
                              {data[0]?.map((item, index) => (
                                <th
                                  className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 bg-yellow-500"
                                  style={{
                                    backgroundColor:
                                      index % 2 === 0 ? "#374151" : "", // Memberikan background color jika index genap
                                  }}
                                >
                                  {item.GENDER}
                                </th>
                              ))}
                            </tr>
                            <tr>
                              <th
                                scope="col"
                                colSpan={2}
                                className="first-column px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                TOTAL
                              </th>
                              <th
                                scope="col"
                                className="second-column px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                {totalAllRows?.toLocaleString()}
                              </th>
                              {columns.map((columnName, index) => (
                                <th
                                  key={index}
                                  scope="col"
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
                                >
                                  {calculateColumnTotal(
                                    columnName
                                  )?.toLocaleString()}
                                </th>
                              ))}
                            </tr>
                          </thead>
                        )}
                        {cekSEQ === "1" && (
                          <thead className="bg-slate-300">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                WORK CENTER
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                LINE
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                MACHINE TYPE
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                P-CARD
                              </th>
                            </tr>
                          </thead>
                        )}
                        {updating && (
                          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <img
                              className="max-h-28 w-auto animate-bounce animate-infinite"
                              src={Logo}
                              alt="Your Company"
                            />
                          </div>
                        )}
                        {cekSEQ === "0" && (
                          <tbody className="divide-y divide-neutral-950 bg-white">
                            {data[1]?.map((item) => {
                              const totalColumnValue = columns.reduce(
                                (total, columnName) => {
                                  return total + item[columnName];
                                },
                                0
                              );

                              return (
                                <tr key={item.index}>
                                  <td className="sticky-first-row bg-gray-300 whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6">
                                    {item.WORK_CENTER}
                                  </td>
                                  <td className="sticky-second-row bg-gray-300 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                    {item.MACHINE_TYPE}
                                  </td>
                                  <td className="sticky-third-row whitespace-nowrap bg-orange-600 py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                    {totalColumnValue?.toLocaleString()}
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
                        )}
                        {cekSEQ === "1" && (
                          <tbody className="divide-y divide-neutral-950 bg-white">
                            {data[0]?.map((item) => (
                              <tr key={item.index}>
                                <td className=" whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                  {item.WORK_CENTER}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.LINE}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.MACHINE_TYPE}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.BARCODE}
                                </td>
                              </tr>
                            ))}
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

export default InventoryMesin;
