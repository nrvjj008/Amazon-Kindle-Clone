import React, { useState } from 'react';
import Link from "next/link";
import Footer from "@/components/Footer";
import Image from "next/image";
import VerifyResetPassword from "@/components/VerifyPassword";


export default function ResetPasswordPage() {
    const [isCodeSent, setCodeSent] = useState(false);

    const handleCodeSent = () => {
        setCodeSent(true);
    };

    return (
        <main
            className={`relative bg-gold text-slate-900 flex min-h-screen p-8 space-y-12 flex-col justify-center items-center `}
        >
            <div className={"hidden lg:flex w-full"}>
                <Link href={"/"} className={"absolute top-8  lg:left-8 h-[130px] w-11/12 lg:w-[280px] flex justify-center items-center  "}>
                    <Image className={"mix-blend-multiply bg-contain "} src={"/logo.jpeg"} fill={true} alt={""} />
                </Link>
                <div className={"flex-grow flex justify-center pt-12 items-center"}>
                    <h1 className={"text-4xl text-black font-bold"}>Reset Password</h1>
                </div>
            </div>
            <div className={"flex lg:hidden flex-col lg:flex-row items-center justify-between w-full"}>
                <Link href={"/"} className={" h-[130px] w-[280px]  "}>
                    <img className={"mix-blend-multiply bg-contain "} src={"/logo.jpeg"}  alt={""}/>
                </Link>
                <div className={"flex-grow flex justify-center pt-12 items-center"}>
                    <h1 className={"text-4xl text-black font-bold"}>Reset Password</h1>

                </div>
            </div>
            <div className={" px-12 rounded flex flex-col bg-darkergold   p-8"}>

                <div>

                    <VerifyResetPassword/>
                </div>
            </div>
            <Footer/>
        </main>
    );
}

