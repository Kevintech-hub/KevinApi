```markdown
# api-kev

All-in-one API wrapper for media downloading, AI chat, image processing, and more.

## Installation

```bash
npm install api-kev
```

Features

📥 Media Downloaders

· Instagram - Download posts, stories, reels
· YouTube - Download videos and audio (MP3/MP4)
· TikTok - Download videos without watermark
· Facebook - Download videos
· Twitter/X - Download videos and images
· Pinterest - Download pins
· Reddit - Download media
· SoundCloud - Download tracks
· MediaFire - Download files
· Terabox - Download videos

🤖 AI Chat

· DeepSeek - DeepSeek AI with reasoning
· Gemini - Google Gemini AI
· GPT-5 - GPT-4.1 Nano
· Qwen3 - Alibaba Qwen
· UnlimitedAI - Multiple character personas

🖼️ Image Processing

· Text-to-Image - Generate images from prompts
· Image-to-Image - Transform images with prompts
· Upscale - Enhance image resolution
· Remove Background - Remove backgrounds from images
· Image to Prompt - Extract prompt from images

🎬 Video Processing

· Video Enhancer - Upscale video quality
· Upload - Upload to Videy.co

🔍 Information Scrapers

· Honor of Kings - Character information
· Wuthering Waves - Character information
· Wallpaper Search - Search wallpapers

Usage

AI Chat

```javascript
import { DeepSeekThinking, GPT5, Qwen3 } from 'api-kev';

// DeepSeek with reasoning
const result = await DeepSeekThinking("Apa itu AI?", []);

// GPT-5
const gptResult = await GPT5("Hello, world!");

// Qwen3
const qwenResult = await Qwen3("Jelaskan tentang JavaScript");
```

Media Download

```javascript
import { 
  instagramDownloader, 
  tiktokDownloader, 
  youtubeDownloader,
  aiodl 
} from 'api-kev';

// Auto-detect platform
const result = await aiodl("https://instagram.com/p/...");

// Instagram specific
const igResult = await instagramDownloader("https://instagram.com/p/...");

// TikTok
const ttResult = await tiktokDownloader("https://tiktok.com/@user/video/...");

// YouTube
const ytResult = await youtubeDownloader("https://youtube.com/watch?v=...");
```

Image Generation

```javascript
import { Txt2Img2, Img2Img, removeBackground } from 'api-kev';

// Text to Image
const image = await Txt2Img2("a beautiful sunset over mountains");

// Image to Image
const transformed = await Img2Img("make it anime style", imageBuffer);

// Remove Background
const noBg = await removeBackground(imagePath);
```

Image Upscaling

```javascript
import { upscaler, ImgUpscaler, hdUpload, hdGetStatus } from 'api-kev';

// Simple upscale
const result = await upscaler("./image.jpg");

// Or using ImgUpscaler class
const upscalerTool = new ImgUpscaler();
const result2 = await upscalerTool.process("./image.jpg");
```

Video Enhancement

```javascript
import videoEnhancer from 'api-kev';

const result = await videoEnhancer("./video.mp4");
console.log(result.resultUrl);
```

Google Search

```javascript
import { GoogleSearch } from 'api-kev';

const results = await GoogleSearch("cara belajar programming");
console.log(results.results);
```

Temporary Email

```javascript
import { TempMailCreate, TempMailInbox } from 'api-kev';

const { email } = await TempMailCreate();
const inbox = await TempMailInbox(email);
```

Character Information

```javascript
import { scrapeHokCharacter, scrapeWutheringWavesCharacter } from 'api-kev';

const hokChar = await scrapeHokCharacter("Gusion");
const wwChar = await scrapeWutheringWavesCharacter("Jinhsi");
```

Wallpaper Search

```javascript
import wallpaperSearch from 'api-kev';

const wallpapers = await wallpaperSearch("anime landscape");
console.log(wallpapers.results);
```

Response Formats

Each function returns consistent response structures:

```javascript
// Downloader response
{
  status: true/false,
  title: "Title",
  media: [{ type: "video/image", url: "...", quality: "..." }],
  thumbnail: "..."
}

// AI Chat response
{
  status: true/false,
  answer: "Response text",
  reasoning: "Reasoning (if available)",
  model: "model name"
}
```

Requirements

· Node.js >= 18.0.0
· FFmpeg (for video/audio processing fallback)

License

MIT

Author

Kev

```

## CLI Tool (bin/cli.js) - Optional

```javascript
#!/usr/bin/env node

import { aiodl, DeepSeekThinking, GPT5, Txt2Img2 } from "../index.js";
import fs from "fs";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case "download":
      const url = args[1];
      if (!url) {
        console.log("Usage: api-kev download <url>");
        process.exit(1);
      }
      const result = await aiodl(url);
      console.log(JSON.stringify(result, null, 2));
      break;

    case "ask":
      const prompt = args.slice(1).join(" ");
      if (!prompt) {
        console.log("Usage: api-kev ask <question>");
        process.exit(1);
      }
      const answer = await DeepSeekThinking(prompt);
      console.log(answer.answer);
      break;

    case "gpt5":
      const question = args.slice(1).join(" ");
      if (!question) {
        console.log("Usage: api-kev gpt5 <question>");
        process.exit(1);
      }
      const gptAnswer = await GPT5(question);
      console.log(gptAnswer.answer);
      break;

    case "img":
      const promptText = args[1];
      if (!promptText) {
        console.log("Usage: api-kev img <prompt>");
        process.exit(1);
      }
      const image = await Txt2Img2(promptText);
      console.log("Generated image:", image.url);
      break;

    default:
      console.log(`
api-kev CLI Tool

Commands:
  download <url>    Download media from URL
  ask <question>    Ask DeepSeek AI
  gpt5 <question>   Ask GPT-5 AI
  img <prompt>      Generate image from prompt

Examples:
  api-kev download https://instagram.com/p/xxx
  api-kev ask "Apa itu JavaScript?"
  api-kev gpt5 "Explain quantum computing"
  api-kev img "cat wearing sunglasses"
      `);
  }
}

main().catch(console.error);
```

Make sure to set executable permission:

```bash
chmod +x bin/cli.js
```

Publishing to npm

```bash
npm login
npm publish
```