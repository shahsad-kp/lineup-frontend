import Image from 'next/image';
import LogoDark from "@/assets/images/Logo-Dark.svg";
import LogoLight from "@/assets/images/Logo-Light.svg";
import Link from 'next/link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Box, Stack} from "@mui/joy";
import React from "react";
import {DashboardNavbar} from "@/components/dashboardNavbar/dashboardNavbar";


type Props = {
    children: React.ReactNode
}

export default function DashboardLayout(props: Props) {

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
                    width={30}
                />
                <Image
                    src={LogoDark}
                    alt="LineUp Logo"
                    className="hidden dark:block"
                    width={30}
                />
            </Link>
            <Box>
                <AccountCircleIcon sx={{width: '2rem', height: '2rem'}}/>
            </Box>
        </Stack>
        <Stack component={'main'} direction={'row'} width={'100%'} height={'100%'} sx={{flex: 1}}>
            <DashboardNavbar/>
            <Box borderRadius={'1rem 0'} width={'100%'}>
                {props.children}
            </Box>
        </Stack>
    </>
}