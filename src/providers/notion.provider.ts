import { RelatedImage } from "common/interfaces/ImageResult.interface";
import { VocabTemplate } from "common/interfaces/Vocab.interface";
import { env } from "config/environment";
import { handlePhraseToUpperCase, isImageValid, sleep } from "utilities/function";
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: env.NOTION_API_KEY });

export async function createNotionPage(vocabArr: VocabTemplate[], dataBaseId: string) {
  try {
    // duyệt từ cuối mảng lên
    vocabArr = vocabArr.reverse();
    for (const vocab of vocabArr) {
      // do quá trình xử lý trước đó title và tranlate là lowercase nên chuyển và uppercase
      if (vocab.title) vocab.title = handlePhraseToUpperCase(vocab.title);
      if (vocab.translate) vocab.translate = handlePhraseToUpperCase(vocab.translate);

      let relatedImagesArr: Object[] = [];

      vocab.related_image?.map((img: RelatedImage, index: number) => {
        if (index !== 0 && img?.url_image && isImageValid(img?.url_image)) {
          relatedImagesArr.push(
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: " ",
                    },
                  },
                ],
              },
            },
            {
              object: "block",
              type: "image",
              image: {
                type: "external",
                external: {
                  url: img.url_image,
                },
              },
            }
          );
        }
      });

      const data = {
        parent: {
          type: "database_id",
          database_id: dataBaseId,
        },
        icon: {
          type: "emoji",
          emoji: "📝",
        },
        cover: {
          type: "external",
          external: {
            url: vocab?.related_image && vocab?.related_image[0].url_image,
          },
        },
        properties: {
          Status: {
            select: {
              name: "Done",
            },
          },
          Date: {
            date: {
              start: new Date().toISOString(),
            },
          },
          Name: {
            title: [
              {
                text: {
                  content: vocab?.title || " ",
                },
              },
            ],
          },
          "IPA transcription": {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `/${vocab?.ipa_transcription || "..."}/`,
                },
                annotations: {
                  color: "blue_background",
                },
              },
            ],
          },
          Translate: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: vocab?.translate || [],
                },
                annotations: {
                  color: "yellow_background",
                },
              },
            ],
          },
          Concept: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: vocab?.concept || [],
                },
              },
            ],
          },
          Synonym: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: vocab?.synonym || " ",
                },
              },
            ],
          },
          Group: {
            multi_select: vocab.group?.map((g) => ({ name: g })) || [],
          },
          "Created by": {
            people: [
              {
                object: "user",
                id: "9749e759-a2d7-4638-9ff6-ea3545fb2bca",
              },
            ],
          },
          Sound: {
            files: [
              {
                name: "Sound IPA",
                external: {
                  url: vocab?.audio_url || [],
                },
              },
            ],
          },
          // "Person": {
          //   "people": [{
          //     "object": "user",
          //     "id": "9749e759-a2d7-463-9ff6-ea3545fb2bca"
          //   }]
          // }
        },
        children: [
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: "🔊 AUDIO FILE 🔊",
                  },
                  annotations: {
                    bold: true,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: "default",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: " ",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "embed",
            embed: {
              url: vocab?.audio_url || " ",
            },
          },
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: "🖼️ REALATED IMAGES 🖼️",
                  },
                  annotations: {
                    bold: true,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: "default",
                  },
                },
              ],
            },
          },
          // chỗ này sẽ thêm các hình ảnh liên quan phía dưới page
          ...relatedImagesArr,
        ],
      };
      // đợi tầm 300 mili giấy
      await sleep(300);
      console.log(`Sending data to Notion`);
      const response = await notion.pages.create(data);
      console.log(response);
    }

    return "Task Done!";
  } catch (error) {
    console.log("🚀 ~ createNotionPage ~ error:", error);
  }
}

export const appendBlock = async (parentId: string, mermaidSyntax: string) => {
  const response = await notion.blocks.children.append({
    block_id: parentId,
    children: [
      {
        type: "divider",
        divider: {},
      },
      {
        type: "toggle",
        toggle: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Diagram",
              },
              annotations: {
                bold: true,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "purple_background",
              },
            },
          ],
          color: "default",
          children: [
            {
              type: "code",
              code: {
                caption: [],
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: mermaidSyntax,
                    },
                  },
                ],
                language: "mermaid",
              },
            },
          ],
        },
      },
    ],
  });
  console.log(response);
};

export const createDatabaseInPage = async (parentId: string, title: string, coverDatabse: string) => {
  try {
    const response = await notion.databases.create({
      parent: {
        type: "page_id",
        page_id: parentId,
      },
      icon: {
        type: "emoji",
        emoji: "📖",
      },
      cover: {
        type: "external",
        external: {
          url: coverDatabse,
        },
      },
      title: [
        {
          type: "text",
          text: {
            content: title,
            link: null,
          },
        },
      ],
      properties: {
        "Name": {
          title: {},
        },
        "Status": {
          select: {
            options: [
              {
                name: "Done",
                color: "green",
              },
              {
                name: "Operational",
                color: "orange",
              },
              {
                name: "None Do",
                color: "red",
              }
            ],
          },
        },
        "Date": {
          date: {},
        },
        "Sound": {
          files: {},
        },
        "IPA transcription": {
          rich_text: {},
        },
        "Translate": {
          rich_text: {},
        },
        "Concept": {
          rich_text: {},
        },
        "Synonym": {
          rich_text: {},
        },
        "Group": {
          type: "multi_select",
          multi_select: {
            options: [],
          },
        },
        "Created by": {
          created_by: {},
        },
      },
    });
    if (response.id)
      return response.id
    else
      return;
  } catch (error) {
    return;
  }
}

export const listAllUsers = async () => {
  const response = await notion.users.list();
  console.log(response);
};
