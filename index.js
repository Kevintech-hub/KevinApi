// AI Chat Modules
export { DeepSeekThinking } from "./src/deepseek.js";
export { FeelBetter } from "./src/feeb.js";
export { chat as geminiChat } from "./src/gemini.js";
export { chat as geminiVisionChat } from "./src/geminiVision.js";
export { GPT5 } from "./src/gpt5.js";
export { chat as GPT52Chat } from "./src/gpt52.js";
export { Qwen3 } from "./src/qwen3.js";
export { UnlimitedAI, CHARACTERS } from "./src/unlimitedai.js";

// Downloader Modules
export { aiodl, detectPlatform } from "./src/aio.js";
export { default as dramaboxsearch } from "./src/dramabox.js";
export { GoogleSearch } from "./src/google.js";
export { default as instagramDownloader } from "./src/ig.js";
export { default as likee } from "./src/likee.js";
export { default as mediafire } from "./src/mediafire.js";
export { default as scrapePinterest } from "./src/pindl.js";
export { RedditDL } from "./src/reddit.js";
export { RedNoteDL } from "./src/rednote.js";
export { reelsvideo } from "./src/reelsvideo.js";
export { default as sfileDownloader } from "./src/sfiledl.js";
export { default as searchSoundCloud } from "./src/soundcloud.js";
export { default as soundcloudDownloader } from "./src/soundclouddl.js";
export { TeraBoxDL } from "./src/terabox.js";
export { default as tiktokDownloader } from "./src/tiktok.js";
export { tiktokSearchVideo } from "./src/tiktoksearch.js";
export { default as twitterDownloader } from "./src/twitter.js";
export { default as youtubeDownloader } from "./src/youtube.js";
export { default as ytDownloader } from "./src/yt.js";
export { ytdl, Youtube, fallbackToMp3Buffer } from "./src/ytdl.js";

// Image Processing
export { upload as hdUpload, get as hdGetStatus } from "./src/hd.js";
export { default as videoEnhancer, createEnhanceTask, pollEnhanceTask } from "./src/hdvid.js";
export { Img2Img } from "./src/img2img.js";
export { default as imgToPrompt } from "./src/img2prompt.js";
export { default as uploadImage } from "./src/imgdrop.js";
export { default as ImgUpscaler } from "./src/imglarger.js";
export { pixa as removeBackground } from "./src/removebackground.js";
export { default as unrestrictedAiImage } from "./src/txt2img.js";
export { Txt2Img2 } from "./src/txt2img2.js";
export { default as upscaler } from "./src/upscaler.js";
export { default as videyUpload } from "./src/videy.js";

// Information & Scrapers
export { default as scrapeHokCharacter } from "./src/hokinfo.js";
export { default as scrapeWutheringWavesCharacter } from "./src/wwchar.js";
export { default as wallpaperSearch } from "./src/wallpapersearch.js";

// Other Utilities
export { TempMailCreate, TempMailInbox } from "./src/tempmail.js";
export { default as generateCustomTTS } from "./src/topmedia.js";

// Legacy/Additional
export { default as spotifyDownloader } from "./src/spotify.js";

// Version info
export const VERSION = "1.0.0";
export const NAME = "api-kev";
export const AUTHOR = "Kev";

// Default export with all modules
const API_KEV = {
  // AI
  DeepSeekThinking,
  FeelBetter,
  geminiChat,
  geminiVisionChat,
  GPT5,
  GPT52Chat,
  Qwen3,
  UnlimitedAI,
  CHARACTERS,
  
  // Downloaders
  aiodl,
  detectPlatform,
  dramaboxsearch,
  GoogleSearch,
  instagramDownloader,
  likee,
  mediafire,
  scrapePinterest,
  RedditDL,
  RedNoteDL,
  reelsvideo,
  sfileDownloader,
  searchSoundCloud,
  soundcloudDownloader,
  TeraBoxDL,
  tiktokDownloader,
  tiktokSearchVideo,
  twitterDownloader,
  youtubeDownloader,
  ytDownloader,
  ytdl,
  Youtube,
  fallbackToMp3Buffer,
  
  // Image
  hdUpload,
  hdGetStatus,
  videoEnhancer,
  Img2Img,
  imgToPrompt,
  uploadImage,
  ImgUpscaler,
  removeBackground,
  unrestrictedAiImage,
  Txt2Img2,
  upscaler,
  videyUpload,
  
  // Info
  scrapeHokCharacter,
  scrapeWutheringWavesCharacter,
  wallpaperSearch,
  
  // Utils
  TempMailCreate,
  TempMailInbox,
  generateCustomTTS,
  spotifyDownloader,
  
  VERSION,
  NAME,
  AUTHOR
};

export default API_KEV;