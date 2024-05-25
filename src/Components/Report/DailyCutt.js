import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";

const DailyCutt = () => {
  const history = useHistory();
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "REPORT",
          programName: "REPORT - DAILY SPK CUTTING",
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
  const [selectedData, setSelectedData] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [selectedLine, setSelectedLine] = useState(0);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [numColumns, setNumColumns] = useState(0);

  const fetchData = async () => {
    try {
      setUpdating(true);
      const response = await axios.get(`http://172.16.200.28:3000/spk-cutt?LINE=${selectedLine}&CUTT_PROCESS_DATE=${selectedDate}`);
      setData(response.data);
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
  }, [
    autoUpdate, selectedDate, selectedLine
  ]);


  console.log('LINE:', selectedLine)


  // Fungsi untuk mengubah format tanggal
  function formatDate(dateString) {
    // Mendefinisikan nama bulan
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // Mengubah string tanggal menjadi objek Date
    const date = new Date(dateString);

    // Mendapatkan tanggal, bulan, dan tahun dari objek Date
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Mengembalikan tanggal yang diformat
    return `${day} ${month} ${year}`;
  }

  // Fungsi untuk menampilkan modal update
  const openUpdateModal = (item) => {
    setSelectedData(item);
    // Menginisialisasi updatedData dengan data yang akan diupdate
    setUpdatedData({
      LINE: item.LINE,
      STYLE: item.STYLE,
      MODEL: item.MODEL,
      COMPONENT: item.COMPONENT,
      MATERIAL: item.MATERIAL,
      CUTT_PROCESS_DATE: item.CUTT_PROCESS_DATE,
      TOTAL_DAILY_PLAN: item.TOTAL_DAILY_PLAN,
      TOTAL_DAILY_ACTUAL: item.TOTAL_DAILY_ACTUAL
    });
  };

  // Fungsi untuk menutup modal update
  const closeUpdateModal = () => {
    setSelectedData(null);
    setUpdatedData({});
  };

  const handleSubmit = async () => {
    try {
      // Pastikan selectedData dan selectedData.ID tidak null atau undefined
      if (!selectedData || !selectedData.ID) {
        console.error('Selected data or its ID is missing.');
        return;
      }

      // Kirim data pembaruan ke backend menggunakan axios
      await axios.put(`http://172.16.200.28:3000/spk-cutt-update/${selectedData.ID}`, updatedData); // Menggunakan ID untuk update
      // Refresh data setelah berhasil memperbarui
      const response = await axios.get('http://172.16.200.28:3000/spk-cutt');
      setData(response.data);
      // Tutup modal update
      closeUpdateModal();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  // Fungsi untuk mendapatkan tanggal hari ini dengan format YYYY-MM-DD
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Mendapatkan nama kolom secara dinamis dari data yang memiliki format waktu
  const getColumnNames = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter((key) => key.match(/^\d{2}_\d{2}$/));
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

  console.log("Selected Data:", data);


  return (
    <>
      <main className="py-12">
        <div className="mx-auto max-w-full px-6 lg:px-1">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center py-3 z-20">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Report
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the Daily SPK Cutting
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label
                  htmlFor="line"
                  className="block text-sm font-medium text-gray-700"
                >
                  LINE
                </label>
                <select
                  id="line"
                  name="line"
                  onChange={(e) => setSelectedLine(parseInt(e.target.value))}
                  value={selectedLine}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                >
                  <option value="0">All</option> {/* Opsi default untuk menampilkan semua data */}
                  {/* Ambil nilai unik LINE dari data, urutkan secara ascending, kemudian buat opsi */}
                  {Array.from(new Set(data.map(item => item.LINE)))
                    .sort((a, b) => a - b)
                    .map(line => (
                      <option key={line} value={line}>LINE {line}</option>
                    ))}
                </select>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <label
                  htmlFor="cuttingDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  CUTTING PROCESS DATE
                </label>
                <input
                  type="date"
                  id="cuttingDate"
                  name="cuttingDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                />
              </div>

            </div>
            <div className="sm:flex sm:items-center ">
              <div className="sm:flex-auto"></div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <Link to="/ProductInputSPKCutt">
                  <button
                    className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-2 mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                  >
                    INPUT NEW SPK
                  </button>
                </Link>
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
                <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                  <div className=" shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <div className="max-h-[70vh] max-w-screen ">
                      <table className="min-w-full divide-y divide-neutral-950 border border-slate-500 ">
                        <thead className="bg-slate-300 ">
                          <tr className="sticky top-0 text-white z-10 bg-gray-900 whitespace-nowrap">
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky top-0 bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                            >
                              LINE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              STYLE
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              MODEL
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              COMPONENT
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              MATERIAL
                            </th>
                            <th
                              scope="col"
                              colSpan={2}
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              PPIC PLAN
                            </th>
                            <th
                              scope="col"
                              colSpan={numColumns}
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                              style={{
                                backgroundColor: "#374151",
                              }}
                            >
                              CUTTING PER HOUR
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky bg-gray-900  px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              TOTAL ACTUAL
                            </th>
                            <th
                              scope="col"
                              rowSpan={2}
                              className="sticky bg-gray-900  px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              ACTION
                            </th>
                          </tr>
                          <tr className="sticky top-12 text-white z-10 bg-gray-900 whitespace-nowrap">
                          <th
                              scope="col"
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              
                              CUTTING PROCESS DATE
                            </th>
                            <th
                              scope="col"
                              className="sticky bg-gray-900  px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              TOTAL PLAN
                            </th>
                            {columns.map((columnName, index) => {
                              // Split string based on underscore to separate hours and minutes
                              const [hour, minute] = columnName.split('_');
                              // Format the time string
                              const formattedTime = `${hour}:${minute}`;
                              return (
                                <th
                                  key={index}
                                  scope="col"
                                  className="sticky bg-gray-900  px-3 py-3.5 text-center text-sm font-semibold"
                                  style={{
                                    backgroundColor: "#374151",
                                  }}
                                >
                                  {formattedTime}
                                </th>
                              );
                            })}
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
                          {data.map((item) => (
                            <tr key={item.index}>
                              <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.LINE}
                              </td>
                              <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.STYLE}
                              </td>
                              <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.MODEL}
                              </td>
                              <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.COMPONENT}
                              </td>
                              <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.MATERIAL}
                              </td>
                              <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {formatDate(item.CUTT_PROCESS_DATE)}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.TOTAL_DAILY_PLAN}
                              </td>
                              {columns.map((columnName) => (
                                <td
                                  className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6"
                                >
                                  {item[columnName]}
                                </td>
                              ))}
                              <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium sm:pl-6 ${item.TOTAL_DAILY_ACTUAL >= item.TOTAL_DAILY_PLAN ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                {item.TOTAL_DAILY_ACTUAL}
                              </td>

                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                <button
                                  className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
                                  onClick={() => openUpdateModal(item)}
                                >
                                  UPDATE
                                </button>
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
      {selectedData && (
        <div className="fixed inset-0 overflow-y-auto z-20">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeUpdateModal}></div>
            <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Update Data</h2>
              <div className="mb-4">
                <label htmlFor="LINE" className="block text-sm font-semibold text-gray-700 mb-2">LINE</label>
                <input
                  type="text"
                  id="LINE"
                  name="LINE"
                  value={updatedData.LINE || ""}
                  readOnly
                  onChange={(e) => setUpdatedData({ ...updatedData, LINE: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="LINE" className="block text-sm font-semibold text-gray-700 mb-2">STYLE</label>
                <input
                  type="text"
                  id="STYLE"
                  name="STYLE"
                  value={updatedData.STYLE || ""}
                  readOnly
                  onChange={(e) => setUpdatedData({ ...updatedData, STYLE: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="MODEL" className="block text-sm font-semibold text-gray-700 mb-2">MODEL</label>
                <input
                  type="text"
                  id="MODEL"
                  name="MODEL"
                  value={updatedData.MODEL || ""}
                  readOnly
                  onChange={(e) => setUpdatedData({ ...updatedData, MODEL: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="LINE" className="block text-sm font-semibold text-gray-700 mb-2">COMPONENT</label>
                <input
                  type="text"
                  id="COMPONENT"
                  name="COMPONENT"
                  value={updatedData.COMPONENT || ""}
                  readOnly
                  onChange={(e) => setUpdatedData({ ...updatedData, COMPONENT: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="MATERIAL" className="block text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                <input
                  type="text"
                  id="MATERIAL"
                  name="MATERIAL"
                  value={updatedData.MATERIAL || ""}
                  readOnly
                  onChange={(e) => setUpdatedData({ ...updatedData, MATERIAL: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="CUTT_PROCESS_DATE" className="block text-sm font-semibold text-gray-700 mb-2">CUTTING PROCESS DATE</label>
                <input
                  type="date"
                  id="CUTT_PROCESS_DATE"
                  name="CUTT_PROCESS_DATE"
                  value={updatedData.CUTT_PROCESS_DATE ? new Date(updatedData.CUTT_PROCESS_DATE).toISOString().substr(0, 10) : ""}
                  onChange={(e) => setUpdatedData({ ...updatedData, CUTT_PROCESS_DATE: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="TOTAL_DAILY_PLAN" className="block text-sm font-semibold text-gray-700 mb-2">TOTAL PLAN</label>
                <input
                  type="text"
                  id="TOTAL_DAILY_PLAN"
                  name="TOTAL_DAILY_PLAN"
                  value={updatedData.TOTAL_DAILY_PLAN || ""}
                  readOnly
                  onChange={(e) => setUpdatedData({ ...updatedData, TOTAL_DAILY_PLAN: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="TOTAL_DAILY_ACTUAL" className="block text-sm font-semibold text-gray-700 mb-2">TOTAL ACTUAL</label>
                <input
                  type="text"
                  id="TOTAL_DAILY_ACTUAL"
                  name="TOTAL_DAILY_ACTUAL"
                  value={updatedData.TOTAL_DAILY_ACTUAL || ""}
                  onChange={(e) => setUpdatedData({ ...updatedData, TOTAL_DAILY_ACTUAL: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              {/* Tambahkan input untuk setiap kolom data yang ingin diupdate */}
              <div className="flex justify-end">
                <button
                  className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={handleSubmit}
                >
                  UPDATE
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={closeUpdateModal}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyCutt;
