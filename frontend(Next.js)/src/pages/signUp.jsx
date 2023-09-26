import Image from 'next/image';
import SignupForm from '@/components/SignupForm';  // Adjust the path accordingly
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Signup() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('access_token') !== null) {
            router.push('/home');
        }
    }, []);

    return (
        <main className={`relative bg-gold text-slate-900 flex min-h-screen p-4 space-y-12 flex-col justify-center items-center`}>
            <div className={"hidden lg:flex w-full"}>
                <Link href={"/"} className={"absolute top-8  lg:left-8 h-[130px] w-11/12 lg:w-[280px] flex justify-center items-center  "}>
                    <Image className={"mix-blend-multiply bg-contain "} src={"/logo.jpeg"} fill={true} alt={""} />
                </Link>
                <div className={"flex-grow flex justify-center pt-12 items-center"}>
                    <h1 className={"text-4xl text-black font-bold"}>Sign Up</h1>
                </div>
            </div>
            <div className={"flex lg:hidden flex-col lg:flex-row items-center justify-between w-full"}>
                <Link href={"/"} className={" h-[130px] w-[280px]  "}>
                    <img className={"mix-blend-multiply bg-contain "} src={"/logo.jpeg"}  alt={""}/>
                </Link>
                <div className={"flex-grow flex justify-center pt-12 items-center"}>
                    <h1 className={"text-4xl text-black font-bold"}>Sign Up</h1>

                </div>
            </div>

            <div className={"lg:w-1/3 lg:px-12 rounded flex flex-col bg-darkergold p-8 w-full"}>
                <SignupForm />
            </div>
            <Footer/>
        </main>
    );
}
