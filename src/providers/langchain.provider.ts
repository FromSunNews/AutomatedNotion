import { z } from "zod";
import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { VocabTemplate } from "common/interfaces/Vocab.interface";
import { VocabInfo } from "common/interfaces/VocabInfo.interface";
import { VocabGroup } from "common/interfaces/VocabGroup";
import { handleChunkString } from "utilities/function";

const getInfo = async (vocabs: string): Promise<VocabInfo[]> => {
  // We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.

  const parser = StructuredOutputParser.fromZodSchema(
    z.array(
      z.object({
        title: z
          .string()
          .describe(
            "This is name of the vocabulary. Write in lowercase letters => important!. Write in english."
          ),
        translate: z
          .string()
          .describe("This is translate of the vocabulary. Write in Vienamese"),
        concept: z
          .string()
          .describe(
            "Write the definition of given words in the IT field. The definition should provide in-depth clarification of the meaning of the given word and be 3-4 lines long. Write in Vietnamese"
          ),
        synonym: z
          .string()
          .describe(
            "this is synonym of the vocabulary as much detail as possible. Number each word you just found and add a line break. Write in english"
          ),
      })
    )
    // z.object({
    //   answer: z.string().describe("answer to the user's question"),
    //   sources: z
    //     .array(z.string())
    //     .describe("sources used to answer the question, should be websites."),
    // })
  );

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `You are an expert in the IT field. Give specific concepts(vietnamese), translate(vietnamese) and synonyms(english) for each vocabulary word provided:
      \n{question}
      \n{format_instructions}
      `
    ),
    new OpenAI({
      temperature: 0,
      maxTokens: 3500,
      modelName: "gpt-3.5-turbo-0125",
    }),
    parser,
  ]);

  console.log(parser.getFormatInstructions());
  return new Promise((resolve, reject) => {
    chain
      .invoke({
        question: vocabs,
        format_instructions: parser.getFormatInstructions(),
      })
      .then((response: VocabInfo[]) => {
        response.map((item) => {
          item.title = item.title.toLowerCase();
        });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getGroup = async (vocabs: string): Promise<VocabGroup[]> => {
  // We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.
  const parser = StructuredOutputParser.fromZodSchema(
    z.array(
      z.object({
        title: z
          .string()
          .describe(
            "This is name of the vocabulary. Write in lowercase letters => important. Write in english"
          ),
        group: z
          .array(z.string())
          .describe(
            "This is group that this vocabulary.You must carefully, deeply and accurately classify each word to find the corresponding vocabulary groups in as much detail as possible. Groups of words are related common elements."
          ),
      })
    )

    // z.object({
    //   query: z.array(z.object({
    //     title: z.string().describe("name of vocabulary."),
    //     group_id: z.array(z.string().describe("id of group in groups property."))
    //   })),
    //   groups: z.array(z.object({
    //     id: z.number().describe("id must have type of number"),
    //     name: z.string().describe("name of group")
    //   })).describe("You must carefully, deeply and accurately classify words to find the corresponding vocabulary groups. Groups of words are related common elements. For example 'words: Monitor, Printer, Speakers => group: Output Devices' is good answer")
    // })
  );

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `You are tasked with classifying the following computer terms into English vocabulary groups:
      \n{question}
      \nPlease carefully classify each term into appropriate English vocabulary groups. Provide accurate classifications for each term to ensure the correct categorization. Use the following format for your response:
      \n{format_instructions}
      \n{example}
      \nEnsure the classification reflects the most accurate and detailed categorization for each term. If a term belongs to multiple groups, list all applicable groups.`
    ),
    new OpenAI({
      temperature: 0,
      maxTokens: 3500,
      modelName: "gpt-3.5-turbo-0125",
    }),
    parser,
  ]);

  console.log(parser.getFormatInstructions());

  return new Promise((resolve, reject) => {
    chain
      .invoke({
        question: vocabs,
        format_instructions: parser.getFormatInstructions(),
        example: `For example:
      [
        {
          title: "Monitor",
          group: ["Output Devices", "Display"]
        },
        {
          title: "Printer",
          group: ["Output Devices"]
        },
        {
          title: "Speakers",
          group: ["Output Devices", "Sound"]
        },
        ...
      ]`,
      })
      .then((response: VocabGroup[]) => {
        response.map((item) => {
          item.title = item.title.toLowerCase();
        });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getInfoVocab = async (chunksVocab: string[]) => {
  const promiseArr: Promise<VocabInfo[]>[] = [];

  let mergedArray: VocabInfo[] = [];

  chunksVocab.forEach((chunkVocab: string) => {
    promiseArr.push(getInfo(chunkVocab));
  });
  await Promise.all(promiseArr)
    .then((result) => {
      mergedArray = result.reduce((acc, curr) => acc.concat(curr), []);
    })
    .catch((error) => {
      console.error("At least one task failed:", error);
    });
  return mergedArray
};

export const getGroupVocab = async (chunksVocab: string[]) => {

  let mergedArrayVocabGroup: VocabGroup[] = [];

  const promiseArrGetGroup: Promise<VocabGroup[]>[] = [];
  chunksVocab.forEach((chunkVocab: string) => {
    promiseArrGetGroup.push(getGroup(chunkVocab));
  });

  await Promise.all(promiseArrGetGroup)
    .then((result) => {
      mergedArrayVocabGroup = result.reduce(
        (acc, curr) => acc.concat(curr),
        []
      );
    })
    .catch((error) => {
      console.error("At least one task failed:", error);
    });

  return mergedArrayVocabGroup;
};

export const getDiagram = async (vocabs: string): Promise<string> => {
  console.log("🚀 ~ getDiagram ~ vocabs:", vocabs)

  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      mermaid_syntax: z.string().describe(
        "This is mermaid syntax created based on vocabulary groups. You must rely on that to find the relationship between GROUPS, creating each relationship accurately and in detail. Diagrams should not be too close together, but should be spacious enough for users to read easily"
      ),
    })
  );

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `You are responsible for analyzing the title and group of vocabulary in the given json string and establishing relationships between words and word groups according to mermaid syntax:
      \n{question}
      \n{format_instructions}
      \n{example}`
    ),
    new OpenAI({
      temperature: 0,
      maxTokens: 3500,
      modelName: "gpt-3.5-turbo-0125",
    }),
    parser,
  ]);

  console.log(parser.getFormatInstructions());

  try {
    const response = await chain.invoke({
      question: vocabs,
      format_instructions: parser.getFormatInstructions(),
      example: `For example:
          {
            mermaid_syntax: "graph TD;
              Mini_Computer(Mini Computer)-->|Connects to| Mainframe(Mainframe);
              Mainframe-->|Connects to| Personal_Computer(Personal Computer);
              Personal_Computer-->|Connects to| Handheld(Handheld);
              Personal_Computer-->|Stores data on| Magnetic_Storage_Devices(Magnetic Storage Devices);
              Handheld-->|Utilizes| Magnetic_Storage_Devices;"
          }`,
    });
    return response.mermaid_syntax;
  } catch (error) {
    console.error("Error:", error);
    return "";
  }

};

