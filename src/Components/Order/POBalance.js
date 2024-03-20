import { Fragment, useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import Logo from "../../assets/img/New Logo White.png";
import Modal from "react-modal";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

function NotFound() {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "ORDER TRACKING",
          programName: "PO BALANCE",
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
  const [error, setError] = useState(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedPO, setSelectedPO] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [filteredPOptions, setFilteredPOptions] = useState([]);
  const [filteredStyleOptions, setFilteredStyleOptions] = useState([]);
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handlePOChange = (selectedValue) => {
    // Update the state with the selected POs
    setSelectedPO(selectedValue);
  };

  const handleStyleChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedStyle(selectedValue);
  };

  const handleModelChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedModel(selectedValue);
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
  nextSunday.setDate(currentDate.getDate() + (7 - currentDate.getDay())); // Menggeser tanggal ke hari Minggu berikutnya
  const [dateFrom, setDateFrom] = useState(formatDate(nextSunday));

  // Menetapkan dateTo ke tanggal hari ini
  const [dateTo, setDateTo] = useState(formatDate(nextSunday));

  const convertToCustomFormat = (dateString) => {
    const dateObj = new Date(dateString);
    const year = String(dateObj.getFullYear()).slice(-2);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${day}${month}${year}`;
  };
  const convertedDateFrom = convertToCustomFormat(dateFrom);
  const convertedDateTo = convertToCustomFormat(dateTo);

  // Fungsi untuk mengambil data dari backend
  const fetchData = async () => {
    const sanitizedStyle = selectedStyle.replace(/-/g, "");
    try {
      setUpdating(true);
      const response = await axios.post(
        "http://172.16.200.28:3000/po-balance",
        {
          FROM_RLS: convertedDateFrom,
          TO_RLS: convertedDateTo,
          PO: selectedPO,
          STYLE: sanitizedStyle,
          MODEL: selectedModel,
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please try again later.");
    } finally {
      setUpdating(false);
    }
  };

  const [data_2, setData_2] = useState([]);
  const [jxline, setJXLINE] = useState("22");
  const [wc, setWC] = useState("CUT");
  const [rls, setRLS] = useState("170324");
  const [po, setPO] = useState("4510018569040");
  const [style, setSTYLE] = useState("DM0951-001");
  const [assyin, setASSY_INPUT] = useState("2024-03-15");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [numColumns, setNumColumns] = useState(0);

  const cancelButtonRef = useRef(null);

  const fetchData_2 = async () => {
    try {
      setUpdating(true);
      // Ganti URL dengan URL endpoint backend Anda
      const response_2 = await axios.post(
        "http://172.16.200.28:3000/po-balance-modal",
        {
          JXLINE: jxline,
          WC: wc,
          RLS: rls,
          PO: po,
          STYLE: style,
          ASSY_INPUT: assyin,
          D_SIZE: "",
          CEK_GUBUN: 0,
        }
      );
      setData_2(response_2.data.data);
    } catch (error) {
      setError("Error fetching data");
    }
  };

  // Mengambil data saat komponen dimount dan mengatur interval untuk auto update
  useEffect(() => {
    let intervalId;

    const fetchDataAndInterval = async () => {
      fetchData();
      fetchData_2();

      intervalId = setInterval(() => {
        fetchData_2();
        fetchData();
      }, 30000);
    };

    if (autoUpdate) {
      fetchDataAndInterval();
    } else {
      fetchData_2();
      fetchData();
    }

    // Membersihkan interval pada unmount atau saat dependencies berubah
    return () => clearInterval(intervalId);
  }, [
    autoUpdate,
    dateTo,
    dateFrom,
    selectedPO,
    selectedStyle,
    selectedModel,
    jxline,
    wc,
    rls,
    po,
    style,
    assyin,
  ]);

  const getColumnNames = () => {
    if (data_2.length === 0) return [];
    const columnNames = Object.keys(data_2[0]);
    const numericColumns = columnNames.filter((key) => key.match(/^\d+$/));
    const numericTColumns = columnNames.filter((key) => key.match(/^\d+T$/));

    // Mengurutkan kolom numerik dan kolom T secara terpisah
    numericColumns.sort((a, b) => parseInt(a) - parseInt(b));
    numericTColumns.sort((a, b) => parseInt(a) - parseInt(b));

    const combinedColumns = [];

    // Menambahkan kolom dengan angka saja
    for (let i = 0; i < numericColumns.length; i++) {
      combinedColumns.push(numericColumns[i]);
      // Menambahkan kolom dengan angka dan "T" jika ada
      const correspondingTColumn = numericTColumns.find(
        (col) => col === `${numericColumns[i]}T`
      );
      if (correspondingTColumn) combinedColumns.push(correspondingTColumn);
    }

    // Menambahkan kolom dengan "T" yang tidak memiliki pasangan angka
    for (let i = 0; i < numericTColumns.length; i++) {
      if (!combinedColumns.includes(numericTColumns[i])) {
        combinedColumns.push(numericTColumns[i]);
      }
    }

    return combinedColumns;
  };

  useEffect(() => {
    if (data_2.length > 0 && data_2[0]) {
      const columns = getColumnNames();
      setNumColumns(columns.length);
    }
  }, [data_2]);

  const columns = getColumnNames();

  useEffect(() => {
    const uniquePOOptions = [...new Set(data?.map((item) => item.PO))];
    setFilteredPOptions(uniquePOOptions);
  }, [data, data_2]);

  useEffect(() => {
    const uniqueModelOptions = [...new Set(data?.map((item) => item.MODEL))];
    setFilteredModelOptions(uniqueModelOptions);
  }, [data, data_2]);

  useEffect(() => {
    const uniqueStyleOptions = [...new Set(data?.map((item) => item.STYLE))];
    setFilteredStyleOptions(uniqueStyleOptions);
  }, [data, data_2]);

  const calculateSPKTotal = () =>
    data?.reduce((total, item) => total + (item.SPK || 0), 0);
  const calculateCuttingTotal = () =>
    data?.reduce((total, item) => total + (item.PROD_CUT || 0), 0);
  const calculateSewingTotal = () =>
    data?.reduce((total, item) => total + (item.PROD_SEW || 0), 0);
  const calculateWhOutputTotal = () =>
    data?.reduce((total, item) => total + (item.PROD_ASP || 0), 0);
  const calculateWhInputTotal = () =>
    data?.reduce((total, item) => total + (item.PROD_ASPIN || 0), 0);

  console.log("Data 1:", data);
  console.log("Data 2:", data_2);

  return (
    <>
      <style>
        {`
        /* CSS Styles */
        .sticky-header thead th {
          position: sticky;
          top: 0;
          
          z-index: 1;
          
        }
        .sticky-header th,
        .sticky-header td {
          white-space: nowrap;
        }
        .sticky-header thead tr:first-child th {
          background-color: #1F2937;
         color: #D1D5DB;
        }
        .sticky-header thead tr:nth-child(2) th {
         position: sticky;
         top: 49px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
         background-color: #1F2937;
         z-index: 3;
         color: #D1D5DB;
       }
       .sticky-header thead tr:nth-child(3) th {
        position: sticky;
        top: 97px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
        z-index: 0;
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
            <div>{/* Your component JSX code goes here */}</div>
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  PO Balance
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the PO Balance
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  RELEASE FROM
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
                  RELEASE TO
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="W-full z-10 mt-1 rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <Combobox as="div" onChange={handlePOChange} value={selectedPO}>
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    PO NUMBER
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={selectedPO}
                      displayValue={selectedPO}
                      onChange={(e) => setSelectedPO(e.target.value)}
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
                      {filteredPOptions.map((po) => (
                        <Combobox.Option
                          key={po}
                          value={po}
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
                                {po}
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
                              rowSpan={2}
                              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              JX LINE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              RELEASE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              PO
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              STYLE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              MODEL
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              OGAC
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              OGAC UPDATE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              ASSY DATE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              SPK
                            </th>
                            <th
                              scope="col"
                              colSpan={4}
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              BALANCE
                            </th>
                          </tr>
                          <tr>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              CUTTING
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              SEWING
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              W/H IN
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                              W/H OUT
                            </th>
                          </tr>
                          <tr>
                            <th
                              className="bg-orange-700 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-left font-medium text-gray-900 sm:pl-6 "
                              colSpan={8}
                            >
                              TOTAL
                            </th>
                            <th className="bg-orange-700 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ">
                              {calculateSPKTotal()?.toLocaleString()}
                            </th>
                            <th
                              className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${
                                calculateCuttingTotal() < 0
                                  ? "bg-red-300 text-red-700 text-lg font-extrabold"
                                  : "text-gray-900 bg-orange-700 "
                              } sm:pl-`}
                            >
                              {calculateCuttingTotal()?.toLocaleString()}
                            </th>
                            <th
                              className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium  ${
                                calculateSewingTotal() < 0
                                  ? "bg-red-300 text-red-600 text-lg font-extrabold"
                                  : "text-gray-900 bg-orange-700"
                              } sm:pl-6`}
                            >
                              {calculateSewingTotal()?.toLocaleString()}
                            </th>
                            <th
                              className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${
                                calculateWhInputTotal() < 0
                                  ? "bg-red-300 text-red-600 text-lg font-extrabold"
                                  : "text-gray-900 bg-orange-700  "
                              } sm:pl-6`}
                            >
                              {calculateWhInputTotal()?.toLocaleString()}
                            </th>
                            <th
                              className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${
                                calculateWhInputTotal() < 0
                                  ? "bg-red-300 text-red-600 text-lg font-extrabold"
                                  : "text-gray-900 bg-orange-700  "
                              } sm:pl-6`}
                            >
                              {calculateWhOutputTotal()?.toLocaleString()}
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
                          {data &&
                            data.map((item, index) => (
                              <tr key={index}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                                  {item.JXLINE}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.RLS}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.PO}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.STYLE}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.MODEL}
                                </td>
                                <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ">
                                  {item.OGAC
                                    ? new Date(item.OGAC)
                                        .toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })
                                        .replace(/\//g, "-")
                                    : ""}
                                </td>
                                <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ">
                                  {item.OGAC_UPDATE
                                    ? new Date(item.OGAC_UPDATE)
                                        .toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })
                                        .replace(/\//g, "-")
                                    : ""}
                                </td>
                                <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ">
                                  {item.ASSY_DATE
                                    ? new Date(item.ASSY_DATE)
                                        .toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })
                                        .replace(/\//g, "-")
                                    : ""}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.SPK.toLocaleString()}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
                                >
                                  {item.PROD_CUT !== 0 && item.PROD_CUT ? (
                                    <button
                                      type="button"
                                      className={`rounded px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm  ${
                                        item.PROD_CUT < 0
                                          ? "text-red-500 hover:bg-red-300"
                                          : "text-gray-900"
                                      } sm:pl-6 mx-auto`}
                                      onClick={() => {
                                        setJXLINE(item.JXLINE);
                                        setWC("CUT");
                                        setRLS(item.RLS);
                                        setPO(item.PO);
                                        setSTYLE(item.STYLE);
                                        setASSY_INPUT(item.ASSY_DATE);
                                        fetchData_2();
                                        setUpdating(false);
                                        setModalIsOpen(true);
                                      }}
                                    >
                                      {item.PROD_CUT.toLocaleString()}
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className={`rounded px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm  ${
                                        item.PROD_CUT < 0
                                          ? "text-red-500 hover:bg-red-300"
                                          : "text-gray-900"
                                      } sm:pl-6 mx-auto`}
                                    >
                                      {item.PROD_CUT.toLocaleString()}
                                    </button>
                                  )}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
                                >
                                  {item.PROD_SEW !== 0 && item.PROD_SEW ? (
                                    <button
                                      type="button"
                                      className={`rounded px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm  ${
                                        item.PROD_SEW < 0
                                          ? "text-red-500 hover:bg-red-300"
                                          : "text-gray-900"
                                      } sm:pl-6 mx-auto`}
                                      onClick={() => {
                                        setJXLINE(item.JXLINE);
                                        setWC("SEW");
                                        setRLS(item.RLS);
                                        setPO(item.PO);
                                        setSTYLE(item.STYLE);
                                        setASSY_INPUT(item.ASSY_DATE);
                                        fetchData_2();
                                        setUpdating(false);
                                        setModalIsOpen(true);
                                      }}
                                    >
                                      {item.PROD_SEW.toLocaleString()}
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className={`rounded px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm  ${
                                        item.PROD_SEW < 0
                                          ? "text-red-500 hover:bg-red-300"
                                          : "text-gray-900"
                                      } sm:pl-6 mx-auto`}
                                    >
                                      {item.PROD_SEW.toLocaleString()}
                                    </button>
                                  )}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
                                >
                                  {item.PROD_ASP !== 0 && item.PROD_ASP ? (
                                    <button
                                      type="button"
                                      className={`rounded px-2 py-1 text-xs font-semibold object-center text-indigo-600 shadow-sm  ${
                                        item.PROD_ASPIN < 0
                                          ? "text-red-500 hover:bg-red-300"
                                          : "text-gray-900"
                                      } sm:pl-6 mx-auto`}
                                      onClick={() => {
                                        setJXLINE(item.JXLINE);
                                        setWC("ASPIN");
                                        setRLS(item.RLS);
                                        setPO(item.PO);
                                        setSTYLE(item.STYLE);
                                        setASSY_INPUT(item.ASSY_DATE);
                                        fetchData_2();
                                        setUpdating(false);
                                        setModalIsOpen(true);
                                      }}
                                    >
                                      {item.PROD_ASPIN.toLocaleString()}
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className={`rounded px-2 py-1 text-xs font-semibold object-center text-indigo-600 shadow-sm  ${
                                        item.PROD_ASPIN < 0
                                          ? "text-red-500 hover:bg-red-300"
                                          : "text-gray-900"
                                      } sm:pl-6 mx-auto`}
                                    >
                                      {item.PROD_ASPIN.toLocaleString()}
                                    </button>
                                  )}
                                </td>
                                <td
                                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6`}
                                >
                                  {item.PROD_ASP !== 0 && item.PROD_ASP ? (
                                    <button
                                      type="button"
                                      className={`rounded px-2 py-1 text-xs font-semibold object-center text-indigo-600 shadow-sm  ${
                                        item.PROD_ASP < 0
                                          ? "text-red-500 hover:bg-red-300"
                                          : "text-gray-900"
                                      } sm:pl-6 mx-auto`}
                                      onClick={() => {
                                        setJXLINE(item.JXLINE);
                                        setWC("ASP");
                                        setRLS(item.RLS);
                                        setPO(item.PO);
                                        setSTYLE(item.STYLE);
                                        setASSY_INPUT(item.ASSY_DATE);
                                        fetchData_2();
                                        setUpdating(false);
                                        setModalIsOpen(true);
                                      }}
                                    >
                                      {item.PROD_ASP.toLocaleString()}
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className={`rounded px-2 py-1 text-xs font-semibold object-center text-indigo-600 shadow-sm  ${
                                        item.PROD_ASP < 0
                                          ? "text-red-500 hover:bg-red-300"
                                          : "text-gray-900"
                                      } sm:pl-6 mx-auto`}
                                    >
                                      {item.PROD_ASP.toLocaleString()}
                                    </button>
                                  )}
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
      <Transition.Root show={modalIsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setModalIsOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-6xl">
                  {" "}
                  {/* Ubah max-w-lg menjadi max-w-7xl */}
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          DETAIL DATA
                        </Dialog.Title>
                        <div className="mt-2 max-h-screen max-w-5xl overflow-y-scroll overflow-x-scroll">
                          <table className="min-w-full divide-y divide-neutral-950 border border-slate-500 ">
                            <thead className="whitespace-nowrap bg-gray-800">
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-200 sm:pl-6"
                                >
                                  WORK CENTER
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-200"
                                >
                                  JX LINE
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-200"
                                >
                                  PO
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-200"
                                >
                                  RELEASE
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-200"
                                >
                                  STYLE
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-200"
                                >
                                  MODEL
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-200"
                                >
                                  GENDER
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-200"
                                >
                                  ASSY DATE
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-200"
                                >
                                  TOTAL
                                </th>
                                {columns.map((columnName, index) => (
                                  <th
                                    key={index}
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-200"
                                  >
                                    {columnName}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-950 bg-white">
                              {data_2 &&
                                data_2.map((item, index) => {
                                  let total = 0;
                                  columns.map(
                                    (columnName) => (total += item[columnName])
                                  );
                                  return (
                                    <tr key={index}>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {item.WC === "CUT"
                                          ? "CUTTING"
                                          : item.WC === "SEW"
                                          ? "SEWING"
                                          : item.WC}
                                      </td>

                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.JXLINE}
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {item.PO}
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
                                      <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ">
                                        {item.ASSY_DATE
                                          ? new Date(item.ASSY_DATE)
                                              .toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                              })
                                              .replace(/\//g, "-")
                                          : ""}
                                      </td>

                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                        {total.toLocaleString()}
                                      </td>
                                      {columns.map((columnName, colIndex) => (
                                        <td
                                          key={colIndex}
                                          className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6"
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
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => setModalIsOpen(false)}
                    >
                      CLOSE
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default NotFound;
