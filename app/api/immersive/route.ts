import { NextResponse } from "next/server";
import OpenAI from "openai";
import { parseOpenAI_apiKey } from "../parseOpenAI_apiKey";

const exampleReplace = (s: string) => {
  const obj = {
    from:
      "Source Text: 明天的测试要是统计到每个人，七点半要全部到位，截止时间是下午四点。\\n" +
      "Mixed Chinese-English Text: 明天的test要align到每个人，七点半要全部standby，testDDL是下午四点。\\n" +
      "\\n" +
      "Source Text: I have to lead a five-day training session next week in Seoul for APAC project managers.\\n" +
      "Mixed Chinese-English Text: 我先要去 Seoul 给亚太区的 project manager 做五天 training。\\n",
    to: `
Source Text: 答案是肯定的，以汉字为代表的意音方块字，作为一个复杂的文字符号系统，其信息熵很高。
Mixed Japanese-English Text: 答えは肯定的です。この漢字は、representingされた音節文字システムとして、information entropyが非常に高いです。/ 答えは確かに「Yes」です。漢字は意味を表すスクエアキャラクター（意音方塊字）として、複雑なwriting systemの一部を形成しており、そのinformation entropyは非常に高いです。
`.replaceAll("\n", "\\n"),
  };
  return s.replaceAll(obj.from, obj.to).replaceAll("Chinese", "Japanese");
};

export const POST = async (req: Request) => {
  const apiKey = await parseOpenAI_apiKey(req);
  const input = await req.json();
  const messages = JSON.parse(exampleReplace(JSON.stringify(input.messages)));
  const ret = await new OpenAI({ apiKey }).chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.3,
  });
  return NextResponse.json(ret);
};
