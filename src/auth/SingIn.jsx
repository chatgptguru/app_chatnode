import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FcGoogle } from "react-icons/fc";
import { FaDivide } from 'react-icons/fa';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import GoogleLoginButton from './GoogleLoginButton';

const SignIn = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('isSigned')) {
            navigate('/dashboard');
        }
    }, [])
    const [email, setEmail] = useState("")
    const socialEmail = useRef(false)
    const [password, setPassword] = useState("")
    const isSocial = useRef(false)
    const setSocial = () => {
        isSocial.current = true
    }
    const setSocialEmail = (value) => {
        socialEmail.current = value
    }
    const token = useRef(null);
    const signin = async (e) => {
        if (!isSocial.current)
            e.preventDefault()
        if (!isSocial.current && (email == "" || password == "")) {
            toast.warning("please input all field")
        } else {
            try {
                let data = {
                    email: email,
                    password: password,
                    isSocial: isSocial.current
                }
                if (isSocial.current) {
                    data = {
                        email: socialEmail.current,
                        password: password,
                        isSocial: isSocial.current
                    }
                }
                console.log(data)
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/signin`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    token.current = response.data.token
                    toast.success(response.data.message)
                    await localStorage.setItem('token', response.data.token);
                    await localStorage.setItem('isSigned', true);
                    await localStorage.setItem('user_id', response.data.user_id);
                    navigate('/dashboard');
                } else {
                    toast.error(response.data.message)
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#edf2ff]">
            <a className="flex items-center justify-center gap-0 mb-4" href="/">
                <div className='text-[24px] font-bold'>RAG System</div>
            </a>
            <div className="max-w-full p-10 bg-white shadow-lg rounded-3xl card w-96 bg-base-100">
                <div className="flex flex-col items-stretch gap-4 text-center card-body">
                    <div className="mx-auto text-[24px]">Welcome Back!</div>
                    <GoogleLoginButton setEmail={setSocialEmail} setSocial={setSocial} signin={signin} />
                    <div className='flex items-center justify-center gap-2'>
                        <div className='h-[1px] bg-black w-[40%] flex items-center'></div>
                        <div>Or</div>
                        <div className='h-[1px] bg-black w-[40%] flex items-center'></div>
                    </div>
                    <form className="flex flex-col gap-2 form-control" onSubmit={signin}>
                        <div>
                            <input
                                className="w-full p-3 border border-gray-300 rounded-full input input-bordered"
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                autoComplete="email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                className="w-full p-3 border border-gray-300 rounded-full input input-bordered"
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                required
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full p-3 mb-4 border border-blue-400 btn btn-outline btn-primary rounded-2xl hover:bg-blue-400 hover:text-white">
                            <span className="invisible"></span>
                            Sign in
                        </button>
                    </form>
                    <div>
                        <a className="block text-sm text-blue-500 no-underline link text-accent" href="/login/forgot-password">
                            Forgot password?
                        </a>
                        <a href="/signup" className="block mt-4 text-sm text-blue-500 no-underline link text-accent">
                            Create an account
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;