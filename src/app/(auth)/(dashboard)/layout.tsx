import Image from 'next/image';
import LogoDark from "@/assets/images/Logo-Dark.svg";
import LogoLight from "@/assets/images/Logo-Light.svg";
import Link from 'next/link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Box, Divider, Stack} from "@mui/joy";
import React, {Fragment, useMemo} from "react";
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Typography from "@mui/joy/Typography";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

type Props = {
    children: React.ReactNode
}

export default function DashboardLayout(props: Props) {
    const navBarOptions = useMemo(() => {
        return [
            {name: 'Event Types', href: '/', icon: <EventIcon/>},
            {name: 'Multi Events', href: '/settings', icon: <CalendarMonthIcon/>},
            {name: 'Meeting Schedules', href: '/profile', icon: <ScheduleIcon/>},
            {name: 'Availablity', href: '/profile', icon: <EventAvailableIcon/>},
            {name: 'Profile', href: '/help', icon: <PersonIcon/>}
        ];
    }, []);

    return <>
        <Stack
            bgcolor={'black'}
            direction={'row'}
            justifyContent={'space-between'}
            sx={{paddingX: '1rem', paddingY: '0.5rem'}}
            alignItems={'center'}
        >
            <Link href={'/'}>
                <Image
                    src={LogoLight}
                    alt="LineUp Logo"
                    className="block dark:hidden"
                    width={20}
                />
                <Image
                    src={LogoDark}
                    alt="LineUp Logo"
                    className="hidden dark:block"
                    width={20}
                />
            </Link>
            <Box>
                <AccountCircleIcon/>
            </Box>
        </Stack>
        <Stack component={'main'} direction={'row'} width={'100%'} height={'100%'} sx={{flex: 1}}>
            <Stack component={'ul'} paddingY={'1rem'} paddingX={'1.5rem'} direction={'column'} width={'25%'}
                   height={'100%'} gap={0.5}>
                {
                    navBarOptions.map((option, index) => (
                        <Fragment key={index}>
                            <Stack
                                key={option.name}
                                component={'li'}
                                paddingX={'0.5rem'}
                                paddingY={'1rem'}
                                borderRadius={'0.5rem'}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    }
                                }}
                                direction={'row'}
                                gap={1}
                            >
                                {option.icon}
                                <Typography textColor={'white'}>{option.name}</Typography>
                            </Stack>
                            {index < navBarOptions.length - 1 && (<Divider/>)}
                        </Fragment>
                    ))

                }
            </Stack>
            <Box borderRadius={'1rem 0'} bgcolor={'black'} width={'100%'}>
                {/*{props.children}*/}
            </Box>
        </Stack>
    </>
}