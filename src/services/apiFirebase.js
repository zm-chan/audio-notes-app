import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db, storage } from "@/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { isEmpty } from "@/lib/utils";
import { deleteObject, getBlob, ref, uploadBytes } from "firebase/storage";

const metaDataRef = doc(db, "notes-metadata", "metadata");

const audioMetadata = {
  contentType: "audio/wav",
};

export async function loginFirebase({ email, password }) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logoutFirebase() {
  await signOut(auth);
}

export async function getNotes() {
  const metaDataDocSnap = await getDoc(metaDataRef);

  if (!metaDataDocSnap.exists()) {
    throw new Error(
      "Please create a notes-metadata collection and a metadata document with notes property of an empty array in firebase, and reload the page!",
    );
  }

  const { notes: notesData } = metaDataDocSnap.data();

  const sortedNotesData = notesData.sort(
    (a, b) => b.lastEditTime - a.lastEditTime,
  );

  return sortedNotesData;
}

export async function createEmptyNote() {
  const metaDataDocSnap = await getDoc(metaDataRef);
  let { notes: notesData } = metaDataDocSnap.data();

  const { id } = await addDoc(collection(db, "notes"), { content: "" });

  if (isEmpty(notesData)) {
    notesData = [
      ...notesData,
      {
        id: id,
        title: "New",
        pinned: false,
        audioPath: [],
        lastEditTime: Date.now(),
      },
    ];
  } else {
    let temperoraryTitle = "New";
    let counter = 0;

    while (true) {
      const isDuplicateTitle = notesData.some(
        (eachNoteMetadata) => eachNoteMetadata.title === temperoraryTitle,
      );

      if (!isDuplicateTitle) {
        break;
      }

      counter++;
      temperoraryTitle = `New ${counter}`;
    }

    notesData = [
      ...notesData,
      {
        id: id,
        title: temperoraryTitle,
        pinned: false,
        audioPath: [],
        lastEditTime: Date.now(),
      },
    ];
  }

  await setDoc(metaDataRef, { notes: notesData });
}

export async function saveNotePinStatus({ noteId }) {
  const metaDataDocSnap = await getDoc(metaDataRef);
  let { notes: notesData } = metaDataDocSnap.data();

  notesData = notesData.map((noteData) => {
    if (noteData.id === noteId) {
      noteData.pinned = !noteData.pinned;
      return noteData;
    } else {
      return noteData;
    }
  });

  await setDoc(metaDataRef, { notes: notesData });
}

export async function deleteSelectedNote(noteId) {
  const metaDataDocSnap = await getDoc(metaDataRef);
  const { notes: notesData } = metaDataDocSnap.data();

  const { id, audioPath: noteAudioPathList } = notesData.find(
    (noteData) => noteData.id === noteId,
  );

  await deleteDoc(doc(db, "notes", id));

  if (noteAudioPathList.length !== 0) {
    const deleteAudioPromises = noteAudioPathList.map((eachDeletedAudio) => {
      return deleteObject(ref(storage, `audio/${eachDeletedAudio}.wav`));
    });

    await Promise.all(deleteAudioPromises);
  }

  const newNotesData = notesData.filter((noteData) => noteData.id !== noteId);

  await setDoc(metaDataRef, { notes: newNotesData });
}

function removeRange(str, start, end) {
  const removed = str.slice(start, end);
  const newStr = str.slice(end + 1);
  return { removed, newStr };
}

export async function getContent(noteId) {
  const metaDataDocSnap = await getDoc(metaDataRef);
  let { notes: notesData } = metaDataDocSnap.data();

  const noteData = notesData.find((noteMetaData) => {
    return noteMetaData.id === noteId;
  });

  const noteContentDocSnap = await getDoc(doc(db, "notes", noteData.id));

  let { content: noteFileContent } = noteContentDocSnap.data();

  const textContentSections = noteFileContent.split(/(?=### Note ID:)/);

  // Remove the first empty section if it exists
  if (textContentSections[0].trim() === "") {
    textContentSections.shift();
  }

  const textContentObj = textContentSections.map((section) => {
    const { removed: removedId, newStr: newStrAfterId } = removeRange(
      section,
      0,
      section.indexOf("\n", 0),
    );

    const id = removedId.split("### Note ID: ")[1];

    const { removed: removedCreatedAt, newStr: newStrAfterCreatedAt } =
      removeRange(
        newStrAfterId,
        newStrAfterId.indexOf("Created At: "),
        newStrAfterId.indexOf("\n", newStrAfterId.indexOf("Created At: ")),
      );

    const createdAt = removedCreatedAt.split("Created At: ")[1];

    const { removed: removedEncrypted, newStr: newStrAfterEncrypted } =
      removeRange(
        newStrAfterCreatedAt,
        newStrAfterCreatedAt.indexOf("Encrypted: "),
        newStrAfterCreatedAt.indexOf(
          "\n",
          newStrAfterCreatedAt.indexOf("Encrypted: "),
        ),
      );

    const encrypted = removedEncrypted.split("Encrypted: ")[1];

    const { removed: removedAudioId, newStr: newStrAfterAudioId } = removeRange(
      newStrAfterEncrypted,
      newStrAfterEncrypted.indexOf("Audio ID: "),
      newStrAfterEncrypted.indexOf(
        "\n",
        newStrAfterEncrypted.indexOf("Audio ID: "),
      ),
    );

    const audioId = removedAudioId.split("Audio ID: ")[1];

    // Create the object
    const noteObject = {
      id,
      createdAt,
      encrypted: Boolean(false),
      audioId,
      textValue: newStrAfterAudioId.slice(0, -2),
    };

    return noteObject;
  });

  const reconstructedContent = textContentObj.map((eachTextContent) => {
    return { ...eachTextContent, type: "text", selected: false };
  });

  if (noteData.audioPath.length === 0) {
    return {
      ...noteData,
      content: reconstructedContent,
    };
  }

  const audioPromises = noteData.audioPath.map((eachAudio) => {
    return getBlob(ref(storage, `audio/${eachAudio}.wav`));
  });

  const audioFiles = await Promise.all(audioPromises);

  const results = audioFiles.map((audioFile) => {
    const audioUrl = URL.createObjectURL(audioFile);
    return [audioUrl, audioFile];
  });

  const voiceContent = noteData.audioPath.map((audioId, i) => {
    return {
      id: audioId,
      createdAt: audioId,
      type: "audio",
      selected: false,
      recorded: true,
      audioUrl: results[i][0],
      audioFile: results[i][1],
    };
  });

  return {
    ...noteData,
    content: [...reconstructedContent, ...voiceContent],
  };
}

export async function saveContent(content, noteId) {
  const audioData = [];
  const textData = [];

  content.forEach((eachContent) => {
    if (eachContent.type === "audio") {
      audioData.push(eachContent);
    } else if (eachContent.type === "text") {
      textData.push(eachContent);
    }
  });

  const textContent = textData.reduce((previous, current) => {
    const currentString = `### Note ID: ${current.id}\nCreated At: ${current.createdAt}\nEncrypted: ${current.encrypted.toString()}\nAudio ID: ${current.audioId ? current.audioId : ""}\n${current.textValue}\n\n`;
    return previous + currentString;
  }, "");

  await setDoc(doc(db, "notes", noteId), {
    content: textContent,
  });

  if (audioData.length !== 0) {
    const audioUploadPromises = audioData.map((eachAudio) => {
      return uploadBytes(
        ref(storage, `audio/${eachAudio.id}.wav`),
        eachAudio.audioFile,
        audioMetadata,
      );
    });

    await Promise.all(audioUploadPromises);
  }

  const metaDataDocSnap = await getDoc(metaDataRef);
  let { notes: notesData } = metaDataDocSnap.data();

  const { audioPath: noteAudioPathList } = notesData.find((noteData) => {
    return noteData.id === noteId;
  });

  const copyOfAudioPathList = [...noteAudioPathList];

  const tempAudioPath = [];
  notesData = notesData.map((noteData) => {
    if (noteData.id === noteId) {
      textData.forEach((eachTextContent) => {
        if (eachTextContent.audioId) {
          tempAudioPath.push(eachTextContent.audioId);
        }
      });
      noteData.audioPath = tempAudioPath;
      return noteData;
    } else {
      return noteData;
    }
  });

  const deletedAudioList = copyOfAudioPathList.filter((eachOldAudio) => {
    return !tempAudioPath.includes(eachOldAudio);
  });

  if (deletedAudioList.length !== 0) {
    const deleteAudioPromises = deletedAudioList.map((eachDeletedAudio) => {
      return deleteObject(ref(storage, `audio/${eachDeletedAudio}.wav`));
    });

    await Promise.all(deleteAudioPromises);
  }

  notesData = notesData.map((noteData) => {
    if (noteData.id === noteId) {
      noteData.lastEditTime = Date.now();
      return noteData;
    } else {
      return noteData;
    }
  });

  await setDoc(metaDataRef, { notes: notesData });
}

export async function saveTitle(title, noteId) {
  const metaDataDocSnap = await getDoc(metaDataRef);
  let { notes: notesData } = metaDataDocSnap.data();

  notesData = notesData.map((noteData) => {
    if (noteData.id === noteId) {
      noteData.title = title;
      return noteData;
    } else {
      return noteData;
    }
  });

  await setDoc(metaDataRef, { notes: notesData });
}
