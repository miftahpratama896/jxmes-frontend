import { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../assets/img/New Logo White.png";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useHistory } from "react-router-dom";
import Person from "../assets/img/Person.jpg";


// Setiap subItem sekarang memiliki properti active dengan nilai true

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [userID, setuserID] = useState("");

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    setuserID(user_id);
    const sendDataToBackend = async () => {
      try {
        const data = {
          division: "JXMES-WEB",
          menuName: "MAIN MENU",
          programName: "MAIN MENU",
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

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const handleToggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  const history = useHistory();
  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("token");

    // Redirect ke halaman login
    history.push("/");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect ke halaman login jika tidak ada token
      history.push("/");
    }
  }, [history]);

  const navigation = [
    {
      name: "Monitoring",
      href: "/MainMonitoring",
      current: false,
      subItems: [
        { name: "Monitoring", href: "/MainMonitoring", active: true },
        { name: "Daily Monitoring", href: "/DailyMonitoring", active: true },
      ],
    },
    {
      name: "Product",
      href: "/ProductTime",
      current: false,
      subItems: [
        { name: "Product - Detail", href: "/ProductDetail", active: true },
        { name: "Product - Time", href: "/ProductTime", active: true },
        { name: "Product - PCard", href: "/ProductPCard", active: true },
        {
          name: "Product - Result Target",
          href: "/ProductResultTargetModel",
          active: true,
        },
        { name: "Product - Personnel", href: "/ProductPersonel", active: true },
        {
          name: "Product - Nosew Mesin",
          href: "/ProductNosewMesin",
          active: true,
        },
        {
          name: "Product - KK Material MO",
          href: "/ProductKKMaterial",
          active: true,
        },
        {
          name: "Product - Material Setting Balance",
          href: "/ProductMaterialBalance",
          active: true,
        },
        {
          name: "Product - Sewing Mesin Counter",
          href: "/ProductSewingMesinCounter",
          active: true,
        },
        {
          name: "Product - Daily Prod Trend",
          href: "/ProductDailyProdTrend",
          active: true,
        },
        {
          name: "Product - SPK Balance",
          href: "/ProductSPKBalance",
          active: true,
        },
        {
          name: "Product - Laminating",
          href: "/ProductLaminating",
          active: true,
        },
        {
          name: "Product - CSS",
          href: "/ProductCSS",
          active: true,
        },
        {
          name: "Product - Input SPK Cutting",
          href: "/ProductInputSPKCutt",
          active: false,
        },
        
      ],
    },
    {
      name: "Order Tracking",
      href: "/POBalance",
      current: false,
      subItems: [{ name: "PO Balance", href: "/POBalance", active: true }],
    },
    {
      name: "WIP",
      href: "/InventoryLongTerm",
      current: false,
      subItems: [
        { name: "Inventory", href: "/Inventory", active: true },
        {
          name: "Inventory - Long Term",
          href: "/InventoryLongTerm",
          active: true,
        },
        { name: "Inventory - Mesin", href: "/InventoryMesin", active: true },
        { name: "Inventory - Summary", href: "/InventorySummary", active: true },
      ],
    },
    {
      name: "Report",
      href: "#",
      current: false,
      subItems: [
        {
          name: "Daily SPK Cutting",
          href: "/DailyCutt",
          active: false,
        },
        {
          name: "Daily Barcode Cutting",
          href: "/DailyBarcodeCutt",
          active: false,
        },
        { name: "Daily Hour Production", href: "/DailyHourProd", active: true },
        { name: "Scan Status JX2-JX", href: "/ScanStatus", active: true },
        { name: "Daily Prod QTY Trend", href: "/DailyProdQTYTrend", active: true },
        { name: "Setting Sewing QTY", href: "/SettingSewingQTY", active: true },
      ],
    },
  ];
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="sticky top-0 z-50 bg-gray-800">
            <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <a href="/Dashboard">
                      <img
                        className="h-8 w-auto"
                        src={Logo}
                        alt="Your Company"
                        href="/Dashboard"
                      />
                    </a>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item, index) => (
                        <DropdownItem
                          key={item.name}
                          item={item}
                          isOpen={openDropdownIndex === index}
                          userID={userID}
                          onToggle={() => handleToggleDropdown(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={Person}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={handleLogout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item, index) => (
                <DropdownItem
                  key={item.name}
                  item={item}
                  isOpen={openDropdownIndex === index}
                  userID={userID}
                  onToggle={() => handleToggleDropdown(index)}
                />
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function DropdownItem({ item, isOpen, onToggle, userID }) {
  console.log("User :", userID);
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="text-white bg-gray-800 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-800 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center inline-flex items-center dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        type="button"
      >
        {item.name}
      </button>
      {isOpen && (
        <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-1">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {item.subItems.map((subItem, index) => {
              if (userID === "mesuser" && subItem.active) {
                return (
                  <li key={index}>
                    <a
                      href={subItem.href}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {subItem.name}
                    </a>
                  </li>
                );
              } else if (userID === "admin") {
                return (
                  <li key={index}>
                    <a
                      href={subItem.href}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {subItem.name}
                    </a>
                  </li>
                );
              }
              return null; // Jika tidak memenuhi kondisi, kembalikan null
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
