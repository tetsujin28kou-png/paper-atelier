const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.5-pro";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(response, 200, {
      ok: false,
      model: "local",
      error: "OPENAI_API_KEY is not set"
    });
    return;
  }
  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
    const system = [
      "あなたは教育思想史研究、教育哲学研究、美術教育学研究に精通した論文執筆支援者です。",
      "硬質で明晰な学術文体を保ち、論証構造、先行研究との差分、資料根拠、反論可能性を重視してください。",
      "ユーザーが順に入力すれば論文が完成するよう、次に書くべきこと、文章案、修正案を具体的に出してください。"
    ].join("\n");
    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        reasoning: { effort: "high" },
        input: [
          { role: "system", content: system },
          {
            role: "user",
            content: [
              body.prompt || "",
              "",
              "現在の論文コンテキスト:",
              JSON.stringify(body.context || {}, null, 2)
            ].join("\n")
          }
        ]
      })
    });
    const data = await aiResponse.json();
    if (!aiResponse.ok) {
      sendJson(response, 200, {
        ok: false,
        model: OPENAI_MODEL,
        error: data && data.error ? data.error.message : "OpenAI API error"
      });
      return;
    }
    sendJson(response, 200, {
      ok: true,
      model: OPENAI_MODEL,
      text: extractResponseText(data)
    });
  } catch (error) {
    sendJson(response, 200, {
      ok: false,
      model: OPENAI_MODEL,
      error: error.message || "AI request failed"
    });
  }
}

function extractResponseText(data) {
  if (typeof data.output_text === "string" && data.output_text) return data.output_text;
  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) parts.push(content.text);
      if (content.type === "text" && content.text) parts.push(content.text);
    }
  }
  return parts.join("\n").trim() || "応答を取得できませんでした。";
}

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-cache");
  response.end(JSON.stringify(payload));
}
