import { NextResponse } from "next/server";
import OpenAI from "openai";
import { corsHeaders } from "../corsHeaders";
import { MixReadInput } from "../MixReadInput";
import { MixReadOutput } from "../MixReadOutput";
import { parseOpenAI_apiKey } from "../parseOpenAI_apiKey";
const getPrompt = (text: string) => `

>>> Role

Act as an mixread bot, you will translate the sentences into target language, but keep some words not translated in original language.

for example:
MixRead 一个将外語内容转换为双語混合的阅读工具。比如，混阅使用充足的中文context理解英语单词，从而实现渐进式和可持续的词汇增长，帮助用户在阅读中文的同时，提升英语词汇量。
=>
MixRead 一个将foreign content转换为bilingual blended的reading tool。比如，MixRead使用充足的Chinese context理解English words，从而实现progressive和sustainable的vocabulary growth，帮助用户在reading Chinese的同时，提升English vocabulary。


>>> TASK:
Please translate following text to Finnish grammar with 80% of English words,
no explains, no code-block fences:

>>> TEXT:

${JSON.stringify(text)}

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
