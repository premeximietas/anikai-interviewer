"use client";
import axios from "axios";
import { Captions, EllipsisVertical, Hand, Info, Laugh, MessageSquareText, Mic, MicOff, MonitorUp, Phone, SendHorizontal, Shapes, Users, Video, VideoOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DrawerModal from './DrawerModal';
import { Input } from './ui/input';
import UserView from './UserView';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const MeetPage = () => {
    const [micOn, setMicOn] = useState(false);
    const [cameraOn, setCameraOn] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [showInCallMsg, setShowInCallMsg] = useState(false);
    const [showMeetInfo, setShowMeetInfo] = useState(false);
    const [transcription, setTranscription] = useState<string>(""); // Stores transcribed text
    const [isBotSpeaking, setIsBotSpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null); // 🔹 Keep AudioContext persistent

    const {
        transcript,
        resetTranscript,
    } = useSpeechRecognition();

    const silenceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        console.log({ transcript });
        if (transcript.trim()) {
            setTranscription(transcript); // Save the transcribed text
        }
        if (silenceTimer.current) {
            clearTimeout(silenceTimer.current);
        }

        silenceTimer.current = setTimeout(() => {
            // Stop listening and reset transcript
            SpeechRecognition.stopListening();
            resetTranscript();
            setTranscription("");
            console.log("Stopped due to inactivity");

            if (transcription.trim()) {
                console.log(`Asish said this: ${transcription}`);
            }

            if (micOn) {
                setTimeout(() => {
                    SpeechRecognition.startListening({ continuous: true });
                    console.log("Listening restarted...");
                }, 500); // Small delay before restarting
            }

        }, 3000);

        return () => {
            if (silenceTimer.current) {
                clearTimeout(silenceTimer.current);
            }
        };
    }, [transcript]);

    const users = [
        { name: 'Bot', isSpeaking: isBotSpeaking, cameraOn: false },
        { name: 'Asish Nayak', isSpeaking: isUserSpeaking, cameraOn: cameraOn },
    ];

    useEffect(() => {
        if (micOn) {
            SpeechRecognition.startListening({ continuous: true })
            console.log("Mic turned on, listening started...");
        } else {
            SpeechRecognition.stopListening();
            resetTranscript();
            setTranscription("");
            console.log("Mic turned off, recognition stopped.");
        }
    }, [micOn]);

    useEffect(() => {
        greetWithTTS("Welcome Aniket, to interview at eximietas design,Introduce yourself");
    }, []);

    async function greetWithTTS(text: string) {
        const API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? "";
        if (!API_KEY) {
            console.error("Deepgram API Key is missing!");
            return;
        }

        setIsBotSpeaking(true);

        try {
            const response = await axios.post(
                "https://api.deepgram.com/v1/speak",
                { text },
                {
                    headers: {
                        Authorization: `Token ${API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    params: {
                        model: "aura-helios-en",
                        encoding: "linear16",
                    },
                    responseType: "arraybuffer",
                }
            );
            if (!audioContextRef.current) {
                const AudioContextClass = (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;
                if (!AudioContextClass) {
                    console.error("❌ Web Audio API is not supported on this device.");
                    return;
                }
                audioContextRef.current = new AudioContextClass();
            }
            const audioContext = audioContextRef?.current;
            if (!audioContext) {
                setIsBotSpeaking(false);
                return;
            }
            console.log({ state: audioContext.state })
            if (audioContext.state == "suspended") {
                setIsBotSpeaking(false);
                await audioContext.resume().catch(err => console.error("❌ Failed to resume AudioContext:", err));
            }

            const audioBuffer = await audioContext.decodeAudioData(response.data);
            if (!audioBuffer) {
                console.error("❌ Failed to decode audio after retries.");
                setIsBotSpeaking(false);
                return;
            }

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);

            source.start(0);
            console.log("✅ Greeting audio played!");
            source.onended = () => {
                console.log("✅ Bot finished speaking.");
                setIsBotSpeaking(false); // 🔹 Bot stops speaking
            };

        } catch (error) {
            console.error("Deepgram TTS Error:", error);
            setIsBotSpeaking(false);
        }
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center p-6">
            <div className={`w-full h-dvh grid gap-4 overflow-auto p-7
                ${users.length === 1 ? 'grid-cols-1' : ''} 
                ${users.length === 2 ? 'grid-cols-2' : ''} 
                ${users.length === 3 ? 'grid-cols-2 grid-rows-2' : ''} 
                ${users.length >= 4 ? 'grid-cols-2 grid-rows-2' : ''}`}
            >
                {users.map((user, index) => (
                    <UserView key={index} name={user.name} isSpeaking={user.isSpeaking} cameraOn={user.cameraOn} />
                ))}
            </div>

            <div className='flex flex-row w-full justify-between items-center my-auto'>
                <span>11:25 AM | axi-uxwm-dbm</span>
                <div className='flex flex-row gap-x-3 '>
                    <div onClick={() => { setIsUserSpeaking(!isUserSpeaking); setMicOn(!micOn) }} className=' px-3 bg-white rounded-lg py-2.5'>{!micOn ? <MicOff className='h-5 text-red-950' /> : <Mic className='h-5 text-red-950' />}</div>
                    <div onClick={() => setCameraOn(!cameraOn)} className=' px-3 bg-white rounded-lg py-2.5'>{!cameraOn ? <VideoOff className='h-5 text-red-950' /> : <Video className='h-5 text-red-950' />}</div>
                    <div className=' px-3 bg-gray-600 rounded-full py-2.5'><Captions className='h-5' /></div>
                    <div className=' px-3 bg-gray-600 rounded-full py-2.5'><Laugh className='h-5' /></div>
                    <div className=' px-3 bg-gray-600 rounded-full py-2.5'><MonitorUp className='h-5' /></div>
                    <div className=' px-3 bg-gray-600 rounded-full py-2.5'><Hand className='h-5' /></div>
                    <div className=' px-1 bg-gray-600 rounded-full py-2.5'><EllipsisVertical className='h-5' /></div>
                    <div className='px-4.5 bg-red-400 rounded-full py-2.5'><Phone className='h-5 rotate-135' /></div>
                </div>
                <div className='flex flex-row gap-x-7 '>
                    <Info className='h-5' onClick={() => setShowMeetInfo(true)} />
                    <Users className='h-5' onClick={() => setShowParticipants(true)} />
                    <MessageSquareText className='h-5' onClick={() => setShowInCallMsg(true)} />
                    <Shapes className='h-5' />
                </div>
            </div>
            {showParticipants && <DrawerModal title={'People'} isOpen={showParticipants} onClose={() => setShowParticipants(false)}>
                <div className='flex flex-col gap-y-3 py-5'>
                    <span className='text-xs'>IN THE MEETING</span>
                    <div className='border-[1px] rounded-xl'>
                        <div className='flex flex-row justify-between px-5 border-b-[1px] py-2'><span>Contributors</span> <span>{users?.length}</span></div>
                        {users.map((user, index) => (
                            <div key={index} className='flex flex-row justify-between px-5 py-2'><span>{user?.name}</span> <span>{user?.isSpeaking ? <Mic className='h-5 text-gray-600' /> : <MicOff className='h-5 text-gray-600' />}</span></div>
                        ))}
                    </div>
                </div>
            </DrawerModal>}
            {showInCallMsg && <DrawerModal title={'In-call messages'} isOpen={showInCallMsg} onClose={() => setShowInCallMsg(false)}>
                <div className='flex flex-col gap-y-3 py-5 relative h-[42vh]'>
                    <div className='absolute bottom-3 2xl:bottom-0 flex flex-row justify-between w-full text-xs '>
                        <div className="relative w-full">
                            <Input
                                type="text"
                                placeholder="Send a message to everyone"
                                className="pr-7 rounded-lg border-offWhite"
                            />
                            <SendHorizontal className="absolute right-1 top-1/2 -translate-y-1/2 text-activeGreen h-[2.5vh] 2xl:h-[2vh]" />
                        </div>
                    </div>
                </div>
            </DrawerModal>}
            {showMeetInfo && <DrawerModal title={'Meeting details'} isOpen={showMeetInfo} onClose={() => setShowMeetInfo(false)}>
                <div className='flex flex-col gap-y-3 py-5 '>
                    <span>Meeting Details</span>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo culpa, consequuntur voluptas explicabo cumque maxime quidem eius mollitia, ullam quae eligendi adipisci accusamus maiores incidunt veniam ad et vitae earum!</span>

                </div>
            </DrawerModal>}
        </div>
    )
}

export default MeetPage