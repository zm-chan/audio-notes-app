import SelectButton from "./SelectButton";

function VoiceNote({ handleUpdateSelectContent, eachContent }) {
  function handleSelectAudio() {
    handleUpdateSelectContent(eachContent.id);
  }

  // console.log(eachContent);

  return (
    <div className="flex items-center gap-3">
      <SelectButton
        selected={eachContent.selected}
        onClick={handleSelectAudio}
      />

      {eachContent.audioUrl && (
        <div>
          <audio controls src={eachContent.audioUrl} />
        </div>
      )}
    </div>
  );
}

export default VoiceNote;
