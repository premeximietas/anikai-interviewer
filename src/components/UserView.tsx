"use client";
import React, { useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface UserProps {
    name: string;
    isSpeaking: boolean;
    cameraOn: boolean;
}

const UserView: React.FC<UserProps> = ({ name, isSpeaking,cameraOn }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const enableCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                streamRef.current = stream;
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };

        const disableCamera = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };

        if (cameraOn) {
            enableCamera();
        } else {
            disableCamera();
        }

        return () => disableCamera(); // Cleanup on unmount
    }, [cameraOn]);

    return (
        <div className="relative flex items-center justify-center bg-neutral-900 rounded-lg w-auto h-auto">
            {/* Mic Status */}
            <div className="text-xs absolute top-4 right-3 z-10">
                {isSpeaking ? <Mic className="h-4 text-white" /> : <MicOff className="h-4 text-white" />}
            </div>

            {/* Speaking Waves (Only Show When isSpeaking is True) */}
            {isSpeaking && !cameraOn && 
                    <div className="wave absolute w-40 h-40 bg-white opacity-30 animate-wave" />
            }

            {/* User Avatar */}
            {cameraOn ? (
                <video ref={videoRef} autoPlay playsInline className='rounded-lg transform scale-x-[-1]' />
            ) : (
                <div className="relative flex justify-center items-center rounded-full w-36 h-36 bg-blue-400 z-10">
                    <span className="text-white text-7xl">{name.charAt(0).toUpperCase()}</span>
                </div>
            )}

            {/* User Name */}
            <span className="text-white text-xs absolute bottom-3 left-3">{name}</span>
        </div>
    );
};

export default UserView;
