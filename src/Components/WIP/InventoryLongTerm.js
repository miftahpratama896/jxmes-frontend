import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import Logo from "../../assets/img/New Logo White.png";

const InventoryLongTerm = () => {
  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [updating, setUpdating] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedWC, setSelectedWC] = useState('Cutting');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [filteredStyleOptions, setFilteredStyleOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [filteredGenderOptions, setFilteredGenderOptions] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  const handleStyleChange = (selectedValue) => {
    // Update the state with the selected Style
    setSelectedStyle(selectedValue);
  };

  const handleGenderChange = (selectedValue) => {
    // Update the state with the selected Gender
    setSelectedGender(selectedValue);
  };

  const handleModelChange = (selectedValue) => {
    // Update the state with the selected Model
    setSelectedModel(selectedValue);
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleWCChange = (event) => {
    setSelectedWC(event.target.value);
  };
  
  const calculateTotalQty = () => {
    const filteredData = data.filter(item => {
      const scanDate = new Date(item.SCAN_DATE);
      const selected = new Date(selectedDate);
      scanDate.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      const differenceInTime = Math.abs(selected - scanDate);
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

      switch(selectedFilter) {
        case 'Over 1 week':
          return differenceInDays >= 7;
        case 'Over 2 weeks':
          return differenceInDays >= 14;
        case 'Over 3 weeks':
          return differenceInDays >= 21;
        case 'Over 4 weeks':
          return differenceInDays >= 28;
        default:
          return true;
      }
    });

    const totalQty = filteredData.reduce((acc, item) => acc + item.QTY, 0); // Menggunakan totalQty di sini
    return totalQty;
  };
  const totalQty = calculateTotalQty();
  
  const fetchData = async () => {
    const apiUrl = 'http://172.16.200.28:3000/inventory-long-term';
    try {
      setUpdating(true);
      const sanitizedStyle = selectedStyle.replace(/-/g, '');
      const response = await axios.post(apiUrl, {
        STOCK_DATE: selectedDate,
        S_DAY: 0,
        WC: selectedWC,
        SCAN_LINE: 'ALL',
        RLS: '',
        STYLE_NAME: selectedModel,
        STYLE: sanitizedStyle,
        GENDER: selectedGender,
        C_CEK: 0,
        PLANT: 'ALL',
      });
      setData(response.data[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
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
  }, [autoUpdate,selectedDate, selectedFilter, selectedWC, selectedStyle, selectedGender, selectedModel]);

  useEffect(() => {
    const uniqueStyleOptions = [...new Set(data.map(item => item.STYLE))];
    setFilteredStyleOptions(uniqueStyleOptions);
  }, [data]);

  useEffect(() => {
    const uniqueGenderOptions = [...new Set(data.map(item => item.GENDER_S))];
    setFilteredGenderOptions(uniqueGenderOptions);
  }, [data]);

  useEffect(() => {
    const uniqueModelOptions = [...new Set(data.map(item => item.STYLE_NAME))];
    setFilteredModelOptions(uniqueModelOptions);
  }, [data]);

  console.log('Data :',data)
  return (
    <>
      <style>
        {`
        {/* CSS Styles */}
        .sticky-header thead th {
          position: sticky;
          top: 0;
          background-color: #1f2937;
          z-index: 1;
        }
        .sticky-header th,
        .sticky-header td {
          white-space: nowrap;
        }
        .sticky-header thead tr:first-child th {
          color: #d1d5db;
        }
        .sticky-header thead tr:nth-child(2) th {
          position: sticky;
          top: 48px;
          background-color: #fa7625;
          z-index: 3;
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
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">Inventory</h1>
                <p className="mt-2 text-sm text-gray-700">A list of all the Inventory [Long Term]</p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">STOCk DATE</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">WORK CENTER</label>
                <select
                  value={selectedWC}
                  onChange={handleWCChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                >
                  <option value="Sewing">Sewing</option>
                  <option value="Cutting">Cutting</option>
                  <option value="W/H">W/H</option>
                </select>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">TERM</label>
                <select
                  value={selectedFilter}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                >
                  <option value="ALL">ALL</option>
                  <option value="Over 1 week">Over 1 week</option>
                  <option value="Over 2 weeks">Over 2 weeks</option>
                  <option value="Over 3 weeks">Over 3 weeks</option>
                  <option value="Over 4 weeks">Over 4 weeks</option>
                </select>
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
                    {filteredModelOptions.map((Model) => (
                      <Combobox.Option
                        key={Model}
                        value={Model}
                        className={({ active }) =>
                          classNames(
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                            active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span className={classNames('block truncate', selected && 'font-semibold')}>{Model}</span>
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
                      <table className="min-w-full divide-y divide-neutral-950 sticky-header border border-slate-500">
                        <thead className="bg-slate-300">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                              P-CARD
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                              WORK CENTER
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
                              TERMS
                            </th>
                          </tr>
                          <tr>
                            <th scope="col" colSpan={8} className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                              TOTAL
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            {totalQty}
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
                        {data.map((item, index) => {
                              const scanDate = new Date(item.SCAN_DATE);
                              const selected = new Date(selectedDate);
                              scanDate.setHours(0, 0, 0, 0);
                              selected.setHours(0, 0, 0, 0);
                              const differenceInTime = Math.abs(selected - scanDate);
                              const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
                               // Logika filter
                              let shouldDisplay = true;
                              switch(selectedFilter) {
                                case 'Over 1 week':
                                  shouldDisplay = differenceInDays >= 7; // Menampilkan hanya jika lebih dari 1 minggu
                                  break;
                                case 'Over 2 weeks':
                                  shouldDisplay = differenceInDays >= 14; // Menampilkan hanya jika lebih dari 2 minggu
                                  break;
                                case 'Over 3 weeks':
                                  shouldDisplay = differenceInDays >= 21; // Menampilkan hanya jika lebih dari 3 minggu
                                  break;
                                case 'Over 4 weeks':
                                  shouldDisplay = differenceInDays >= 28; // Menampilkan hanya jika lebih dari 4 minggu
                                  break;
                                default:
                                  shouldDisplay = true; // Menampilkan semua jika tidak ada filter yang dipilih
                              }

                              if(shouldDisplay) {
                                return (
                              <tr key={index}>
                                <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                                  {item.SCAN_DATE}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.WC}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.RELEASE}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.STYLE}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.STYLE_NAME}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.GENDER_S}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.SIZE}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.REQ}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {item.QTY}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                  {differenceInDays}
                                </td>
                              </tr>
                           );
                          } else {
                            return null; // Jika tidak memenuhi kriteria filter, tidak akan ditampilkan
                          }
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

export default InventoryLongTerm;
