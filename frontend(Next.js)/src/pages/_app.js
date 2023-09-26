import '@/styles/globals.css'
import {Inter, Noto_Sans_Arabic, Nunito, Open_Sans} from "next/font/google";

const inter = Noto_Sans_Arabic({ subsets: ['arabic'] })
export default function App({ Component, pageProps }) {
  return <Component className={`${inter.className}`} {...pageProps} />
}
