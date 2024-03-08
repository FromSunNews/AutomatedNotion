import { IPAEntryTemplate } from "common/interfaces/IPAEntry.interface";
import { VocabTemplate } from "common/interfaces/Vocab.interface";
import { DictionaryIPA } from "data/IPA";

export const convertTextsToIPA = (phrasesArray: string[]): VocabTemplate[] => {
  let vocabArr: VocabTemplate[] = [];
  // traverse each phrase in phrasesArray
  phrasesArray.forEach((text) => {
    const wordsArray: string[] = text.split(" ");
    let ipaWord: string = "";
    // traverse each word in wordsArray
    wordsArray.forEach((word: string) => {
      const ipaEntry: IPAEntryTemplate | undefined = DictionaryIPA.find(
        (entry: IPAEntryTemplate) => entry.englishName === word
      );
      // look up for word level
      if (ipaEntry?.ipaText) ipaWord += ipaEntry?.ipaText + " ";
      // look up whether final char is "s"
      else if (word[word.length - 1] === "s") {
        const ipaNoneCharS: IPAEntryTemplate | undefined = DictionaryIPA.find(
          (entry: IPAEntryTemplate) =>
            entry.englishName === word.slice(0, word.length - 1)
        );
        // look up for word level
        if (ipaNoneCharS?.ipaText) ipaWord += ipaNoneCharS?.ipaText + " ";
      }
      // look up for char level
      else {
        let ipaCharacters: string = "";
        // traverse each chars in word
        word.split("").forEach((char: string, index: number) => {
          const ipaChar: IPAEntryTemplate | undefined = DictionaryIPA.find(
            (entry: IPAEntryTemplate) => entry.englishName === char
          );
          if (index === 0) ipaCharacters += ipaChar?.ipaText;
          else ipaCharacters += "-" + ipaChar?.ipaText;
        });
        ipaWord += ipaCharacters.trim();
      }
    });

    vocabArr.push({
      title: text,
      ipa_transcription: ipaWord.trim(),
    });
  });
  return vocabArr;
};
