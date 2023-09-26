import React, { useEffect } from "react";
import axios from "axios";

const Books = () => {
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get("http://localhost:8000/ebooks/api/books/", config);
                console.log(response.data);
            } catch (error) {
                console.error("An error occurred while fetching data: ", error);
            }
        };

        fetchBooks();
    }, []);

    return <div>Check console for books!</div>;
};

export default Books;