import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import api, {getAccessToken} from "@/axiosHandler";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";

export default function CategoryPage() {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null); // New state to track total number of pages
    const router = useRouter();

    useEffect(() => {
            api.get(`/user/favorites/`, ).then(response => {
                setTotalPages(response.data.totalPages || null);
                setBooks(response.data);
            }).catch(error => {
                console.error(error);
            });
    }, []);

    const fetchBooks = (page) => {
            api.get(`/user/favorites/`, {
                params: {
                    page: page
                }
            }).then(response => {
                setTotalPages(response.data.totalPages || null);
                setBooks(prevBooks => [...prevBooks, ...response.data]);
            }).catch(error => {
                console.error(error);
            });

    }



    const handleLoadMore = () => {
        fetchBooks( currentPage + 1);
        setCurrentPage(prevPage => prevPage + 1);
    };

    return (
        <div className="bg-gold text-slate-700 min-h-screen">
            <NavBar />
            <div className="container mx-auto my-10 bg-gold py-8">
                {books.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {books.map(book => (
                                <div key={book.id} className="space-y-4 flex flex-col justify-between  items-center  p-1">
                                    <img src={book.cover_image} alt={book.title} className="w-[200px] shadow-2xl h-[300px] object-cover hover:scale-95 transition-all duration-200"/>
                                    <Link href={`/books/${book.id}`} className="rounded text-center bg-blue-950 text-white w-[180px] py-2 px-2 hover:bg-blue-800">
                                        Read
                                    </Link>
                                </div>
                            ))}
                        </div>
                        {currentPage < totalPages ? (
                            <div className="flex justify-center mt-8">
                                <button onClick={handleLoadMore} className="bg-blue-950 text-white py-2 px-4 hover:bg-blue-800">
                                    Load More
                                </button>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <p className="text-center mt-10 text-xl">No books available in this category.</p>
                )}
            </div>
            <Footer/>
        </div>
    );
}
