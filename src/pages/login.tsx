import { Link, useNavigate } from "react-router-dom";
// import MainLogo from './../assets/hub.png';
import MainLogo from './../assets/ppcrvlogo.png';
import PoweredByLogo from './../assets/poweredByMyTech.png';
import { useEffect, useState } from "react";
import { postRequest } from "../utils/apiHelpers";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { saveUserSession } from "../utils/functions";

export default function LoginPage() {

    const navigate = useNavigate();
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [alerts, setAlerts] = useState<any[]>([]);

    let processing = false;

    useEffect(() => {
        let user = localStorage.getItem('user');
        if (user) {

            // check if expired
            // if expired, remove and redirect to login

            const isValidToken = true;
            if (isValidToken) {
                navigate('/');
            }
        }

    }, []);


    async function handleLogin(e: any) {
        e.preventDefault();

        const payload = {
            type: "Administrator",
            email: data.email,
            password: btoa(data.password),
        };


        if (!processing) {

            processing = true;
            setLoading(true);
            let response = await postRequest('/auth/login', payload);
            setLoading(false);
            processing = false;

            if (response && response.success) {
                saveUserSession(response);
                navigate('/');
                window.location.reload();
            } else {
                addAlert("error", "Invalid email or password.", 2000);
            }

        }
    }

    function handleInput(e: any) {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    function handleForgotPassword(e: any) {
        e.preventDefault();

        navigate('/forgot-password');
    }

    const addAlert = (type: "info" | "success" | "warning" | "error", message: string, duration: number) => {
        const id = Date.now();
        setAlerts((prev) => [...prev, { id, type, message, duration }]);
    };

    const removeAlert = (id: any) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="fixed top-20 right-20">
                {alerts.map((alert) =>
                    <Alert
                        key={alert.id}
                        type={alert.type}
                        message={alert.message}
                        duration={alert.duration} // 3 seconds
                        onClose={() => removeAlert(alert.id)}
                    />
                )}
            </div>
            {loading && <Loader />}
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Faciliteq Hub"
                    src={MainLogo}
                    className="mx-auto h-28 w-auto"
                />
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
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
                                value={data.email ?? ''}
                                onChange={handleInput}
                                required
                                autoComplete="email"
                                className=" w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 indent-2"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#" onClick={handleForgotPassword} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password ?? ''}
                                onChange={handleInput}
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 indent-2"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleLogin}
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    {/* Not a member?{' '}
                    <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Start a 14 day free trial
                    </a> */}
                    <img
                        alt="Powered by MyTechPH"
                        src={PoweredByLogo}
                        className="mx-auto h-14 w-auto"
                    />
                </p>
            </div>
        </div>

    );
}

