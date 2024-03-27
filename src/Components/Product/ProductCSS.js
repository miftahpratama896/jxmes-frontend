import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/img/New Logo White.png";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function ProductCSS() {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "PRODUCT",
          programName: "PRODUCT - CCS",
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
  const [selectedJXLine, setSelectedJXLine] = useState("ALL");
  const [selectedJX2Line, setSelectedJX2Line] = useState("ALL");
  const [filteredJXLineOptions, setFilteredJXLineOptions] = useState([]);
  const [filteredJX2LineOptions, setFilteredJX2LineOptions] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [filteredStyleOptions, setFilteredStyleOptions] = useState([]);
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState("ALL");
  const [filteredGenderOptions, setFilteredGenderOptions] = useState([]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const handleJXLineChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedJXLine(selectedValue);
  };

  const handleJX2LineChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedJX2Line(selectedValue);
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

  const [release, setRelease] = useState("");
  const convertedReleaseTo = convertToCustomFormat(release);

  console.log(convertedReleaseTo);

  const fetchData = async () => {
    setUpdating(true);

    try {
      const sanitizedStyle = selectedStyle.replace(/-/g, "");
      const response = await axios.post(
        "http://172.16.200.28:3000/product-css",
        {
          dateFrom: dateFrom,
          dateTo: dateTo,
          jxLine: selectedJXLine,
          jx2Line: selectedJX2Line,
          rls: convertedReleaseTo,
          model: selectedModel,
          style: sanitizedStyle,
          gender: selectedGender,
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
  }, [
    autoUpdate,
    dateFrom,
    dateTo,
    release,
    selectedJX2Line,
    selectedJXLine,
    selectedStyle,
    selectedModel,
    selectedGender,
  ]);

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

  useEffect(() => {
    const uniqueJXLineOptions = [...new Set(data?.map((item) => item.SCAN_LINEJX)),
    ];
    setFilteredJXLineOptions(uniqueJXLineOptions);

    const uniqueJX2LineOptions = [...new Set(data?.map((item) => item.SCAN_LINEJX2)),
    ];
    setFilteredJX2LineOptions(uniqueJX2LineOptions);

    const uniqueModelOptions = [...new Set(data?.map((item) => item.MODEL))];
    setFilteredModelOptions(uniqueModelOptions);

    const uniqueStyleOptions = [...new Set(data?.map((item) => item.STYLE))];
    setFilteredStyleOptions(uniqueStyleOptions);

    const uniqueGenderOptions = [...new Set(data?.map((item) => item.GENDER))];
    setFilteredGenderOptions(uniqueGenderOptions);
  }, [data]);

  console.log(data);

  return (
    <>
      <main className="py-12">
        <div className="mx-auto max-w-full px-6 lg:px-1">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center py-3 z-20">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Product
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the Product CCS
                </p>
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
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  RELEASE FROM
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
                  Clear Release From
                </button>
              </div>
            </div>

            <div className="sm:flex sm:items-center py-3 ">
              <div className="sm:flex-auto"></div>
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

                    <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                  onChange={handleJX2LineChange}
                  value={selectedJX2Line}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    JX2 LINE
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={selectedJX2Line}
                      displayValue={selectedJX2Line}
                      onChange={(e) => handleJX2LineChange(e.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                      {filteredJX2LineOptions.map((JX2Line) => (
                        <Combobox.Option
                          key={JX2Line}
                          value={JX2Line}
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
                                {JX2Line}
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

                    <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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

                    <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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

                    <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                          <tr className="sticky top-12 z-10 bg-orange-700 whitespace-nowrap">
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
