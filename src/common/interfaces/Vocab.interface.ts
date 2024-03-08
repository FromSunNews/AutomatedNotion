import { RelatedImage } from "./ImageResult.interface";

export interface VocabTemplate {
  title?: string;
  status?: string;
  date?: string;
  ipa_transcription?: string;
  concept?: string;
  synonym?: string;
  group?: string[];
  related_image?: RelatedImage[];
  audio_url?: string;
  translate?: string;
}
