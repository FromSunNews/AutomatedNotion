import cloudinary, { UploadApiOptions, UrlOptions } from "cloudinary";
import streamifier from "streamifier";
import { env } from "config/environment";
import { AudioBufferResponse } from "./tts.provider";
import { VocabTemplate } from "common/interfaces/Vocab.interface";
/**
 * Tài liệu tham khảo:
 * https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
 * https://andela.com/insights/how-to-use-cloudinary-and-nodejs-to-upload-multiple-images/
 */

// https://www.npmjs.com/package/cloudinary

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function streamUploadMutiple(
  fileBuffers: AudioBufferResponse[],
  options: UploadApiOptions
) {
  options = Object.assign(
    {
      folder: "",
    },
    options
  );

  const uploadPromises = fileBuffers.map((fileBuffer: AudioBufferResponse) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinaryV2.uploader.upload_stream(
        options,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            const vocab: VocabTemplate = {
              title: fileBuffer.title,
              audio_url: result?.url,
            };
            resolve(vocab);
          }
        }
      );

      streamifier.createReadStream(fileBuffer.buffer).pipe(stream);
    });
  });
  // Đây là tiến trinh song song => giảm được thời gian chờ
  const results = await Promise.all(uploadPromises);
  if (results) return results as VocabTemplate[];
  else return [];
}
