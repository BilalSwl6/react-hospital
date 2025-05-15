import React, { useState, useEffect } from 'react';
import { Hospital, Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { usePage, router, Link, Head } from '@inertiajs/react';
import { SharedData } from '@/types';

const HospitalLandingPage: React.FC = () => {
  const { auth } = usePage<SharedData>().props;
  const isAuthenticated = auth.user ? true : false;

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <Head title="Sahiwal Teaching Hospital" />
      {/* Premium Header/Navigation */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-800/95 shadow-lg backdrop-blur-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-sm opacity-70"></div>
                <Hospital className={`h-10 w-10 text-white relative z-10 p-2 rounded-full ${
                  scrolled ? 'bg-blue-600' : 'bg-blue-700'
                }`} />
              </div>
              <div>
                <h1 className={`font-bold transition-all duration-300 ${
                  scrolled
                    ? 'text-gray-900 dark:text-white text-lg'
                    : 'text-xl text-blue-700 dark:text-blue-400'
                }`}>
                  Sahiwal Teaching Hospital
                </h1>
                <p className={`text-xs font-medium transition-opacity duration-300 ${
                  scrolled ? 'opacity-100' : 'opacity-0'
                } text-blue-600 dark:text-blue-400`}>
                  IPD Pharmacy System
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 ${
                scrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'
              } transition-colors duration-200`}>
                Home
              </a>

              {isAuthenticated && (
                <a href="/dashboard" className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 ${
                  scrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'
                } transition-colors duration-200`}>
                  Dashboard
                </a>
              )}

              {/* Authentication */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className={`flex items-center space-x-2 rounded-full ${
                      scrolled
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'bg-white/20 backdrop-blur-sm'
                    } px-4 py-2 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-600`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white grid place-items-center">
                      <span className="text-sm font-bold">
                        {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      scrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'
                    }`}>
                      {auth.user?.name || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10 border border-gray-100 dark:border-gray-700">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">

                                        <Link href={route('profile.edit')}>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {auth.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {auth.user?.email}
                        </p>
                    </Link>
                      </div>

                      <button
                        onClick={() => router.post('/logout')}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => router.get('/login')}
                  className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                    scrolled
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white'
                  }`}
                >
                  Sign In
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="container mx-auto px-4 py-4 bg-white dark:bg-gray-800 shadow-lg border-t dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <a
                href="/"
                className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
              >
                Home
              </a>

              {isAuthenticated && (
                <a
                  href="/dashboard"
                  className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                >
                  Dashboard
                </a>
              )}

              {/* Mobile Authentication */}
              {isAuthenticated ? (
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                  <div className="flex items-center space-x-3 pb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white grid place-items-center">
                      <span className="text-lg font-bold">
                        {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                                        <Link href={route('profile.edit')}>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {auth.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {auth.user?.email}
                      </p>
                    </div>
                    </Link>
                  </div>

                  <button
                    onClick={() => router.post('/logout')}
                    className="w-full mt-2 bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 py-3 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.get('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Adjusted for fixed header */}
      <section className="pt-32 pb-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Hospital className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">IPD Pharmacy Inventory Management</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Streamline your indoor pharmacy operations with our efficient inventory management system
          </p>

          {isAuthenticated ? (
            <a
              href="/dashboard"
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition duration-300"
            >
              Go to Dashboard
            </a>
          ) : (
            <button
              onClick={() => router.get('/login')}
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition duration-300"
            >
              Login to System
            </button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-12">Key Features</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                <Hospital className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Medication Tracking</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time tracking of medication inventory levels and expiration dates
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                <Hospital className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Order Management</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Streamlined process for ordering, receiving, and dispensing medications
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                <Hospital className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Ward Integration</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Seamlessly connect with hospital wards for efficient medication distribution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-indigo-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6">Start Managing Your Inventory Today</h3>
          {isAuthenticated ? (
            <a
              href="/dashboard"
              className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-indigo-50 transition duration-300"
            >
              Access Dashboard
            </a>
          ) : (
            <button
              onClick={() => router.get('/login')}
              className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-indigo-50 transition duration-300"
            >
              Login Now
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Sahiwal Teaching Hospital. All rights reserved.</p>
                    <br />
                    <p className="text-xs">Developed by <a href="https://www.facebook.com/Bilalswl.6" className="text-blue-600 dark:text-blue-400 hover:underline">Bilal</a></p>
        </div>
      </footer>
    </div>
  );
};

export default HospitalLandingPage;
