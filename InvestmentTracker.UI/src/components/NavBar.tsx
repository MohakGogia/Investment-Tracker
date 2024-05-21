import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-white text-xl font-bold">
              Investment Tracker App
            </NavLink>
          </div>
          <div className="hidden md:flex space-x-4">
            <NavLink to="/" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </NavLink>
            <NavLink to="/grid" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Grid View
            </NavLink>
            <NavLink to="/add-new" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Add New Investment
            </NavLink>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className="block text-gray-400 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </NavLink>
            <NavLink to="/grid" className="block text-gray-400 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              Grid View
            </NavLink>
            <NavLink to="/add-new" className="block text-gray-400 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              Add New Investment
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
