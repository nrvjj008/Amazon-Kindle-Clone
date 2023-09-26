import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import api, {getAccessToken} from "@/axiosHandler";
import NavBar from "@/components/NavBar";
import {useRouter} from "next/router";
import Footer from "@/components/Footer";

export default function Home() {

    const [categoryBooks, setCategoryBooks] = useState([]);   // State for the books of the selected category
    const [selectedCategory, setSelectedCategory] = useState(null);  // State for the currently selected category
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState({ categories: [], books: [] });
    const [searchResults, setSearchResults] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const loadCategoryBooks = async () => {
        try {
            const response = await api.get(`/books/category/${selectedCategory}`);
            if (response.data) {
                setCategoryBooks(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch category books:", error);
        }
    }
    useEffect(() => {
        if (selectedCategory) {
            loadCategoryBooks();
        }
    }, [selectedCategory]);



    useEffect(() => {
        api.get('/books/').then(response => {
            setData(response.data);
        }).catch(error => {
            console.error(error);
        });
    }, []);


    const handleSearch = async (e) => {
        e.preventDefault();
        const searchTerm = e.target.search.value;

        const results = data.books.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(results);
    };


    // Fetch data from Django API


    const Category = ({ categoryName, books }) => {
        const [displayRange, setDisplayRange] = useState({ start: 0, end: 5 });

        const handlePrev = () => {
            setDisplayRange(prevRange => ({
                start: Math.max(0, prevRange.start - 5),
                end: Math.max(5, prevRange.end - 5)
            }));
        };

        const handleNext = () => {
            setDisplayRange(prevRange => ({
                start: prevRange.start + 5,
                end: prevRange.end + 5
            }));
        };

        return (
            <div>
                <h2 className="text-2xl font-bold text-start  mt-8 px-4 py-2">{categoryName}</h2>

            <div key={categoryName} className="rounded py-8 bg-darkergold relative">
                <div className="px-12 gap-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 overflow-hidden">
                    {books.slice(displayRange.start, displayRange.end).map(book => (
                            <Link key={book.id} href={`/books/${book.id}`}  className="  rounded overflow-hidden space-y-4 flex flex-col justify-between items-center">
                                <img src={book.cover_image} alt={book.title} className="border rounded border-slate-400 h-[300px] w-[200px]  object-cover hover:scale-95 transition-all duration-200 shadow-lg"/>


                                <button className="mx-2 bg-blue-950 text-white w-[180px] hover:bg-blue-800 px-4 py-2 text-center rounded">Read</button>
                        </Link>
   ))}
                </div>
                {displayRange.start > 0 && <button onClick={handlePrev} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-full px-2 py-1 ">←</button>}
                {displayRange.end < books.length && <button onClick={handleNext} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded-full">→</button>}
            </div>
            </div>

        );
    };

    return (
        <div className={"bg-gold text-slate-700"}>
            <NavBar onCategoryChange={(category) => setSelectedCategory(category)} />


            <div className="container mx-auto my-10 bg-gold py-8">
                <div>
                    <h2 className="text-2xl font-bold text-start  mt-8 px-4 py-2">Welcome to kindle clone Library</h2>
                    <div className={"grid grid-cols-1 md:grid-cols-3 bg-slate-100 rounded p-4 gap-4"}>
                    <div className={"border rounded p-4 bg-gold/30 grid grid-cols-4 "}>
                        <img src={"/header1.svg"}  className="w-20 h-20 my-auto rounded  col-span-1 object-fill  "/>
                        <div className={"col-span-3 flex flex-col justify-center"}>
                            <h1 className={"text-md font-semibold px-2"}>Access books online free</h1>
                            <p className={"text-md  px-2"}>Endless titles through Digital Lending </p>
                        </div>
                    </div>
                        <div className={"border rounded p-4 bg-gold/30 grid grid-cols-4 "}>
                            <img src={"/header2.svg"}  className="w-20 h-20 my-auto rounded border-slate-400 col-span-1 object-fill  "/>
                            <div className={"col-span-3 flex flex-col justify-center"}>
                                <h1 className={"text-md font-semibold px-2"}>Track favorite reads</h1>
                                <p className={"text-md  px-2"}>Organize with Lists and Logs </p>
                            </div>
                        </div>
                        <div className={"border rounded p-4 bg-gold/30 grid grid-cols-4 "}>
                            <img src={"/header3.svg"}  className="w-20 h-20 my-auto rounded border-slate-400 col-span-1 object-fill  "/>
                            <div className={"col-span-3 flex flex-col justify-center"}>
                                <h1 className={"text-md font-semibold px-2"}>Explore digital Library Guide</h1>
                                <p className={"text-md  px-2"}>Shelves mirroring physical ones </p>
                            </div>
                        </div>
                    </div>
                </div>

                {searchResults ? (
                    <div>
                        <h2 className="text-2xl font-bold text-center p-4">Search Results</h2>
                        {/* Display search results */}
                    </div>
                ) : (

                    Object.entries(data).map(([categoryName, books]) => <Category key={categoryName} categoryName={categoryName} books={books} />)
                )}
            </div>
            <Footer/>
        </div>
    );
}
