import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import Logo from "../../assets/img/New Logo White.png";

const ProductLaminating = () => {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "PRODUCT",
          programName: "PRODUCT - LAMINATING",
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
  const [release, setRelease] = useState(" ");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [filteredStyleOptions, setFilteredStyleOptions] = useState([]);
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);
  const [selectedPart, setSelectedPart] = useState("");
  const [filteredPartOptions, setFilteredPartOptions] = useState([]);
  const [selectedMesin, setSelectedMesin] = useState("");
  const [filteredMesinOptions, setFilteredMesinOptions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [filteredTypeOptions, setFilteredTypeOptions] = useState([]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleStyleChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedStyle(selectedValue);
  };

  const handleModelChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedModel(selectedValue);
  };

  const handlePartChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedPart(selectedValue);
  };

  const handleMesinChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedMesin(selectedValue);
  };

  const handleTypeChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedType(selectedValue);
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

  // Mendapatkan hari ini dalam bentuk hari dalam seminggu (0 untuk Minggu, 1 untuk Senin, dst.)
  const currentDayOfWeek = currentDate.getDay();

  // Menghitung selisih hari yang diperlukan untuk mencapai hari Minggu (jika hari ini sudah Minggu, selisihnya akan menjadi 0)
  const diffToNextSunday = 7 - currentDayOfWeek;

  // Menambahkan selisih hari ke tanggal hari ini untuk mendapatkan tanggal hari Minggu berikutnya
  const nextSunday = new Date(currentDate);
  nextSunday.setDate(currentDate.getDate() + diffToNextSunday);

  // Mengonversi tanggal ke format "YYYY-MM-DD"
  const nextSundayISOString = nextSunday.toISOString().split("T")[0];

  // Set nilai default untuk releaseTo
  const [releaseTo, setReleaseTo] = useState(nextSundayISOString);

  const [dateFrom, setDateFrom] = useState(formatDate(currentDate));

  // Menetapkan dateTo ke tanggal hari ini
  const [dateTo, setDateTo] = useState(formatDate(currentDate));

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
  const convertedReleaseTo = convertToCustomFormat(releaseTo);

  const fetchData = async () => {
    try {
      setUpdating(true);
      const sanitizedStyle = selectedStyle.replace(/-/g, "");
      const response = await axios.post(
        "http://172.16.200.28:3000/product-laminating",
        {
          L_QRCODE: "140124DX37051024K024010810240701010",
          L_PRODATE: dateFrom,
          L_RLS: convertedRelease,
          L_STYLE: sanitizedStyle,
          L_PROCESS: "",
          L_PARTCODE: "",
          L_MESINNAME: selectedMesin,
          L_MESINNO: "",
          L_QTY: "0",
          L_STATUS: "",
          L_TYPE: selectedType,
          L_CEK: 6,
          L_TO_RLS: convertedReleaseTo,
          L_MODEL: selectedModel,
          L_PARTNAME: selectedPart,
          L_TODATE: dateTo,
          L_QTY_CEK: 1,
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
    release,
    selectedPart,
    releaseTo,
    selectedStyle,
    selectedModel,
    selectedMesin,
    selectedType,
  ]);

  useEffect(() => {
    const uniqueModelOptions = [...new Set(data.map((item) => item.MODEL))];
    setFilteredModelOptions(uniqueModelOptions);

    const uniqueStyleOptions = [...new Set(data.map((item) => item.STYLE))];
    setFilteredStyleOptions(uniqueStyleOptions);

    const uniqueMesinOptions = [
      ...new Set(data.map((item) => item.L_MESINNAME)),
    ];
    setFilteredMesinOptions(uniqueMesinOptions);

    const uniquePartOptions = [...new Set(data.map((item) => item.PART_NAME))];
    setFilteredPartOptions(uniquePartOptions);

    const uniqueTypeOptions = [...new Set(data.map((item) => item.L_TYPE))];
    setFilteredTypeOptions(uniqueTypeOptions);
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
         top: 48px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
         background-color: #FA7625;
         z-index: 3;
       }
        .table-container {
          max-height: 130vh;
          max-width: 200vh;
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
                  A list of all the Product Laminating
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
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  RELEASE TO
                </label>
                <input
                  type="date"
                  value={releaseTo}
                  onChange={(e) => setReleaseTo(e.target.value)}
                  className="W-full z-10 mt-1 rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  onClick={() => setReleaseTo("")} // Mengatur release menjadi string kosong saat tombol diklik
                  className="mt-2 px-4 py-1 sm:ml-4 rounded-md bg-gray-700 text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Clear Release To
                </button>
              </div>
            </div>
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto"></div>
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
                  onChange={handlePartChange}
                  value={selectedPart}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    PART
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={selectedPart}
                      displayValue={selectedPart}
                      onChange={(e) => handlePartChange(e.target.value)}
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
                      {filteredPartOptions.map((Part) => (
                        <Combobox.Option
                          key={Part}
                          value={Part}
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
                                {Part}
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
                  onChange={handleMesinChange}
                  value={selectedMesin}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    MESIN
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={selectedMesin}
                      displayValue={selectedMesin}
                      onChange={(e) => handleMesinChange(e.target.value)}
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
                      {filteredMesinOptions.map((Mesin) => (
                        <Combobox.Option
                          key={Mesin}
                          value={Mesin}
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
                                {Mesin}
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
                  onChange={handleTypeChange}
                  value={selectedType}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    TYPE
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={selectedType}
                      displayValue={selectedType}
                      onChange={(e) => handleTypeChange(e.target.value)}
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
                      {filteredTypeOptions.map((Type) => (
                        <Combobox.Option
                          key={Type}
                          value={Type}
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
                                {Type}
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
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <div className="table-container">
                      <table className="min-w-full divide-y divide-neutral-950 sticky-header border border-slate-500 ">
                        <thead className="bg-slate-300">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              DATE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              CATEGORY
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              RELEASE
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
                              PART NAME
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              MAT NAME
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              MAT COLOR
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              MESIN NAME
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              MESIN NO
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              TYPE
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              QTY
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
                          {data?.map((item) => (
                            <tr key={item.index}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm font-medium text-gray-900 sm:pl-6">
                                {new Date(item.PROD_DATE)
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  })
                                  .replace(/\//g, "-")}{" "}
                                {new Date(item.PROD_DATE).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.L_STATUS}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.L_RLS}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.STYLE}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.MODEL}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.GEN}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.PART_NAME}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.MAT?.split(" ").length > 4
                                  ? item.MAT?.split(" ").map((word, index) => (
                                      <React.Fragment key={index}>
                                        {index > 0 && index % 4 === 0 && <br />}{" "}
                                        {/* Tambahkan baris baru setelah setiap 4 kata */}
                                        {word}{" "}
                                      </React.Fragment>
                                    ))
                                  : item.MAT}
                              </td>

                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.COLOR?.split(" ").length > 2
                                  ? item.COLOR?.split(" ").map(
                                      (word, index) => (
                                        <React.Fragment key={index}>
                                          {index > 0 && index % 2 === 0 && (
                                            <br />
                                          )}{" "}
                                          {/* Tambahkan baris baru setelah setiap 3 kata */}
                                          {word}{" "}
                                        </React.Fragment>
                                      )
                                    )
                                  : item.COLOR}
                              </td>

                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.L_MESINNAME}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.L_MESINNO}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.L_TYPE}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.QTY}
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
      </main>
    </>
  );
};

export default ProductLaminating;
