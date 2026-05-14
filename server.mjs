import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { networkInterfaces } from "node:os";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const port = Number(process.env.PORT || process.argv[2] || 4173);
const host = "0.0.0.0";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.5-pro";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    if (url.pathname === "/api/ai") {
      await handleAiRequest(request, response);
      return;
    }
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    const target = normalize(join(root, pathname));
    if (!target.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const info = await stat(target);
    const filePath = info.isDirectory() ? join(target, "index.html") : target;
    const type = mimeTypes[extname(filePath)] || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": "no-cache"
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(500);
    response.end("Server error");
  }
});

async function handleAiRequest(request, response) {
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
    const body = await readJsonBody(request);
    const system = [
      "あなたは教育思想史研究、教育哲学研究、美術教育学研究に精通した論文執筆支援者です。",
      "硬質で明晰な学術文体を保ち、論証構造、先行研究との差分、資料根拠、反論可能性を重視してください。",
      "ユーザーが順に入力すれば論文が完成するよう、次に書くべきこと、文章案、修正案を具体的に出してください。"
    ].join("\n");
    const input = [
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
    ];
    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        reasoning: { effort: "high" },
        input
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

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 2_000_000) {
        reject(new Error("Request too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache"
  });
  response.end(JSON.stringify(payload));
}

server.listen(port, host, async () => {
  const addresses = lanAddresses();
  const lines = [
    "",
    "論文アトリエを起動しました。",
    `PC:      http://localhost:${port}`,
    ...addresses.map((address) => `スマホ:  http://${address}:${port}`),
    "",
    "スマホは同じWi-Fiにつないで、上のスマホ用URLを開いてください。",
    `AI:      ${process.env.OPENAI_API_KEY ? `OpenAI ${OPENAI_MODEL}` : "OPENAI_API_KEY 未設定のためローカル提案"}`,
    "終了するには、このターミナルで Ctrl+C を押します。",
    ""
  ];
  console.log(lines.join("\n"));
  try {
    await readFile(join(root, "index.html"));
  } catch {}
});

function lanAddresses() {
  return Object.values(networkInterfaces())
    .flat()
    .filter(Boolean)
    .filter((item) => item.family === "IPv4" && !item.internal)
    .map((item) => item.address);
}
