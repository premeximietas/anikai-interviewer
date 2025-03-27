import { AvatarVideo } from "@/components/AvatarVideo";
import { Presenter, Voice } from "@/types";
import { useEffect, useState } from "react";

export function InteractiveAvatar() {
  const [isLoading, setIsLoading] = useState({
    chat: false,
    repeat: false,
    presenters: true,
    voices: true,
  });
  const [repeatText, setRepeatText] = useState("");
  const [chatText, setChatText] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [voiceId, setVoiceId] = useState("iP95p4xoKVk53GoZ742B"); // Default: Elevenlabs > Chris
  const [voices, setVoices] = useState<Voice[]>([]);
  const [presenters, setPresenters] = useState<Presenter[]>([]);


  useEffect(() => {
    fetchVoices();
    fetchPresenters();
  }, []);

  useEffect(() => {
    setVideoUrl(null);
  }, [avatarId]);

  async function fetchVoices() {
    try {
      const response = await fetch("/api/voices");

      if (!response.ok) {
        throw new Error("Failed to fetch voices");
      }

      const data = await response.json();
      setVoices(data.voices);
    } catch (error) {
      console.error("Error fetching voices:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, voices: false }));
    }
  }

  async function fetchPresenters() {
    try {
      const response = await fetch("/api/presenters");

      if (!response.ok) {
        throw new Error("Failed to fetch presenters");
      }

      const data: Presenter[] = await response.json();
      setPresenters(data);

      const initialPresenter = data.find((p) => p.name === "matt") || data[0];
      setAvatarId(initialPresenter.presenter_id);
    } catch (err) {
      console.error("Error fetching presenters:", err);
    } finally {
      setIsLoading((prev) => ({ ...prev, presenters: false }));
    }
  }

  const selectedPresenter = presenters.find((p) => p.presenter_id === avatarId);
  const isAnyLoading = Object.values(isLoading).some(Boolean);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card>
        <CardBody className="h-[400px] flex flex-col justify-center items-center bg-gray-100 dark:bg-[#1B191D]">
          <div className="h-[400px] w-[700px] justify-center items-center flex rounded-lg overflow-hidden relative">
            {isLoading.presenters ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : videoUrl ? (
              <AvatarVideo videoUrl={videoUrl} />
            ) : selectedPresenter ? (
              <img
                src={selectedPresenter.image_url}
                alt={selectedPresenter.name}
                className="w-full h-full rounded-lg object-contain"
              />
            ) : null}
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-2 w-full">
            <Select
              label="Select Avatar"
              placeholder="Choose an avatar"
              selectedKeys={avatarId ? [avatarId] : []}
              onChange={(e) => setAvatarId(e.target.value)}
              className="flex-1"
              isDisabled={isLoading.presenters}
            >
              {presenters.map((presenter) => (
                <SelectItem
                  key={presenter.presenter_id}
                  value={presenter.presenter_id}
                >
                  {presenter.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Select Voice"
              placeholder="Choose a voice"
              selectedKeys={voiceId ? [voiceId] : []}
              onChange={(e) => setVoiceId(e.target.value)}
              className="flex-1"
              isDisabled={isLoading.voices}
            >
              {voices.map((voice) => (
                <SelectItem key={voice.voice_id} value={voice.voice_id}>
                  {voice.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <TextInput
            label="Repeat"
            placeholder="Type something for the avatar to repeat"
            input={repeatText}
            onSubmit={() => handleSpeakWithAvatar(repeatText)}
            setInput={setRepeatText}
            loading={isLoading.repeat}
            disabled={isAnyLoading}
          />
          
        </CardFooter>
      </Card>
    </div>
  );
}
