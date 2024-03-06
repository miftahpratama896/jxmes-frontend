import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import Logo from "../../assets/img/New Logo White.png";

const InventoryMesin = () => {
    useEffect(() => {
        const user_id = localStorage.getItem("user_id");
        const sendDataToBackend = async () => {
          try {
            const data = {
              division: "JXMES-WEB",
              menuName: "WIP",
              programName: "INVENTORY - MESIN",
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

  const [data, setData] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false); 
  const [selectedFactory, setSelectedFactory] = useState('ALL')
  const [selectedWC, setSelectedWC] = useState('ALL')
  const [selectedJXLine, setSelectedJXLine] = useState('ALL')

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1 ).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`
  }

  const currenDate = new Date()
  
  const [dateFrom, setdateFrom] = useState(formatDate(currenDate))
  

  const fetchData = async () => {
    try {
      setUpdating(true)
      const response = await axios.post('http://172.16.200.28:3000/inventory-mesin', {
        D_DATE: dateFrom, // Sesuaikan dengan tanggal yang Anda inginkan
        D_PLANT: selectedFactory,
        D_WC: selectedWC,
        D_LINE: 'ALL',
        D_MESINCODE: '',
        D_MESINNAME: '',
        D_MESINBRAND: '',
        D_CEK_SEQ: 0
      });

      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
        setUpdating(false)
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

    return() => clearInterval(intervalId);

  }, [autoUpdate])

  console.log(data)

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>

        {data[1]?.map((item, index) => (
        <div> 
          <p>Line: {item.WORK_CENTER}</p>
          <p>Model: {item.MACHINE_TYPE}</p>
          </div>
        ))}
    </div>
  );
};

export default InventoryMesin;
