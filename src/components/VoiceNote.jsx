import SelectButton from "./SelectButton";

function VoiceNote({ handleUpdateSelectContent, eachContent }) {
  function handleSelectAudio() {
    handleUpdateSelectContent(eachContent.id);
  }

  // console.log(eachContent);

  return (
    <div className="flex flex-col gap-3 xs:flex-row xs:items-center">
      <SelectButton
        selected={eachContent.selected}
        onClick={handleSelectAudio}
      />

      {eachContent.audioUrl && (
        <audio
          controls
          src={eachContent.audioUrl}
          className="w-full max-w-xs"
        />
      )}
    </div>
  );
}

export default VoiceNote;
