'use client'
import React, {useCallback, useRef, useState} from "react";
import {checkEmail, collectToken, googleLogin, registerUser} from "@/services/api/auth";
import {AuthData} from "@/types";
import {useRouter} from "next/navigation";

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const [error, setError] = useState({
        email: [],
        password: [],
        fullName: [],
        repeatPassword: []
    });

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isUserExist, setIsUserExist] = useState<boolean>(false);

    const passwordFieldRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const updateError = useCallback((message: string[], errorType: string) => {
        setError(prevState => ({...prevState, [errorType]: message}));
    }, []);

    const clearError = useCallback((errorType: string) => {
        setError(prevState => ({...prevState, [errorType]: []}));
    }, []);

    const redirectProperPage = useCallback((user: AuthData) => {
        if (!user.isEmailVerified)
            router.push('/verify-email/')
    }, [router]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (isEmailVerified && isUserExist) {
            if (!email.trim()) {
                updateError(['Email is required'], 'email');
                setTimeout(() => clearError('email'), 2000);
                return;
            }
            if (!password) {
                updateError(['Password is required'], 'password');
                setTimeout(() => clearError('password'), 2000);
                return;
            }
            collectToken(email, password).then(
                user => redirectProperPage(user)
            ).catch(({status, data}) => {
                    if (status === 401) {
                        updateError([data.detail], 'password');
                        if (passwordFieldRef.current)
                            passwordFieldRef.current.select();
                        setTimeout(() => clearError('password'), 2000);
                    } else if (status === 400) {
                        updateError(data.password, 'password');
                        setTimeout(() => clearError('password'), 2000);
                    } else if (status === 404) {
                        updateError(['User not found'], 'email');
                        setTimeout(() => clearError('email'), 2000);
                    } else {
                        updateError(['An error occurred. Please try again later.'], 'email');
                        setTimeout(() => clearError('password'), 2000);
                    }
                }
            )
        } else if (isEmailVerified && !isUserExist) {
            if (!email.trim()) {
                updateError(['Email is required'], 'email');
                setTimeout(() => clearError('email'), 2000);
                return;
            }
            if (!fullName.trim()) {
                updateError(['Full name is required'], 'fullName');
                setTimeout(() => clearError('fullName'), 2000);
                return;
            }
            if (!password) {
                updateError(['Password is required'], 'password');
                setTimeout(() => clearError('password'), 2000);
                return;
            }
            if (password !== repeatPassword) {
                updateError(['Passwords do not match'], 'repeatPassword');
                setTimeout(() => clearError('repeatPassword'), 2000);
                return;
            }
            registerUser({
                email,
                fullName,
                password,
                repeatPassword
            }).then(
                user => redirectProperPage(user)
            ).catch(({status, data}) => {
                if (status === 400) {
                    if (data.password) {
                        updateError(data.password, 'password');
                        setTimeout(() => clearError('password'), 2000);
                    }
                    if (data.fullName) {
                        updateError(data.fullName, 'fullName');
                        setTimeout(() => clearError('fullName'), 2000);
                    }
                    if (data.email) {
                        updateError(data.email, 'email');
                        setTimeout(() => clearError('email'), 2000);
                    }
                    if (data.repeatPassword) {
                        updateError(data.repeatPassword, 'repeatPassword');
                        setTimeout(() => clearError('repeatPassword'), 2000);
                    }
                } else if (status === 404) {
                    updateError(['User not found'], 'email');
                    setTimeout(() => clearError('email'), 2000);
                } else {
                    updateError(['An error occurred. Please try again later.'], 'email');
                    setTimeout(() => clearError('email'), 2000);
                }
            })
        } else {
            if (!email.trim()) {
                updateError(['Email is required'], 'email');
                setTimeout(() => clearError('email'), 2000);
                return;
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                updateError(['Invalid email format'], 'email');
                setTimeout(() => clearError('email'), 2000);
                return;
            }
            checkEmail(email).then(
                () => {
                    setIsEmailVerified(true);
                    setIsUserExist(true);
                    if (passwordFieldRef.current)
                        passwordFieldRef.current.focus();
                }
            ).catch(({status, data}) => {
                if (status === 400) {
                    updateError(data.email, 'email');
                    setTimeout(() => clearError('email'), 2000);
                } else if (status === 404) {
                    setIsUserExist(false);
                    setIsEmailVerified(true);
                } else {
                    updateError(['An error occurred. Please try again later.'], 'email');
                    setTimeout(() => clearError('email'), 2000);
                }
            })
        }
    }, [isEmailVerified, isUserExist, email, password, updateError, clearError, redirectProperPage, fullName, repeatPassword]);

    const handleGoogleLogin = useCallback(() => {
        const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/callback/`;
        const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile`;

        const width = 500, height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(authUrl, "Google Login", `width=${width},height=${height},top=${top},left=${left}`);

        if (!popup) {
            console.error("Popup blocked! Allow popups and try again.");
            return;
        }

        const handleMessage = (event: MessageEvent<{ code: string, provider: string }>) => {
            if (event.origin !== window.location.origin || !event.data.provider || event.data.provider !== 'google') return;
            googleLogin(event.data.code).then(user => redirectProperPage(user))
            window.removeEventListener("message", handleMessage);
            popup.close();

        };

        window.addEventListener("message", handleMessage);

        const checkPopup = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(checkPopup);
                window.removeEventListener("message", handleMessage);
            }
        }, 1000);
    }, [redirectProperPage]);

    return (
        <div className="w-full pt-9">
            <h3 className={'text-text-secondary text-2xl font-bold font-inter'}>Welcome to LineUp</h3>
            <form className="w-full pt-5 flex flex-col" onSubmit={handleSubmit}>
                <div className={'w-full'}>
                    <div className={'flex flex-col'}>
                        <label htmlFor="email" className="text-sm text-accent">Email</label>
                        <input
                            className={`slow-animate w-full p-2 mt-2 rounded-md border-2 border-border ${error.email.length > 0 ? 'border-red-500' : 'border-border'} focus:outline-none focus:border-accent`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            placeholder="john.doe@example.com"
                            formNoValidate={true}
                            readOnly={isEmailVerified}
                        />
                    </div>
                    {
                        error.email.map((message, index) => (
                            <p key={index} className={'text-red-500 text-sm mt-1 slow-animate w-auto'}>
                                {message}
                            </p>)
                        )
                    }
                </div>

                <div
                    className={`${isEmailVerified && !isUserExist ? 'h-fit' : 'h-0 overflow-hidden'} slow-animate`}>
                    <div className={'w-full mt-2 slow-animate'}>
                        <label htmlFor="full-name" className="text-sm text-accent">Full Name</label>
                        <input
                            className={`slow-animate w-full p-2 mt-2 rounded-md border-2 border-border ${error.fullName.length > 0 ? 'border-red-500' : 'border-border'} focus:outline-none focus:border-accent`}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            id="full-name"
                            placeholder="John Doe"
                            autoComplete={'name'}
                        />
                    </div>
                    {
                        error.fullName.map((message, index) => (
                            <p key={index} className={'text-red-500 text-sm mt-1 slow-animate w-auto'}>
                                {message}
                            </p>)
                        )
                    }
                </div>

                <div className={`${isEmailVerified ? 'h-fit' : 'h-0 overflow-hidden'} slow-animate`}>
                    <div className={'w-full mt-2'}>
                        <label htmlFor="password" className="text-sm text-accent">Password</label>
                        <input
                            className={`w-full p-2 mt-2 rounded-md border-2 border-border ${error.password.length > 0 ? 'border-red-500' : 'border-border'} focus:outline-none focus:border-accent`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            placeholder={isUserExist ? 'Enter your password' : 'Create a password'}
                            ref={passwordFieldRef}
                            autoComplete={isUserExist ? 'current-password' : 'new-password'}
                        />
                    </div>
                    {
                        error.password.map((message, index) => (
                            <p key={index} className={'text-red-500 text-sm mt-1 slow-animate w-auto'}>
                                {message}
                            </p>)
                        )
                    }
                </div>

                <div
                    className={`${isEmailVerified && !isUserExist ? 'h-fit' : 'h-0 overflow-hidden'} slow-animate`}>
                    <div className={'w-full mt-2'}>
                        <label htmlFor="repeat-password" className="text-sm text-accent">Repeat Password</label>
                        <input
                            className={`w-full p-2 mt-2 rounded-md border-2 border-border ${error.repeatPassword.length > 0 ? 'border-red-500' : 'border-border'} focus:outline-none focus:border-accent`}
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            type="password"
                            id="repeat-password"
                            placeholder="Repeat password"
                            autoComplete={'new-password'}
                        />
                    </div>
                    {
                        error.repeatPassword.map((message, index) => (
                            <p key={index} className={'text-red-500 text-sm mt-1 slow-animate w-auto'}>
                                {message}
                            </p>)
                        )
                    }
                </div>


                <div className={'flex flex-col rounded-md mt-2 gap-2'}>
                    <button
                        className={'w-full flex flex-row justify-center gap-2 p-2 rounded-md border-border cursor-pointer bg-brand hover:opacity-90'}
                        type="submit"
                    >
                        <span>{!isEmailVerified ? 'Continue with email' : (isUserExist ? 'Login' : 'Register')}</span>
                        {!isEmailVerified && (
                            <svg className={'fill-text-primary'} xmlns="http://www.w3.org/2000/svg" height="24px"
                                 viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                                <path
                                    d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </form>
            {
                !isEmailVerified && (
                    <>
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-grow h-px bg-border"></div>
                            <span className="text-muted text-sm">or</span>
                            <div className="flex-grow h-px bg-border"></div>
                        </div>
                        <div className="flex flex-row gap-2 justify-center">
                            <button className="gsi-material-button">
                                <div className="gsi-material-button-state"></div>
                                <div className="gsi-material-button-content-wrapper">
                                    <div className="gsi-material-button-icon">
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                                             style={{display: 'block'}}>
                                            <path fill="#EA4335"
                                                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                            <path fill="#4285F4"
                                                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                            <path fill="#FBBC05"
                                                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                            <path fill="#34A853"
                                                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                            <path fill="none" d="M0 0h48v48H0z"></path>
                                        </svg>
                                    </div>
                                    <span onClick={handleGoogleLogin} className="gsi-material-button-contents">Continue with Google</span>
                                </div>
                            </button>
                        </div>
                    </>
                )
            }
            {
                isEmailVerified && !isUserExist && (
                    <p className={'text-text-secondary text-sm font-inter pt-5'}>By continuing, you agree to our <span
                        className={'text-accent'}>Terms of Service</span> and <span
                        className={'text-accent'}>Privacy Policy</span></p>
                )
            }
        </div>
    )
}