import { useState, useEffect } from 'react';
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
    }, [apiKey]);

    const fetchArticles = async (query) => {
        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`https://newsapi.org/v2/everything?q=${encodedQuery}&apiKey=${apiKey}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setArticles(data.articles || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
            alert('Failed to fetch news articles. Please try again later.');
        }
    };

    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleSidebar = () => setShowSidebar(!showSidebar);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            const query = searchQuery.trim() || "waste disposal OR recycling OR waste management";
            fetchArticles(query);
        }
    };

    return (
        <div className="h-screen w-full flex">
            <SideBar isVisible={!showSidebar} />
            <div className="flex-grow flex flex-col">
                <header className="flex items-center justify-between h-20 px-4 bg-white border-b border-gray-200 fixed w-full z-50">
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleSidebar} className="text-xl">
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
                        <FaSearch className="text-gray-400 cursor-pointer" onClick={handleSearch} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaBell className="text-gray-500" />
                        <div className="relative inline-block">
                            <button onClick={toggleDropdown} className="text-gray-500 text-2xl">
                                <FaUser />
                            </button>
                            {isOpen && (
                                <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                    <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex flex-col items-center mt-24 px-4">
                    <h1 className="text-3xl font-bold">Latest News</h1>
                    <div className="mt-8 w-full max-w-4xl space-y-6">
                        {articles.length > 0 ? (
                            articles.map((article) => (
                                <article key={article.url} className="bg-white p-4 rounded shadow-md">
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
                                </article>
                            ))
                        ) : (
                            <p className="text-gray-500">No articles available. Try a different search query.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default News;