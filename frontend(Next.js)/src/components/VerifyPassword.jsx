import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../axiosHandler';
import { useState } from "react";
import {useRouter} from "next/router";


export default function VerifyResetPassword() {
    const [message, setMessage] = useState('');
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            email: '',
            code: '',
            password: '',
            confirm_password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email format').required('Required'),
            code: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
            confirm_password: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await api.post('/verify-password-reset/', {
                    email: values.email,
                    code: values.code,
                    password: values.password,
                    confirm_password: values.confirm_password
                });
                alert('Password has been reset');
                router.push('/');
            } catch (error) {
                    setMessage(error.detail);

            }
            setSubmitting(false);
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 flex flex-col w-full">
            <input
                name="email"
                type="email"
                placeholder="Email"
                {...formik.getFieldProps('email')}
                className="placeholder:text-black p-2 border bg-gold text-slate-700 border-slate-400 rounded"
            />
            {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}

            <input
                name="code"
                type="text"
                placeholder="Verification Code"
                {...formik.getFieldProps('code')}
                className="placeholder:text-black p-2 border bg-gold text-slate-700 border-slate-400 rounded"
            />
            {formik.touched.code && formik.errors.code ? <div className="text-red-500">{formik.errors.code}</div> : null}

            <input
                name="password"
                type={formik.values.showPassword ? "text" : "password"}
                placeholder="New Password"
                {...formik.getFieldProps('password')}
                className="placeholder:text-black p-2 border bg-gold text-slate-700 border-slate-400 rounded"
            />
            {formik.touched.password && formik.errors.password ? <div className="text-red-500">{formik.errors.password}</div> : null}

            <input
                name="confirm_password"
                type={formik.values.showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...formik.getFieldProps('confirm_password')}
                className="placeholder:text-black p-2 border bg-gold text-slate-700 border-slate-400 rounded"
            />
            {formik.touched.confirm_password && formik.errors.confirm_password ? <div className="text-red-500">{formik.errors.confirm_password}</div> : null}

            <button type="submit" className="bg-blue-950 text-white w-full py-2 px-4 rounded">
                Reset Password
            </button>
            {message && <p className="text-red-500 mx-auto">{message}</p>}
        </form>
    );
}
