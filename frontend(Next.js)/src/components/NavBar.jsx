import Link from "next/link";
import {useEffect, useState} from 'react';
import {FaBars, FaSearch, FaUserAlt} from "react-icons/fa";
import {FaAngleDown} from "react-icons/fa6";
import api from "@/axiosHandler";
import {useRouter} from "next/router";
import Image from "next/image";

export default function NavBar({ onSearch, onCategoryChange }) {

    const [categoryId, setCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);  // Now it will hold both IDs and Titles

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isUserDropdownVisible, setUserDropdownVisible] = useState(false);
    const [searchType, setSearchType] = useState('book');  // Default to 'book'

    const router = useRouter();
    useEffect(() => {
            api.get(`/categories/`).then(response => {
                setCategories(response.data);
            }).catch(error => {
                console.error(error);
            });
    }, []);

    const handleCategorySelect = (id, title) => {
        setCategoryId(id);
        setSelectedCategory(title);
        setDropdownVisible(false);
        onCategoryChange && onCategoryChange(id);  // Propagate the selected category ID upwards
    }
    const scientificAndResearchCategory = categories.find(category => category.name === "Scientific and Research");


    const handleLogout = () => {
        localStorage.clear();  // Clear everything from localStorage

        router.push('/');  // Redirect to root (or login page)
    };



// Then, within the dropdown menu, modify the category link:


    const handleSearch = () => {
        router.push(`/search?query=${searchText}&type=${searchType}`);
    }


    const [isMobileNavVisible, setMobileNavVisible] = useState(false);
    return (
        <div className={"text-sm md:text-md lg:text-lg"}>
            <div className="hidden lg:block ">
        <nav className="flex  justify-between items-center px-4 shadow-sm  lg:px-4">
            <div className="flex items-center flex-shrink-0 pr-4">
                <img src="/logo.jpeg" alt="logo"  className="w-[150px] h-[100px] py-4 object-contain mix-blend-multiply mr-2" />
            </div>
            <ul className="flex space-x-4 xl:space-x-12 font-bold items-center">
                {/* ... other nav links ... */}
                <li>
                    <Link href="/home">Home</Link>
                </li>
                <li className="relative ">
                    <button
                        onMouseEnter={() => setDropdownVisible(true)}
                        onMouseLeave={() => setDropdownVisible(false)} // New: hide on mouse leave
                        className={"flex items-center justify-center space-x-1"}
                    >
                        <span>Books</span>
                        <FaAngleDown size={"1rem "} className={"font-bold"}/>
                    </button>
                    {isDropdownVisible && (
                        <ul className="absolute top-6  mt-0 z-10 w-[300px]  bg-white border border-gray-300 rounded shadow-lg"
                            onMouseEnter={() => setDropdownVisible(true)} // New: remain visible on hover
                            onMouseLeave={() => setDropdownVisible(false)} // New: hide on mouse leave
                        >
                            {categories.map(category => (
                                <li key={category.id} className="px-4 py-2 hover:bg-gray-200">
                                    <Link href={`/categories/${category.id}`} className={"w-[300px]"}>
                                        {category.name}
                                    </Link>
                                </li>
                            ))}

                        </ul>
                    )}
                </li>
                {scientificAndResearchCategory && (
                    <li>
                        <Link href={`/categories/${scientificAndResearchCategory.id}`}>Scientific and Research</Link>
                    </li>
                )}
                {/* ... other nav links ... */}

                <li>
                    <Link href="/favouriteBooks">Favourite Books</Link>
                </li>
                {/*<li>*/}
                {/*    <Link href="/research">Research & Studies</Link>*/}
                {/*</li>*/}

                            <ul>
                                <li className="px-4 py-2 hover:bg-gray-200">
                                    <a onClick={handleLogout} href="#">Log out</a> {/* Modified this link */}
                                </li>
                            </ul>

            </ul>
            <div className="flex items-center space-x-2 border  border-slate-500 rounded">
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="border-r border-slate-500 bg-gold text-sm w-16 p-0 "
                >
                    <option value="book">Book</option>
                    <option value="author">Author</option>
                    <option value="publisher">Publisher</option>
                </select>

                <input
                    type="text"
                    placeholder="Search..."
                    className="placeholder:text-black  bg-gold "
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button className=" border rounded   flex justify-center items-center" onClick={handleSearch}>
                    <FaSearch className={"border-l border-slate-500 px-1"} size={"1.5em"}/>
                </button>
            </div>
        </nav>
            </div>
            <div className="lg:hidden px-8">
                <nav className="flex justify-between items-center px-4 shadow-sm">
                    <img src="/logo.jpeg" alt="logo"  className="w-[150px] h-[100px] py-4 object-contain mix-blend-multiply mr-2" />

                    <button className="p-2" onClick={() => setMobileNavVisible(!isMobileNavVisible)}> {/* Toggle mobile nav visibility */}
                        <FaBars size="1.5em" />
                    </button>
                </nav>
                {isMobileNavVisible && (
                <div className="flex flex-col mt-4 space-y-4">
                    <Link href="/home">Home</Link>
                    <div className={"flex space-x-4 items-center"}>Books <FaAngleDown /></div>
                    {categories.map(category => (
                        <Link key={category.id} href={`/categories/${category.id}`} className="ml-4">{category.name}</Link>
                    ))}
                    <Link href="/favouriteBooks">Favourite Books</Link>
                    <button className={"w-full   border-slate-500 text-start"} onClick={handleLogout} >Log out</button>

                    {/* Mobile Search */}
                    <div className="mx-4 flex items-center space-x-2 border border-slate-500 rounded mt-4">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="border-r border-slate-500 p-2 bg-gold"
                        >
                            <option value="book">Book</option>
                            <option value="author">Author</option>
                            <option value="publisher">Publisher</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="placeholder:text-black p-2 bg-gold"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button className="border rounded p-2 flex justify-center items-center" onClick={handleSearch}>
                            <FaSearch className="border-l border-slate-500 pl-2" size="1.5em" />
                        </button>
                    </div>
                </div>)}
            </div>
            </div>
    )
};