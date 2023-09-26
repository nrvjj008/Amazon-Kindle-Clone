import Link from "next/link";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";
import api from "@/axiosHandler";
import Footer from "@/components/Footer";

export default function SearchPage() {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null); // To track the total number of pages
    const router = useRouter();
    const { query, type } = router.query;  // Extracting search query and type from URL

    useEffect(() => {
        if (query) {
            api.get(`/search/`, {
                params: {
                    query: query,
                    type: type,
                    page: currentPage
                }
            }).then(response => {
                setTotalPages(response.data.totalPages || null);  // Assuming the backend sends totalPages
                setBooks(response.data);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [query, type, currentPage]);

    const handleLoadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);  // This will trigger the useEffect above to fetch more books
    };

    return (
        <div className="bg-gold text-slate-700 min-h-screen">
            <NavBar />
            <div className="container mx-auto my-10 bg-gold py-8">
                {books.length > 0 ? (
                    <>
                        <div className="grid grid-cols-5 gap-4">
                            {books.map(book => (
                                <Link href={`/books/${book.id}`} key={book.id} className="space-y-4 flex flex-col justify-between items-center  p-1">
                                    <img src={book.cover_image} alt={book.title} className="shadow-2xl w-[200px] h-[300px] object-cover hover:scale-95 transition-all duration-200"/>
                                    <button  className="rounded text-center bg-blue-950 text-white w-[180px] py-2 px-2 hover:bg-blue-800">
                                        Read
                                    </button>
                                </Link>
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
                    <p className="text-center mt-10 text-xl">No books found for your search criteria.</p>
                )}
            </div>
            <Footer/>
        </div>
    );
}
