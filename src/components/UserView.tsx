import React from 'react';
import { Mic, MicOff, User } from 'lucide-react';

interface UserProps {
    name: string;
    micOff: boolean;
    isSpeaking?: boolean;
}

const UserView: React.FC<UserProps> = ({ name, micOff,isSpeaking }) => {
    return (
        <div className='relative flex items-center justify-center bg-neutral-900 rounded-lg w-auto h-auto'>
            {/* Mic Status */}
            <div className='text-xs absolute top-4 right-3'>{isSpeaking ? <Mic className='h-4 text-white' /> : <MicOff className='h-4 text-white' /> }</div>


            {/* User Avatar */}
            <div className='bg-blue-400 rounded-full w-36 h-36 flex justify-center items-center'>
                    <span className='text-white text-7xl 2xl:text-[6xl]'>{name.charAt(0).toUpperCase()}</span>
                </div>

            {/* User Name */}
            <span className='text-white text-xs absolute bottom-3 left-3'>{name}</span>
            </div>
    );
};

export default UserView;