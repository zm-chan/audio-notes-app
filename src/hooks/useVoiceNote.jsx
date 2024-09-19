import { useEffect, useRef, useState } from "react";
import { useToast } from "./use-toast";

function punctuationReplacement(language, transcript) {
  if (language === "en-GB") {
    const formattedTranscript = transcript
      .replaceAll("punctuation comma", ", ")
      .replaceAll("punctuation period", ". ")
      .replaceAll("punctuation semicolon", "; ")
      .replaceAll("punctuation dash", "- ")
      .replaceAll("punctuation underscore", "_")
      .replaceAll("punctuation quotation mark", '"')
      .replaceAll("punctuation colon", ": ")
      .replaceAll("punctuation apostrophe", "'")
      .replaceAll("punctuation exclamation point", "! ")
      .replaceAll("punctuation question mark", "? ")
      .replaceAll("punctuation opening paranthenses", "(")
      .replaceAll("punctuation closing paranthenses", ")")
      .replaceAll("punctuation opening bracket", "{")
      .replaceAll("punctuation closing bracket", "}");

    return formattedTranscript;
  } else if (language === "zh-CN") {
    const formattedTranscript = transcript
      .replaceAll("逗号", "，")
      .replaceAll("句号", "。")
      .replaceAll("分号", "；")
      .replaceAll("破折号", "- ")
      .replaceAll("引号", "‘")
      .replaceAll("冒号", "：")
      .replaceAll("感叹号", "！")
      .replaceAll("问号", "？")
      .replaceAll("开括号", "（")
      .replaceAll("关括号", "）")
      .replaceAll("顿号", "、");

    return formattedTranscript;
  }
}

function useVoiceNote(language) {
  const [isRecording, setIsRecording] = useState(false);
  const [doneRecording, setDoneRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [interimScript, setInterimScript] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const audioFileRef = useRef(null);

  const { toast } = useToast();

  // console.log(transcript, interimScript);

  useEffect(() => {
    // Setup MediaRecorder
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          chunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, {
            type: "audio/wav",
          });
          const url = URL.createObjectURL(blob);
          audioFileRef.current = blob;
          setAudioUrl(url);
          chunksRef.current = []; // Reset chunks
        };
      })
      .catch((error) =>
        toast({
          title: "Error accessing microphone:",
          description: error.message,
        }),
      );

    // Setup SpeechRecognition
    recognitionRef.current = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true;
    recognitionRef.current.lang = language;
    recognitionRef.current.onresult = (event) => {
      //   console.log(event.results);
      let interimScript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prevTranscript) => {
            return punctuationReplacement(
              language,
              `${prevTranscript} ${transcript}`,
            );
          });
          setInterimScript("");
        } else {
          interimScript += transcript;
          setInterimScript(punctuationReplacement(language, interimScript));
        }
      }
    };

    return () => {
      console.log("Cleanup");
      // Cleanup on component unmount
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
      }
    };
  }, [language, toast]);

  const startRecording = () => {
    if (!mediaRecorderRef.current || !recognitionRef.current) {
      toast({ title: "Error", description: "Audio initialization failed." });
      return;
    }

    if (mediaRecorderRef.current.state !== "paused") {
      mediaRecorderRef.current.start();
    } else {
      mediaRecorderRef.current.resume();
    }

    recognitionRef.current.start();

    setIsRecording(true);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.pause();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsRecording(false);
  };

  const stopRecording = () => {
    if (!transcript) {
      return toast({
        title: "Start Recording",
        description: "No recording process can be stopped!",
      });
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setDoneRecording(true);

    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());
    recognitionRef.current.onresult = null;
  };

  return {
    isRecording,
    doneRecording,
    audioUrl,
    audioFile: audioFileRef.current,
    transcript,
    interimScript,
    startRecording,
    pauseRecording,
    stopRecording,
  };
}

export default useVoiceNote;
