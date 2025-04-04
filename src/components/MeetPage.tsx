"use client";
import axios from "axios";
import { Captions, ChevronRight, EllipsisVertical, Hand, Info, Laugh, MessageSquareText, Mic, MicOff, MonitorUp, Phone, SendHorizontal, Shapes, Users, Video, VideoOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DrawerModal from './DrawerModal';
import { Input } from './ui/input';
import UserView from './UserView';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import TypingText from "@/input-components/TypingText";
import dayjs from "dayjs";
import { Button } from "./ui/button";


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
    const [botMessage, setBotMessage] = useState<string>("Hi Aniket, Welcome to interview at eximietas design, lets start with your introduction first"); // Stores bot message
    const [showCaptions, setShowCaptions] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

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
        greetWithTTS(botMessage);
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

    // useEffect(() => {
    //     if (botMessage) {
    //       setShowCaptions(true);
    //       const timer = setTimeout(() => {
    //         setShowCaptions(false);
    //       }, 3000);
    //       return () => clearTimeout(timer);
    //     }
    //   }, [botMessage]);

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
                <div className="text-sm gap-x-2 flex flex-row items-center">
                    <span>{dayjs().format("hh:mm A")}</span>
                    <span>|</span>
                    <span>{dayjs().format("MMM D, YYYY")}</span>
                </div>
                <div className='flex flex-row gap-x-3 '>
                    <div onClick={() => { setIsUserSpeaking(!isUserSpeaking); setMicOn(!micOn) }} className=' px-3 bg-white rounded-lg py-2.5 cursor-pointer'>{!micOn ? <MicOff className='h-5 text-red-950' /> : <Mic className='h-5 text-red-950' />}</div>
                    <div onClick={() => setCameraOn(!cameraOn)} className=' px-3 bg-white rounded-lg py-2.5 cursor-pointer'>{!cameraOn ? <VideoOff className='h-5 text-red-950' /> : <Video className='h-5 text-red-950' />}</div>
                    <div onClick={() => setShowCaptions(!showCaptions)} className={`px-3 ${showCaptions ? 'bg-white text-red-950 rounded-lg cursor-pointer' : 'bg-gray-600 rounded-full'} py-2.5`}><Captions className='h-5' /></div>
                    <div className=' px-3 bg-gray-600 rounded-full py-2.5 text-sm flex flex-row items-center justify-center font-semibold cursor-pointer'><span>Next Question</span><ChevronRight className='h-5' /></div>
                    <div className='px-4.5 bg-red-400 rounded-full py-2.5 cursor-pointer'><Phone className='h-5 rotate-135' /></div>
                </div>
                <div className='flex flex-row gap-x-4 items-center'>
                    <Info className='h-5 cursor-pointer' onClick={() => setShowMeetInfo(true)} />
                    <Users className='h-5 cursor-pointer' onClick={() => setShowParticipants(true)} />
                    <MessageSquareText className='h-5 cursor-pointer' onClick={() => setShowInCallMsg(true)} />
                    <Button className="rounded-lg bg-gray-600 text-white hover:bg-gray-600 cursor-pointer" onClick={()=> setShowConfirmation(true)}>Submit Interview</Button>
                </div>
            </div>
            {showCaptions && <div className="absolute 2xl:bottom-[9%] bottom-[13%] bg-white text-black font-semibold"> <TypingText text={botMessage} /></div>}
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
            {showConfirmation && <DrawerModal title={'Submit Interview?'} isOpen={showConfirmation} onClose={() => setShowConfirmation(false)}>
                <div className='flex flex-col gap-y-3 py-5 '>
                    <span>Are you sure you want to submit and finish your interview? This action cannot be undone. <br/><br/>Thank you for your time — we’ll review your responses and get back to you shortly</span>
                    <div className="flex flex-row gap-x-3 justify-end mt-5">
                    <Button>No</Button>
                    <Button>Yes</Button>
                    </div>
                </div>
            </DrawerModal>}
        </div>
    )
}

export default MeetPage