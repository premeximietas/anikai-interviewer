export const transcribeAudio = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            reject("Speech recognition not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            console.log("Listening...");
        };

        recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
            const transcript = event.results[0][0].transcript;
            console.log("Transcription:", transcript);
            resolve(transcript);
        };

        recognition.onerror = (event: { error: any; }) => {
            console.error("Error during transcription:", event.error);
            reject("Transcription failed.");
        };

        recognition.onend = () => {
            console.log("Stopped listening.");
        };

        recognition.start();
    });
};
