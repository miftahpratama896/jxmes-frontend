import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";
import { Combobox } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/20/solid'

function ProductPCard() {
  const [data, setData] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const history = useHistory();
  const [ProdDatefrom, setProdDatefrom] = useState(new Date().toISOString().split('T')[0]);
  const [ProdDateto, setProdDateto] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFactory, setSelectedFactory] = useState('ALL');
  const [selectedWC, setSelectedWC] = useState('CUTTING');
  const [selectedJXLine, setSelectedJXLine] = useState('ALL'); 
  const [selectedJX2Line, setSelectedJX2Line] = useState('ALL'); 
  const [filteredJXLineOptions, setFilteredJXLineOptions] = useState([]);
  const [filteredJX2LineOptions, setFilteredJX2LineOptions] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(''); 
  const [selectedModel, setSelectedModel] = useState(''); 
  const [filteredStyleOptions, setFilteredStyleOptions] = useState([]);
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState('ALL'); 
  const [filteredGenderOptions, setFilteredGenderOptions] = useState([]);
  const [selectedPCard, setSelectedPCard] = useState(''); 
  const [filteredPCardOptions, setFilteredPCardOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('0');
  const [selectedFilter2, setSelectedFilter2] = useState('1');
  const [numColumns, setNumColumns] = useState(0);
  const [totalAllRows, setTotalAllRows] = useState(0);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
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

  const handlePCardChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedPCard(selectedValue);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect ke halaman login jika tidak ada token
      history.push('/');
    }
  }, [history]);

  useEffect(() => {
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: 'JXMES-WEB',
          menuName: 'PRODUCT',
          programName: 'PRODUCT - PCARD',
          userID: 'mesuser',
        };

        // Kirim data ke backend
        const response = await axios.post('http://172.16.200.28:3000/api/log-menu-access', data);
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Panggil fungsi untuk mengirim data ke backend
    sendDataToBackend();
  }, []);
  const [release, setRelease] = useState(' ');
  const convertToCustomFormat = (dateString) => {
    if (dateString.trim() === '') {
      return ''; // Jika release adalah string kosong, kembalikan string kosong
    }
    
    const dateObj = new Date(dateString);
    const year = String(dateObj.getFullYear()).slice(-2);
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${day}${month}${year}`;
  };
  const convertedRelease = convertToCustomFormat(release);
    // Fungsi untuk mengambil data dari server
    const fetchData = async () => {
      try {
        setUpdating(true);
        const parsedFilter = parseInt(selectedFilter);
        const parsedFilter2 = parseInt(selectedFilter2);
        const sanitizedStyle = selectedStyle.replace(/-/g, '');
        // Lakukan permintaan HTTP GET ke endpoint server
        const response = await axios.get('http://172.16.200.28:3000/product-pcard', {
          params: {
            prodDateFrom: ProdDatefrom,
            prodDateTo: ProdDateto,
            scanCell: selectedJXLine,
            cStyle: sanitizedStyle,
            cStyleName: selectedModel,
            cRls: convertedRelease,
            cGender: selectedGender,
            cCek: 0,
            cCekDate: 0,
            cCekNull: parsedFilter2,
            cReq: selectedPCard,
            wc: selectedWC,
            plant: selectedFactory,
            jxCell: selectedJX2Line,
            iGubun: parsedFilter
          }
        });
        // Simpan data yang diterima dari respons ke dalam state data
        setData(response.data);
      } catch (error) {
        // Tangani kesalahan jika permintaan gagal
        console.error('Terjadi kesalahan:', error);
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
      }, [autoUpdate, ProdDatefrom, ProdDateto,selectedFactory,selectedWC, release, selectedJX2Line, selectedJXLine,  selectedStyle, selectedModel,selectedGender, selectedPCard,selectedFilter, selectedFilter2]);

      const getColumnNames = () => {
        if (data.length === 0) return [];
        return Object.keys(data[0]).filter(key => key.match(/^\d{6}$/));
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
      
        data.forEach((item) => {
          const totalColumnValue = columns.reduce((total, columnName) => {
            return total + item[columnName];
          }, 0);
      
          total += totalColumnValue;
      
        });
      
        setTotalAllRows(total);

      }, [data, columns]);
      
      const totalqty = data.reduce((total, item) => {
        return total + item.QTY;
        }, 0);

    useEffect(() => {
      const uniqueJXLineOptions = [...new Set(data.map(item => item.CELL))];
      setFilteredJXLineOptions(uniqueJXLineOptions);

      const uniqueJX2LineOptions = [...new Set(data.map(item => item.JX_CELL))];
      setFilteredJX2LineOptions(uniqueJX2LineOptions);

      const uniqueModelOptions = [...new Set(data.map(item => item.STYLE_NAME))];
      setFilteredModelOptions(uniqueModelOptions);

      const uniqueStyleOptions = [...new Set(data.map(item => item.STYLE))];
      setFilteredStyleOptions(uniqueStyleOptions);

      const uniqueGenderOptions = [...new Set(data.map(item => item.GENDER_S))];
      setFilteredGenderOptions(uniqueGenderOptions);

      const uniquePCardOptions = [...new Set(data.map(item => item.REQ))];
      setFilteredPCardOptions(uniquePCardOptions);
    }, [data]);
    console.log(data)
  return (
    <>
    <style>
    {`
        /* CSS Styles */
        .sticky-header thead th {
          
        }
        
        .sticky-header th,
        .sticky-header td {
          white-space: nowrap;
        }
        
        .sticky-header thead tr:first-child th {
          color: #D1D5DB;
          position: sticky;
          top: 0;
          background-color: #1F2937;
          z-index: 1;
        }
        
        .sticky-header thead tr:nth-child(2) th {
          position: sticky;
          top: 49px; \
          z-index: 2;
          background-color: #B84600;
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
                    <div className="sm:flex justify-between items-center py-3">
                    <div className="sm:flex sm:items-center">
                        <div className="smt-4 sm:mt-0 sm:ml-4">
                          <h1 className="text-base font-semibold leading-6 text-gray-900">Product</h1>
                          <p className="mt-2 text-sm text-gray-700">
                            A list of all the Product - PCard 
                          </p>
                        </div>
                        </div>
                    </div>
                    <div className="sm:flex justify-between items-center py-3">
                        <div className="sm:flex sm:items-center">
                        <div className="mt-4 sm:mt-0 sm:ml-4">
                            <label htmlFor="yesdayDate" className="block text-sm font-medium text-gray-700">
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
                            <label htmlFor="todayDate" className="block text-sm font-medium text-gray-700">
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
                              <label htmlFor="plant" className="block text-sm font-medium text-gray-700">
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
                              <label htmlFor="wc" className="block text-sm font-medium text-gray-700">
                                WORK CENTER
                              </label>
                              <select
                                id="wc"
                                name="wc"
                                onChange={(e) => setSelectedWC(e.target.value)}
                                value={selectedWC}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                              >
                                <option value="CUTTING">CUTTING</option>
                                <option value="SEWING">SEWING</option>
                                <option value="HI">HI</option>
                                <option value="W/H">W/H</option>
                                {/* Add other factory options as needed */}
                              </select>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                              <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                                FILTER
                              </label>
                              <select
                                id="filter"
                                name="filter"
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                value={selectedFilter}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                              >
                                <option value="0">DETAIL</option>
                                <option value="1">SUMMARY</option>
                                {/* Add other factory options as needed */}
                              </select>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                  <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                                    OUTPUT DATE
                                  </label>
                                  <select
                                    id="filter"
                                    name="filter"
                                    onChange={(e) => setSelectedFilter2(e.target.value)}
                                    value={selectedFilter2}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                  >
                                    <option value="0">NULL</option>
                                    <option value="1">NOT NULL</option>
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
                                        onClick={() => setRelease('')} // Mengatur release menjadi string kosong saat tombol diklik
                                        className="mt-2 px-4 py-1 sm:ml-4 rounded-md bg-gray-700 text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Clear Release
                                    </button>
                                 </div>
                        </div>
                    </div>
                    <div className="sm:flex justify-between items-center py-3">
                    <div className="sm:flex sm:items-center">
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                          <Combobox as="div" onChange={handleJXLineChange} value={selectedJXLine} >
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">JX2 LINE</Combobox.Label>
                            <div className="relative mt-2">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={selectedJXLine}
                                displayValue={selectedJXLine}
                                onChange={(e) => handleJXLineChange(e.target.value)}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </Combobox.Button>

                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {/* Option for All */}
                                <Combobox.Option
                                  key="all"
                                  value="ALL"
                                  className={({ active }) =>
                                    classNames(
                                      'relative cursor-default select-none py-2 pl-3 pr-9',
                                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <span className={classNames('block truncate', selected && 'font-semibold')}>All</span>
                                      {selected && (
                                        <span
                                          className={classNames(
                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                            active ? 'text-white' : 'text-indigo-600'
                                          )}
                                        >
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                      )
                                    }
                                  >
                                    {({ active, selected }) => (
                                      <>
                                        <span className={classNames('block truncate', selected && 'font-semibold')}>{JXLine}</span>
                                        {selected && (
                                          <span
                                            className={classNames(
                                              'absolute inset-y-0 right-0 flex items-center pr-4',
                                              active ? 'text-white' : 'text-indigo-600'
                                            )}
                                          >
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                          <Combobox as="div" onChange={handleJX2LineChange} value={selectedJX2Line} >
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">JX LINE</Combobox.Label>
                            <div className="relative mt-2">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={selectedJX2Line}
                                displayValue={selectedJX2Line}
                                onChange={(e) => handleJX2LineChange(e.target.value)}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </Combobox.Button>

                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {/* Option for All */}
                                <Combobox.Option
                                  key="all"
                                  value="ALL"
                                  className={({ active }) =>
                                    classNames(
                                      'relative cursor-default select-none py-2 pl-3 pr-9',
                                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <span className={classNames('block truncate', selected && 'font-semibold')}>All</span>
                                      {selected && (
                                        <span
                                          className={classNames(
                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                            active ? 'text-white' : 'text-indigo-600'
                                          )}
                                        >
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                      )
                                    }
                                  >
                                    {({ active, selected }) => (
                                      <>
                                        <span className={classNames('block truncate', selected && 'font-semibold')}>{JX2Line}</span>
                                        {selected && (
                                          <span
                                            className={classNames(
                                              'absolute inset-y-0 right-0 flex items-center pr-4',
                                              active ? 'text-white' : 'text-indigo-600'
                                            )}
                                          >
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                          <Combobox as="div" onChange={handleStyleChange} value={selectedStyle} >
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">STYLE</Combobox.Label>
                            <div className="relative mt-2">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={selectedStyle}
                                displayValue={selectedStyle}
                                onChange={(e) => handleStyleChange(e.target.value)}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </Combobox.Button>

                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {/* Option for All */}
                                <Combobox.Option
                                  key="all"
                                  value=""
                                  className={({ active }) =>
                                    classNames(
                                      'relative cursor-default select-none py-2 pl-3 pr-9',
                                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <span className={classNames('block truncate', selected && 'font-semibold')}>All</span>
                                      {selected && (
                                        <span
                                          className={classNames(
                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                            active ? 'text-white' : 'text-indigo-600'
                                          )}
                                        >
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                      )
                                    }
                                  >
                                    {({ active, selected }) => (
                                      <>
                                        <span className={classNames('block truncate', selected && 'font-semibold')}>{style}</span>
                                        {selected && (
                                          <span
                                            className={classNames(
                                              'absolute inset-y-0 right-0 flex items-center pr-4',
                                              active ? 'text-white' : 'text-indigo-600'
                                            )}
                                          >
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                          <Combobox as="div" onChange={handleModelChange} value={selectedModel} >
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">MODEL</Combobox.Label>
                            <div className="relative mt-2">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={selectedModel}
                                displayValue={selectedModel}
                                onChange={(e) => handleModelChange(e.target.value)}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </Combobox.Button>

                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {/* Option for All */}
                                <Combobox.Option
                                  key="all"
                                  value=""
                                  className={({ active }) =>
                                    classNames(
                                      'relative cursor-default select-none py-2 pl-3 pr-9',
                                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <span className={classNames('block truncate', selected && 'font-semibold')}>All</span>
                                      {selected && (
                                        <span
                                          className={classNames(
                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                            active ? 'text-white' : 'text-indigo-600'
                                          )}
                                        >
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                      )
                                    }
                                  >
                                    {({ active, selected }) => (
                                      <>
                                        <span className={classNames('block truncate', selected && 'font-semibold')}>{model}</span>
                                        {selected && (
                                          <span
                                            className={classNames(
                                              'absolute inset-y-0 right-0 flex items-center pr-4',
                                              active ? 'text-white' : 'text-indigo-600'
                                            )}
                                          >
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                          <Combobox as="div" onChange={handleGenderChange} value={selectedGender} >
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">GENDER</Combobox.Label>
                            <div className="relative mt-2">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={selectedGender}
                                displayValue={selectedGender}
                                onChange={(e) => handleGenderChange(e.target.value)}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </Combobox.Button>

                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {/* Option for All */}
                                <Combobox.Option
                                  key="all"
                                  value="ALL"
                                  className={({ active }) =>
                                    classNames(
                                      'relative cursor-default select-none py-2 pl-3 pr-9',
                                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <span className={classNames('block truncate', selected && 'font-semibold')}>All</span>
                                      {selected && (
                                        <span
                                          className={classNames(
                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                            active ? 'text-white' : 'text-indigo-600'
                                          )}
                                        >
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                      )
                                    }
                                  >
                                    {({ active, selected }) => (
                                      <>
                                        <span className={classNames('block truncate', selected && 'font-semibold')}>{Gender}</span>
                                        {selected && (
                                          <span
                                            className={classNames(
                                              'absolute inset-y-0 right-0 flex items-center pr-4',
                                              active ? 'text-white' : 'text-indigo-600'
                                            )}
                                          >
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                          <Combobox as="div" onChange={handlePCardChange} value={selectedPCard} >
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">REQ</Combobox.Label>
                            <div className="relative mt-2">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={selectedPCard}
                                onChange={(e) => handlePCardChange(e.target.value)}
                              />
                             
                            </div>
                          </Combobox>
                        </div>
                        
                        <div className="mt-4 sm:mt-0 sm:ml-4">
                          <label htmlFor="autoUpdateCheckbox" className="block text-sm font-medium text-gray-700">
                            {`Last updated:`}
                          </label>
                          <label htmlFor="autoUpdateCheckbox" className="block text-sm font-medium text-gray-700">
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
                      <div className="mt-8 flow-root">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                          <div className="table-container">
                          {selectedFilter === '0' && (
                            <table className="min-w-full divide-y divide-neutral-950 sticky-header border border-slate-500">
                              <thead className="bg-slate-300 " >
                                <tr>
                                  {selectedWC !== 'CUTTING' && (
                                      <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        JX2 LINE 
                                      </th>
                                  )}
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    JX LINE 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    RELEASE 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    STYLE  
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    MODEL 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    GENDER 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    SIZE 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    REQ 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    QTY 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    P-CARD
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    ASSY DATE 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    INPUT SCAN DATE
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    OUTPUT SCAN DATE
                                  </th>
                                </tr>
                                <tr>
                                <th
                                      scope="col"
                                      colSpan={selectedWC !== 'CUTTING' ? 8 : 7}
                                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                  >
                                      TOTAL
                                  </th>

                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {totalqty.toLocaleString()}
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    
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
                                {data.map((item, rowIndex) => (
                                      <tr key={rowIndex}>
                                        {selectedWC !== 'CUTTING' && (
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.CELL}
                                        </td>
                                        )}
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.JX_CELL}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.RELEASE}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.STYLE}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.STYLE_NAME}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.GENDER_S}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.SIZE}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.REQ}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.QTY}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.PCARD_NO}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.ASSY_DATE}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.INPUT_DATE}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.OUTPUT_DATE}
                                        </td>
                                        
                                      </tr>
                                  ))}
                                </tbody>
                            </table>
                            )}
                            {selectedFilter === '1' && (
                            <table className="min-w-full divide-y divide-neutral-950 sticky-header border border-slate-500">
                              <thead className="bg-slate-300 " >
                                <tr>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                     LINE 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                     TOTAL 
                                  </th>
                                  {columns.map((columnName, index) => (
                                  <th key={index} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"  >
                                    {columnName}
                                  </th>
                                  ))}
                                </tr>
                                <tr>
                                 <th scope="col" className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium">
                                    GRAND TOTAL
                                  </th>
                                  <th scope="col" className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium">
                                  {totalAllRows !== null ? totalAllRows.toLocaleString() : ''}
                                  </th>
                                  {columns.map((columnName, index) => (
                                  <th key={index} scope="col" className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium" >
                                    {calculateColumnTotal(columnName) !== null && calculateColumnTotal(columnName) !== undefined ? calculateColumnTotal(columnName).toLocaleString() : ''}
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
                                  {data.map((item, rowIndex) => {
                                    const totalColumnValue = columns.reduce((total, columnName) => {
                                      return total + (item[columnName] || 0); // Menambahkan penanganan jika item[columnName] adalah null atau undefined
                                    }, 0);

                                    return (
                                      <tr key={rowIndex}>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6">
                                          {item.LINE}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium" >
                                          {totalColumnValue.toLocaleString()}
                                        </td>
                                        {columns.map((columnName, columnIndex) => (
                                          <td key={columnIndex} className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium ${((item[columnName] / item.TARG_HOUR) * 100) === 0 || isNaN((item[columnName] / item.TARG_HOUR) * 100) ? 'bg-gray-50' : ((item[columnName] / item.TARG_HOUR) * 100) >= 100 ? 'bg-green-400' : ((item[columnName] / item.TARG_HOUR) * 100) >= 97 ? 'bg-yellow-400' : 'bg-red-400'} sm:pl-6`}>
                                            {item[columnName] !== null && item[columnName] !== undefined ? item[columnName].toLocaleString() : ''}
                                          </td>
                                        ))}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                            </table>
                            )}
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

export default ProductPCard;
