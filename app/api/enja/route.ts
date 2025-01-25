import { NextResponse } from "next/server";
import OpenAI from "openai";
import { corsHeaders } from "../corsHeaders";
import { MixReadInput } from "../MixReadInput";
import { MixReadOutput } from "../MixReadOutput";
import { parseOpenAI_apiKey } from "../parseOpenAI_apiKey";
const getPrompt = (text: string) => `
Objective: Convert texts into a highly mixed Japanese-English format while maintaining high readability.
Steps:
1. Identify the type of original text
2. For Japanese texts: Identify keywords or phrases related to the text type (e.g., legal, medical, technical) and provide English translations for these terms, integrating them into the original text to create a mixed-language format.
3. For English texts: Retain twenty percent of the original terminology related to the text type and translate the remaining content into Japanese, ensuring that only the very specific and professional jargon remains unaltered in English.
4. Ensure readability: The final text should be coherent and easy to read, effectively combining the two languages without compromising the text's clarity or the integrity of technical terms.
5. Output 2 different versions of text, one simpler and one more complex.
End goal: Produce a text that seamlessly blends Japanese and English, catering to bilingual readers without losing the essence and clarity of the original content. Output Mixed Japanese-English Text. Only results without any additional text.

Source Text: "答案是肯定的，以汉字为代表的意音方块字，作为一个复杂的文字符号系统，其信息熵很高。"
Mixed Japanese-English Text:
答えは肯定的です。この漢字は、representingされた音節文字システムとして、information entropyが非常に高いです。/ 答えは確かに「Yes」です。漢字は意味を表すスクエアキャラクター（意音方塊字）として、複雑なwriting systemの一部を形成しており、そのinformation entropyは非常に高いです。

Source Text: "${text}"
Mixed Japanese-English Text:
`;

export const POST = async (req: Request) => {
  const apiKey = await parseOpenAI_apiKey(req);

  const input: MixReadInput = await req.json();
  const { from, to, text } = input;
  const prompt = getPrompt(text);
  console.log({ prompt });

  const transcription = (
    await new OpenAI({ apiKey }).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `${prompt}` }],
    })
  ).choices[0].message.content;

  console.log({ input, transcription });
  const output: MixReadOutput = {
    code: 0,
    // msg: 'ok',
    data: transcription!,
    from,
    to,
  };
  return NextResponse.json(output, { headers: corsHeaders });
};
