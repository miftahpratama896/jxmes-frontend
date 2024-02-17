import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function Example() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false); // State untuk menunjukkan apakah sedang dalam proses pembaruan
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const fetchData = async () => {
    const apiUrl = 'http://172.16.206.4:3000/api/monitoring';
    const requestBody = {
      PROD_DATE: selectedDate,
    };

    try {
      setUpdating(true); // Mulai proses pembaruan  
      const response = await axios.post(apiUrl, requestBody);
      const sortedData = response.data.sort((a, b) => a.LINE_GROUP.localeCompare(b.LINE_GROUP));
      setData(sortedData);
    } catch (err) {
      console.error('API Error:', err.message);
      setError(err.message);
    } finally {
        setUpdating(false); // Selesai proses pembaruan
      }
  };

  const totalUPSShift1 = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.NOSEW1 || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.NOSEW1 || 0);
  const totalUPSShift2 = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.NOSEW2 || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.NOSEW2 || 0);
  const totalUPSTotal = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.NOSEW3 || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.NOSEW3 || 0);
  const totalCuttingShift1 = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.CUTTING1 || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.CUTTING1 || 0);
  const totalCuttingShift2 = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.CUTTING2 || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.CUTTING2 || 0);
  const totalCuttingTotal = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.CUTTING3 || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.CUTTING3 || 0);
  const totalMarketWIP = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.MARKET_WIP || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.MARKET_WIP || 0);
  const totalMarketOutput = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.MARKET || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.MARKET || 0);
  const totalSewingInput = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.SEWING_INPUT || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.SEWING_INPUT || 0);
  const totalSewingWIP = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.SEWING_WIP || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.SEWING_WIP || 0);
  const totalSewingOutput = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.SEWING || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.SEWING || 0);
  const totalWHInput = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.['W/H_INPUT']|| 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.['W/H_INPUT'] || 0);
  const totalWHWIP = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.['W/H_WIP'] || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.['W/H_WIP'] || 0);
  const totalWHOutput = 
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1')?.['W/H'] || 0) +
    (data.find(item => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2')?.['W/H'] || 0);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    if (autoUpdate) {
        fetchData();
      
      // Set interval untuk melakukan pembaruan setiap 30 detik
      const intervalId = setInterval(() => {
        fetchData();
      }, 30000);
      
      // Membersihkan interval pada saat komponen unmount
      return () => clearInterval(intervalId);
    } else {
      // Pemanggilan pertama kali saat komponen dipasang
      fetchData();
    }
  }, [autoUpdate,selectedDate]);

  console.log('Render Data:', data);

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
          }
          
          .sticky-header thead tr:first-child th {
            color: #D1D5DB;
          }
          
          .sticky-header thead tr:nth-child(2) th {
            position: sticky;
            top: 68px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
            background-color: #FA7625;
            z-index: 2;
          }
          .sticky-header thead tr:nth-child(3) th {
            position: sticky;
            top: 116px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
            background-color: #FA7625;
            z-index: 3;
          }
          .sticky-header thead tr:nth-child(4) th {
            position: sticky;
            top: 164px; /* Jarak antara subheader dan header pertama, sesuaikan sesuai kebutuhan */
            background-color: #B84600;
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
                            <h1 className="text-base font-semibold leading-6 text-gray-900">Monitoring</h1>
                            <p className="mt-2 text-sm text-gray-700">
                            A list of all the process
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-4">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Date
                        </label> 
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="border border-gray-300 px-2 py-1"
                                />
                              
                        </div>
                        
                        <div className="mt-4 sm:mt-0 sm:ml-4">
                        <div className="flex space-x-2">
                           {/* Checkbox for automatic updates */}
                           <input
                                type="checkbox"
                                id="autoUpdateCheckbox"
                                checked={autoUpdate}
                                onChange={() => setAutoUpdate(!autoUpdate)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <label htmlFor="autoUpdateCheckbox" className="ml-2 text-sm text-gray-700">
                                Auto Update
                                </label>
                        </div>
                        </div>
                        </div>
                        <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <div className="table-container">
                            {updating && (
                                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <span className="text-white">Loading data...</span>
                                </div>
                                )}
                                <table className="min-w-full divide-y divide-neutral-950 sticky-header">
                                <thead className="bg-slate-300">
                                    <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                                        Plant
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Model
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Gender
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        UPS [SHIFT1]
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        UPS [SHIFT2]
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        UPS [TOTAL]
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Cutting [SHIFT1]
                                    </th>  
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Cutting [SHIFT2]
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Cutting [TOTAL]
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Market [WIP]
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Market [OUTPUT]
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Sewing [INPUT]
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Sewing [WIP]
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Sewing [OUTPUT]
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        W/H [INPUT]
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        W/H [WIP]
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        W/H [OUTPUT]
                                    </th> 
                                    </tr>
                                    {data.map((item, index) => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F1' && (
                                    <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                                      {item.LINE_GROUP}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {item.STYLE_S_NAME}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {item.GENDER_S}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {item.NOSEW1?.toLocaleString()}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {item.NOSEW2?.toLocaleString()}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {item.NOSEW3?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.CUTTING1?.toLocaleString()}
                                    </th>  
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.CUTTING2?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.CUTTING3?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.MARKET_WIP?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.MARKET?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.SEWING_INPUT?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.SEWING_WIP?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.SEWING?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item['W/H_INPUT']?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item['W/H_WIP']?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item['W/H']?.toLocaleString()}
                                    </th> 
                                    </tr>
                                    ))}
                                    {data.map((item, index) => item.STYLE_S_NAME === 'SUB.TOTAL' && item.LINE_GROUP === 'F2' && (
                                    <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                                      {item.LINE_GROUP}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {item.STYLE_S_NAME}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {item.GENDER_S}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {item.NOSEW1?.toLocaleString()}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {item.NOSEW2?.toLocaleString()}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {item.NOSEW3?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.CUTTING1?.toLocaleString()}
                                    </th>  
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.CUTTING2?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.CUTTING3?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.MARKET_WIP?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.MARKET?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.SEWING_INPUT?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.SEWING_WIP?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item.SEWING?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item['W/H_INPUT']?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item['W/H_WIP']?.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {item['W/H']?.toLocaleString()}
                                    </th> 
                                    </tr>
                                    ))}
                                    <tr>
                                    <th scope="col" colSpan={3} className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        GRAND TOTAL
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                      {totalUPSShift1.toLocaleString()}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {totalUPSShift2.toLocaleString()}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {totalUPSTotal.toLocaleString()}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {totalCuttingShift1.toLocaleString()}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {totalCuttingShift2.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    {totalCuttingTotal.toLocaleString()}
                                    </th>  
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        {totalMarketWIP.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        {totalMarketOutput.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        {totalSewingInput.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        {totalSewingWIP.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        {totalSewingOutput.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        {totalWHInput.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        {totalWHWIP.toLocaleString()}
                                    </th> 
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        {totalWHOutput.toLocaleString()}
                                    </th> 
                                    </tr>
                                </thead>
                                
                                <tbody className="divide-y divide-neutral-950 bg-white">
                                    {data.map((item, index) => item.STYLE_S_NAME !== "SUB.TOTAL" && (
                                    <tr key={index}>
                                        <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ">
                                        {item.LINE_GROUP}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.STYLE_S_NAME}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.GENDER_S}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.NOSEW1.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.NOSEW2.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.NOSEW3.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.CUTTING1.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.CUTTING2.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.CUTTING3.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.MARKET_WIP.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.MARKET.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.SEWING_INPUT.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.SEWING_WIP.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item.SEWING.toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item['W/H_INPUT'].toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item['W/H_WIP'].toLocaleString()}</td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{item['W/H'].toLocaleString()}</td>
                                        
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
    )
  }
  