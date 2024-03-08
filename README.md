# Your Easy English Learning Tool
AutomatedNotion helps you learn English effortlessly. With NotionAPI, it quickly adds new words with translations, definitions, IPA pronunciation, audio, and images to your Notion workspace. Powered by OpenAI's ChatGPT, AutomatedNotion makes learning fun and personalized. Say goodbye to tedious tasks and hello to an exciting English learning adventure with AutomatedNotion.
## Demo
Project Demo

## Link Preview
[Link Notion Temple created by AutomatedBot](https://fluoridated-card-dab.notion.site/d353fc08863a4909b667180c49bf1d01?v=4a7baaa29c4342d5b680eed667f84635)

## Related Image

![image](https://github.com/FromSunNews/AutomatedNotion/assets/111409554/3b84e860-42dc-4023-bfb5-c7473fd023c2)
![image](https://github.com/FromSunNews/AutomatedNotion/assets/111409554/1f874ecd-219b-469b-baa6-68337cb1502e)
![image](https://github.com/FromSunNews/AutomatedNotion/assets/111409554/19d4c75d-a170-463f-992a-d72ec2bb6e90)
![image](https://github.com/FromSunNews/AutomatedNotion/assets/111409554/8874bfc2-0712-4c73-8fd5-336623e6d8c1)
![image](https://github.com/FromSunNews/AutomatedNotion/assets/111409554/ca981133-7de3-4455-9045-3b1402464bc5)

# Introduce

**AutomatedNotion** is a Node.js application built using TypeScript and the Express framework. It demonstrates a simple workflow for using environment variables to access various APIs and services, including OpenAI, LangChainJS, SerpAPI, NotionAPI, Text-To-Speech, IPA Pronunciation, and Cloudinary. The application includes various modules and tools to provide functionality for text generation, web scraping, database management, and media processing.

## Setup and Usage

To set up and use this project, follow these steps:

1. Clone the repository:

```bash
git clone [https://github.com/your-username/your-repo.git](https://github.com/FromSunNews/AutomatedNotion.git)
```

2. Install dependencies:

```bash
cd your-repo
npm install
```

3. Create a .env file:
   Create a file named `.env` in the root directory of the project and add the following environment variables:

```makefile
APP_HOST=localhost
APP_PORT=7500
BUILD_MODE=dev
OPENAI_API_KEY=<your_openai_api_key>
SERPAPI_API_KEY=<your_serpapi_api_key>
NOTION_API_KEY=<your_notion_api_key>
NOTION_PAGE_ID=<your_NOTION_PAGE_ID>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

Replace `<your_openai_api_key>`, `<your_serpapi_api_key>`, `<your_notion_api_key>`, `<your_NOTION_PAGE_ID>`, `<your_cloudinary_cloud_name>`, `<your_cloudinary_api_key>`, `<your_cloudinary_api_secret>` with your actual API keys and database credentials.

4. Build the project:

```bash
npm build
```

5. Start the server:

```bash
npm start
```

This command starts the server using the `node` command and the `dotenv` module to load environment variables from the `.env` file.

6. Access the endpoints:

- http://localhost:7500/v1/vocab/automated
- DataSample:

```json
{
  "vocabs": "Rom,Hertz,Bytes,Computerize,Storage,Application,Memory,Tape,Network,NICs,Sound Card,Graphics Card,Controller,System Unit,Driver card",
  "title": "UNIT 1: The Internet"
}
```

## References
- [TypeScript](https://www.typescriptlang.org/)
- [SerpApi](https://serpapi.com/)
- [Notion API](https://developers.notion.com/)
- [LangchainJS](https://js.langchain.com/docs/get_started/introduction)
- [Mermaid Diagram Syntax](https://mermaid.js.org/intro/) 
