# Wan 2.7 Video cURL Quickstart

## What this example shows

This example shows how to submit a Wan 2.7 Video generation task through APIDot, store the returned `task_id`, and poll the shared status endpoint for the result.

## When to use it

Use this example when you need a server-side cURL quickstart in a product backend, prototype, or media workflow. For production apps, submit the task from your backend, persist `task_id`, and add webhooks after your callback receiver is deployed.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- A backend or terminal environment that does not expose API keys to browser code.

## Environment variables

Use placeholders only. Do not commit real credentials.

```env
APIDOT_API_KEY=YOUR_API_KEY_HERE
```

## How to run

Add `callback_url` only when you have a real webhook receiver. See the [webhooks docs](https://apidot.ai/docs/webhooks) for the production callback flow.

```bash
export APIDOT_API_KEY="YOUR_API_KEY_HERE"

curl --fail-with-body --request POST \
  --url https://api.apidot.ai/api/generate/submit \
  --header "Authorization: Bearer $APIDOT_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
  "model": "wan2.7-text-to-video",
  "input": {
    "prompt": "A cinematic tracking shot of a glass greenhouse at sunrise, soft light, slow camera movement.",
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "duration": 5
  }
}'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

## Request variants

### wan2.7-text-to-video

```json
{
  "model": "wan2.7-text-to-video",
  "callback_url": "https://your-domain.com/callback",
  "input": {
    "prompt": "A cinematic tracking shot of a glass greenhouse at sunrise, soft light, slow camera movement.",
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "audio_url": "https://your-domain.com/audio.mp3",
    "seed": 24680,
    "enable_safety_checker": true
  }
}
```

### wan2.7-image-to-video

```json
{
  "model": "wan2.7-image-to-video",
  "callback_url": "https://your-domain.com/callback",
  "input": {
    "image_urls": [
      "https://your-domain.com/start-image.webp",
      "https://your-domain.com/end-image.webp"
    ],
    "prompt": "Animate the product with a slow dolly-in and realistic reflections.",
    "resolution": "1080p",
    "duration": 6,
    "audio_url": "https://your-domain.com/audio.mp3",
    "multi_shots": false
  }
}
```

### wan2.7-reference-to-video

```json
{
  "model": "wan2.7-reference-to-video",
  "callback_url": "https://your-domain.com/callback",
  "input": {
    "prompt": "Create a polished product hero video using the references for subject identity and lighting style.",
    "reference_image_urls": [
      "https://your-domain.com/reference-1.webp"
    ],
    "reference_video_urls": [
      "https://your-domain.com/reference-video.mp4"
    ],
    "aspect_ratio": "9:16",
    "resolution": "720p",
    "duration": 5,
    "multi_shots": true
  }
}
```

### wan2.7-edit-video

```json
{
  "model": "wan2.7-edit-video",
  "callback_url": "https://your-domain.com/callback",
  "input": {
    "prompt": "Restyle the source clip as a premium winter sports commercial while keeping the original motion.",
    "video_url": "https://your-domain.com/source-video.mp4",
    "reference_image_url": "https://your-domain.com/reference-image.webp",
    "aspect_ratio": "16:9",
    "resolution": "1080p",
    "duration": 0,
    "multi_shots": false,
    "audio_setting": "auto"
  }
}
```

## Expected response

Submit response:

```json
{
  "code": 200,
  "data": {
    "task_id": "task-unified-example",
    "status": "not_started",
    "created_time": "2026-07-04T10:00:00"
  }
}
```

Shortened status response:

```json
{
  "code": 200,
  "data": {
    "task_id": "task-unified-example",
    "status": "finished",
    "output": {
      "files": [
        {
          "file_url": "https://example.com/generated-video.mp4",
          "file_type": "video"
        }
      ]
    },
    "error_message": null
  }
}
```

## Production notes

- Store `data.task_id` before polling or waiting for a webhook.
- Keep APIDot API keys on the server side only.
- Poll at a moderate interval and avoid hot loops.
- Treat `finished` and `failed` as terminal states.
- Store selected model, request payload, user ID, and task ID together for support and retries.
- Use `callback_url` only after your webhook receiver can process duplicate callbacks idempotently.

## Common mistakes

- Committing a real API key or `.env` file.
- Calling APIDot directly from browser code.
- Losing the returned `task_id` before the task reaches a terminal state.
- Polling continuously without delay.
- Assuming every video model accepts the same duration, resolution, or aspect ratio fields.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Wan 2.7 Video docs: https://apidot.ai/docs/wan-2-7-video
- Video models: https://apidot.ai/models/video
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/wan-2-7-video
