import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import SelectLanguage, { languages } from "./SelectLanguage";
import useVoiceNote from "@/hooks/useVoiceNote";
import SelectButton from "./SelectButton";

function VoiceSetup({
  eachContent,
  handleAddNewAudioTextContent,
  handleUpdateSelectContent,
}) {
  const [selectedLanguage, setLanguage] = useState(languages[0].code);

  const {
    isRecording,
    doneRecording,
    audioUrl,
    audioFile,
    transcript,
    interimScript,
    startRecording,
    pauseRecording,
    stopRecording,
  } = useVoiceNote(selectedLanguage);

  useEffect(() => {
    if (audioUrl && audioFile && doneRecording) {
      handleAddNewAudioTextContent(
        eachContent.id,
        audioUrl,
        audioFile,
        transcript,
      );
    }
  }, [
    audioUrl,
    audioFile,
    handleAddNewAudioTextContent,
    eachContent.id,
    transcript,
    doneRecording,
  ]);

  function handleSelectAudio() {
    handleUpdateSelectContent(eachContent.id);
  }

  const finalInterimScript = (transcript + " " + interimScript).trim();

  return (
    <div className="flex flex-col gap-3">
      {!doneRecording && (
        <div className="flex flex-col flex-wrap gap-3 md:flex-row">
          <SelectButton
            selected={eachContent.selected}
            onClick={handleSelectAudio}
          />
          <SelectLanguage
            handleSelectLanguage={setLanguage}
            className="w-auto max-w-xs"
          />
          <Button
            onClick={isRecording ? pauseRecording : startRecording}
            className="max-w-xs bg-zinc-200 text-black hover:bg-zinc-200/90 md:self-start"
          >
            {isRecording ? "Pause Recording ⏸️" : "Start Recording 🎙️"}
          </Button>
          <Button
            onClick={stopRecording}
            className="max-w-xs bg-zinc-200 text-black hover:bg-zinc-200/90 md:self-start"
          >
            Stop Recording 🛑
          </Button>
        </div>
      )}

      {!doneRecording && finalInterimScript && (
        <p className="rounded bg-zinc-600 px-4 py-2 text-white">
          {finalInterimScript}
        </p>
      )}
    </div>
  );
}

export default VoiceSetup;
