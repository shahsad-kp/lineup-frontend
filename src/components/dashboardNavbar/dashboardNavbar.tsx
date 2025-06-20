'use client';
import {Fragment, useMemo} from 'react';
import {Divider, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupsIcon from '@mui/icons-material/Groups';
import {useRouter} from "next/navigation";

export const DashboardNavbar = () => {
    const router = useRouter();
    const navBarOptions = useMemo(() => {
        return [
            {name: 'Event Types', href: '/', icon: <EventIcon/>},
            {name: 'Multi Events', href: '/settings', icon: <CalendarMonthIcon/>},
            {name: 'Meeting Schedules', href: '/profile', icon: <ScheduleIcon/>},
            {name: 'Availability', href: '/profile', icon: <EventAvailableIcon/>},
            {name: 'Contacts', href: '/contacts', icon: <GroupsIcon/>},
            {name: 'Profile', href: '/help', icon: <PersonIcon/>}
        ];
    }, []);

    return (
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
                                },
                                cursor: 'pointer',
                            }}
                            direction={'row'}
                            gap={1}
                            onClick={() => {
                                router.push(option.href);
                            }}
                        >
                            {option.icon}
                            <Typography textColor={'white'}>{option.name}</Typography>
                        </Stack>
                        {index < navBarOptions.length - 1 && (<Divider/>)}
                    </Fragment>
                ))
            }
        </Stack>
    );
};