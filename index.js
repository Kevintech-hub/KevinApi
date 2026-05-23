// AI Chat Modules
const { DeepSeekThinking } = require("./src/deepseek.js");
const { FeelBetter } = require("./src/feeb.js");
const { chat: geminiChat } = require("./src/gemini.js");
const { chat: geminiVisionChat } = require("./src/geminiVision.js");
const { GPT5 } = require("./src/gpt5.js");
const { chat: GPT52Chat } = require("./src/gpt52.js");
const { Qwen3 } = require("./src/qwen3.js");
const { UnlimitedAI, CHARACTERS } = require("./src/unlimitedai.js");

// Downloader Modules
const { aiodl, detectPlatform } = require("./src/aio.js");
const { GoogleSearch } = require("./src/google.js");
const instagramDownloader = require("./src/ig.js");
const likee = require("./src/likee.js");
const mediafire = require("./src/mediafire.js");
const scrapePinterest = require("./src/pindl.js");
const { RedditDL } = require("./src/reddit.js");
const { RedNoteDL } = require("./src/rednote.js");
const { reelsvideo } = require("./src/reelsvideo.js");
const sfileDownloader = require("./src/sfiledl.js");
const searchSoundCloud = require("./src/soundcloud.js");
const soundcloudDownloader = require("./src/soundclouddl.js");
const { TeraBoxDL } = require("./src/terabox.js");
const tiktokDownloader = require("./src/tiktok.js");
const { tiktokSearchVideo } = require("./src/tiktoksearch.js");
const twitterDownloader = require("./src/twitter.js");
const youtubeDownloader = require("./src/youtube.js");
const ytDownloader = require("./src/yt.js");
const { ytdl, Youtube, fallbackToMp3Buffer } = require("./src/ytdl.js");

// Image Processing
const { upload: hdUpload, get: hdGetStatus } = require("./src/hd.js");
const videoEnhancer = require("./src/hdvid.js");
const { createEnhanceTask, pollEnhanceTask } = require("./src/hdvid.js");
const { Img2Img } = require("./src/img2img.js");
const imgToPrompt = require("./src/img2prompt.js");
const uploadImage = require("./src/imgdrop.js");
const ImgUpscaler = require("./src/imglarger.js");
const { pixa: removeBackground } = require("./src/removebackground.js");
const unrestrictedAiImage = require("./src/txt2img.js");
const { Txt2Img2 } = require("./src/txt2img2.js");
const upscaler = require("./src/upscaler.js");
const videyUpload = require("./src/videy.js");

// Information & Scrapers
const scrapeHokCharacter = require("./src/hokinfo.js");
const scrapeWutheringWavesCharacter = require("./src/wwchar.js");
const wallpaperSearch = require("./src/wallpapersearch.js");

// Other Utilities
const { TempMailCreate, TempMailInbox } = require("./src/tempmail.js");
const generateCustomTTS = require("./src/topmedia.js");

// Legacy/Additional
const spotifyDownloader = require("./src/spotify.js");

// Version info
const VERSION = "1.0.0";
const NAME = "API-KEV";
const AUTHOR = "Kev";

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
  createEnhanceTask,
  pollEnhanceTask,
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

module.exports = API_KEV;

// Named exports for backward compatibility
module.exports.DeepSeekThinking = DeepSeekThinking;
module.exports.FeelBetter = FeelBetter;
module.exports.geminiChat = geminiChat;
module.exports.geminiVisionChat = geminiVisionChat;
module.exports.GPT5 = GPT5;
module.exports.GPT52Chat = GPT52Chat;
module.exports.Qwen3 = Qwen3;
module.exports.UnlimitedAI = UnlimitedAI;
module.exports.CHARACTERS = CHARACTERS;
module.exports.aiodl = aiodl;
module.exports.detectPlatform = detectPlatform;
module.exports.GoogleSearch = GoogleSearch;
module.exports.instagramDownloader = instagramDownloader;
module.exports.likee = likee;
module.exports.mediafire = mediafire;
module.exports.scrapePinterest = scrapePinterest;
module.exports.RedditDL = RedditDL;
module.exports.RedNoteDL = RedNoteDL;
module.exports.reelsvideo = reelsvideo;
module.exports.sfileDownloader = sfileDownloader;
module.exports.searchSoundCloud = searchSoundCloud;
module.exports.soundcloudDownloader = soundcloudDownloader;
module.exports.TeraBoxDL = TeraBoxDL;
module.exports.tiktokDownloader = tiktokDownloader;
module.exports.tiktokSearchVideo = tiktokSearchVideo;
module.exports.twitterDownloader = twitterDownloader;
module.exports.youtubeDownloader = youtubeDownloader;
module.exports.ytDownloader = ytDownloader;
module.exports.ytdl = ytdl;
module.exports.Youtube = Youtube;
module.exports.fallbackToMp3Buffer = fallbackToMp3Buffer;
module.exports.hdUpload = hdUpload;
module.exports.hdGetStatus = hdGetStatus;
module.exports.videoEnhancer = videoEnhancer;
module.exports.createEnhanceTask = createEnhanceTask;
module.exports.pollEnhanceTask = pollEnhanceTask;
module.exports.Img2Img = Img2Img;
module.exports.imgToPrompt = imgToPrompt;
module.exports.uploadImage = uploadImage;
module.exports.ImgUpscaler = ImgUpscaler;
module.exports.removeBackground = removeBackground;
module.exports.unrestrictedAiImage = unrestrictedAiImage;
module.exports.Txt2Img2 = Txt2Img2;
module.exports.upscaler = upscaler;
module.exports.videyUpload = videyUpload;
module.exports.scrapeHokCharacter = scrapeHokCharacter;
module.exports.scrapeWutheringWavesCharacter = scrapeWutheringWavesCharacter;
module.exports.wallpaperSearch = wallpaperSearch;
module.exports.TempMailCreate = TempMailCreate;
module.exports.TempMailInbox = TempMailInbox;
module.exports.generateCustomTTS = generateCustomTTS;
module.exports.spotifyDownloader = spotifyDownloader;
module.exports.VERSION = VERSION;
module.exports.NAME = NAME;
module.exports.AUTHOR = AUTHOR;