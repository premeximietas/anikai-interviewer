"use client";
import axios from "axios";
import { Captions, EllipsisVertical, Hand, Info, Laugh, MessageSquareText, Mic, MicOff, MonitorUp, Phone, SendHorizontal, Shapes, Users, Video, VideoOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DrawerModal from './DrawerModal';
import { Input } from './ui/input';
import UserView from './UserView';


const MeetPage = () => {
    const [micOn, setMicOn] = useState(false);
    const [cameraOn, setCameraOn] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [showInCallMsg, setShowInCallMsg] = useState(false);
    const [showMeetInfo, setShowMeetInfo] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcription, setTranscription] = useState<string>(""); // Stores transcribed text

    const deepgramSocketRef = useRef<WebSocket | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const users = [
        { name: 'Bot', micOff: true },
        { name: 'Asish Nayak', micOff: !micOn },
    ];

    useEffect(() => {
        if (micOn) {
            setupDeepgramSTT();
        } else {
            stopDeepgramSTT();
        }
    }, [micOn]);

    useEffect(() => {
        greetWithTTS("Welcome Aniket, to interview at eximietas design ok may god bless you");
    }, []);

    async function greetWithTTS(text: string) {
        const API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? "";
        if (!API_KEY) {
            console.error("Deepgram API Key is missing!");
            return;
        }

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
            console.log("TTS Response Received:", response.data);

            const AudioContextClass = (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;
            if (!AudioContextClass) {
                console.error("❌ Web Audio API is not supported on this device.");
                return;
            }

            const audioContext = new AudioContextClass();

            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
                audioContext.decodeAudioData(
                    response.data,
                    (buffer: AudioBuffer | PromiseLike<AudioBuffer>) => resolve(buffer),
                    (err: any) => reject(err)
                );
            });

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);

            source.start(0);
            console.log("✅ Greeting audio played!");

        } catch (error) {
            console.error("Deepgram TTS Error:", error);
        }
    }

    async function setupDeepgramSTT() {
        const API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? "";
        if (!API_KEY) {
            console.error("Deepgram API Key is missing!");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // ✅ Correct Deepgram WebSocket URL
            const deepgramSocket = new WebSocket(`wss://api.deepgram.com/v1/listen`, ["token", API_KEY]);

            deepgramSocketRef.current = deepgramSocket;

            deepgramSocket.onopen = () => {
                console.log("✅ Connected to Deepgram STT WebSocket");

                // ✅ Send configuration settings
                deepgramSocket.send(
                    JSON.stringify({
                        config: {
                            model : "aura-helios-en",
                            language: "en-IN",
                            tier: "enhanced",
                            interim_results: true,
                            punctuate: true,
                            profanity_filter: false,
                            endpointing: 250,
                            diarize: true,
                            sample_rate: 48000,
                        },
                    })
                );

                // ✅ Start recording & streaming audio
                const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

                mediaRecorder.ondataavailable = (event) => {
                    if (deepgramSocket.readyState === WebSocket.OPEN) {
                        deepgramSocket.send(event.data);
                    }
                };

                mediaRecorder.start(500); // 🔹 Send audio chunks every 500ms
                mediaRecorderRef.current = mediaRecorder;
            };

            deepgramSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                const transcript = data.channel?.alternatives[0]?.transcript;

                if (transcript) {
                    console.log("🗣 Asish Nayak said:", transcript);
                    setTranscription(transcript); // 🔹 Store transcript in state
                }
            };

            deepgramSocket.onerror = (error) => {
                console.error("❌ Deepgram WebSocket Error:", error);
            };

            deepgramSocket.onclose = () => {
                console.log("❌ Deepgram WebSocket closed");
            };
        } catch (error) {
            console.error("❌ Error accessing microphone:", error);
        }
    }

    function stopDeepgramSTT() {
        deepgramSocketRef.current?.close();
        mediaRecorderRef.current?.stop();
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
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
                    <UserView key={index} name={user.name} micOff={user.micOff} isSpeaking={isSpeaking} />
                ))}
            </div>

            <div className='flex flex-row w-full justify-between items-center my-auto'>
                <span>11:25 AM | axi-uxwm-dbm</span>
                <div className='flex flex-row gap-x-3 '>
                    <div className=' px-3 bg-white rounded-lg py-2.5'>{!micOn ? <MicOff className='h-5 text-red-950' onClick={() => setMicOn(true)} /> : <Mic className='h-5 text-red-950' onClick={() => setMicOn(false)} />}</div>
                    <div className=' px-3 bg-white rounded-lg py-2.5'>{!cameraOn ? <VideoOff className='h-5 text-red-950' onClick={() => setCameraOn(true)} /> : <Video className='h-5 text-red-950' onClick={() => setCameraOn(false)} />}</div>
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
                            <div key={index} className='flex flex-row justify-between px-5 py-2'><span>{user?.name}</span> <span>{user?.micOff ? <MicOff className='h-5 text-gray-600' /> : <Mic className='h-5 text-gray-600' />}</span></div>
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
            {showMeetInfo && <DrawerModal title={'In-call messages'} isOpen={showMeetInfo} onClose={() => setShowMeetInfo(false)}>
                <div className='flex flex-col gap-y-3 py-5 '>
                    <span>Meeting Details</span>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo culpa, consequuntur voluptas explicabo cumque maxime quidem eius mollitia, ullam quae eligendi adipisci accusamus maiores incidunt veniam ad et vitae earum!</span>

                </div>
            </DrawerModal>}
        </div>
    )
}

export default MeetPage