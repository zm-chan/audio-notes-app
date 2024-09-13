import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const dateFormatter = (time) => {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(time);
};

export function isEqual(value, other) {
  if (typeof value !== "object" && typeof other !== "object") {
    return Object.is(value, other);
  }

  if (value === null && other === null) {
    return true;
  }

  if (typeof value !== typeof other) {
    return false;
  }

  if (value === other) {
    return true;
  }

  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) {
      return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (!isEqual(value[i], other[i])) {
        return false;
      }
    }

    return true;
  }

  if (Array.isArray(value) || Array.isArray(other)) {
    return false;
  }

  if (Object.keys(value).length !== Object.keys(other).length) {
    return false;
  }

  for (const [k, v] of Object.entries(value)) {
    if (!(k in other)) {
      return false;
    }

    if (!isEqual(v, other[k])) {
      return false;
    }
  }

  return true;
}

export function checkAudioSupport() {
  // Check for support
  const hasSpeechRecognitionSupport =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasGetUserMediaSupport =
    navigator.mediaDevices.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  const hasAudioSupport = hasSpeechRecognitionSupport && hasGetUserMediaSupport;

  return hasAudioSupport;
}

export function encryptContent(secretKey, content) {
  return CryptoJS.AES.encrypt(content, secretKey).toString();
}

export function decryptContent(secretKey, content) {
  const bytes = CryptoJS.AES.decrypt(content, secretKey);

  return bytes.toString(CryptoJS.enc.Utf8);
}

export function debounce(fn, delay = 1000) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function isEmpty(value) {
  return (
    value == null || // From standard.js: Always use === - but obj == null is allowed to check null || undefined
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}
