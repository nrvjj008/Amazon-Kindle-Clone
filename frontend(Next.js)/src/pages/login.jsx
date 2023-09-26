import Image from 'next/image'
import { Inter } from 'next/font/google'
import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import Footer from "@/components/Footer";


export default function Home() {
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem("access_token") !== null) {
            router.push("/home");
        }
    }, []);
    return (
        <main
            className={`relative bg-gold text-slate-900 flex min-h-screen p-8 space-y-12 flex-col justify-center items-center `}
        >
            <div className={"hidden lg:flex w-full"}>
                <Link href={"/"} className={"absolute top-8  lg:left-8 h-[130px] w-11/12 lg:w-[280px] flex justify-center items-center  "}>
                    <Image className={"mix-blend-multiply bg-contain "} src={"/logo.jpeg"} fill={true} alt={""} />
                </Link>
                <div className={"flex-grow flex justify-center pt-12 items-center"}>
                    <h1 className={"text-4xl text-black font-bold"}>Login</h1>
                </div>
            </div>
            <div className={"flex lg:hidden flex-col lg:flex-row items-center justify-between w-full"}>
                <Link href={"/"} className={" h-[130px] w-[280px]  "}>
                    <img className={"mix-blend-multiply bg-contain "} src={"/logo.jpeg"}  alt={""}/>
                </Link>
                <div className={"flex-grow flex justify-center pt-12 items-center"}>
                    <h1 className={"text-4xl text-black font-bold"}>Login</h1>

                </div>
            </div>

            <div className={" px-12 rounded flex flex-col bg-darkergold   p-8"}>

            <LoginForm />
                <Link href={"/ForgotPassword"} className={"mx-auto py-4 underline"}>Forgot Password?</Link>
            </div>
            <Footer/>
        </main>
    )
}
