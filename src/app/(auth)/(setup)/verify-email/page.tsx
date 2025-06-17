'use client'
import React, {FormEvent, useCallback, useContext, useMemo, useState} from "react";
import {AuthContext} from "@/services/authContext/authContext";
import {maskEmail} from "@/services/utils/emailUtils";
import {resendCode, verifyEmail} from "@/services/api/auth";
import {getSetupUrl} from "@/services/utils/authUtils";
import {useRouter} from "next/navigation";

export default function VerifyEmailPage() {
    const {authData, setAuthData} = useContext(AuthContext);
    const [otp, setOtp] = useState('');
    const [sentCodeSuccessfully, setSentCodeSuccessfully] = useState(false);

    const [error, setError] = useState<string[]>([]);
    const router = useRouter();
    const otpLength = 8

    const otpOnChange = useCallback((code: string) => {
        code = code.replace(/[^a-zA-Z0-9]/g, '');
        if (code.length > otpLength)
            return;
        setOtp(code.toUpperCase());
    }, [otpLength]);

    const email = useMemo(() => {
        if (authData && authData.email)
            return maskEmail(authData.email);
        return null;
    }, [authData]);

    const onSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        verifyEmail(otp).then(
            user => {
                setAuthData(user);
                router.push(getSetupUrl(user));
            }
        ).catch(({status, data}: { status: number, data: { code: string } }) => {
            if (status === 400) {
                setError([data.code])
                setTimeout(
                    () => {
                        setError([])
                    }, 3000
                )
            }
        })
    }, [otp, router, setAuthData]);

    const sendCode = useCallback(() => {
        resendCode().then(
            () => {
                setSentCodeSuccessfully(true);
                setTimeout(() => {
                    setSentCodeSuccessfully(false);
                }, 3000);
            }
        ).catch(({status, data}) => {
            if (status === 400) {
                setError(data.code)
            }
        })
    }, []);

    return (
        <div className={'pt-9 w-full'}>
            <h3 className={'text-text-secondary text-2xl font-bold font-inter'}>
                Verify your email to continue
            </h3>
            <form className={'flex flex-col gap-3 mt-5'} onSubmit={onSubmit}>
                <div className={'w-full'}>
                    <label className={'text-text-secondary'}>
                        Enter one time code sent to {email || '**********'}
                    </label>
                    <input
                        type={'text'}
                        autoComplete={'one-time-code'}
                        value={otp}
                        onChange={(e) => otpOnChange(e.target.value)}
                        className={'mt-3 w-full tracking-[0.5ch] text-xl font-bold p-2 rounded-md border-2 border-border focus:border-accent h-13 text-center'}
                        placeholder={'X'.repeat(otpLength)}
                        autoFocus={true}
                    />
                </div>
                <div className={'w-full flex justify-center items-center'}>
                    {sentCodeSuccessfully && (
                        <span className={'text-sm text-success'}>Code send successfully</span>
                    )}
                    {error.map((message, index) => (
                        <span key={index} className={'text-sm text-error'}>{message}</span>
                    ))}
                </div>
                <p className={'text-text-secondary text-sm font-light'}>
                    Didn’t receive the code? Check your spam folder or{' '}
                    <span className={'text-brand cursor-pointer hover:underline'} onClick={sendCode}>
                        Resend
                    </span>
                </p>
                <div className={'w-full flex-row flex gap-2 h-10'}>
                    <button
                        className={'w-full flex flex-2/3 flex-row justify-center gap-2 p-2 rounded-md border-border cursor-pointer bg-brand hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'}
                        type={'submit'}
                        disabled={otp.length !== otpLength}
                    >
                        Verify Code
                    </button>
                </div>
            </form>
        </div>
    )
}

