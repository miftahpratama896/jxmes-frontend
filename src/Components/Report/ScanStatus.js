import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'

function ScanStatus() {
  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Mendapatkan tanggal kemarin
  
  const [fromDate, setfromDate] = useState(yesterday.toISOString().split('T')[0]);
  const [toDate, settoDate] = useState(yesterday.toISOString().split('T')[0]);
  const [totalScanWhInput, setTotalScanWhInput] = useState(0);
  const [totalScanWhOutput, setTotalScanWhOutput] = useState(0);
  const [totalInputJX, setTotalInputJX] = useState(0);
  const [totalInputJXASM, setTotalInputJXASM] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(''); 
  const [selectedModel, setSelectedModel] = useState(''); 
  const [filteredStyleOptions, setFilteredStyleOptions] = useState([]);
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);
  const [selectedJXLine, setSelectedJXLine] = useState('ALL'); 
  const [selectedJX2Line, setSelectedJX2Line] = useState('ALL'); 
  const [filteredJXLineOptions, setFilteredJXLineOptions] = useState([]);
  const [filteredJX2LineOptions, setFilteredJX2LineOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState('ALL'); 
  const [selectedPCard, setSelectedPCard] = useState(''); 
  const [filteredGenderOptions, setFilteredGenderOptions] = useState([]);
  const [filteredPCardOptions, setFilteredPCardOptions] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState('ALL');
  const [selectedFilter, setSelectedFilter] = useState(0);


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const handleStyleChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedStyle(selectedValue);
  };

  const handleModelChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedModel(selectedValue);
  };

  const handleJXLineChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedJXLine(selectedValue);
  };

  const handleJX2LineChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedJX2Line(selectedValue);
  };

  const handleGenderChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedGender(selectedValue);
  };

  const handlePCardChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedPCard(selectedValue);
  };

  const fetchData = async () => {


    try {
      setUpdating(true);
      const parsedFilter = parseInt(selectedFilter);
      const sanitizedStyle = selectedStyle.replace(/-/g, '');
      const response = await axios.post('http://172.16.200.28:3000/scan-jx2-jx', {
        FROM_DATE: fromDate,
        TO_DATE: toDate,
        LINE_JX2: selectedJXLine,
        CELL_JX: selectedJX2Line,
        PLANT: selectedFactory,
        D_STYLE: sanitizedStyle,
        D_MODEL: selectedModel,
        D_GENDER: selectedGender,
        D_RLS: '',
        D_BARCODE: selectedPCard,
        D_CHEK: parsedFilter,
        CEK_IP: '172.16.208.33'
      });

      setData(response.data); // Simpan data respons ke dalam state
    } catch (error) {
      setError('Error fetching data');
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
  }, [autoUpdate, fromDate, toDate, selectedStyle, selectedModel, selectedJXLine, selectedJX2Line,selectedGender, selectedPCard, selectedFactory, selectedFilter]);

  useEffect(() => {
    const uniqueModelOptions = [...new Set(data.map(item => item.MODEL))];
    setFilteredModelOptions(uniqueModelOptions);

    const uniqueStyleOptions = [...new Set(data.map(item => item.STYLE))];
    setFilteredStyleOptions(uniqueStyleOptions);

    const uniqueJXLineOptions = [...new Set(data.map(item => item.JX2_LINE))];
    setFilteredJXLineOptions(uniqueJXLineOptions);

    const uniqueJX2LineOptions = [...new Set(data.map(item => item.JX_CELL))];
    setFilteredJX2LineOptions(uniqueJX2LineOptions);

    const uniqueGenderOptions = [...new Set(data.map(item => item.GENDER))];
    setFilteredGenderOptions(uniqueGenderOptions);

    const uniquePCardOptions = [...new Set(data.map(item => item.BARCODE))];
    setFilteredPCardOptions(uniquePCardOptions);
  }, [data]);


  useEffect(() => {
    // Menghitung total data yang keluar dari item.SCAN_WH_INPUT
    let total = 0;
    let totalOutput = 0
    let totalInputJX = 0
    let totalInputJXASM = 0
    data.forEach(item => {
      if (item.SCAN_WH_INPUT) {
        total += item.QTY;
      }
      if (item.SCAN_WH_OUTPUT) {
        totalOutput += item.QTY;
      }
      if (item.JX_INPUT) {
        totalInputJX += item.QTY;
      }
      if (item.JX_ASM_INPUT) {
        totalInputJXASM += item.QTY;
      }
    });
    setTotalScanWhInput(total);
    setTotalScanWhOutput(totalOutput)
    setTotalInputJX(totalInputJX)
    setTotalInputJXASM(totalInputJXASM)
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
          z-index: 2;
          color: #D1D5DB;
        }
        
        .sticky-header th,
        .sticky-header td {
          white-space: nowrap;
        }
        
        .sticky-header thead tr:first-child th {
          
        }
        
        .sticky-header thead tr:nth-child(2) th {
          position: sticky;
          top: 49px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
          z-index: 2;
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
                        <div className="mt-4 sm:mt-0 sm:ml-4">
                              <label htmlFor="plant" className="block text-sm font-medium text-gray-700">
                                INPUT - OUTPUT
                              </label>
                              <select
                                id="plant"
                                name="plant"
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                value={selectedFilter}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                              >
                                <option value="0">Input</option>
                                <option value="1">Output</option>
                                {/* Add other factory options as needed */}
                              </select>
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
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">JX2 LINE</Combobox.Label>
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
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">P-CARD</Combobox.Label>
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
                            <table className="min-w-full divide-y divide-neutral-950 sticky-header border border-slate-500">
                              <thead className="bg-slate-300 " >
                                <tr>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    JX2 LINE 
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    JX LINE 
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    RELEASE 
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    STYLE  
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    MODEL 
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    GENDER 
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    SIZE 
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    QTY 
                                  </th>
                                  <th rowSpan={2} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    P-CARD
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    JX2 W/H INPUT 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    JX2 W/H OUTPUT 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    JX W/H INPUT 
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    JX ASM INPUT
                                  </th>
                                </tr>
                                <tr>
                                 <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                                    {totalScanWhInput.toLocaleString()}
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                                    {totalScanWhOutput.toLocaleString()}
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                                    {totalInputJX.toLocaleString()}
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900" style={{
                                    backgroundColor:'#374151'}}>
                                  {totalInputJXASM.toLocaleString()}
                                  </th>
                                </tr>
                              </thead>
                              {updating && (
                              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                                  <span className="text-white">Loading data...</span>
                              </div>
                              )}
                                <tbody className="divide-y divide-neutral-950 bg-white">
                                {data.map((item, rowIndex) => (
                                      <tr key={rowIndex}>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.JX2_LINE}
                                        </td>
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
                                          {item.MODEL}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.GENDER}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.SIZE}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.QTY}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.BARCODE}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.SCAN_WH_INPUT && item.SCAN_WH_INPUT.replace('T', ' ').replace('.000Z', '')}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.SCAN_WH_OUTPUT && item.SCAN_WH_OUTPUT.replace('T', ' ').replace('.000Z', '')}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.JX_INPUT && item.JX_INPUT.replace('T', ' ').replace('.000Z', '')}
                                        </td>
                                        <td className="sticky-first-row bg-gray-50 py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 ">
                                          {item.JX_ASM_INPUT && item.JX_ASM_INPUT.replace('T', ' ').replace('.000Z', '')}
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
}

export default ScanStatus;
