import { useState, useEffect  } from 'react';
import Logo from "../assets/img/New Logo White.png";
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useHistory } from 'react-router-dom';
import Person from "../assets/img/Person.jpg"


const navigation = [
  { 
    name: 'Monitoring', 
    href: '/MainMonitoring', 
    current: false,
    subItems: [
      { name: 'Monitoring', href: '/MainMonitoring' },
      { name: 'Daily Monitoring', href: '/DailyMonitoring' },
    ]  
  },
  { 
    name: 'Product', 
    href: '/ProductTime', 
    current: false,
    subItems: [
      { name: 'Product - Detail', href: '/ProductDetail' },
      { name: 'Product - Time', href: '/ProductTime' },
      { name: 'Product - PCard', href: '/ProductPCard' },
      { name: 'Product - Result Target', href: '/ProductResultTargetLine' },
      { name: 'Product - Personnel', href: '/ProductPersonel' },
      { name: 'Product - Nosew Mesin', href: '/ProductNosewMesin' },
      { name: 'Product - KK Material MO', href: '/ProductKKMaterial' },
      { name: 'Product - Material Setting Balance', href: '/ProductMaterialBalance' },
      { name: 'Product - Sewing Mesin Counter', href: '/ProductSewingMesinCounter' },
      { name: 'Product - Daily Prod Trend', href: '/ProductDailyProdTrend' },
      { name: 'Product - Cutting Mesin Counter', href: '/NotFound' },
      { name: 'Product - SPK Balance', href: 'ProductSPKBalance' },
      { name: 'Product - Laminating', href: '/NotFound' },
    ]
  },
  { 
    name: 'Order Tracking', 
    href: '/POBalance', 
    current: false, 
    subItems: [
      { name: 'PO Balance', href: '/POBalance' },
    ]
  },
  { 
    name: 'WIP', 
    href: '/InventoryLongTerm', 
    current: false,
    subItems: [
      { name: 'Inventory', href: '/NotFound' },
      { name: 'Inventory - Long Term', href: '/InventoryLongTerm' },
      { name: 'Inventory - Mesin', href: '/NotFound' },
      { name: 'Inventory - Summary', href: '/NotFound' },
    ]
  },
  { 
    name: 'Report', 
    href: '#', 
    current: false,
    subItems: [
      { name: 'Daily Hour Production', href: '/DailyHourProd' },
      { name: 'Scan Status JX2-JX', href: '/ScanStatus' },
      { name: 'Setting Sewing QTY', href: '/SettingSewingQTY' },
    ]
  },
];


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const handleToggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  const history = useHistory();
  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem('token');

    // Redirect ke halaman login
    history.push('/');
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect ke halaman login jika tidak ada token
      history.push('/');
    }
  }, [history]);
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
                        href = "/Dashboard"
                      />
                    </a>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item, index) => (
                        <DropdownItem key={item.name} item={item} isOpen={openDropdownIndex === index} onToggle={() => handleToggleDropdown(index)} />
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
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
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
                            <DropdownItem key={item.name} item={item} isOpen={openDropdownIndex === index} onToggle={() => handleToggleDropdown(index)} />
              ))}
          </div>
        </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

function DropdownItem({ item, isOpen, onToggle }) {
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
        <div
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-1"
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {item.subItems.map((subItem, index) => (
              <li key={index}>
                <a href={subItem.href} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  {subItem.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
