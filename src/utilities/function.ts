import * as path from 'path';

export const handleVocabInput = (vocabs: string): string => {
  const vocabsText = vocabs.toLowerCase();
  let phrasesArr = vocabsText.split(",");
  // xử lý trường hợp người dùng có thể để space (vd: "chat, bot" => "chat,bot") 
  phrasesArr = phrasesArr.map(phrase => {
    // Kiểm tra và thay thế ký tự đặt biệt thành ' '
    phrase = phrase.replace(/[`~!@#$./|%^*-]/g, ' ');

    // Kiểm tra và xóa phần trong ngoặc ()
    phrase = phrase.replace(/\(.*?\)/g, '');
    return phrase.trim()
  });

  return phrasesArr.join();
};

export const handleChunkString = (str: string, chunkSize: number) => {
  //  tách chuỗi ra thành từng cụm từ
  const words: string[] = str.split(",");
  const chunks: string[] = [];
  let index: number = 0;
  while (index < words.length) {
    const arrWordsOfChunkSize: string[] = words.slice(index, index + chunkSize);
    const chunk: string = arrWordsOfChunkSize.join(",");
    chunks.push(chunk);
    // mỗi lần số bước nhảy sẽ là chunkSize
    index += chunkSize;
  }
  return chunks;
};

export const handlePhraseToUpperCase = (phrase: string): string => {
  const re = phrase.split(" ");
  const capitalizedWords = re.map(
    (s) => s.charAt(0).toUpperCase() + s.slice(1)
  );
  return capitalizedWords.join(" ");
};


// Hàm để kiểm tra định dạng hình ảnh từ phần mở rộng (extension)
export function isImageValid(url: string): boolean {
  const ext = path.extname(url);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  return imageExtensions.includes(ext.toLowerCase());
}

export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};