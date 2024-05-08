import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import Logo from "../../assets/img/New Logo White.png";

const ProductDetail = () => {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "PRODUCT",
          programName: "PRODUCT - DETAIL;",
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
  const [selectedFactory, setSelectedFactory] = useState("ALL");
  const [selectedWC, setSelectedWC] = useState("Cutting");
  const [totalAllRows, setTotalAllRows] = useState(0);
  const [numColumns, setNumColumns] = useState(0);
  const [selectedJXLine, setSelectedJXLine] = useState("ALL");
  const [filteredJXLineOptions, setFilteredJXLineOptions] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [filteredStyleOptions, setFilteredStyleOptions] = useState([]);
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState("ALL");
  const [filteredGenderOptions, setFilteredGenderOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [release, setRelease] = useState(" ");

  // Format tanggal ke format YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // Mendapatkan tanggal sekarang
  const currentDate = new Date();

  // Menetapkan dateFrom ke hari Minggu berikutnya dengan tanggal hari ini
  const nextSunday = new Date(currentDate);
  const [dateFrom, setDateFrom] = useState(formatDate(nextSunday));

  // Menetapkan dateTo ke tanggal hari ini
  const [dateTo, setDateTo] = useState(formatDate(nextSunday));

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleJXLineChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedJXLine(selectedValue);
  };

  const handleStyleChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedStyle(selectedValue);
  };

  const handleModelChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedModel(selectedValue);
  };
  const handleGenderChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedGender(selectedValue);
  };

  const convertToCustomFormat = (dateString) => {
    if (dateString.trim() === "") {
      return ""; // Jika release adalah string kosong, kembalikan string kosong
    }

    const dateObj = new Date(dateString);
    const year = String(dateObj.getFullYear()).slice(-2);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${day}${month}${year}`;
  };
  const convertedRelease = convertToCustomFormat(release);

  const fetchData = async () => {
    try {
      setUpdating(true);
      const sanitizedStyle = selectedStyle.replace(/-/g, "");
      const response = await axios.get(
        "http://172.16.200.28:3000/product-detail",
        {
          params: {
            DATEFROM: dateFrom,
            DATETO: dateTo,
            WC: selectedWC,
            TYPE: selectedFilter,
            SCAN_LINE: selectedJXLine,
            RLS: convertedRelease,
            STYLE_NAME: selectedModel,
            STYLE: sanitizedStyle,
            GENDER: selectedGender,
            C_CEK: 0,
            PLANT: selectedFactory,
          },
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
  }, [
    autoUpdate,
    dateFrom,
    dateTo,
    selectedWC,
    selectedFactory,
    selectedJXLine,
    selectedStyle,
    selectedModel,
    selectedGender,
    selectedFilter,
    release,
  ]);

  const getColumnNames = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0][0]).filter((key) => key.match(/^S\d{2}$/));
  };

  useEffect(() => {
    const columns = getColumnNames();
    setNumColumns(columns.length);
  }, [data]); // Jika data berubah, perbaharui jumlah kolom
  const columns = getColumnNames();

  // Fungsi untuk menghitung total dari kolom tertentu
  const calculateColumnTotal = (columnName) => {
    // Menggunakan reduce untuk menjumlahkan nilai-nilai dalam kolom columnName
    const total = data[0].reduce((accumulator, currentItem) => {
      return accumulator + currentItem[columnName];
    }, 0);

    // Kembalikan total
    return total;
  };

  useEffect(() => {
    let total = 0;

    data[0]?.forEach((item) => {
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
        ...new Set(data[0]?.map((item) => item.SCAN_CELL)),
      ];
      setFilteredJXLineOptions(uniqueJXLineOptions);

      const uniqueModelOptions = [
        ...new Set(data[0]?.map((item) => item.STYLE_NAME)),
      ];
      setFilteredModelOptions(uniqueModelOptions);

      const uniqueStyleOptions = [
        ...new Set(data[0]?.map((item) => item.STYLE)),
      ];
      setFilteredStyleOptions(uniqueStyleOptions);

      const uniqueGenderOptions = [
        ...new Set(data[0]?.map((item) => item.GENDER)),
      ];
      setFilteredGenderOptions(uniqueGenderOptions);
    }
  }, [data]);

  console.log(data);

  return (
    <>
      <main className="py-12">
        <div className="mx-auto max-w-full px-6 lg:px-1">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <div className="smt-4 sm:mt-0 sm:ml-4">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">
                    Product
                  </h1>
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all the Product - Detail
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  DATE FROM
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
                  DATE TO
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
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
                    if (e.target.value === "Cutting") {
                      setSelectedJXLine("ALL");
                    }
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
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    TYPE
                  </label>
                  <select
                    id="filter"
                    name="filter"
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    value={selectedFilter}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  >
                    <option value="">ALL</option>
                    <option value="INPUT">INPUT</option>
                    <option value="OUTPUT">OUTPUT</option>
                    {/* Add other factory options as needed */}
                  </select>
                </div>
              )}
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  RELEASE
                </label>
                <input
                  type="date"
                  value={release}
                  onChange={(e) => setRelease(e.target.value)}
                  className="W-full z-10 mt-1 rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  onClick={() => setRelease("")} // Mengatur release menjadi string kosong saat tombol diklik
                  className="mt-2 px-4 py-1 sm:ml-4 rounded-md bg-gray-700 text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Clear Release
                </button>
              </div>
            </div>

            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto"></div>
              {selectedWC !== "Cutting" && (
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
              )}

              <div className="mt-4 sm:mt-0 sm:ml-4">
                <Combobox
                  as="div"
                  onChange={handleStyleChange}
                  value={selectedStyle}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    STYLE
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={selectedStyle}
                      displayValue={selectedStyle}
                      onChange={(e) => handleStyleChange(e.target.value)}
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
                      {filteredStyleOptions.map((style) => (
                        <Combobox.Option
                          key={style}
                          value={style}
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
                                {style}
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
                  onChange={handleModelChange}
                  value={selectedModel}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    MODEL
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={selectedModel}
                      displayValue={selectedModel}
                      onChange={(e) => handleModelChange(e.target.value)}
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
                      {filteredModelOptions.map((model) => (
                        <Combobox.Option
                          key={model}
                          value={model}
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
                                {model}
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
                  onChange={handleGenderChange}
                  value={selectedGender}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    GENDER
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={selectedGender}
                      displayValue={selectedGender}
                      onChange={(e) => handleGenderChange(e.target.value)}
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
                        value="ALL"
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
                      {filteredGenderOptions.map((Gender) => (
                        <Combobox.Option
                          key={Gender}
                          value={Gender}
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
                                {Gender}
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
                    <div className="max-h-screen max-w-screen ">
                      <table className="min-w-full divide-y divide-neutral-950 border border-slate-500 ">
                        <thead className="bg-slate-300 ">
                          <tr className="sticky top-0 text-white z-20 whitespace-nowrap">
                            <th
                              scope="col"
                              rowSpan={6}
                              className="sticky left-0 top-0 bg-gray-900  py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                            >
                              SCAN DATE
                            </th>
                            <th
                              scope="col"
                              rowSpan={6}
                              className="sticky left-[109px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              PLANT
                            </th>
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[176px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                LINE
                              </th>
                            )}
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[176px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                JX LINE
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[229px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                JX LINE
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[300px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                WORK CENTER
                              </th>
                            )}
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[247px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                WORK CENTER
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[419px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                TYPE
                              </th>
                            )}
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[366px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                TYPE
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[493px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                RELEASE
                              </th>
                            )}
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[426px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                RELEASE
                              </th>
                            )}
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[501px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                STYLE
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[572px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                STYLE
                              </th>
                            )}
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[598px] top-0 bg-gray-900  px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                MODEL
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[669px] top-0 bg-gray-900  px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                MODEL
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[859px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                GENDER
                              </th>
                            )}
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                rowSpan={6}
                                className="sticky left-[783px] top-0 bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              >
                                GENDER
                              </th>
                            )}
                          </tr>
                          <tr className="sticky top-0 bg-yellow-300 z-10">
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                className="sticky left-[860px] z-50 bg-yellow-300 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                              >
                                TD
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                className="sticky left-[935px] z-50 bg-yellow-300 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                              >
                                TD
                              </th>
                            )}
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              2
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              3
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              4
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              5
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              6
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              7
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              8
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              9
                            </th>
                            <th
                              scope="col"
                              colSpan={14}
                              className="px-3 py-3.5 text-left text-sm font-semibold"
                            >
                              10
                            </th>
                          </tr>
                          <tr className="sticky top-12 bg-red-300 z-10">
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                className="sticky left-[860px] z-50 bg-red-300 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                              >
                                GS
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                className="sticky left-[935px] z-50 bg-red-300 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                              >
                                GS
                              </th>
                            )}
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              1
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              1T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              2
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              2T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              3
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              3T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              4
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              4T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              5
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              5T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              6
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              6T
                            </th>
                            <th
                              scope="col"
                              colSpan={10}
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              7
                            </th>
                          </tr>
                          <tr className="sticky top-24 bg-blue-300 z-10">
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                className="sticky left-[860px] z-50 bg-blue-300 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                              >
                                PS
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                className="sticky left-[935px] z-50 bg-blue-300 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                              >
                                PS
                              </th>
                            )}
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              1
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              1T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              2
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              2T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              3
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              8
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              8T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              9
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              9T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              10
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              10T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              11
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              11T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              12
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              12T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              13
                            </th>
                            <th
                              scope="col"
                              colSpan={6}
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              13T
                            </th>
                          </tr>
                          <tr className="sticky top-36 bg-green-300 z-10">
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                className="sticky left-[860px] z-50 bg-green-300 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                              >
                                WO
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                className="sticky left-[935px] z-50 bg-green-300 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                              >
                                WO
                              </th>
                            )}
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              5
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              5T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              6
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              6T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              7
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              7T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              8
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              8T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              9
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              9T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              10
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              10T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              11
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              11T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              12
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              12T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              13
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              13T
                            </th>
                            <th
                              scope="col"
                              colSpan={4}
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              14
                            </th>
                          </tr>
                          <tr className="sticky top-48 bg-purple-300 z-10">
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                className="sticky left-[860px] z-50 bg-purple-300 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                              >
                                ME
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                className="sticky left-[935px] z-50 bg-purple-300 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                              >
                                ME
                              </th>
                            )}
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              3T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              4
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              4T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              5
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              5T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              6
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              6T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              7
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              7T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              8
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              8T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              9
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              9T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              10
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              10T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              11
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              11T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              12
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              12T
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              13
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              14
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              15
                            </th>
                          </tr>
                          <tr className="sticky top-60 bg-orange-700 z-10">
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                colSpan={selectedWC !== "Cutting" ? 10 : 9}
                                className="sticky left-0 z-30  bg-orange-700 px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                TOTAL
                              </th>
                            )}
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                colSpan={selectedWC !== "Cutting" ? 10 : 9}
                                className="sticky left-0 z-30  bg-orange-700 px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                              >
                                TOTAL
                              </th>
                            )}
                            {selectedWC === "Cutting" && (
                              <th
                                scope="col"
                                className={`sticky left-[860px] z-50 bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                              >
                                {totalAllRows.toLocaleString()}
                              </th>
                            )}
                            {selectedWC !== "Cutting" && (
                              <th
                                scope="col"
                                className={`sticky left-[935px] z-50 bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                              >
                                {totalAllRows.toLocaleString()}
                              </th>
                            )}
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
                          {data[0]?.map((item, index) => {
                            const totalColumnValue = columns.reduce(
                              (total, columnName) => {
                                return total + item[columnName];
                              },
                              0
                            );

                            return (
                              <tr key={index}>
                                <td className="sticky left-0 bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900">
                                  {new Date(item.SCAN_DATE)
                                    .toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    })
                                    .replace(/\//g, "-")}
                                </td>

                                <td className="sticky left-[109px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                  {item.PLANT}
                                </td>
                                {selectedWC !== "Cutting" && (
                                  <td className="sticky left-[176px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.SCAN_CELL}
                                  </td>
                                )}
                                {selectedWC === "Cutting" && (
                                  <td className="sticky left-[176px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.JX_CELL}
                                  </td>
                                )}
                                {selectedWC !== "Cutting" && (
                                  <td className="sticky left-[229px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.JX_CELL}
                                  </td>
                                )}
                                {selectedWC === "Cutting" && (
                                  <td className="sticky left-[247px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.POPD_OPCD}
                                  </td>
                                )}
                                {selectedWC !== "Cutting" && (
                                  <td className="sticky left-[300px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.POPD_OPCD}
                                  </td>
                                )}
                                {selectedWC === "Cutting" && (
                                  <td className="sticky left-[366px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.TYPE}
                                  </td>
                                )}
                                {selectedWC !== "Cutting" && (
                                  <td className="sticky left-[419px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.TYPE}
                                  </td>
                                )}
                                {selectedWC === "Cutting" && (
                                  <td className="sticky left-[426px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.RELEASE}
                                  </td>
                                )}
                                {selectedWC !== "Cutting" && (
                                  <td className="sticky left-[493px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.RELEASE}
                                  </td>
                                )}
                                {selectedWC === "Cutting" && (
                                  <td className="sticky left-[501px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.STYLE}
                                  </td>
                                )}
                                {selectedWC !== "Cutting" && (
                                  <td className="sticky left-[572px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.STYLE}
                                  </td>
                                )}
                                {selectedWC === "Cutting" && (
                                  <td className="sticky left-[598px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.STYLE_NAME}
                                  </td>
                                )}
                                {selectedWC !== "Cutting" && (
                                  <td className="sticky left-[669px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.STYLE_NAME}
                                  </td>
                                )}
                                {selectedWC === "Cutting" && (
                                  <td className="sticky left-[783px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.GENDER}
                                  </td>
                                )}
                                {selectedWC !== "Cutting" && (
                                  <td className="sticky left-[859px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900">
                                    {item.GENDER}
                                  </td>
                                )}
                                {selectedWC === "Cutting" && (
                                  <td
                                    className={`sticky left-[860px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium`}
                                  >
                                    {totalColumnValue.toLocaleString()}
                                  </td>
                                )}
                                {selectedWC !== "Cutting" && (
                                  <td
                                    className={`sticky left-[935px] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium`}
                                  >
                                    {totalColumnValue.toLocaleString()}
                                  </td>
                                )}
                                {columns.map((columnName, columnIndex) => (
                                  <td
                                    key={columnIndex}
                                    className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${
                                      item.GENDER === "WO"
                                        ? "bg-green-300"
                                        : item.GENDER === "TD"
                                        ? "bg-yellow-300"
                                        : item.GENDER === "GS"
                                        ? "bg-red-300"
                                        : item.GENDER === "PS"
                                        ? "bg-blue-300"
                                        : item.GENDER === "ME"
                                        ? "bg-purple-300"
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
};

export default ProductDetail;
