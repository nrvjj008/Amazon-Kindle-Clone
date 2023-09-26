import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../axiosHandler';
import {useRouter} from "next/router";
import {useState} from "react";


export default function RequestResetPassword() {
    const [message,setMesssage] = useState('');
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email format').required('Required')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await api.post('/request-password-reset/', values);
                alert('A code has been sent to your email');
                router.push('/resetPassword');

            } catch (error) {
                console.error(error);
                setMesssage(error.detail);
            }
            setSubmitting(false);
        }
    });

    return (
        <>
        <form onSubmit={formik.handleSubmit} className="space-y-4 flex flex-col w-full">
            <label htmlFor="email" className="text-black">Email</label>
            <input
                name="email"
                type="email"
                placeholder="Enter your email"
                {...formik.getFieldProps('email')}
                className="placeholder:text-black p-2 border bg-gold text-slate-700 border-slate-400 rounded"
            />
            {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}

            <button type="submit" className="bg-blue-950 text-white w-full py-2 px-4 rounded">
                Send Code
            </button>
            <div className="text-red-500 mx-auto">{message}</div>
        </form>

            </>
    );
}
