// pages/category.tsx

import React, { useEffect, useState } from 'react';
import axios from "axios";
import Link from 'next/link';
import api from "@/axiosHandler";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function CategoryPage({ category }) {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreBooks, setHasMoreBooks] = useState(true);

    useEffect(() => {
        if (category) {
            loadBooks();
        }
    }, [category]);

    const loadBooks = async () => {
        try {
            const response = await api.get(`/books/category/${category}?page=${currentPage}`);
            if (response.data && response.data.length > 0) {
                setBooks(prevBooks => [...prevBooks, ...response.data]);
            } else {
                setHasMoreBooks(false);
            }
        } catch (error) {
            console.error("Failed to fetch books:", error);
        }
    }

    return (
        <div>
            <NavBar />
            <div className="container mx-auto my-10">
                <h1 className="text-3xl font-bold mb-6">Books in Category: {category}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map(book => (
                        <Link key={book.id} href={`/books/${book.id}`}>
                            <a className="border rounded p-4 hover:shadow-md transition">
                                <img src={book.cover_image} alt={book.title} className="w-full h-auto mb-4"/>
                                <h2 className="text-xl font-semibold">{book.title}</h2>
                                {/* Additional book details here... */}
                            </a>
                        </Link>
                    ))}
                </div>
                {hasMoreBooks && (
                    <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600" onClick={() => {
                        setCurrentPage(prev => prev + 1);
                        loadBooks();
                    }}>
                        Load More
                    </button>
                )}
            </div>
            <Footer/>
        </div>
    );
}
