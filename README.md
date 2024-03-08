## Demo

[Project Demo](https://www.youtube.com/watch?v=your-demo-video-id)

## Related Image

Here's a screenshot of the project in action:
![Project Screenshot](project-screenshot.png)

# Introduce

**AutomatedNotion** is a Node.js application built using TypeScript and the Express framework. It demonstrates a simple workflow for using environment variables to access various APIs and services, including OpenAI, LangChainJS, SerpAPI, NotionAPI, Text-To-Speech, IPA Pronunciation, and Cloudinary. The application includes various modules and tools to provide functionality for text generation, web scraping, database management, and media processing.

## Technical Skills

The following technical skills are required to work with this project:

- Node.js
- TypeScript
- Express
- OpenAI
- SerpAPI
- LangChainJS
- NotionAPI
- Cloudinary
- Text-To-Speech
- Git

## Setup and Usage

To set up and use this project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repo.git
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

Replace `<your_openai_api_key>`, `<your_serpapi_api_key>`, `<your_notion_api_key>`, `<your_NOTION_PAGE_ID>`, `<your_cloudinary_cloud_name>`, `<your_cloudinary_api_key>`, `<your_cloudinary_api_secret>`, `<your_mysql_user>`, `<your_mysql_password>`, and `<your_mysql_database>` with your actual API keys and database credentials.

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

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [OpenAI API](https://www.openai.com/)
- [SerpApi](https://serpapi.com/)
- [Notion API](https://developers.notion.com/)
- [Cloud
