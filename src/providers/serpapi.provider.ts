import {
  ImageResult,
  RelatedImage,
} from "common/interfaces/ImageResult.interface";
import { VocabTemplate } from "common/interfaces/Vocab.interface";
import { env } from "config/environment";
import { getJson } from "serpapi";

interface GetImageResult {
  result: ImageResult[];
  key_search: string;
}

const getImage = (keySearch: string): Promise<GetImageResult> => {
  return new Promise((resolve, reject) => {
    getJson(
      {
        // tìm từ khóa chứa dạng images HD 
        q: keySearch + " images HD",
        engine: "google_images",
        api_key: env.SERPAPI_API_KEY,
      },
      ({ images_results }) => {
        if (images_results) {
          // tách 20 phần tử đầu tiên
          // do images_results có 100 phần tử 
          // (do serpapi quy định và không có params nào để giảm số request nên phải tách)
          const imageResults_10 = images_results.slice(0, 5);
          const imageResults: GetImageResult = {
            key_search: keySearch,
            result: imageResults_10,
          };
          resolve(imageResults);
        } else {
          reject(new Error("No image results found"));
        }
      }
    );
  });
};

export const getMutilImage = async (phrasesArray: string[]) => {
  const promiseArr: Promise<GetImageResult>[] = [];
  let vocabImageArr: VocabTemplate[] = [];

  phrasesArray.forEach((chunk: string) => {
    promiseArr.push(getImage(chunk));
  });

  await Promise.all(promiseArr)
    .then((results: GetImageResult[]) => {
      results.forEach((re: GetImageResult) => {
        const imageArr: RelatedImage[] = [];
        re.result.map((i: ImageResult) => {
          let image: RelatedImage = {
            title: i.title,
            url_image: i.original,
            url_link: i.link,
          };
          imageArr.push(image);
        });
        let vocab: VocabTemplate = {
          title: re.key_search,
          related_image: imageArr,
        };
        vocabImageArr.push(vocab);
      });
    })
    .catch((err) => {
      console.log("🚀 ~ getMutilImage ~ err:", err);
    });

  return vocabImageArr;
};
