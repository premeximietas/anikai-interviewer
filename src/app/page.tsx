"use client";

import { Canvas } from "@react-three/fiber";
import { AvatarTTS } from "@/components/AvatarTTS";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [speakText, setSpeakText] = useState<string>("");

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 w-80 rounded"
        />
        <button
          onClick={() => setSpeakText(text)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Speak
        </button>
      </div>

      <Canvas camera={{ position: [0,0, 1], fov: 30 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <group position={[0, -2, 0]} scale={1.2}>
        <AvatarTTS text={speakText} />
        </group>
      </Canvas>
    </div>
  );
}

