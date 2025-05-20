'use client';
import React, { ReactNode, useState } from 'react';
import Image from 'next/image';

interface InfoHoverProps {
    children: ReactNode;
}

const InfoHover: React.FC<InfoHoverProps> = ({ children }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <div
                className="cursor-pointer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <Image src="/icons/info-icon.svg" alt="info" className="w-5 h-5" width={20} height={20} />
                {hovered && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 p-2 bg-gray-500 border rounded shadow-md z-10 text-sm text-gray-800">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoHover;
