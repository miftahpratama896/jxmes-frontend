import React, { useState, useEffect } from "react";
import Logo from "../../assets/img/New Logo White.png";
import { useHistory } from "react-router-dom";
import axios from "axios";

const JXJX2StatusRetur = () => {
    useEffect(() => {
        const user_id = localStorage.getItem("user_id");
        const sendDataToBackend = async () => {
            try {
                const data = {
                    division: "JXMES-WEB",
                    menuName: "REPORT",
                    programName: "JX-JX2 STATUS RETUR",
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


    const [autoUpdate, setAutoUpdate] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [data, setData] = useState([]);
    const [fromDate, setFromDate] = useState('2024-05-24');
    const [toDate, setToDate] = useState('2024-05-24');
    const [selectedStyle, setSelectedStyle] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [release, setRelease] = useState(" ");
    const [selectedPCard, setSelectedPCard] = useState("");
    const [dChek, setDChek] = useState(0);
    const [selectedJXLine, setSelectedJXLine] = useState("");
    const [filteredJXLineOptions, setFilteredJXLineOptions] = useState([]);
    const [uniqueStyleOptions, setUniqueStyleOptions] = useState([]);
    const [uniqueModelOptions, setUniqueModelOptions] = useState([]);
    const [uniqueGenderOptions, setUniqueGenderOptions] = useState([]);
    const [uniquePCardOptions, setUniquePCardOptions] = useState([]);
    const [totalKirimJX, settotalKirimJX] = useState(0);
    const [totalTerimaJX, settotalTerimaJX] = useState(0);
    const [totalKirimJX2, settotalKirimJX2] = useState(0);
    const [totalTerimaJX2, settotalTerimaJX2] = useState(0);

    const convertToCustomFormat = (dateString) => {
        if (dateString.trim() === "") {
            return ""; // Jika release adalah string kosong, kembalikan string kosong
        }

        const dateObj = new Date(dateString);
        const year = String(dateObj.getFullYear()).slice(-2);
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return `${day}${month}${year}`;
    };
    const convertedRelease = convertToCustomFormat(release);

    const fetchData = async () => {
        try {
            setUpdating(true);
            const response = await axios.post('http://172.16.200.28:3000/jxjx2-status-retur', {
                FROM_DATE: fromDate,
                TO_DATE: toDate,
                CELL_JX: selectedJXLine,
                D_STYLE: selectedStyle,
                D_MODEL: selectedModel,
                D_GENDER: selectedGender,
                D_RLS: convertedRelease,
                D_BARCODE: selectedPCard,
                D_CHEK: dChek
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
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
    }, [autoUpdate, fromDate, toDate, selectedJXLine, selectedStyle, selectedModel, selectedGender, release, selectedPCard, dChek]);

    useEffect(() => {
        const uniqueJXLineOptions = [...new Set(data.map((item) => item.JXLINE))];
        setFilteredJXLineOptions(uniqueJXLineOptions);

        const uniqueStyles = [...new Set(data.map((item) => item.STYLE))];
        setUniqueStyleOptions(uniqueStyles);

        const uniqueModelOptions = [...new Set(data.map((item) => item.MODEL))];
        setUniqueModelOptions(uniqueModelOptions);

        const uniqueGenderOptions = [...new Set(data.map((item) => item.GENDER))];
        setUniqueGenderOptions(uniqueGenderOptions);

        const uniquePCardOptions = [...new Set(data.map((item) => item.PCARD))];
        setUniquePCardOptions(uniquePCardOptions);
    }, [data]);

    useEffect(() => {
        // Menghitung total data yang keluar dari item.SCAN_WH_INPUT
        let totalKirimJX = 0;
        let totalTerimaJX = 0;
        let totalKirimJX2 = 0;
        let totalTerimaJX2 = 0;
        data.forEach((item) => {
            if (item.KIRIM_JX) {
                totalKirimJX += item.QTY;
            }
            if (item.TERIMA_JX2) {
                totalTerimaJX += item.QTY;
            }
            if (item.KIRIM_JX2) {
                totalKirimJX2 += item.QTY;
            }
            if (item.TERIMA_JX) {
                totalTerimaJX2 += item.QTY;
            }
        });
        settotalKirimJX(totalKirimJX);
        settotalTerimaJX(totalTerimaJX);
        settotalKirimJX2(totalKirimJX2);
        settotalTerimaJX2(totalTerimaJX2);
    }, [data]);

    console.log(data)

    return (
        <>
            <main className="py-12">
                <div className="mx-auto max-w-full px-6 lg:px-1">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center py-3">
                            <div className="sm:flex-auto">
                                <h1 className="text-base font-semibold leading-6 text-gray-900">
                                    Report
                                </h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    A list of all the JX-JX2 Status Retur
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <label
                                    htmlFor="yesdayDate"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    DATE FROM
                                </label>
                                <input
                                    type="date"
                                    id="yesdayDate"
                                    name="yesdayDate"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                />
                            </div>
                            {/* Combobox for selecting Today Date */}
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <label
                                    htmlFor="todayDate"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    DATE TO
                                </label>
                                <input
                                    type="date"
                                    id="todayDate"
                                    name="todayDate"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    JX LINE
                                </label>
                                <select
                                    value={selectedJXLine}
                                    onChange={(e) => setSelectedJXLine(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                >
                                    <option value="">All JX Lines</option>
                                    {/* Isi dropdown dengan opsi JX_LINE */}
                                    {filteredJXLineOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    STYLE
                                </label>
                                <select
                                    value={selectedStyle}
                                    onChange={(e) => setSelectedStyle(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                >
                                    <option value="">All Styles</option>
                                    {/* Isi dropdown dengan opsi STYLE */}
                                    {uniqueStyleOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Dropdown untuk MODEL */}
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    MODEL
                                </label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                >
                                    <option value="">All Models</option>
                                    {/* Isi dropdown dengan opsi MODEL */}
                                    {uniqueModelOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Dropdown untuk GENDER */}
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    GENDER
                                </label>
                                <select
                                    value={selectedGender}
                                    onChange={(e) => setSelectedGender(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                >
                                    <option value="">All Genders</option>
                                    {/* Isi dropdown dengan opsi GENDER */}
                                    {uniqueGenderOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    P-CARD
                                </label>
                                <select
                                    value={selectedPCard}
                                    onChange={(e) => setSelectedPCard(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                                >
                                    <option value="">All PCards</option>
                                    {/* Isi dropdown dengan opsi PCARD */}
                                    {uniquePCardOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
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
                                    onClick={() => setRelease("")} // Mengatur release menjadi string kosong saat tombol diklik
                                    className="mt-2 px-4 py-1 sm:ml-4 rounded-md bg-gray-700 text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Clear Release
                                </button>
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
                                                            rowSpan={2}
                                                            className="bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            JX LINE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            rowSpan={2}
                                                            className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            RELEASE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            rowSpan={2}
                                                            className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            STYLE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            rowSpan={2}
                                                            className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            MODEL
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            rowSpan={2}
                                                            className=" bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            GENDER
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            rowSpan={2}
                                                            className="bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            SIZE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            rowSpan={2}
                                                            className="bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            QTY
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            rowSpan={2}
                                                            className="bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            P-CARD
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            SEND TO JX
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            RECEIVED BY JX2
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            SEND TO JX2
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="bg-gray-900 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-50 sm:pl-6"
                                                        >
                                                            RECEIVED BY JX
                                                        </th>
                                                    </tr>
                                                    <tr className="sticky top-12 text-gray-900 z-10 bg-orange-500 whitespace-nowrap">
                                                        <th
                                                            scope="col"
                                                            className="g-orange-500 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                                        >
                                                            {totalKirimJX.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="g-orange-500 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                                        >
                                                            {totalKirimJX2.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="g-orange-500 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                                        >
                                                            {totalKirimJX2.toLocaleString()}
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="g-orange-500 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                                                        >
                                                            {totalTerimaJX.toLocaleString()}
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
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}>
                                                                    {item.JXLINE}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}>
                                                                    {item.RELEASE}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}>
                                                                    {item.STYLE}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}>
                                                                    {item.MODEL}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}>
                                                                    {item.GENDER}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}>
                                                                    {item.SIZE}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}>
                                                                    {item.QTY}
                                                                </td>
                                                                <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6`}>
                                                                    {item.PCARD}
                                                                </td>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm font-medium text-gray-900 sm:pl-6">
                                                                    {item.KIRIM_JX ? (
                                                                        <>
                                                                            {new Date(item.KIRIM_JX)
                                                                                .toLocaleDateString("en-GB", {
                                                                                    day: "2-digit",
                                                                                    month: "long",
                                                                                    year: "numeric",
                                                                                })
                                                                                .replace(/\//g, "-")}{" "}
                                                                            {new Date(item.KIRIM_JX).toLocaleTimeString("en-US", {
                                                                                hour12: true,
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                                second: "2-digit",
                                                                            })}
                                                                        </>
                                                                    ) : null}
                                                                </td>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm font-medium text-gray-900 sm:pl-6">
                                                                    {item.TERIMA_JX2 ? (
                                                                        <>
                                                                            {new Date(item.TERIMA_JX2)
                                                                                .toLocaleDateString("en-GB", {
                                                                                    day: "2-digit",
                                                                                    month: "long",
                                                                                    year: "numeric",
                                                                                })
                                                                                .replace(/\//g, "-")}{" "}
                                                                            {new Date(item.TERIMA_JX2).toLocaleTimeString("en-US", {
                                                                                hour12: true,
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                                second: "2-digit",
                                                                            })}
                                                                        </>
                                                                    ) : null}
                                                                </td>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm font-medium text-gray-900 sm:pl-6">
                                                                    {item.KIRIM_JX2 ? (
                                                                        <>
                                                                            {new Date(item.KIRIM_JX2)
                                                                                .toLocaleDateString("en-GB", {
                                                                                    day: "2-digit",
                                                                                    month: "long",
                                                                                    year: "numeric",
                                                                                })
                                                                                .replace(/\//g, "-")}{" "}
                                                                            {new Date(item.KIRIM_JX2).toLocaleTimeString("en-US", {
                                                                                hour12: true,
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                                second: "2-digit",
                                                                            })}
                                                                        </>
                                                                    ) : null}
                                                                </td>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm font-medium text-gray-900 sm:pl-6">
                                                                    {item.TERIMA_JX ? (
                                                                        <>
                                                                            {new Date(item.TERIMA_JX)
                                                                                .toLocaleDateString("en-GB", {
                                                                                    day: "2-digit",
                                                                                    month: "long",
                                                                                    year: "numeric",
                                                                                })
                                                                                .replace(/\//g, "-")}{" "}
                                                                            {new Date(item.TERIMA_JX).toLocaleTimeString("en-US", {
                                                                                hour12: true,
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                                second: "2-digit",
                                                                            })}
                                                                        </>
                                                                    ) : null}
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

export default JXJX2StatusRetur;
