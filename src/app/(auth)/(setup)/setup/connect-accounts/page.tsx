'use client';
import React, {useCallback, useState} from "react";
import {SetupTracker} from "@/app/(auth)/(setup)/setup/setupTracker";
import InfoHover from "@/components/infoIcon/infoIcon";
import Image from "next/image";
import {connectCalendarAccount} from "@/services/api";
import {Calendar} from "@/types";


export default function SetupLayout() {
    const [accountName, setAccountName] = useState('');
    const [connectedCalendars, setConnectedCalendars] = useState<Calendar[]>([]);
    const [openedCalendar, setOpenedCalendar] = useState<Calendar | null>(null);

    const [showAddAccountModal, setShowAddAccountModal] = useState<boolean>(false);

    const closeModalOnOutsideClick = useCallback((event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest('#connectAccountModal') === null) {
            document.removeEventListener('click', closeModalOnOutsideClick);
            setShowAddAccountModal(false);
        }
    }, []);

    const closeModal = useCallback(() => {
        setShowAddAccountModal(false);
        setOpenedCalendar(null);
        setAccountName('');
        document.removeEventListener('click', closeModalOnOutsideClick);
    }, [closeModalOnOutsideClick]);

    const openAddAccountModal = useCallback(() => {
        setShowAddAccountModal(true);
        document.addEventListener('click', closeModalOnOutsideClick);
    }, [closeModalOnOutsideClick]);

    const connectGoogleAccount = useCallback(() => {
        const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/callback/`;
        const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const authUrlQuery = new URLSearchParams({
            client_id: CLIENT_ID || '',
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            scope: 'https://www.googleapis.com/auth/calendar',
            access_type: 'offline',
            prompt: 'consent',
            include_granted_scopes: 'true',
        })
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authUrlQuery.toString()}`;

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
            connectCalendarAccount({
                code: event.data.code,
                name: accountName || null,
                provider: 'Google',
            }).then(calendar => {
                setAccountName(calendar.name);
                setOpenedCalendar(calendar);
                setConnectedCalendars((prev) => {
                    const existingCalendar = prev.find(c => c.id === calendar.id);
                    if (existingCalendar) {
                        return prev.map(c => c.id === calendar.id ? calendar : c);
                    }
                    return [...prev, calendar];
                });
            })
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
    }, [accountName]);

    return (
        <>
            <div>
                <SetupTracker totalSteps={4} currentStep={1}/>
                <div className={'w-full flex flex-col gap-3 mt-10'}>
                    <div className={'w-full flex flex-row gap-2'}>
                        <h4 className={'text-text-secondary font-medium'}>Connect your calendar accounts</h4>
                        <InfoHover>
                            <div className={'w-80 text-text-secondary text-sm'}>
                                <p>Connecting your calendar accounts will allow you to sync your events and schedules
                                    with our platform.</p>
                            </div>
                        </InfoHover>
                    </div>
                    <div className={'w-full flex-col gap-2 flex'}>
                        {
                            connectedCalendars.map(calendar => {
                                return (
                                    <div key={calendar.id}
                                         className={'bg-gray-500 flex-row flex py-3 px-4 rounded gap-2 items-center'}>
                                        {
                                            calendar.provider === 'Google' ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="24"
                                                     height="24">
                                                    <path
                                                        d="M152.632 47.368l-47.368-5.263-57.895 5.263L42.105 100l5.263 52.632L100 159.211l52.632-6.579 5.263-53.947z"
                                                        fill="#fff"/>
                                                    <path
                                                        d="M68.961 129.026c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c.829 3.158 2.276 5.605 4.342 7.342 2.053 1.737 4.553 2.592 7.474 2.592 2.987 0 5.553-.908 7.697-2.724s3.224-4.132 3.224-6.934c0-2.868-1.132-5.211-3.395-7.026s-5.105-2.724-8.5-2.724h-5.276v-9.039h4.736c2.921 0 5.382-.789 7.382-2.368s3-3.737 3-6.487c0-2.447-.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684 0-4.816.711-6.395 2.145s-2.724 3.197-3.447 5.276l-9.039-3.763c1.197-3.395 3.395-6.395 6.618-8.987 3.224-2.592 7.342-3.895 12.342-3.895 3.697 0 7.026.711 9.974 2.145 2.947 1.434 5.263 3.421 6.934 5.947 1.671 2.539 2.5 5.382 2.5 8.539 0 3.224-.776 5.947-2.329 8.184s-3.461 3.947-5.724 5.145v.539a17.379 17.379 0 0 1 7.342 5.724c1.908 2.566 2.868 5.632 2.868 9.211s-.908 6.776-2.724 9.579-4.329 5.013-7.513 6.618C89.355 132.184 85.763 133 81.776 133c-4.618.013-8.881-1.316-12.815-3.974zM125 83.711l-9.974 7.25-5.013-7.605L128 70.382h6.895v61.197H125z"
                                                        fill="#1a73e8"/>
                                                    <path
                                                        d="M152.632 200L200 152.632l-23.684-10.526-23.684 10.526-10.526 23.684z"
                                                        fill="#ea4335"/>
                                                    <path d="M36.842 176.316L47.368 200h105.263v-47.368H47.368z"
                                                          fill="#34a853"/>
                                                    <path
                                                        d="M15.789 0C7.066 0 0 7.066 0 15.789v136.842l23.684 10.526 23.684-10.526V47.368h105.263l10.526-23.684L152.632 0z"
                                                        fill="#4285f4"/>
                                                    <path
                                                        d="M0 152.632v31.579C0 192.935 7.066 200 15.789 200h31.579v-47.368z"
                                                        fill="#188038"/>
                                                    <path d="M152.632 47.368v105.263H200V47.368l-23.684-10.526z"
                                                          fill="#fbbc04"/>
                                                    <path
                                                        d="M200 47.368V15.789C200 7.065 192.934 0 184.211 0h-31.579v47.368z"
                                                        fill="#1967d2"/>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" clipRule="evenodd"
                                                     fillRule="evenodd"
                                                     height="24" imageRendering="optimizeQuality"
                                                     shapeRendering="geometricPrecision"
                                                     textRendering="geometricPrecision"
                                                     viewBox="0 0 6876 6994" width="24">
                                                    <path
                                                        d="M0 779L4033 0l-14 6994L0 6160zm1430 3632c-305-357-390-918-244-1384 203-648 718-867 1149-717 246 86 465 293 582 610 56 152 86 326 88 503 4 318-106 692-324 953-335 400-903 441-1250 35zm314-339c-150-223-191-573-120-864 99-404 352-541 563-447 121 54 228 183 285 381 27 95 42 203 43 314 2 198-52 432-159 595-164 250-442 275-612 22zm2552-2598h2341c131 0 238 107 238 238v86L5035 3039c-24 16-83 62-132 93-72 47-77 38-153-5-117-65-319-203-455-297V1474zm2580 875v2504c0 200-164 365-365 365H4296V3366c133 88 310 204 419 271 88 54 104 79 202 22 45-26 89-60 119-80l1840-1229z"
                                                        fill="#0072c6"/>
                                                </svg>
                                            )
                                        }
                                        <span
                                            className={'text-text-secondary text-sm font-medium'}>{calendar.name}</span>
                                    </div>
                                )
                            })
                        }
                        <button className={'bg-gray-500 flex-row flex py-3 px-4 rounded gap-2'}
                                onClick={() => openAddAccountModal()}>
                            <Image src={'/icons/plus-icon.svg'} alt={'Plus Icon'} className={'w-5 h-5'} width={20}
                                   height={20}/>
                            <span className={'text-text-secondary text-sm font-medium'}>Add a calendar account</span>
                        </button>
                    </div>
                </div>
            </div>
            {
                showAddAccountModal && (
                    <div className={'fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'}>
                        <div
                            id={'connectAccountModal'}
                            className={'bg-surface p-7 sm:rounded-lg h-full sm:h-fit shadow-lg w-full sm:w-fit sm:min-w-1/2 md:min-w-1/3 lg:min-w-1/4 fix fix-col items-center'}>
                            <h4 className={'text-text-secondary text-center text-2xl font-bold mb-3'}>Add Calendar
                                Account</h4>
                            <div className={'w-fit'}>
                                <div className={'mt-3 w-full'}>
                                    <span className={'text-text-secondary text-sm font-medium'}>Connect your account</span>
                                    {!openedCalendar ? (
                                        <div className={'w-full flex flex-row gap-2 mt-2'}>
                                            <button
                                                className={'w-full rounded bg-gray-500 flex flex-row gap-2 p-2 justify-center'}
                                                onClick={() => connectGoogleAccount()}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="24"
                                                     height="24">
                                                    <path
                                                        d="M152.632 47.368l-47.368-5.263-57.895 5.263L42.105 100l5.263 52.632L100 159.211l52.632-6.579 5.263-53.947z"
                                                        fill="#fff"/>
                                                    <path
                                                        d="M68.961 129.026c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c.829 3.158 2.276 5.605 4.342 7.342 2.053 1.737 4.553 2.592 7.474 2.592 2.987 0 5.553-.908 7.697-2.724s3.224-4.132 3.224-6.934c0-2.868-1.132-5.211-3.395-7.026s-5.105-2.724-8.5-2.724h-5.276v-9.039h4.736c2.921 0 5.382-.789 7.382-2.368s3-3.737 3-6.487c0-2.447-.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684 0-4.816.711-6.395 2.145s-2.724 3.197-3.447 5.276l-9.039-3.763c1.197-3.395 3.395-6.395 6.618-8.987 3.224-2.592 7.342-3.895 12.342-3.895 3.697 0 7.026.711 9.974 2.145 2.947 1.434 5.263 3.421 6.934 5.947 1.671 2.539 2.5 5.382 2.5 8.539 0 3.224-.776 5.947-2.329 8.184s-3.461 3.947-5.724 5.145v.539a17.379 17.379 0 0 1 7.342 5.724c1.908 2.566 2.868 5.632 2.868 9.211s-.908 6.776-2.724 9.579-4.329 5.013-7.513 6.618C89.355 132.184 85.763 133 81.776 133c-4.618.013-8.881-1.316-12.815-3.974zM125 83.711l-9.974 7.25-5.013-7.605L128 70.382h6.895v61.197H125z"
                                                        fill="#1a73e8"/>
                                                    <path
                                                        d="M152.632 200L200 152.632l-23.684-10.526-23.684 10.526-10.526 23.684z"
                                                        fill="#ea4335"/>
                                                    <path d="M36.842 176.316L47.368 200h105.263v-47.368H47.368z"
                                                          fill="#34a853"/>
                                                    <path
                                                        d="M15.789 0C7.066 0 0 7.066 0 15.789v136.842l23.684 10.526 23.684-10.526V47.368h105.263l10.526-23.684L152.632 0z"
                                                        fill="#4285f4"/>
                                                    <path
                                                        d="M0 152.632v31.579C0 192.935 7.066 200 15.789 200h31.579v-47.368z"
                                                        fill="#188038"/>
                                                    <path d="M152.632 47.368v105.263H200V47.368l-23.684-10.526z"
                                                          fill="#fbbc04"/>
                                                    <path
                                                        d="M200 47.368V15.789C200 7.065 192.934 0 184.211 0h-31.579v47.368z"
                                                        fill="#1967d2"/>
                                                </svg>
                                                <span>Google</span>
                                            </button>
                                            <button
                                                className={'w-full rounded bg-gray-500 flex flex-row gap-2 p-2 justify-center'}>
                                                <svg xmlns="http://www.w3.org/2000/svg" clipRule="evenodd"
                                                     fillRule="evenodd"
                                                     height="24" imageRendering="optimizeQuality"
                                                     shapeRendering="geometricPrecision"
                                                     textRendering="geometricPrecision"
                                                     viewBox="0 0 6876 6994" width="24">
                                                    <path
                                                        d="M0 779L4033 0l-14 6994L0 6160zm1430 3632c-305-357-390-918-244-1384 203-648 718-867 1149-717 246 86 465 293 582 610 56 152 86 326 88 503 4 318-106 692-324 953-335 400-903 441-1250 35zm314-339c-150-223-191-573-120-864 99-404 352-541 563-447 121 54 228 183 285 381 27 95 42 203 43 314 2 198-52 432-159 595-164 250-442 275-612 22zm2552-2598h2341c131 0 238 107 238 238v86L5035 3039c-24 16-83 62-132 93-72 47-77 38-153-5-117-65-319-203-455-297V1474zm2580 875v2504c0 200-164 365-365 365H4296V3366c133 88 310 204 419 271 88 54 104 79 202 22 45-26 89-60 119-80l1840-1229z"
                                                        fill="#0072c6"/>
                                                </svg>
                                                <span>Outlook</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className={'w-full flex flex-row mt-2 gap-2 border-2 p-3 rounded border-border'}>
                                            {
                                                openedCalendar.provider === 'Google' ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="24"
                                                         height="24">
                                                        <path
                                                            d="M152.632 47.368l-47.368-5.263-57.895 5.263L42.105 100l5.263 52.632L100 159.211l52.632-6.579 5.263-53.947z"
                                                            fill="#fff"/>
                                                        <path
                                                            d="M68.961 129.026c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c.829 3.158 2.276 5.605 4.342 7.342 2.053 1.737 4.553 2.592 7.474 2.592 2.987 0 5.553-.908 7.697-2.724s3.224-4.132 3.224-6.934c0-2.868-1.132-5.211-3.395-7.026s-5.105-2.724-8.5-2.724h-5.276v-9.039h4.736c2.921 0 5.382-.789 7.382-2.368s3-3.737 3-6.487c0-2.447-.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684 0-4.816.711-6.395 2.145s-2.724 3.197-3.447 5.276l-9.039-3.763c1.197-3.395 3.395-6.395 6.618-8.987 3.224-2.592 7.342-3.895 12.342-3.895 3.697 0 7.026.711 9.974 2.145 2.947 1.434 5.263 3.421 6.934 5.947 1.671 2.539 2.5 5.382 2.5 8.539 0 3.224-.776 5.947-2.329 8.184s-3.461 3.947-5.724 5.145v.539a17.379 17.379 0 0 1 7.342 5.724c1.908 2.566 2.868 5.632 2.868 9.211s-.908 6.776-2.724 9.579-4.329 5.013-7.513 6.618C89.355 132.184 85.763 133 81.776 133c-4.618.013-8.881-1.316-12.815-3.974zM125 83.711l-9.974 7.25-5.013-7.605L128 70.382h6.895v61.197H125z"
                                                            fill="#1a73e8"/>
                                                        <path
                                                            d="M152.632 200L200 152.632l-23.684-10.526-23.684 10.526-10.526 23.684z"
                                                            fill="#ea4335"/>
                                                        <path d="M36.842 176.316L47.368 200h105.263v-47.368H47.368z"
                                                              fill="#34a853"/>
                                                        <path
                                                            d="M15.789 0C7.066 0 0 7.066 0 15.789v136.842l23.684 10.526 23.684-10.526V47.368h105.263l10.526-23.684L152.632 0z"
                                                            fill="#4285f4"/>
                                                        <path
                                                            d="M0 152.632v31.579C0 192.935 7.066 200 15.789 200h31.579v-47.368z"
                                                            fill="#188038"/>
                                                        <path d="M152.632 47.368v105.263H200V47.368l-23.684-10.526z"
                                                              fill="#fbbc04"/>
                                                        <path
                                                            d="M200 47.368V15.789C200 7.065 192.934 0 184.211 0h-31.579v47.368z"
                                                            fill="#1967d2"/>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" clipRule="evenodd"
                                                         fillRule="evenodd"
                                                         height="24" imageRendering="optimizeQuality"
                                                         shapeRendering="geometricPrecision"
                                                         textRendering="geometricPrecision"
                                                         viewBox="0 0 6876 6994" width="24">
                                                        <path
                                                            d="M0 779L4033 0l-14 6994L0 6160zm1430 3632c-305-357-390-918-244-1384 203-648 718-867 1149-717 246 86 465 293 582 610 56 152 86 326 88 503 4 318-106 692-324 953-335 400-903 441-1250 35zm314-339c-150-223-191-573-120-864 99-404 352-541 563-447 121 54 228 183 285 381 27 95 42 203 43 314 2 198-52 432-159 595-164 250-442 275-612 22zm2552-2598h2341c131 0 238 107 238 238v86L5035 3039c-24 16-83 62-132 93-72 47-77 38-153-5-117-65-319-203-455-297V1474zm2580 875v2504c0 200-164 365-365 365H4296V3366c133 88 310 204 419 271 88 54 104 79 202 22 45-26 89-60 119-80l1840-1229z"
                                                            fill="#0072c6"/>
                                                    </svg>
                                                )
                                            }
                                            <span>{openedCalendar.name}</span>
                                        </div>
                                    )}
                                </div>
                                <div className={'mt-3'}>
                                    <label htmlFor="accountName" className={'text-text-secondary text-sm font-medium'}>Account
                                        Name</label>
                                    <input
                                        type="text"
                                        id="accountName"
                                        className={'w-full bg-surface border border-border rounded p-2 mt-2'}
                                        placeholder={'Enter account name'}
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        autoCorrect={'off'}
                                        autoComplete={'off'}
                                    />
                                </div>
                            </div>
                            <div className={'w-full flex mt-8 justify-end'}>
                                <button className={'bg-text-muted rounded py-1 px-2 text-sm font-medium'}
                                        onClick={() => closeModal()}>
                                    {openedCalendar ? 'Save & ' : ''} Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}