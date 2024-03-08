require("dotenv").config();

export const env = {
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  BUILD_MODE: process.env.BUILD_MODE,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SERPAPI_API_KEY: process.env.SERPAPI_API_KEY,

  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_PAGE_ID: process.env.NOTION_PAGE_ID,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
