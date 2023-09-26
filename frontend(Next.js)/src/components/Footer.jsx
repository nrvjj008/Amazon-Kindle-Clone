

import Link from 'next/link';
import {FaInstagram} from "react-icons/fa";
import {FaEnvelope, FaTwitter} from "react-icons/fa6";
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className=" p-4 text-center flex flex-col space-y-2 items-center justify-center  px-4 bg-gold rounded-full mt-4">
            © {currentYear} kindle clone Library
            <div className={"flex justify-center items-center space-x-2"}>
                 </div>
        </div>
    );
}
