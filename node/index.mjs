const API_KEY = process.env.APIDOT_API_KEY;
const BASE_URL = process.env.APIDOT_BASE_URL || "https://api.apidot.ai";
const CALLBACK_URL = process.env.APIDOT_CALLBACK_URL;

if (!API_KEY) {
  console.error("Set APIDOT_API_KEY before running this example.");
  process.exit(1);
}

const payload = {
  "model": "wan2.7-text-to-video",
  "input": {
    "prompt": "A cinematic tracking shot of a glass greenhouse at sunrise, soft light, slow camera movement.",
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "duration": 5
  }
};
if (CALLBACK_URL) payload.callback_url = CALLBACK_URL;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok || body?.code >= 400) {
    throw new Error("APIDot request failed: " + JSON.stringify(body));
  }
  return body;
}

async function main() {
  const submitted = await requestJson(BASE_URL + "/api/generate/submit", {
    method: "POST",
    headers: { Authorization: "Bearer " + API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const taskId = submitted?.data?.task_id;
  if (!taskId) throw new Error("Submit response did not include data.task_id: " + JSON.stringify(submitted));
  console.log("Submitted Wan 2.7 Video task: " + taskId);
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    await sleep(5000);
    const status = await requestJson(BASE_URL + "/api/generate/status/" + taskId, {
      method: "GET",
      headers: { Authorization: "Bearer " + API_KEY },
    });
    const state = status?.data?.status;
    console.log("Attempt " + attempt + ": " + state);
    if (state === "finished" || state === "failed") {
      console.log(JSON.stringify(status, null, 2));
      return;
    }
  }
  throw new Error("Task " + taskId + " did not finish within the polling limit.");
}

main().catch((error) => { console.error(error); process.exit(1); });
