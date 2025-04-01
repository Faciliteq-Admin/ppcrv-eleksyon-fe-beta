import { Link, useNavigate } from "react-router-dom";
import MainLogo from './../assets/hub.png';
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { newtonsCradle } from 'ldrs'


// Default values shown

export default function ForgotPasswordPage() {

    const [isLoading, setIsLoading] = useState(false);
    newtonsCradle.register()

    const navigate = useNavigate();
    let user = localStorage.getItem('user');
    
    if (user) {
        // check if expired
        // if expired, remove and redirect to login
        const isValidToken = true;
        if (isValidToken) {
            navigate('/');
        }
    }


    function handleForgotPassword(e: any) {
        setIsLoading(true);
        e.preventDefault();

        setTimeout(()=> {
            setIsLoading(false)
        }, 2000);
    }

    function handleBackToLogin(e: any) {
        e.preventDefault();
        navigate('/login');
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            {isLoading && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-700/50">
                <l-newtons-cradle
                size="78"
                speed="1.4"     
                color="black"
                ></l-newtons-cradle>
                <l-grid
                size="78"
                speed="1.4"     
                color="black"
                ></l-grid>
            </div>}
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Faciliteq Hub"
                    src={MainLogo}
                    className="mx-auto h-28 w-auto"
                />
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Forgot Password
                </h2>
                <p className="text-sm text-center text-slate-600 pt-4">Enter your email and we'll send a a link to reset your password.</p>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="#" method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className=" w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 indent-2"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={handleForgotPassword}
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    <a onClick={handleBackToLogin} className="flex justify-center font-semibold leading-6">
                        <ChevronLeftIcon className="h-6"/> Back to Login
                    </a>
                </p>
            </div>
        </div>
        
    );
}

