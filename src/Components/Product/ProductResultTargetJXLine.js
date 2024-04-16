import React, { useState, useEffect } from "react";
import Logo from "../../assets/img/New Logo White.png";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ProductResultTargetJXLine = () => {
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
    const [selectedOption, setSelectedOption] = useState("JXLine");
    const [numColumns, setNumColumns] = useState(0);
    const [totalAllRowsPlan, setTotalAllRowsPlan] = useState(0);
    const [totalAllRowsCutt, setTotalAllRowsCutt] = useState(0);
    const [totalAllRowsSewIn, setTotalAllRowsSewIn] = useState(0);
    const [totalAllRowsSewOut, setTotalAllRowsSewOut] = useState(0);
    const [totalAllRowsWHIn, setTotalAllRowsWHIn] = useState(0);
    const [totalAllRowsWHOut, setTotalAllRowsWHOut] = useState(0);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);

        // Tambahkan logika navigasi sesuai dengan opsi yang dipilih
        if (e.target.value === "Line") {
            window.location.href = "/ProductResultTargetLine";
        } else if (e.target.value === "Model") {
            window.location.href = "/ProductResultTargetModel";
        } else if (e.target.value === "JXLine") {
            window.location.href = "/ProductResultTargetJXLine";
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
                        D_CEK: 4,
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

    const getColumnNames = () => {
        if (data.length === 0) return [];
        return Object.keys(data[0]).filter((key) =>
            key.match(/_\d$/)
        );
    };

    const calculateColumnTotal = (columnName) => {
        // Menggunakan reduce untuk menjumlahkan nilai-nilai dalam kolom columnName
        const total = data.reduce((accumulator, currentItem) => {
            return accumulator + currentItem[columnName];
        }, 0);

        // Kembalikan total
        return total / 2;
    };

    useEffect(() => {
        const columns = getColumnNames();
        setNumColumns(columns.length);
    }, [data]); // Jika data berubah, perbaharui jumlah kolom
    const columns = getColumnNames();

    useEffect(() => {
        let totalPlan = 0;
        let totalCutt = 0;
        let totalSewIn = 0;
        let totalSewOut = 0;
        let totalWHIn = 0;
        let totalWHOut = 0;

        data.forEach((item) => {
            const totalColumnValuePlan = columns.reduce((totalPlan, columnName) => {
                if (columnName.endsWith("_1")) {
                    return totalPlan + item[columnName];
                }
                return totalPlan;
            }, 0);
            const totalColumnValueCutt = columns.reduce((totalCutt, columnName) => {
                if (columnName.endsWith("_2")) {
                    return totalCutt + item[columnName];
                }
                return totalCutt;
            }, 0);
            const totalColumnValueSewIn = columns.reduce((totalSewIn, columnName) => {
                if (columnName.endsWith("_3")) {
                    return totalSewIn + item[columnName];
                }
                return totalSewIn;
            }, 0);
            const totalColumnValueSewOut = columns.reduce((totalSewOut, columnName) => {
                if (columnName.endsWith("_4")) {
                    return totalSewOut + item[columnName];
                }
                return totalSewOut;
            }, 0);
            const totalColumnValueWHIn = columns.reduce((totalWHIn, columnName) => {
                if (columnName.endsWith("_5")) {
                    return totalWHIn + item[columnName];
                }
                return totalWHIn;
            }, 0);
            const totalColumnValueWHOut = columns.reduce((totalWHOut, columnName) => {
                if (columnName.endsWith("_6")) {
                    // Check if columnName ends with '_1'
                    return totalWHOut + item[columnName];
                }
                return totalWHOut;
            }, 0);

            totalPlan += totalColumnValuePlan;
            totalCutt += totalColumnValueCutt;
            totalSewIn += totalColumnValueSewIn;
            totalSewOut += totalColumnValueSewOut;
            totalWHIn += totalColumnValueWHIn;
            totalWHOut += totalColumnValueWHOut;

        });

        setTotalAllRowsPlan(totalPlan / 2);
        setTotalAllRowsCutt(totalCutt / 2);
        setTotalAllRowsSewIn(totalSewIn / 2);
        setTotalAllRowsSewOut(totalSewOut / 2);
        setTotalAllRowsWHIn(totalWHIn / 2);
        setTotalAllRowsWHOut(totalWHOut / 2);

    }, [data, columns]);
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
                                    <option value="JXLine">JX Line</option>
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
                                                    <tr className="sticky top-0 text-white z-20 bg-gray-900 whitespace-nowrap">
                                                        <th
                                                            scope="col"
                                                            rowSpan={2}
                                                            className="sticky left-[0px] top-0 bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            JX LINE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            rowSpan={2}
                                                            className="sticky left-[73px] top-0 bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            STYLE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            colSpan={6}
                                                            className="sticky left-[177px] top-0 bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            TOTAL
                                                        </th>
                                                        {columns.map((columnName, index) => {
                                                            // Memeriksa apakah columnName berakhir dengan "_1"
                                                            if (columnName.endsWith("_1")) {
                                                                const displayName = columnName.replace(
                                                                    /_1$/,
                                                                    ""
                                                                );
                                                                const bgColor =
                                                                    index % 12 < 6 ? "#374151" : "";
                                                                const dateParts = displayName.split("-");
                                                                const monthNames = [
                                                                    "January", "February", "March",
                                                                    "April", "May", "June", "July",
                                                                    "August", "September", "October",
                                                                    "November", "December"
                                                                ];

                                                                const dateObject = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                                                                const day = dateObject.getDate();
                                                                const monthIndex = dateObject.getMonth();
                                                                const year = dateObject.getFullYear();

                                                                const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;

                                                                return (
                                                                    <th
                                                                        colSpan={6}
                                                                        key={index}
                                                                        scope="col"
                                                                        className="px-3 py-3.5 text-center text-sm font-semibold"
                                                                        style={{ backgroundColor: bgColor }}
                                                                    >
                                                                        {formattedDate}
                                                                    </th>
                                                                );
                                                            }
                                                            // Jika tidak, maka tidak merender elemen <th>
                                                            return null;
                                                        })}
                                                    </tr>
                                                    <tr className="sticky top-12 text-white z-10 bg-gray-800 whitespace-nowrap">
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[177px] bg-gray-800 top-0 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            PLAN
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[249px] bg-gray-800 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            CUTTING
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[333px] bg-gray-800 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            SEWING INPUT
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[455px] bg-gray-800 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            SEWING OUTPUT
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[599px] bg-gray-800 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            W/H IN
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[675px] bg-gray-800 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            W/H OUT
                                                        </th>
                                                        {columns.map((columnName, index) => {
                                                            let displayText = columnName;
                                                            let bgColor =
                                                                index % 12 < 6 ? "#374151" : "#1F2937"; // Memeriksa apakah indeks adalah ganjil atau genap per set grup tiga kolom
                                                            if (columnName.endsWith("_1")) {
                                                                displayText = "PLAN";
                                                            } else if (columnName.endsWith("_2")) {
                                                                displayText = "CUTTING";
                                                            } else if (columnName.endsWith("_3")) {
                                                                displayText = "SEWING INPUT";
                                                            } else if (columnName.endsWith("_4")) {
                                                                displayText = "SEWING OUTPUT";
                                                            } else if (columnName.endsWith("_5")) {
                                                                displayText = "W/H IN";
                                                            } else if (columnName.endsWith("_6")) {
                                                                displayText = "W/H OUT";
                                                            }

                                                            return (
                                                                <th
                                                                    key={index}
                                                                    scope="col"
                                                                    className="px-3 py-3.5 text-center text-sm font-semibold"
                                                                    style={{ backgroundColor: bgColor }}
                                                                >
                                                                    {displayText}
                                                                </th>
                                                            );
                                                        })}
                                                    </tr>
                                                    <tr className="sticky top-24 text-gray-900 z-10 bg-orange-500 whitespace-nowrap">
                                                        <th
                                                            scope="col"
                                                            colSpan={2}
                                                            className="sticky left-[0px] top-0 bg-orange-500 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                                        >
                                                            TOTAL
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[177px] px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalAllRowsPlan.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[249px] px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalAllRowsCutt.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[333px] px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalAllRowsSewIn.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[455px] px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalAllRowsSewOut.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[599px] px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalAllRowsWHIn.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="sticky left-[675px] px-3 py-3.5 text-center text-sm font-semibold bg-orange-500"
                                                        >
                                                            {totalAllRowsWHOut.toLocaleString()}
                                                        </th>
                                                        {columns.map((columnName, index) => (
                                                            <th
                                                                key={index}
                                                                scope="col"
                                                                className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium bg-orange-500 sm:pl-6`}
                                                            >
                                                                {calculateColumnTotal(
                                                                    columnName
                                                                ).toLocaleString()}
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
                                                    {data?.map((item, index) => {
                                                        let totalPlan = 0; // variabel untuk menyimpan total penjumlahan
                                                        let totalCutt = 0;
                                                        let totalsewIn = 0;
                                                        let totalsewOut = 0;
                                                        let totalWHIn = 0;
                                                        let totalWHOut = 0;
                                                        {
                                                            columns.map((columnName, colIndex) => {
                                                                if (columnName.endsWith("_1")) {
                                                                    // Hanya menjumlahkan nilai dari kolom yang memiliki akhiran "_1"
                                                                    const value =
                                                                        parseFloat(item[columnName]) || 0; // mengambil nilai dan mengonversi ke float, jika tidak valid maka 0
                                                                    totalPlan += value; // menambahkan nilai ke total
                                                                }
                                                                if (columnName.endsWith("_2")) {
                                                                    // Hanya menjumlahkan nilai dari kolom yang memiliki akhiran "_1"
                                                                    const valueCutt =
                                                                        parseFloat(item[columnName]) || 0; // mengambil nilai dan mengonversi ke float, jika tidak valid maka 0
                                                                    totalCutt += valueCutt; // menambahkan nilai ke total
                                                                }
                                                                if (columnName.endsWith("_3")) {
                                                                    // Hanya menjumlahkan nilai dari kolom yang memiliki akhiran "_1"
                                                                    const valueIn =
                                                                        parseFloat(item[columnName]) || 0; // mengambil nilai dan mengonversi ke float, jika tidak valid maka 0
                                                                    totalsewIn += valueIn; // menambahkan nilai ke total
                                                                }
                                                                if (columnName.endsWith("_4")) {
                                                                    // Hanya menjumlahkan nilai dari kolom yang memiliki akhiran "_1"
                                                                    const valueOut =
                                                                        parseFloat(item[columnName]) || 0; // mengambil nilai dan mengonversi ke float, jika tidak valid maka 0
                                                                    totalsewOut += valueOut; // menambahkan nilai ke total
                                                                }
                                                                if (columnName.endsWith("_5")) {
                                                                    // Hanya menjumlahkan nilai dari kolom yang memiliki akhiran "_1"
                                                                    const valueWHIn =
                                                                        parseFloat(item[columnName]) || 0; // mengambil nilai dan mengonversi ke float, jika tidak valid maka 0
                                                                    totalWHIn += valueWHIn; // menambahkan nilai ke total
                                                                }
                                                                if (columnName.endsWith("_6")) {
                                                                    // Hanya menjumlahkan nilai dari kolom yang memiliki akhiran "_1"
                                                                    const valueWHOut =
                                                                        parseFloat(item[columnName]) || 0; // mengambil nilai dan mengonversi ke float, jika tidak valid maka 0
                                                                    totalWHOut += valueWHOut; // menambahkan nilai ke total
                                                                }
                                                            })
                                                        }
                                                        return (
                                                            <tr key={index}>
                                                                <td className={`sticky left-[0px] whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.STYLE === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {item.JX_LINE}
                                                                </td>
                                                                <td className={`sticky left-[73px] whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.STYLE === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {item.STYLE}
                                                                </td>
                                                                <td className={`sticky left-[177px] whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.STYLE === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {totalPlan?.toLocaleString()}{" "}
                                                                </td>
                                                                <td className={`sticky left-[249px] whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.STYLE === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {totalCutt?.toLocaleString()}{" "}
                                                                </td>
                                                                <td className={`sticky left-[333px] whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.STYLE === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {totalsewIn?.toLocaleString()}{" "}
                                                                </td>
                                                                <td className={`sticky left-[455px] whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.STYLE === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {totalsewOut?.toLocaleString()}{" "}
                                                                </td>
                                                                <td className={`sticky left-[599px] whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.STYLE === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {totalWHIn?.toLocaleString()}{" "}
                                                                </td>
                                                                <td className={`sticky left-[675px] whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.STYLE === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}>
                                                                    {totalWHOut?.toLocaleString()}{" "}
                                                                </td>
                                                                {columns.map((columnName, colIndex) => (
                                                                    <td
                                                                        key={colIndex}
                                                                        className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6 ${item.STYLE === 'SUB_TOTAL' ? 'bg-gray-400' : 'bg-gray-50'}`}
                                                                    >
                                                                        {item[columnName]?.toLocaleString()}
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
};

export default ProductResultTargetJXLine;
