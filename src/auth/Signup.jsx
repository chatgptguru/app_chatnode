import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FcGoogle } from "react-icons/fc";
import GoogleSignupButton from './GoogleSignupButton';
import { Outlet, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('isSigned')) {
            navigate('/bots');
        }
    }, [])
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const socialEmail = useRef(false)
    const isSocial = useRef(false)
    const setSocial = () => {
        isSocial.current = true
    }
    const setSocialEmail = (value) => {
        socialEmail.current = value
    }
    const signup = async (e) => {
        if (!isSocial.current)
            e.preventDefault()
        if (!isSocial.current && (email == "" || password == "")) {
            toast.warning("please input all field")
        } else {
            console.log(email, password)
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
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/signup`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log(response)
                if (response.status === 200) {
                    toast.success(response.data.message)
                    await localStorage.setItem('token', response.data.token);
                    await localStorage.setItem('isSigned', true);
                    await localStorage.setItem('user_id', response.data.user_id);
                    navigate('/bots');
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
                    <div className="mx-auto text-[20px] font-bold">Sign Up to <span className='text-blue-500'>Your Free Plan</span></div>
                    <div className="mx-auto text-[14px]">Always free! No credit card required.</div>
                    <GoogleSignupButton setEmail={setSocialEmail} setSocial={setSocial} signup={signup} />
                    <div className='flex items-center justify-center gap-2'>
                        <div className='h-[1px] bg-black w-[40%] flex items-center'></div>
                        <div>Or</div>
                        <div className='h-[1px] bg-black w-[40%] flex items-center'></div>
                    </div>
                    <form className="flex flex-col gap-2 form-control" onSubmit={signup}>
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
                        <button type="submit" className="w-full p-3 mb-4 text-blue-400 border border-blue-400 btn btn-outline btn-primary rounded-2xl hover:bg-blue-400 hover:text-white">
                            <span className="invisible"></span>
                            Create Account
                        </button>
                    </form>
                    <div>
                        <div>
                            Already have an account? <a className="text-blue-500 no-underline link text-accent" href="/signin">Sign in</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;