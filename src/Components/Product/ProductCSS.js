import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/img/New Logo White.png";
import { Combobox, Menu, Popover, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Home', href: '#', current: true },
  { name: 'Profile', href: '#', current: false },
  { name: 'Resources', href: '#', current: false },
  { name: 'Company Directory', href: '#', current: false },
  { name: 'Openings', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

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
  const [error, setError] = useState('');
  const [numColumns, setNumColumns] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [totalAllRowsTime, setTotalAllRowsTime] = useState(0);
  const [ProdDatefrom, setProdDatefrom] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [ProdDateto, setProdDateto] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedFilter2, setSelectedFilter2] = useState("INPUT");
  const [release, setRelease] = useState('');
  const [selectedJX2Line, setSelectedJX2Line] = useState("ALL");
  const [filteredJX2LineOptions, setFilteredJX2LineOptions] = useState([]);
  const [selectedJXLine, setSelectedJXLine] = useState("ALL");
  const [filteredJXLineOptions, setFilteredJXLineOptions] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [filteredStyleOptions, setFilteredStyleOptions] = useState([]);
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState("ALL");
  const [filteredGenderOptions, setFilteredGenderOptions] = useState([]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleJX2LineChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedJX2Line(selectedValue);
  };

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

  // Fungsi untuk menangani pengiriman permintaan ke backend
  const fetchData = async () => {
    try {
      setUpdating(true);
      setError('');
      const parsedFilter = parseInt(selectedFilter);
      const sanitizedStyle = selectedStyle.replace(/-/g, "");
      // Pengiriman permintaan POST ke backend
      const response = await axios.post('http://172.16.200.28:3000/product-ccs', {
        // Masukkan data yang diperlukan
        D_DATEFROM: ProdDatefrom,
        D_DATETO: ProdDateto,
        D_JXLINE: selectedJXLine,
        D_JX2LINE: selectedJX2Line,
        D_RLS: convertedRelease,
        D_MODEL: selectedModel,
        D_SYTLE: sanitizedStyle,
        D_GENDER: selectedGender,
        CEK_RLS: 0,
        D_TYPE: selectedFilter2,
        D_SHIFT: 1,
        D_SUMMARY_LINECEK: parsedFilter
      });

      // Simpan data yang diterima ke dalam state
      setData(response.data.data);
    } catch (error) {
      setError('Error fetching data');
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
    autoUpdate, selectedFilter, ProdDatefrom,
    ProdDateto, selectedFilter2, release, selectedJX2Line, selectedJXLine,
    selectedStyle,
    selectedModel,
    selectedGender
  ]);

  const getColumnNames = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0][0]).filter((key) =>
      key.match(/^\d{2}:\d{2}$/)
    );
  };

  useEffect(() => {
    const columns = getColumnNames();
    setNumColumns(columns.length);
  }, [data[0]]); // Jika data berubah, perbaharui jumlah kolom
  const columns = getColumnNames();

  useEffect(() => {
    let total = 0;

    data[0]?.forEach((item) => {
      const totalColumnValue = columns.reduce((total, columnName) => {
        return total + item[columnName];
      }, 0);

      total += totalColumnValue;
    });

    setTotalAllRowsTime(total);
  }, [data, columns]);

  // Menghitung Total Input 1
  const totalinput1 = data[2]?.reduce((total, item) => {
    return total + item.INPUT;
  }, 0);

  // Menghitung Total Retur 1
  const totalretur1 = data[2]?.reduce((total, item) => {
    return total + item.RETUR;
  }, 0);

  // Menghitung Total Prod 1
  const totalprod1 = data[2]?.reduce((total, item) => {
    return total + item.PROD;
  }, 0);

  // Menghitung Total Output 1
  const totaloutput1 = data[2]?.reduce((total, item) => {
    return total + item.OUTPUT;
  }, 0);

  // Menghitung Total Input 2
  const totalinput2 = data[4]?.reduce((total, item) => {
    return total + item.INPUT;
  }, 0);

  // Menghitung Total Retur 2
  const totalretur2 = data[4]?.reduce((total, item) => {
    return total + item.RETUR;
  }, 0);

  // Menghitung Total Prod 2
  const totalprod2 = data[4]?.reduce((total, item) => {
    return total + item.PROD;
  }, 0);

  // Menghitung Total Output 2
  const totaloutput2 = data[4]?.reduce((total, item) => {
    return total + item.OUTPUT;
  }, 0);


  // Fungsi untuk menghitung total dari kolom tertentu
  const calculateColumnTotalTime = (columnName) => {
    // Menggunakan reduce untuk menjumlahkan nilai-nilai dalam kolom columnName
    const total = data[0].reduce((accumulator, currentItem) => {
      return accumulator + currentItem[columnName];
    }, 0);

    // Kembalikan total
    return total;
  };

  useEffect(() => {
    const uniqueJXLineOptions = [...new Set(data[0]?.map((item) => item.SCAN_LINEJX))];
    setFilteredJXLineOptions(uniqueJXLineOptions);

    const uniqueJX2LineOptions = [...new Set(data[0]?.map((item) => item.SCAN_LINEJX2))];
    setFilteredJX2LineOptions(uniqueJX2LineOptions);

    const uniqueModelOptions = [...new Set(data[0]?.map((item) => item.MODEL))];
    setFilteredModelOptions(uniqueModelOptions);

    const uniqueStyleOptions = [...new Set(data[0]?.map((item) => item.STYLE))];
    setFilteredStyleOptions(uniqueStyleOptions);

    const uniqueGenderOptions = [...new Set(data[0]?.map((item) => item.GENDER))];
    setFilteredGenderOptions(uniqueGenderOptions);

  }, [data]);

  console.log(data)
  return (
    <>
      <main className=" pb-8 py-16">
        <div className="mx-auto max-w-full px-6 lg:px-1">
          <div className="px-4 sm:px-6 lg:px-8">

            <h1 className="sr-only">Page title</h1>
            {/* Main 3 column grid */}
            <div className="sm:flex sm:items-center py-1.5 z-20">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Product
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the Product CCS
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label
                  htmlFor="yesdayDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  DATE FROM
                </label>
                <input
                  type="date"
                  id="yesdayDate"
                  name="yesdayDate"
                  value={ProdDatefrom}
                  onChange={(e) => setProdDatefrom(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                />
              </div>
              {/* Combobox for selecting Today Date */}
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label
                  htmlFor="todayDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  DATE TO
                </label>
                <input
                  type="date"
                  id="todayDate"
                  name="todayDate"
                  value={ProdDateto}
                  onChange={(e) => setProdDateto(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label
                  htmlFor="filter"
                  className="block text-sm font-medium text-gray-700"
                >
                  TYPE
                </label>
                <select
                  id="filter"
                  name="filter"
                  onChange={(e) => setSelectedFilter2(e.target.value)}
                  value={selectedFilter2}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                >
                  <option value="INPUT">INPUT</option>
                  <option value="OUTPUT">OUTPUT</option>
                  <option value="PROD">PROD</option>
                  {/* Add other factory options as needed */}
                </select>
              </div>
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
            <div className="sm:flex sm:items-center py-1.5 ">
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
                  <option value="0">SUMMARY</option>
                  <option value="1">TIME TOTAL</option>
                  {/* Add other factory options as needed */}
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
            {selectedFilter === "0" && (
              <div>
                <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
                  {/* Left column */}
                  <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                    <section aria-labelledby="section-1-title">
                      <h2 className="sr-only" id="section-1-title">
                        Section title
                      </h2>
                      <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="p-6">{/* Your content */}
                          <div className="mx-auto max-w-full px-6 lg:px-1">
                            <div className="px-4 sm:px-6 lg:px-8">

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
                                                className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                                              >
                                                JXLINE
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                STYLE
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                MODEL
                                              </th>
                                              <th
                                                scope="col"
                                                className="bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                GENDER
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                INPUT
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                PROD
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                RETUR
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900  px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                OUTPUT
                                              </th>

                                            </tr>
                                            <tr className="sticky top-12 bg-orange-700 z-10">
                                              <th
                                                scope="col"
                                                colSpan={4}
                                                className="sticky left-0 z-30 bg-orange-700 px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                              >
                                                TOTAL
                                              </th>
                                              <th
                                                scope="col"
                                                className={`bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                                              >
                                                {totalinput1?.toLocaleString()}
                                              </th>
                                              <th
                                                scope="col"
                                                className={`bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                                              >
                                                {totalprod1?.toLocaleString()}
                                              </th>
                                              <th
                                                scope="col"
                                                className={`bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                                              >
                                                {totalretur1?.toLocaleString()}
                                              </th>
                                              <th
                                                scope="col"
                                                className={`bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                                              >
                                                {totaloutput1?.toLocaleString()}
                                              </th>
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
                                            {data[2]?.map((item) => (
                                              <tr key={item.index}>
                                                <td className=" bg-gray-50 whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                                                  {item.JXLINE}
                                                </td>

                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.STYLE}
                                                </td>
                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.MODEL}
                                                </td>
                                                <td className="] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.GENDER}
                                                </td>
                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.INPUT}
                                                </td>
                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.PROD}
                                                </td>
                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.RETUR}
                                                </td>
                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.OUTPUT}
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right column */}
                  <div className="grid grid-cols-1 gap-4">
                    <section aria-labelledby="section-2-title">
                      <h2 className="sr-only" id="section-2-title">
                        Section title
                      </h2>
                      <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="p-6">{/* Your content */}
                          <div className="mx-auto max-w-full px-6 lg:px-1">
                            <div className="px-4 sm:px-6 lg:px-8">

                              <div className="mt-8 flow-root">
                                <div className="relative -mx-4 -my-2 overflow-y-scroll overflow-x-scroll sm:-mx-6 lg:-mx-8">
                                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <div className=" shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                      <div className="max-h-[70vh] max-w-full ">
                                        <table className="min-w-full divide-y divide-neutral-950 border border-slate-500 ">
                                          <thead className="bg-slate-300 ">
                                            <tr className="sticky top-0 text-white z-10 bg-gray-900 whitespace-nowrap">
                                              <th
                                                scope="col"
                                                className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                STYLE
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                MODEL
                                              </th>
                                              <th
                                                scope="col"
                                                className="bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                GENDER
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                INPUT
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                PROD
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                RETUR
                                              </th>
                                              <th
                                                scope="col"
                                                className=" bg-gray-900  px-3 py-3.5 text-center text-sm font-semibold"
                                              >
                                                OUTPUT
                                              </th>

                                            </tr>
                                            <tr className="sticky top-12 bg-orange-700 z-10">
                                              <th
                                                scope="col"
                                                colSpan={3}
                                                className="sticky left-0 z-30 bg-orange-700 px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                              >
                                                TOTAL
                                              </th>
                                              <th
                                                scope="col"
                                                className={`bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                                              >
                                                {totalinput2?.toLocaleString()}
                                              </th>
                                              <th
                                                scope="col"
                                                className={`bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                                              >
                                                {totalprod2?.toLocaleString()}
                                              </th>
                                              <th
                                                scope="col"
                                                className={`bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                                              >
                                                {totalretur2?.toLocaleString()}
                                              </th>
                                              <th
                                                scope="col"
                                                className={`bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                                              >
                                                {totaloutput2?.toLocaleString()}
                                              </th>
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
                                            {data[4]?.map((item) => (
                                              <tr key={item.index}>

                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.STYLE}
                                                </td>
                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.MODEL}
                                                </td>
                                                <td className="] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.GENDER}
                                                </td>
                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.INPUT}
                                                </td>
                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.PROD}
                                                </td>
                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.RETUR}
                                                </td>
                                                <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                                  {item.OUTPUT}
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow mx-auto max-w-full px-6 py-3 lg:px-1">
                  <div className="px-4 sm:px-6 lg:px-8">

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
                                      className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                                    >
                                      JX LINE
                                    </th>
                                    <th
                                      scope="col"
                                      className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                    >
                                      JX2 LINE
                                    </th>
                                    <th
                                      scope="col"
                                      className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                    >
                                      RELEASE
                                    </th>
                                    <th
                                      scope="col"
                                      className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                    >
                                      STYLE
                                    </th>
                                    <th
                                      scope="col"
                                      className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                    >
                                      MODEL
                                    </th>
                                    <th
                                      scope="col"
                                      className="bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                    >
                                      GENDER
                                    </th>
                                    <th
                                      scope="col"
                                      className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                    >
                                      TOTAL
                                    </th>
                                    {columns.map((columnName, index) => (
                                      <th
                                        key={index}
                                        scope="col"
                                        className="px-3 py-3.5 text-center text-sm font-semibold"
                                      >
                                        {columnName}
                                      </th>
                                    ))}
                                  </tr>
                                  <tr className="sticky top-12 bg-orange-700 z-10">
                                    <th
                                      scope="col"
                                      colSpan={6}
                                      className="sticky left-0 z-30 bg-orange-700 px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                    >
                                      TOTAL
                                    </th>
                                    <th
                                      scope="col"
                                      className={`bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                                    >
                                      {totalAllRowsTime.toLocaleString()}
                                    </th>
                                    {columns.map((columnName, index) => (
                                      <th
                                        key={index}
                                        scope="col"
                                        className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
                                      >
                                        {calculateColumnTotalTime(
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
                                  {data[0]?.map((item) => {
                                    const totalColumnValue = columns.reduce(
                                      (total, columnName) => {
                                        return total + item[columnName];
                                      },
                                      0
                                    );

                                    return (
                                      <tr key={item.index}>
                                        <td className=" bg-gray-50 whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                                          {item.SCAN_LINEJX}
                                        </td>

                                        <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                          {item.SCAN_LINEJX2}
                                        </td>
                                        <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                          {item.RLS}
                                        </td>
                                        <td className="] bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                          {item.STYLE}
                                        </td>
                                        <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                          {item.MODEL}
                                        </td>
                                        <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                          {item.GENDER}
                                        </td>
                                        <td
                                          className={` bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center text-gray-900 font-medium`}
                                        >
                                          {totalColumnValue.toLocaleString()}
                                        </td>
                                        {columns.map((columnName) => (
                                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
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
              </div>
            )}
            {selectedFilter === "1" && (
              <div className="overflow-hidden rounded-lg bg-white shadow mx-auto max-w-full px-6 py-3 lg:px-1">
                <div className="px-4 sm:px-6 lg:px-8">

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
                                    className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                                  >
                                    JX LINE
                                  </th>
                                  <th
                                    scope="col"
                                    className=" bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                                  >
                                    TOTAL
                                  </th>
                                  {columns.map((columnName, index) => (
                                    <th
                                      key={index}
                                      scope="col"
                                      className="px-3 py-3.5 text-center text-sm font-semibold"
                                    >
                                      {columnName}
                                    </th>
                                  ))}

                                </tr>
                                <tr className="sticky top-12 bg-orange-700 z-10">
                                  <th
                                    scope="col"
                                    className="sticky left-0 z-30 bg-orange-700 px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                    TOTAL
                                  </th>
                                  <th
                                    scope="col"
                                    className={`bg-orange-700 px-3 py-3.5 z-10 text-center text-sm font-semibold text-gray-900  sm:pl-6`}
                                  >
                                    {totalAllRowsTime.toLocaleString()}
                                  </th>
                                  {columns.map((columnName, index) => (
                                    <th
                                      key={index}
                                      scope="col"
                                      className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
                                    >
                                      {calculateColumnTotalTime(
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
                                {data[0]?.map((item) => {
                                  const totalColumnValue = columns.reduce(
                                    (total, columnName) => {
                                      return total + item[columnName];
                                    },
                                    0
                                  );

                                  return (
                                    <tr key={item.index}>
                                      <td className=" bg-gray-50 whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                                        {item.SCAN_LINEJX2}
                                      </td>
                                      <td
                                        className={` bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center text-gray-900 font-medium`}
                                      >
                                        {totalColumnValue.toLocaleString()}
                                      </td>
                                      {columns.map((columnName) => (
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
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
            )}
          </div>
        </div>

      </main>

    </>
  );
}

export default ProductCSS;
