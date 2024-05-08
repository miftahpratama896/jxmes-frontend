import React, { useState, useEffect } from "react";
import Logo from "../../assets/img/New Logo White.png";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ProductResultTargetSPKAll = () => {
    useEffect(() => {
        const user_id = localStorage.getItem("user_id");
        const sendDataToBackend = async () => {
            try {
                const data = {
                    division: "JXMES-WEB",
                    menuName: "PRODUCT",
                    programName: "PRODUCT RESULT - TARGET LINE",
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
    const [updating, setUpdating] = useState(false); // State untuk menunjukkan apakah sedang dalam proses pembaruan
    const [selectedOption, setSelectedOption] = useState("JXSPKAll");
    const [numColumns, setNumColumns] = useState(0);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);

        // Tambahkan logika navigasi sesuai dengan opsi yang dipilih
        if (e.target.value === "Line") {
            window.location.href = "/ProductResultTargetLine";
        } else if (e.target.value === "Model") {
            window.location.href = "/ProductResultTargetModel";
        } else if (e.target.value === "JXLine") {
            window.location.href = "/ProductResultTargetJXLine";
        } else if (e.target.value === "JXSPK") {
            window.location.href = "/ProductResultTargetJXSPK";
        }
        else if (e.target.value === "JXSPKAll") {
            window.location.href = "/ProductResultTargetJXSPKAll";
        }
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

    // Menetapkan dateFrom ke 1 pada bulan ini
    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    const [dateFrom, setDateFrom] = useState(formatDate(firstDayOfMonth));

    // Menetapkan dateTo ke tanggal sekarang
    const [dateTo, setDateTo] = useState(formatDate(currentDate));

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    // Fungsi untuk menghitung Rate
    const calculateRate = (target, production) => {
        if (target === 0) {
            return 0;
        }
        return ((production / target) * 100).toFixed(2);
    };

    const fetchData = async () => {
        try {
            setUpdating(true); // Mulai proses pembaruan
            // Mengganti URL sesuai dengan endpoint Express.js Anda
            const response = await fetch(
                "http://172.16.200.28:3000/api/product-result-target",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        DATEFROM: dateFrom,
                        DATETO: dateTo,
                        PLANT: "ALL",
                        D_CEK: 6,
                        D_ST: 1,
                    }),
                }
            );

            const result = await response.json();

            // Menampilkan data di console
            console.log("Data from server:", result.result);

            // Mengupdate state dengan hasil data dari server
            setData(result.result);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setUpdating(false); // Selesai proses pembaruan
        }
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
    }, [autoUpdate, dateFrom, dateTo]);

    const totalSPK = data.reduce((total, item) => {
        return total + item.SPK;
    }, 0) / 2;

    const totalProd = data.reduce((total, item) => {
        return total + item.PROD;
    }, 0) / 2;
    const totalDiff = data.reduce((total, item) => {
        return total + item.DIFF;
    }, 0) / 2;
    const totalRate = data.reduce((total, item) => {
        return total + item.RADIO;
    }, 0) / 2;
    const AveragePercentage = (totalProd / totalSPK) * 100;

    const totalWHOutput = data.reduce((total, item) => {
        return total + item.WH_OUTPUT;
    }, 0) / 2;
    const totalWHDiff = data.reduce((total, item) => {
        return total + item.WH_DIFF;
    }, 0) / 2;
    const totalWHRate = data.reduce((total, item) => {
        return total + item.WH_RADIO;
    }, 0) / 2;
    const AveragePercentage2 = (totalWHOutput / totalSPK) * 100;


    return (
        <>
            <main className="py-12">
                <div className="mx-auto max-w-full px-6 lg:px-1">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center py-3">
                            <div className="sm:flex-auto">
                                <h1 className="text-base font-semibold leading-6 text-gray-900">
                                    Product
                                </h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    A list of all the Product [Result - Target]
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <p className="bg-green-200 text-green-800 inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0">
                                    RATE {">"}= 100
                                </p>
                                <p className="bg-yellow-200 text-yellow-800 inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0">
                                    RATE {">"}= 98
                                </p>
                                <p className="bg-red-200 text-red-800 inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0">
                                    RATE {"<"}= 97
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <label
                                    htmlFor="productOption"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    DATE FROM
                                </label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <label
                                    htmlFor="productOption"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    DATE TO
                                </label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <label
                                    htmlFor="productOption"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    FILTER
                                </label>
                                <select
                                    id="productOption"
                                    name="productOption"
                                    onChange={handleOptionChange}
                                    value={selectedOption}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                >
                                    <option value="Line">JX/JX2 Line</option>
                                    <option value="JXLine">JX Line (Day)</option>
                                    <option value="JXSPK">JX SPK (Day)</option>
                                    <option value="JXSPKAll">JX SPK (All)</option>
                                    <option value="Model">Model</option>
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
                        <div className="mt-8 flow-root">
                            <div className="relative -mx-4 -my-2 overflow-y-scroll overflow-x-scroll sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <div className=" shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                        <div className="max-h-[70vh] max-w-screen ">
                                            <table className="min-w-full divide-y divide-neutral-950 border border-slate-500 ">
                                                <thead className="bg-slate-300 ">
                                                    <tr className="sticky top-0 text-white z-20  whitespace-nowrap">
                                                        <th
                                                            scope="col"
                                                            className="bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            JX LINE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            RELEASE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            STYLE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            MODEL
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            SPK
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="bg-green-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            PROD
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="bg-green-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            DIFF
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="bg-green-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            RATE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="bg-blue-950 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            W/H OUT
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="bg-blue-950 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            DIFF
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="bg-blue-950 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            RATE
                                                        </th>
                                                    </tr>
                                                    <tr className="sticky top-12 text-gray-900 z-10 bg-orange-500 whitespace-nowrap">
                                                        <th
                                                            scope="col"
                                                            colSpan={4}
                                                            className="g-orange-500 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                                        >
                                                            TOTAL
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalSPK.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalProd.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalDiff.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className={`px-3 py-3.5 text-center text-sm font-semibold ${AveragePercentage >= 100
                                                                ? "bg-green-400"
                                                                : AveragePercentage >= 98
                                                                    ? "bg-yellow-400"
                                                                    : "bg-red-400"}`}
                                                        >
                                                            {AveragePercentage.toFixed(2)}%
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalWHOutput.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalWHDiff.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className={`px-3 py-3.5 text-center text-sm font-semibold ${AveragePercentage2 >= 100
                                                                ? "bg-green-400"
                                                                : AveragePercentage2 >= 98
                                                                    ? "bg-yellow-400"
                                                                    : "bg-red-400"}`}
                                                        >
                                                            {AveragePercentage2.toFixed(2)}%
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
                                                    {data?.map((item, index) => {

                                                        return (
                                                            <tr key={index}>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.RLS === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {item.LINE}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.RLS === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {item.RLS}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.RLS === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {item.STYLE}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.RLS === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {item.MODEL}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.RLS === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {item.SPK.toLocaleString()}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.RLS === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {item.PROD.toLocaleString()}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.RLS === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'} ${item.DIFF < 0 ? 'text-red-500' : ''}`}>
                                                                    {item.DIFF.toLocaleString()}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.RADIO >= 100
                                                                    ? "bg-green-400"
                                                                    : item.RADIO >= 98
                                                                        ? "bg-yellow-400"
                                                                        : "bg-red-400"}`}>
                                                                    {item.RADIO.toFixed(2)}%
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.RLS === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {item.WH_OUTPUT.toLocaleString()}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.RLS === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'} ${item.WH_DIFF < 0 ? 'text-red-500' : ''}`}>
                                                                    {item.WH_DIFF.toLocaleString()}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.WH_RADIO >= 100
                                                                    ? "bg-green-400"
                                                                    : item.WH_RADIO >= 98
                                                                        ? "bg-yellow-400"
                                                                        : "bg-red-400"}`}>
                                                                    {item.WH_RADIO.toFixed(2)}%
                                                                </td>

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
};

export default ProductResultTargetSPKAll;
