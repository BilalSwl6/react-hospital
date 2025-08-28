import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, Hospital, LogOut, Menu, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const HospitalLandingPage: React.FC = () => {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth.user;

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <Head title="Sahiwal Teaching Hospital" />

            <header
                className={`fixed z-50 w-full transition-all duration-300 ${
                    scrolled ? 'backdrop-blur-cm bg-white/80 shadow-md dark:bg-gray-800/80' : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto flex h-20 items-center justify-between px-6">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-2 shadow-lg">
                            <Hospital className="h-8 w-8 text-white" />
                        </div>
                        <span className={`text-lg font-bold md:text-xl ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                            Sahiwal Teaching Hospital
                        </span>
                    </div>

                    <nav className="hidden items-center space-x-8 md:flex">
                        <a
                            href="/"
                            className={`font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                                scrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'
                            }`}
                        >
                            Home
                        </a>
                        {isAuthenticated && (
                            <a
                                href="/dashboard"
                                className={`font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                                    scrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'
                                }`}
                            >
                                Dashboard
                            </a>
                        )}

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center space-x-2 rounded-full bg-white/20 px-4 py-2 transition hover:bg-white/30 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-white">
                                        {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className={scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}>{auth.user?.name}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                                        <Link
                                            href={route('profile.edit')}
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {auth.user?.name}
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{auth.user?.email}</p>
                                        </Link>
                                        <button
                                            onClick={() => router.post('/logout')}
                                            className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
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
                                className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
                            >
                                Sign In
                            </button>
                        )}
                    </nav>

                    <button onClick={() => setIsOpen(!isOpen)} className="rounded-lg bg-gray-100 p-2 md:hidden dark:bg-gray-700">
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {isOpen && (
                    <div className="border-t bg-white shadow-lg md:hidden dark:border-gray-700 dark:bg-gray-800">
                        <nav className="flex flex-col space-y-4 p-6">
                            <a href="/" className="font-medium hover:text-blue-600 dark:hover:text-blue-400">
                                Home
                            </a>
                            {isAuthenticated && (
                                <a href="/dashboard" className="font-medium hover:text-blue-600 dark:hover:text-blue-400">
                                    Dashboard
                                </a>
                            )}
                            {isAuthenticated ? (
                                <button
                                    onClick={() => router.post('/logout')}
                                    className="mt-4 flex items-center justify-center space-x-2 rounded-lg bg-red-100 py-2 text-red-600 dark:bg-gray-700 dark:text-red-400"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Sign Out</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.get('/login')}
                                    className="mt-4 flex items-center justify-center rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                                >
                                    <User className="h-5 w-5" />
                                    <span>Sign In</span>
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 pt-32 pb-20 text-center text-white">
                <div className="container mx-auto px-6">
                    <Hospital className="mx-auto mb-6 h-16 w-16" />
                    <h1 className="mb-4 text-4xl leading-tight font-bold md:text-5xl">IPD Pharmacy Inventory Management</h1>
                    <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90 md:text-xl">
                        Streamline your indoor pharmacy operations with real-time, reliable, and secure inventory management.
                    </p>
                    {isAuthenticated ? (
                        <a
                            href="/dashboard"
                            className="rounded-full bg-white px-8 py-3 font-semibold text-blue-600 shadow-md transition hover:bg-blue-50"
                        >
                            Go to Dashboard
                        </a>
                    ) : (
                        <button
                            onClick={() => router.get('/login')}
                            className="rounded-full bg-white px-8 py-3 font-semibold text-blue-600 shadow-md transition hover:bg-blue-50"
                        >
                            Login to System
                        </button>
                    )}
                </div>
            </section>

            <section className="bg-gray-50 py-20 dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {[
                            {
                                title: 'Medication Tracking',
                                desc: 'Real-time tracking of inventory levels and expiration dates',
                            },
                            {
                                title: 'Order Management',
                                desc: 'Simplified ordering, receiving, and dispensing workflow',
                            },
                            {
                                title: 'Ward Integration',
                                desc: 'Connect with hospital wards for smooth distribution',
                            },
                        ].map((f, i) => (
                            <div key={i} className="rounded-xl bg-white p-6 text-center shadow-md transition hover:shadow-lg dark:bg-gray-800">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                    <Hospital className="h-7 w-7" />
                                </div>
                                <h4 className="mb-2 text-xl font-semibold">{f.title}</h4>
                                <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-indigo-700 py-16 text-center text-white">
                <div className="container mx-auto px-6">
                    <h3 className="mb-6 text-2xl font-bold md:text-3xl">Start Managing Your Inventory Today</h3>
                    {isAuthenticated ? (
                        <a
                            href="/dashboard"
                            className="rounded-full bg-white px-8 py-3 font-semibold text-indigo-700 shadow transition hover:bg-indigo-50"
                        >
                            Access Dashboard
                        </a>
                    ) : (
                        <button
                            onClick={() => router.get('/login')}
                            className="rounded-full bg-white px-8 py-3 font-semibold text-indigo-700 shadow transition hover:bg-indigo-50"
                        >
                            Login Now
                        </button>
                    )}
                </div>
            </section>

            <footer className="bg-gray-100 py-8 text-center text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                <div className="container mx-auto px-6">
                    <p>© {new Date().getFullYear()} Sahiwal Teaching Hospital. All rights reserved.</p>
                    <p className="mt-2 text-xs">
                        Developed by{' '}
                        <a href="https://www.facebook.com/Bilalswl.6" className="text-blue-600 hover:underline dark:text-blue-400">
                            Bilal
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HospitalLandingPage;
