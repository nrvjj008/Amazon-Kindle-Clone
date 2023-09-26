import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../axiosHandler';
import {useState} from "react";  // Adjust the path accordingly

export default function SignupForm() {
    const [message, setMessage] = useState('');
    const formik = useFormik({
        initialValues: {
            username:'',
            email: '',
            name: '',
            reason: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Required')
                .matches(/^\S*$/, 'No spaces are allowed.'),
            email: Yup.string().required('Required').email('Invalid email format'),
            name: Yup.string().required('Required'),
            reason: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await api.post('/signup/', values);
                alert('Thank you for your interest. You will receive an email once the admin approves it.');
                resetForm();
            } catch (error) {
                console.error(error);
                setMessage(error.username);

            }
            setSubmitting(false);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 flex flex-col w-full">
            <input
                name="username"
                type="text"
                placeholder="username"
                {...formik.getFieldProps('username')}
                className="placeholder:text-black p-2 border bg-gold text-slate-700 border-slate-400 rounded"
            />
            {formik.touched.username && formik.errors.username ? <div className="text-red-500">{formik.errors.username}</div> : null}

            <input
                name="email"
                type="email"
                placeholder="Email"
                {...formik.getFieldProps('email')}
                className="placeholder:text-black p-2 border bg-gold text-slate-700 border-slate-400 rounded"
            />
            {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}

            <input
                name="name"
                type="text"
                placeholder="Name"
                {...formik.getFieldProps('name')}
                className="placeholder:text-black p-2 border bg-gold text-slate-700 border-slate-400 rounded"
            />
            {formik.touched.name && formik.errors.name ? <div className="text-red-500">{formik.errors.name}</div> : null}

            <textarea
                name="reason"
                placeholder="Reason to join the library"
                {...formik.getFieldProps('reason')}
                className="placeholder:text-black p-2 border bg-gold text-slate-700 border-slate-400 rounded"
            ></textarea>
            {formik.touched.reason && formik.errors.reason ? <div className="text-red-500">{formik.errors.reason}</div> : null}

            <div className="relative">
                <input
                    name="password"
                    type={formik.values.showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...formik.getFieldProps('password')}
                    className="placeholder:text-black p-2 border bg-gold text-slate-700 border-slate-400 rounded pr-2 w-full"
                />
                <button
                    type="button"
                    onClick={() => formik.setFieldValue('showPassword', !formik.values.showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                    {/* Replace with the FontAwesome icon */}
                    Show
                </button>
            </div>
            {formik.touched.password && formik.errors.password ? <div className="text-red-500">{formik.errors.password}</div> : null}

            <button type="submit" className="bg-blue-950 text-white w-full py-2 px-4 rounded">
                Sign Up
            </button>
            {message && <p>{message}</p>}
        </form>
    );
}
