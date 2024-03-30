/* eslint-disable no-unreachable */
import { VocabTemplate } from "common/interfaces/Vocab.interface";
import { HttpStatusCode } from "../utilities/constants";
import { convertTextsToIPA } from "providers/ipa.provider";
import { getDiagram, getGroupVocab, getInfoVocab } from "providers/langchain.provider";
import { getMutilImage } from "providers/serpapi.provider";
import { getAudioURL } from "providers/tts.provider";
import { appendBlock, createDatabaseInPage, createNotionPage } from "providers/notion.provider";
import { handleChunkString, handleVocabInput, isImageValid } from "utilities/function";
import { env } from "config/environment";
import { RelatedImage } from "common/interfaces/ImageResult.interface";
import { dataJson } from "data/data";
const handleAutomatedVocab = async (data: { vocabs: string, title: string }) => {
  try {
    // cho về LowerCase
    const vocabsText = handleVocabInput(data.vocabs);
    let phrasesArr = vocabsText.split(",");
    // tách mỗi 10 từ vào 1 string
    const chunksVocab = handleChunkString(vocabsText, 10);

    // Đầu tiên gọi langchain để xử lý group
    const vocabGroupArr: VocabTemplate[] = await getGroupVocab(chunksVocab);
    console.log("🚀 ~ handleAutomatedVocab ~ vocabGroupArr:", vocabGroupArr)

    let groupArr: string[] = [];
    vocabGroupArr.map(arr => {
      arr?.group?.map(g => {
        // xử lý có thể trong mảng group sẽ có chữ trùng lặp
        const isExist = groupArr.find(i => i === g)
        if (!isExist) {
          groupArr.push(g)
        }
      })
    })

    // gọi hàm để lấy mermaid syntax diagram 
    const mermaidSyntax: string = await getDiagram(groupArr.join(","));
    console.log("🚀 ~ handleAutomatedVocab ~ mermaidSyntax:", mermaidSyntax)

    // Tạo thêm 1 block diagram và 1 page
    await appendBlock(env.NOTION_PAGE_ID as string, mermaidSyntax)

    let coverDatabse: string = ""
    const vocabImagearr = await getMutilImage([`${data.title}`]);
    vocabImagearr[0].related_image?.map((img: RelatedImage) => {
      if (img?.url_image && isImageValid(img?.url_image)) {
        coverDatabse = img.url_image;
        return;
      }
    })
    const dataBaseId = await createDatabaseInPage(env.NOTION_PAGE_ID as string, data.title, coverDatabse)
    let result;

    // Gộp các đối tượng có cùng "title" thành một đối tượng duy nhất
    const mergedObjects: VocabTemplate[] = [];
    if (dataBaseId) {
      // đầu tiên sẽ sử lý phát âm IPAs
      const vocabsArr: VocabTemplate[] = convertTextsToIPA(phrasesArr);
      console.log("🚀 ~ handleAutomatedVocab ~ vocabsArr:", vocabsArr);
      // Sau đó call langchain để xử lý concept, synonym
      const vocabInfoArr: VocabTemplate[] = await getInfoVocab(chunksVocab);
      console.log(
        "🚀 ~ handleAutomatedVocab ~ vocabInfoArr:",
        vocabInfoArr
      );
      // Gọi api serpapi để lấy các hình ảnh liên quan
      const vocabRelatedImageArr: VocabTemplate[] = await getMutilImage(
        phrasesArr
      );
      console.log(
        "🚀 ~ handleAutomatedVocab ~ vocabRelatedImageArr:",
        vocabRelatedImageArr
      );
      // Gọi cloudinary để lấy các url_audio
      const vocabAudioUrl: VocabTemplate[] = await getAudioURL(phrasesArr);
      console.log("🚀 ~ handleAutomatedVocab ~ vocabAudioUrl:", vocabAudioUrl);

      // =========gộp mảng hai chiều===========================
      const arrayOfVocabTemplates: VocabTemplate[][] = [
        vocabsArr,
        vocabInfoArr,
        vocabGroupArr,
        vocabRelatedImageArr,
        vocabAudioUrl,
      ];

      arrayOfVocabTemplates.forEach((arrayOfObjects) => {
        arrayOfObjects.forEach((object) => {
          let existIndex = mergedObjects.findIndex(
            (obj) => obj.title === object.title
          );

          if (existIndex !== -1) {
            // Đối tượng đã tồn tại, cập nhật nó trong mảng mergedObjects
            mergedObjects[existIndex] = {
              ...mergedObjects[existIndex],
              ...object,
            };
          } else {
            // Đối tượng chưa tồn tại, thêm mới vào mảng mergedObjects
            const newObj = { ...object };
            mergedObjects.push(newObj);
          }
        });
      });

      console.log("🚀 ~ handleAutomatedVocab ~ mergedObjects:", mergedObjects);
      result = await createNotionPage(mergedObjects, dataBaseId);
    }

    return {
      isSuccess: true,
      data: result,
      status: HttpStatusCode.OK,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(JSON.stringify(error));
    }
  }
};

export const VocabService = {
  handleAutomatedVocab,
};
