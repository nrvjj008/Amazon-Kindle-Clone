import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        console.log("handleSubmit");
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/token/", {
                username,
                password,
            });
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem('user_id', response.data.user_id);

            router.push('/home');
        } catch (error) {
            setMessage("Invalid credentials.");
            console.error("An error occurred while fetching data: ", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={"flex flex-col mx-auto space-y-8 items-center justify-center"}>

            <div className="flex flex-col space-y-2 w-full">
                <label htmlFor="email" className="font-semibold">Username:</label>
                <input
                    id="email"
                    className={"px-4 py-2 border border-slate-500 rounded w-full bg-gold text-slate-800 lg:min-w-[300px]"}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />
            </div>

            <div className="flex flex-col space-y-2 w-full">
                <label htmlFor="password" className="font-semibold">Password:</label>
                <input
                    id="password"
                    className={"px-4 py-2 border border-slate-500 rounded w-full bg-gold text-slate-800 lg:min-w-[300px]"}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />
            </div>

            <button type="submit" className={" w-full bg-gold border border-black shadow-xl   px-4 py-2 rounded font-semibold hover:bg-white/50"}>
                Login
            </button>
            {message && <p className="text-red-500">{message}</p>}
        </form>
    );
}
