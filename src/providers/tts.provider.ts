import * as googleTTS from "google-tts-api";
import axios from "axios";
import base64 from "base64-js";
import { VocabTemplate } from "common/interfaces/Vocab.interface";
import { streamUploadMutiple } from "./cloudinary.provider";

export interface AudioBufferResponse {
  title: string;
  buffer: Buffer;
}

export const getAudioBuffer = async (
  pharase: string
): Promise<AudioBufferResponse> => {
  return new Promise((resolve, reject) => {
    googleTTS
      .getAudioBase64(pharase, {
        lang: "en",
        slow: false,
        host: "https://translate.google.com",
        timeout: 10000,
      })
      .then((respone) => {
        // chuyển respone trae về thành dạng base64
        const audioBuffer = Buffer.from(respone, "base64");
        resolve({
          buffer: audioBuffer,
          title: pharase,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getAudioURL = async (
  phrasesArray: string[]
): Promise<VocabTemplate[]> => {
  const promises: Promise<AudioBufferResponse>[] = [];
  let audioBufferResponse: AudioBufferResponse[] = [];

  phrasesArray.forEach((phrase: string) => {
    promises.push(getAudioBuffer(phrase));
  });

  await Promise.all(promises)
    .then((results: AudioBufferResponse[]) => {
      audioBufferResponse = results;
    })
    .catch((err) => {
      console.log("🚀 ~ getMutilImage ~ err:", err);
    });

  // upload lên cloudinary
  const audioVocabUrl = await streamUploadMutiple(audioBufferResponse, {
    folder: "AutomatedVocab",
    //để auto cloudinary tự động nhận file
    resource_type: "auto",
  });

  return audioVocabUrl;
};
