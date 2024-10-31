import React, { useState, useEffect } from 'react';
import { FaLeaf, FaSearch, FaBell, FaUser } from 'react-icons/fa';
import { MdOutlineMenu } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';

const News = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [articles, setArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();
    const apiKey = import.meta.env.VITE_APP_NEWS_API_KEY;

    useEffect(() => {
        fetchArticles("waste disposal OR recycling OR waste management");
    }, []);

    const fetchArticles = (query) => {
        fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.articles) {
                    setArticles(data.articles);
                } else {
                    console.error('No articles found');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            const query = searchQuery.trim() === '' ? "waste OR recycling OR waste management" : searchQuery;
            fetchArticles(query);
        }
    };

    return (
        <div className="h-screen w-full flex">
            <SideBar isVisible={!showSidebar} />
            <div className={`flex-grow flex flex-col ${showSidebar ? 'ml-0' : 'ml-0'} transition-all duration-300`}>
                <div className="flex items-center justify-between h-20 px-4 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                    <div className="flex items-center space-x-4">
                        <button className="text-xl" onClick={toggleSidebar}>
                            <MdOutlineMenu />
                        </button>
                        <div className="flex items-center text-lg font-semibold">
                            <FaLeaf className="text-green-500 mr-1" />
                            <span>GreenFuture</span>
                        </div>
                    </div>
                    <div className="lg:flex hidden items-center w-1/3 bg-gray-100 rounded-full px-4 py-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-grow bg-transparent outline-none text-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <FaSearch className="text-gray-400" onClick={handleSearch} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaBell className="text-gray-500" />
                        <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                            <FaLeaf className="text-green-500" />
                            <span className="text-sm font-semibold text-gray-800">0.00</span>
                        </div>
                        <div className="relative inline-block">
                            <button onClick={toggleDropdown} className="text-gray-500 text-2xl">
                                <FaUser />
                            </button>
                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                                    <ul>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                        <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex justify-center w-full items-center mt-[100px]'>
                    <h1 className='text-3xl text-black'>NEWS</h1>
                </div>
                <div className='flex flex-col self-center'>
                    <div className="w-full max-w-4xl space-y-6">
                        {articles.map((article) => (
                            <div key={article.url} className="bg-white p-4 rounded shadow-md">
                                {article.urlToImage && (
                                    <img
                                        src={article.urlToImage}
                                        alt={article.title}
                                        className="w-full h-64 object-cover rounded mb-4"
                                    />
                                )}
                                <h2 className="text-xl font-bold">{article.title}</h2>
                                <p className="text-gray-700 mt-2">{article.description}</p>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 mt-2 inline-block"
                                >
                                    Read more
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default News;
