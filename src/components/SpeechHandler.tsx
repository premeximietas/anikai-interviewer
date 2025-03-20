"use client";
import { useState } from "react";

const SpeechHandler: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);

  // TTS function
  const speak = (text: string): void => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  // STT function
  const startListening = (): void => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
  
    const recognition = new SpeechRecognition() as InstanceType<typeof SpeechRecognition>;
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
  
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setRecognizedText(transcript);
    };
  
    recognition.onend = () => setIsListening(false);
  
    recognition.start();
    setIsListening(true);
  };
  

  const stopListening = (): void => {
    window.speechSynthesis.cancel();
    setIsListening(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Text-to-Speech & Speech-to-Text</h1>

      {/* TTS */}
      <div className="mb-4">
        <textarea
          className="border p-2 w-full"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to speak"
        />
        <button
          onClick={() => speak(inputText)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Speak
        </button>
      </div>

      {/* STT */}
      <div>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-4 py-2 rounded text-white ${
            isListening ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
        <div className="border p-2 mt-4 min-h-[50px]">
          <p className="text-gray-700">Recognized Text:</p>
          <p className="font-bold">{recognizedText}</p>
        </div>
      </div>
    </div>
  );
};

export default SpeechHandler;
