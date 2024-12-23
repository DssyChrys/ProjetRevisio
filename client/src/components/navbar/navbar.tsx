
import {useState } from "react";
const Navbar = () => {
  
    const [isOpen, setIsOpen] = useState(false);
  
  
    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };
    return (
      <header className="bg-[#1E3A8A] text-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          {/* Logo */}
          <div  className="logo hover:cursor-pointer">
            <div className="flex space-y-6 list-none">
              <p>
                C-<span className="text-[#93d500]">GBE</span>
              </p>
            </div>
          </div>
  
          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6 list-none">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/historiquepaiement"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  Historique
                </a>
              </li>
              <li></li>
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  Quitter
                </a>
              </li>
            </ul>
          </nav>
          {/* Hamburger Menu for mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none bg-transparent border-none"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
  
        {/* Mobile Menu */}
        <div
          className={`${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden md:hidden flex flex-col bg-[#1c3b72] w-full px-4 py-2 transition-all duration-500 ease-in-out transform ${
            isOpen ? "translate-y-0" : "-translate-y-10"
          }`}
        >
          <nav>
            <ul className="space-y-4 list-none">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-gray-300 hover:text-white no-underline transition duration-300"
                >
                  Connexion
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  };
  
  export default Navbar;
  