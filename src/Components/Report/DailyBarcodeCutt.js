import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import Logo from "../../assets/img/New Logo White.png";

const DailyBarcodeCutt = () => {
  const history = useHistory();

  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [selectedLine, setSelectedLine] = useState(0);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  // Fungsi untuk mendapatkan tanggal hari ini dengan format YYYY-MM-DD
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const fetchData = async () => {
    try {
      setUpdating(true);
      const response = await axios.get(`http://172.16.206.4:3003/monitoring-barcode?LINE=${selectedLine}&DATE=${selectedDate}`); // Sesuaikan dengan URL endpoint Anda
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
    setUpdatedData(item);
  };

  // Fungsi untuk menutup modal update
  const closeUpdateModal = () => {
    setSelectedData(null);
    setUpdatedData({});
  };

  const handleSubmit = async () => {
    try {
      // Kirim data pembaruan ke backend menggunakan axios
      await axios.put(`http://172.16.206.4:3003/spk-cutt/${selectedData.LINE}/${selectedData.CUTT_PROCESS_DATE}/${selectedData.COMPONENT}`, updatedData);
      // Refresh data setelah berhasil memperbarui
      const response = await axios.get('http://172.16.206.4:3003/spk-cutt');
      setData(response.data);
      // Tutup modal update
      closeUpdateModal();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

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
                  A list of all the Daily Barcode Cutting
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
                              className="sticky top-0 bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold sm:pl-6"
                            >
                              DATE
                            </th>
                            <th
                              scope="col"
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              LINE
                            </th>
                            <th
                              scope="col"
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              NO MACHINE
                            </th>
                            <th
                              scope="col"
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              BARCODE
                            </th>
                            <th
                              scope="col"
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              SIZE
                            </th>
                            <th
                              scope="col"
                              className="sticky bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold"
                            >
                              TOTAL COUNTER
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
                          {data.map((item) => (
                            <tr key={item.index}>
                              <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                              {formatDate(item.DATE)}
                              </td>
                              <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.LINE}
                              </td>
                              <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.NO_MACHINE}
                              </td>
                              <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.BARCODE}
                              </td>
                              <td className=" bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.SIZE}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">
                                {item.TOTAL_COUNTER_BARCODE}
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
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Update Data</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">LINE</label>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full"
                name="LINE"
                value={updatedData.LINE || ""}
                onChange={(e) => setUpdatedData({ ...updatedData, LINE: e.target.value })}
              />
            </div>
            {/* Tambahkan input untuk setiap kolom data yang ingin diupdate */}
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleSubmit}
              >
                Update
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={closeUpdateModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyBarcodeCutt;
