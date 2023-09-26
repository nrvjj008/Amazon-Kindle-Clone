import Image from 'next/image'
import {Inter, Noto_Sans_Arabic} from 'next/font/google'
import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import React from "react";
import Footer from "@/components/Footer";
const inter = Noto_Sans_Arabic({ subsets: ['arabic'] })

export default function Home() {
    return (
        <main
            className={` ${inter.className} relative bg-gold text-slate-900 flex min-h-screen  flex-col  font-semibold`}
        >

            <div className={"flex w-full"}>
                <Link href={"/"} className={"absolute top-8 left-10 lg:left-8 h-[130px] w-3/4 lg:w-[280px] flex justify-center items-center  "}>
                    <Image className={"mix-blend-multiply bg-contain "} src={"/logo.jpeg"} fill={true} alt={""} />
                </Link>
                <div className={"flex-grow flex mt-[150px] lg:mt-0 justify-center py-12 items-center"}>
                    <h1 className={"text-4xl text-black font-bold"}>About Us</h1>
                </div>
            </div>

            <div className={" lg:w-3/4 flex flex-col mx-auto my-auto  p-4 py-8 "}>
                <div className={"h-full"}>
                <div className={" flex flex-col justify-around  space-y-6 bg-darkergold rounded relative py-8 w-full"} >
                    <p className={"text-black text-xl  lg:text-2xl font-medium  px-4 "} dir={"rtl"}>منصة مكتبة نَسق للإبداع والأبحاث والدراسات النظرية المتخصصة في العمارة والفنون البصرية والفيلم والموسيقى والتصميم، وهي
                    منصة غير ربحيّة، تُعنى بتوفير المصادر والمراجع الفنية، لإثراء المحتوى الفني والعربي. كما تطمح نَسق في المساهمة بنشر المعرفة
                    </p>
                    <p className={"text-black text-xl  lg:text-2xl font-medium  px-4 "} dir={"rtl"}>تنطلق نسق كمكتبة مرجعية لمصادر ومراجع الإبداع والفنون، رغم أن طموحاتها تذهب لأبعد من ذلك في المستقبل. إذ بدأت بالفعل
                    بالتواصل مع الشركاء الثقافيين، والمراكز والجامعات، ودور النشر، والجهات المعنيّة بالفنون، إيمانًا منها بأهمية العمل الجماعي، لتحقيق
                    الهدف المشترك في تشجيع البحث الفني، وتعزيز الوعي والاستمتاع بجماليات الفن. </p>




                </div>
                <div className={"pt-8  flex flex-wrap justify-center lg:justify-start space-x-2"}>
                    <span>Contact Us</span>
                    <Link href={"/contactUs"} ><button className={"rounded bg-gold border border-black   px-4"}>Here</button></Link>
                    <Link href={"/signUp"} ><button className={"rounded bg-gold border border-black   px-4"}>Sign Up</button></Link>
                    <span className={"text-black text-xl  font-bold  px-4 "} dir={"rtl"}>للانضمام إلى المكتبة وأن تكون أحد أعضائها نرجو مراسلتنا وتقديم طلب </span>
                </div>
                </div>
            </div>
            <Footer/>
        </main>
    )
}
