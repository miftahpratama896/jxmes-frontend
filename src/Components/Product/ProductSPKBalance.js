import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";
import { Combobox } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/20/solid'

function ProductSPKBalance() {
    useEffect(() => {
      const user_id = localStorage.getItem('user_id');
        const sendDataToBackend = async () => {
          try {
            const data = {
              division: 'JXMES-WEB',
              menuName: 'PRODUCT',
              programName: 'PRODUCT - SPK BALANCE',
              userID: user_id,
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
    
      const history = useHistory();
    
      useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect ke halaman login jika tidak ada token
          history.push('/');
        }
      }, [history]);

  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [numColumns, setNumColumns] = useState(0);
  const [selectedWC, setSelectedWC] = useState('CUTTING');
  const [ProdDatefrom, setProdDatefrom] = useState(new Date().toISOString().split('T')[0]);
  const [ProdDateto, setProdDateto] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStyle, setSelectedStyle] = useState(''); 
  const [selectedModel, setSelectedModel] = useState(''); 
  const [filteredStyleOptions, setFilteredStyleOptions] = useState([]);
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);
  const [selectedJXLine, setSelectedJXLine] = useState(''); 
  const [filteredJXLineOptions, setFilteredJXLineOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState('ALL'); 
  const [filteredGenderOptions, setFilteredGenderOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('0');

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
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

  const fetchData = async () => {
    setUpdating(true);
    try {
      const parsedFilter = parseInt(selectedFilter);
      const sanitizedStyle = selectedStyle.replace(/-/g, '');
      const response = await axios.post('http://172.16.200.28:3000/product-spk-balance', {
        SPK_DATE_FROM: ProdDatefrom,
        SPK_DATE_TO: ProdDateto,
        WC: selectedWC,
        STYLE: sanitizedStyle,
        STYLE_NAME: selectedModel,
        GENDER: selectedGender,
        TYPE: parsedFilter,
        JXLINE: selectedJXLine
      });
      setData(response.data);
    } catch (err) {
      setError(err.message);
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
  }, [autoUpdate, selectedWC, ProdDatefrom, ProdDateto,  selectedStyle, selectedModel, selectedJXLine, selectedGender, selectedFilter]);

  const getColumnNames = () => {
    if (data.length === 0) return [];
    const columnNames = Object.keys(data[0][0]);
    const numericColumns = columnNames.filter(key => key.match(/^\d+$/));
    const numericTColumns = columnNames.filter(key => key.match(/^\d+T$/));
    const combinedColumns = [];
    
    for (let i = 0; i < Math.max(numericColumns.length, numericTColumns.length); i++) {
        if (numericColumns[i]) combinedColumns.push(numericColumns[i]);
        if (numericTColumns[i]) combinedColumns.push(numericTColumns[i]);
    }
    
    return combinedColumns;
};



  useEffect(() => {
    if (data.length > 0 && data[0]) {
        const columns = getColumnNames();
        setNumColumns(columns.length);
    }
    }, [data]);

  const columns = getColumnNames();

  useEffect(() => {
    if (data.length > 0) {
      const uniqueJXLineOptions = [...new Set(data[0].map(item => item.JXLINE))];
      setFilteredJXLineOptions(uniqueJXLineOptions);
  
      const uniqueModelOptions = [...new Set(data[0].map(item => item.MODEL))];
      setFilteredModelOptions(uniqueModelOptions);
  
      const uniqueStyleOptions = [...new Set(data[0].map(item => item.STYLE))];
      setFilteredStyleOptions(uniqueStyleOptions);
      const uniqueGenderOptions = [...new Set(data[0].map(item => item.GENDER))];
      setFilteredGenderOptions(uniqueGenderOptions);
    }
  }, [data]);
  
  console.log(data)

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
            max-height: 70vh;
            max-width: 197vh;
            overflow-y: auto;
            overflow-x: auto;;
        }
      `}
    </style>

    <main className="py-12">
      

      <div className="mx-auto max-w-full px-6 lg:px-1">
        <div className="px-4 sm:px-6 lg:px-8">
          <div>
            {/* Your component JSX code goes here */}
          </div>
          <div className="sm:flex sm:items-center py-3">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">Product</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the Product SPK Balance 
              </p>
            </div>
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
                                <option value="0">SUMMARY</option>
                                <option value="1">JX LINE</option>
                                {/* Add other factory options as needed */}
                              </select>
                            </div>
                            {selectedFilter === '1' && (
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                          <Combobox as="div" onChange={handleJXLineChange} value={selectedJXLine} >
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">JX LINE</Combobox.Label>
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
                                  value=''
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
                            )}
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
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <div className="table-container">
                    <table className="min-w-full divide-y divide-neutral-950 sticky-header border border-slate-500 ">
                      <thead className="bg-slate-300">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                            WORK CENTER
                          </th>
                          {selectedFilter === '1' && (
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            JX LINE 
                          </th>
                          )}
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
                            TOTAL 
                          </th>
                           {columns.map((columnName, index) => (
                                  <th key={index} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" >
                                    {columnName}
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
                        
                      {data.length > 0 && data[0].map((item, index) => {

                        let total = 0;
                        columns.map((columnName) => (
                          total += item[columnName]
                        ));
                        return(
                          <tr key={item.index} className={`${index % 4 === 0 || index % 4 === 1 || index % 4 === 4 || index % 4 === 5 ? 'bg-gray-400' : ''}`}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                              {item.WC}
                            </td>
                            {selectedFilter === '1' && (
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.JXLINE}</td>
                            )}
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.STYLE}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.MODEL}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.GENDER}</td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 bg-orange-600">{total}</td>
                            {columns.map((columnName) => (
                              <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6 
                              ${index % 2 === 0 && item[columnName] > data[0][index + 1][columnName] ? 'bg-red-500' : ''}
                              ${index % 2 === 0 && item[columnName] < data[0][index + 1][columnName] ? 'bg-yellow-300' : ''}
                              ${index % 2 === 0 && item[columnName] == data[0][index + 1][columnName] && item[columnName] && data[0][index + 1][columnName] !== '' ? 'bg-green-500' : ''}
                              `}>
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

export default ProductSPKBalance;
