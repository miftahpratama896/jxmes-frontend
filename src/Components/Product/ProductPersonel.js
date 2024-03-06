import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/img/New Logo White.png";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const ProductPersonel = () => {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "PRODUCT",
          programName: "PRODUCT - PERSONNEL",
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

  const [data, setData] = useState(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedFilter, setSelectedFilter] = useState("1");
  const [selectedMainDept, setSelectedMainDept] = useState("TOTAL");
  const [selectedSubDept, setSelectedSubDept] = useState("TOTAL");
  const [filteredMainDeptOptions, setFilteredMainDeptOptions] = useState([]);
  const [filteredSubDeptOptions, setFilteredSubDeptOptions] = useState([]);
  const [selectedMainDept1, setSelectedMainDept1] = useState("TOTAL");
  const [filteredMainDept1Options, setFilteredMainDept1Options] = useState([]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleMainDept1Change = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedMainDept1(selectedValue);
  };

  const handleMainDeptChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedMainDept(selectedValue);
  };

  const handleSubDeptChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedSubDept(selectedValue);
  };

  const fetchData = async () => {
    try {
      setUpdating(true);
      const parsedFilter = parseInt(selectedFilter);
      let D_DEPTNAME_MAIN = selectedMainDept;

      if (parsedFilter !== 3) {
        D_DEPTNAME_MAIN = selectedMainDept1; // Ubah nilai D_DEPTNAME_MAIN jika parsedFilter bukan 3
      }

      const response = await axios.post(
        "http://172.16.200.28:3000/product-personel",
        {
          i_DATE: date,
          D_DEPTNAME_MAIN,
          D_DEPTNAME_MID: selectedSubDept,
          C_GUBUN: parsedFilter,
        }
      );
      setData(response.data.data);
    } catch (error) {
      setError("Error fetching data");
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
  }, [
    autoUpdate,
    date,
    selectedFilter,
    selectedMainDept1,
    selectedMainDept,
    selectedSubDept,
  ]);

  useEffect(() => {
    if (data) {
      const filteredData = data.filter((item) => {
        // Filter item yang DEPT-nya adalah angka
        if (!isNaN(parseInt(item.DEPT))) {
          return false;
        }
        // Filter item yang SUB DEPT-nya adalah angka
        if (!isNaN(parseInt(item["SUB DEPT"]))) {
          return false;
        }
        return true;
      });

      const uniqueMainDept1Options = [
        ...new Set(data && data.map((item) => item.HDPT_NAME)),
      ];
      setFilteredMainDept1Options(uniqueMainDept1Options);

      const uniqueMainDeptOptions = [
        ...new Set(filteredData.map((item) => item.DEPT)),
      ];
      setFilteredMainDeptOptions(uniqueMainDeptOptions);

      const uniqueSubDeptOptions = [
        ...new Set(filteredData.map((item) => item["SUB DEPT"])),
      ];
      setFilteredSubDeptOptions(uniqueSubDeptOptions);
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
         top: 49px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
         z-index: 3;
         background-color: #B84600; 
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
            <div>{/* Your component JSX code goes here */}</div>
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Product
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the Product - Personnel
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label
                  htmlFor="todayDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  WORK DATE
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
                  <option value="1">SUMMARY</option>
                  <option value="2">DETAILED</option>
                  <option value="3"> HIGHLY DETAILED</option>
                  {/* Add other factory options as needed */}
                </select>
              </div>
              {selectedFilter === "3" && (
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <Combobox
                    as="div"
                    onChange={handleMainDeptChange}
                    value={selectedMainDept}
                  >
                    <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                      MAIN DEPARTMENT
                    </Combobox.Label>
                    <div className="relative mt-2">
                      <Combobox.Input
                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={selectedMainDept}
                        displayValue={selectedMainDept}
                        onChange={(e) => handleMainDeptChange(e.target.value)}
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
                          value="TOTAL"
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
                        {filteredMainDeptOptions.map((MainDept) => (
                          <Combobox.Option
                            key={MainDept}
                            value={MainDept}
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
                                  {MainDept}
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
              )}
              {selectedFilter === "3" && (
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <Combobox
                    as="div"
                    onChange={handleSubDeptChange}
                    value={selectedSubDept}
                  >
                    <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                      SUB DEPARTMENT
                    </Combobox.Label>
                    <div className="relative mt-2">
                      <Combobox.Input
                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={selectedSubDept}
                        displayValue={selectedSubDept}
                        onChange={(e) => handleSubDeptChange(e.target.value)}
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
                          value="TOTAL"
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
                        {filteredSubDeptOptions.map((SubDept) => (
                          <Combobox.Option
                            key={SubDept}
                            value={SubDept}
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
                                  {SubDept}
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
              )}
              {selectedFilter === "1" && (
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <Combobox
                    as="div"
                    onChange={handleMainDept1Change}
                    value={selectedMainDept1}
                  >
                    <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                      MAIN DEPARTMENT
                    </Combobox.Label>
                    <div className="relative mt-2">
                      <Combobox.Input
                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={selectedMainDept1}
                        displayValue={selectedMainDept1}
                        onChange={(e) => handleMainDept1Change(e.target.value)}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Combobox.Button>

                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {/* Option for All */}

                        {/* Filtered options */}
                        {filteredMainDept1Options.map((MainDept1) => (
                          <Combobox.Option
                            key={MainDept1}
                            value={MainDept1}
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
                                  {MainDept1}
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
                        {selectedFilter !== "3" && (
                          <thead className="bg-slate-300">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                DEPARTMENT
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                TOTAL
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                TOTAL ABSEN
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                RATE
                              </th>
                            </tr>
                            {data &&
                              data.length > 0 &&
                              data[0].HDPT_NAME === "TOTAL" && (
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0].HDPT_NAME}
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0].TOTAL}
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0].TOTAL_ABSEN}
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0].RATE}%
                                  </th>
                                </tr>
                              )}
                          </thead>
                        )}
                        {selectedFilter === "3" && (
                          <thead className="bg-slate-300">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                NIK
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                NAME
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
                                FIRST DAY OF WORK
                              </th>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                DEPARTMENT
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                MID DEPARTMENT
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                SUB DEPARTMENT
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                HAML
                              </th>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                ABSENCE
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                SICKNESS
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                PERMISSION
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                LEAVE
                              </th>
                            </tr>
                            {data &&
                              data.length > 0 &&
                              data[0].ID === "TOTAL" && (
                                <tr>
                                  <th
                                    scope="col"
                                    colSpan={6}
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0].ID}
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0]["SUB DEPT"]}
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0].HAML}
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0].ABSEN}
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0].SAKIT}
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0].IJIN}
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    {data[0].CUTI}
                                  </th>
                                </tr>
                              )}
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
                        {selectedFilter !== "3" && (
                          <tbody className="divide-y divide-neutral-950 bg-white">
                            {data &&
                              data.map(
                                (item) =>
                                  // Menambahkan kondisi untuk memfilter item dengan HDPT_NAME tidak sama dengan 'TOTAL'
                                  item.HDPT_NAME !== "TOTAL" && (
                                    <tr key={item.HDPT_NAME}>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {item.HDPT_NAME}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.TOTAL}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.TOTAL_ABSEN}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.RATE}%
                                      </td>
                                    </tr>
                                  )
                              )}
                          </tbody>
                        )}
                        {selectedFilter === "3" && (
                          <tbody className="divide-y divide-neutral-950 bg-white">
                            {data &&
                              data.slice(0, 500).map(
                                (item) =>
                                  // Menambahkan kondisi untuk memfilter item dengan HDPT_NAME tidak sama dengan 'TOTAL'
                                  item.ID !== "TOTAL" && (
                                    <tr key={item.ID}>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {item.ID}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.NAME}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.SEXX}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.ENDT}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.DEPT}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item["MID DEPT"]}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item["SUB DEPT"]}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.HAML}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.ABSEN}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.SAKIT}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.IJIN}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.CUTI}
                                      </td>
                                    </tr>
                                  )
                              )}
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

export default ProductPersonel;
