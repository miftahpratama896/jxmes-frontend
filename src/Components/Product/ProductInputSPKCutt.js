import React, { useState, Fragment, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

function ProductInputSPKCutt() {
    const history = useHistory();
    useEffect(() => {
        const user_id = localStorage.getItem("user_id");
        const sendDataToBackend = async () => {
          try {
            const data = {
              division: "JXMES-WEB",
              menuName: "PRODUCT",
              programName: "PRODUCT - INPUT SPK CUTTING",
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

    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [uniqueComponents, setUniqueComponents] = useState([]);
    const [uniqueModel, setUniqueModel] = useState([]);
    const [uniqueMaterial, setUniqueMaterial] = useState([]);
    const [filteredMaterials, setFilteredMaterials] = useState([]);

    const [formData, setFormData] = useState({
        LINE: '',
        STYLE: '',
        MODEL: '',
        COMPONENT: '',
        MATERIAL: '',
        CUTT_PROCESS_DATE: '',
        TOTAL_DAILY_PLAN: 0,
        TOTAL_DAILY_ACTUAL: 0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Jika yang berubah adalah MODEL, reset COMPONENT dan MATERIAL
        if (name === 'MODEL') {
            setFormData(prevState => ({
                ...prevState,
                COMPONENT: '',
                MATERIAL: ''
            }));
        }
        
        // Jika yang berubah adalah COMPONENT, filter material sesuai dengan komponen yang dipilih
        if (name === 'COMPONENT') {
            const selectedComponent = value;
            const filteredMaterial = new Set(data.filter(item => item.COMPONENT === selectedComponent).map(item => item.MATERIAL));
            setFilteredMaterials([...filteredMaterial]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://172.16.200.28:3000/input-spk-cutting', formData);
            console.log(response.data);
            // Reset form data after successful submission
            setFormData({
                LINE: '',
                STYLE: '',
                MODEL: '',
                COMPONENT: '',
                MATERIAL: '',
                CUTT_PROCESS_DATE: '',
                TOTAL_DAILY_PLAN: 0,
                TOTAL_DAILY_ACTUAL: 0
            });
            setShow(true);
            // Refresh halaman setelah 1 detik
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    useEffect(() => {
        // Mendapatkan data dari server Express.js
        axios.get('http://172.16.200.28:3000/barcode-cutt')
            .then(response => {
                setData(response.data);
                // Membuat array unik dari nilai COMPONENT
                const uniqueComponents = [...new Set(response.data.map(item => item.COMPONENT))];
                setUniqueComponents(uniqueComponents);
                // Membuat array unik dari nilai MODEL
                const uniqueModel = [...new Set(response.data.map(item => item.MODEL))];
                setUniqueModel(uniqueModel);
                // Membuat array unik dari nilai MATERIAL
                const uniqueMaterial = [...new Set(response.data.map(item => item.MATERIAL))];
                setUniqueMaterial(uniqueMaterial);
            })
            .catch(error => {
                console.error('Terjadi kesalahan:', error);
            });
    }, []);

    useEffect(() => {
        // Filter material berdasarkan komponen yang dipilih
        if (formData.COMPONENT) {
            const filteredMaterial = new Set(data.filter(item => item.COMPONENT === formData.COMPONENT).map(item => item.MATERIAL));
            setFilteredMaterials([...filteredMaterial]);
        } else {
            // Jika komponen tidak dipilih, atur material yang difilter menjadi kosong
            setFilteredMaterials([]);
        }
    }, [formData.COMPONENT, data]);

    return (
        <>
            <div className="max-w-md mx-auto m-4 p-6 bg-white rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">FORM INPUT SPK - CUTTING</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="LINE">LINE</label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            name="LINE"
                            value={formData.LINE}
                            onChange={handleChange}
                        >
                            <option value="">Select Line</option>
                            {[...Array(16)].map((_, index) => (
                                <option key={index + 1} value={index + 1}>{index + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="STYLE">STYLE</label>
                        <input className="w-full border border-gray-300 rounded-md px-3 py-2" type="text" name="STYLE" value={formData.STYLE} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="MODEL">MODEL</label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            name="MODEL"
                            value={formData.MODEL}
                            onChange={handleChange}
                        >
                            <option value="">Select Model</option>
                            {uniqueModel.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                    {formData.MODEL && (
                        <div className="mb-4">
                            <label className="block mb-1" htmlFor="COMPONENT">COMPONENT</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                name="COMPONENT"
                                value={formData.COMPONENT}
                                onChange={handleChange}
                            >
                                <option value="">Select Component</option>
                                {uniqueComponents.map(component => (
                                    <option key={component} value={component}>{component}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {filteredMaterials.length > 0 && (
                        <div className="mb-4">
                            <label className="block mb-1" htmlFor="MATERIAL">MATERIAL</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                name="MATERIAL"
                                value={formData.MATERIAL}
                                onChange={handleChange}
                            >
                                <option value="">Select Material</option>
                                {filteredMaterials.map(material => (
                                    <option key={material} value={material}>{material}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="CUTT_PROCESS_DATE">CUTT PROCESS DATE</label>
                        <input className="w-full border border-gray-300 rounded-md px-3 py-2" type="date" name="CUTT_PROCESS_DATE" value={formData.CUTT_PROCESS_DATE} onChange={handleChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="TOTAL_DAILY_PLAN">TOTAL DAILY PLAN</label>
                        <input className="w-full border border-gray-300 rounded-md px-3 py-2" type="number" name="TOTAL_DAILY_PLAN" value={formData.TOTAL_DAILY_PLAN} onChange={handleChange} />
                    </div>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-600" type="submit">Submit</button>
                </form>
            </div>
            <div
                aria-live="assertive"
                className="pointer-events-none z-20 fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
            >
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                    <Transition
                        show={show}
                        as={Fragment}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">Successfully submit!</p>
                                    </div>
                                    <div className="ml-4 flex flex-shrink-0">
                                        <button
                                            type="button"
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => {
                                                setShow(false)
                                            }}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </>
    );
}

export default ProductInputSPKCutt;
