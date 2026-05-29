const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

class YoutubeMusicScraper {
    constructor() {
        this.API_BASE = "https://phantom-api.us.ci/api/download/ytmp3";
        this.CREATED_BY = "Ditzzy";
        this.NOTE = "Thank you for using this YouTube music scraper";
        
        // Multiple fallback APIs
        this.FALLBACK_APIS = [
            {
                name: "Phantom API (Audio)",
                url: (url) => `https://phantom-api.us.ci/api/download/ytmp3?url=${encodeURIComponent(url)}`,
                process: (data) => data.audio?.url || data.download
            },
            {
                name: "Phantom API (Video)",
                url: (url) => `https://phantom-api.us.ci/api/download/ytmp4?url=${encodeURIComponent(url)}`,
                process: (data) => data.video?.url || data.download
            },
            {
                name: "Hector Manuel Worker",
                url: (url) => `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(url)}`,
                process: (data) => data.downloadUrl || data.url || data.result?.url
            },
            {
                name: "Nexray API",
                url: (url, videoId) => `https://api.nexray.eu.cc/downloader/ytplay?q=${encodeURIComponent(videoId || url)}`,
                process: (data) => data.download_url || data.url || data.result?.url
            },
            {
                name: "Y2mate Alternative",
                url: (url) => `https://y2mate.is/api/json?url=${encodeURIComponent(url)}`,
                process: (data) => data.video?.url || data.audio?.url || data.url
            },
            {
                name: "SaveFrom Helper",
                url: (url) => `https://savefrom.net/api/convert?url=${encodeURIComponent(url)}`,
                process: (data) => data.downloadUrl || data.url
            }
        ];
    }

    wrapResponse(data) {
        return {
            created_by: this.CREATED_BY,
            note: this.NOTE,
            results: data,
        };
    }

    extractVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = String(url || "").match(regex);
        return match ? match[1] : null;
    }

    async tryAllApis(url, videoId, format = "audio") {
        const errors = [];
        
        // Try each API in sequence
        for (const api of this.FALLBACK_APIS) {
            try {
                // Skip audio APIs when requesting video and vice versa
                if (format === "audio" && api.name === "Phantom API (Video)") continue;
                if (format === "video" && api.name === "Phantom API (Audio)") continue;
                
                console.log(`Trying ${api.name}...`);
                
                const apiUrl = api.url(url, videoId);
                const response = await axios.get(apiUrl, {
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json',
                        'Origin': new URL(apiUrl).origin,
                        'Referer': new URL(apiUrl).origin + '/'
                    }
                });
                
                if (response.data && response.data.status !== false) {
                    const downloadUrl = api.process(response.data);
                    
                    if (downloadUrl) {
                        console.log(`✓ Success with ${api.name}`);
                        return {
                            success: true,
                            service: api.name,
                            data: response.data,
                            downloadUrl: downloadUrl
                        };
                    }
                }
                
                // If we got a response but no download URL
                if (response.data) {
                    console.log(`${api.name} responded but no download URL found`);
                    errors.push(`${api.name}: No download URL in response`);
                }
                
            } catch (error) {
                console.log(`✗ ${api.name} failed: ${error.message}`);
                errors.push(`${api.name}: ${error.message}`);
            }
        }
        
        return { success: false, errors };
    }

    async download(url, format = "audio") {
        try {
            const videoId = this.extractVideoId(url);
            if (!videoId) {
                throw new Error("Invalid YouTube URL format");
            }

            // Normalize format
            const normalizedFormat = String(format || "audio").toLowerCase();
            const isVideo = normalizedFormat === "video" || normalizedFormat === "mp4";
            
            // Try all available APIs
            const result = await this.tryAllApis(url, videoId, isVideo ? "video" : "audio");
            
            if (!result.success) {
                throw new Error(`All APIs failed: ${result.errors.join("; ")}`);
            }
            
            const data = result.data;
            
            // Process response from different APIs
            const processedResult = {
                title: data.title || data.meta?.title || data.info?.title || "Unknown Title",
                channel: data.channel || data.ownerChannelName || data.author || "Unknown Channel",
                thumbnail: data.thumbnail || data.thumb || data.picture,
                duration: data.duration || data.lengthSeconds,
                videoId: videoId,
                url: url,
                timestamp: new Date().toISOString(),
                service: result.service
            };
            
            // Handle audio format
            if (!isVideo) {
                // Extract audio URL from various response formats
                let audioUrl = result.downloadUrl;
                let audioQuality = "128K";
                let audioExt = "mp3";
                let audioSize = null;
                
                if (data.audio) {
                    audioUrl = data.audio.url || data.audio;
                    audioQuality = data.audio.quality || data.quality || "128K";
                    audioExt = data.audio.ext || data.ext || "mp3";
                    audioSize = data.audio.size;
                } else if (data.download) {
                    audioUrl = data.download;
                } else if (data.url) {
                    audioUrl = data.url;
                }
                
                processedResult.audio = {
                    url: audioUrl,
                    quality: audioQuality,
                    size: audioSize || "Unknown",
                    ext: audioExt,
                    mime: `audio/${audioExt === "mp3" ? "mpeg" : audioExt}`
                };
                processedResult.download = audioUrl;
            } 
            // Handle video format
            else {
                let videoUrl = result.downloadUrl;
                let videoQuality = "720p";
                let videoExt = "mp4";
                let videoSize = null;
                
                if (data.video) {
                    videoUrl = data.video.url || data.video;
                    videoQuality = data.video.quality || data.quality || "720p";
                    videoExt = data.video.ext || data.ext || "mp4";
                    videoSize = data.video.size;
                } else if (data.download) {
                    videoUrl = data.download;
                } else if (data.url) {
                    videoUrl = data.url;
                }
                
                processedResult.video = {
                    url: videoUrl,
                    quality: videoQuality,
                    size: videoSize || "Unknown",
                    ext: videoExt,
                    mime: `video/${videoExt}`
                };
                processedResult.download = videoUrl;
            }
            
            return this.wrapResponse(processedResult);
            
        } catch (error) {
            throw new Error(`Download failed: ${error.message}`);
        }
    }

    async downloadBuffer(url, format = "audio") {
        try {
            const result = await this.download(url, format);
            const mediaUrl = result.results.download;
            
            if (!mediaUrl) {
                throw new Error("No download URL found");
            }
            
            const response = await axios.get(mediaUrl, {
                responseType: "arraybuffer",
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const buffer = Buffer.from(response.data);
            const ext = format === "video" || format === "mp4" ? "mp4" : "mp3";
            
            return {
                buffer: buffer,
                title: result.results.title,
                ext: ext,
                size: buffer.length,
                service: result.results.service
            };
            
        } catch (error) {
            throw new Error(`Failed to download buffer: ${error.message}`);
        }
    }
    
    async downloadVideo(url) {
        return await this.download(url, "video");
    }
    
    async downloadAudio(url) {
        return await this.download(url, "audio");
    }

    async saveToFile(url, outputPath = null, format = "audio") {
        try {
            const { buffer, title, ext } = await this.downloadBuffer(url, format);
            
            const filename = outputPath || `${title.replace(/[^a-z0-9]/gi, '_')}.${ext}`;
            const filepath = path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename);
            
            fs.writeFileSync(filepath, buffer);
            
            return {
                path: filepath,
                filename: path.basename(filepath),
                size: buffer.length,
                title: title,
                format: ext
            };
            
        } catch (error) {
            throw new Error(`Failed to save file: ${error.message}`);
        }
    }

    async getInfo(url) {
        try {
            const result = await this.download(url);
            return result.results;
        } catch (error) {
            throw new Error(`Failed to get info: ${error.message}`);
        }
    }
}

// Create allinOne function that handles everything
async function allinOne(url, options = {}) {
    const scraper = new YoutubeMusicScraper();
    const format = options.format || "audio";
    const saveToFile = options.saveToFile || false;
    const outputPath = options.outputPath || null;
    const returnBuffer = options.returnBuffer || false;
    
    try {
        if (returnBuffer) {
            const bufferResult = await scraper.downloadBuffer(url, format);
            return {
                success: true,
                data: bufferResult.buffer,
                title: bufferResult.title,
                ext: bufferResult.ext,
                size: bufferResult.size,
                service: bufferResult.service,
                type: "buffer"
            };
        } else if (saveToFile) {
            const fileResult = await scraper.saveToFile(url, outputPath, format);
            return {
                success: true,
                path: fileResult.path,
                filename: fileResult.filename,
                size: fileResult.size,
                title: fileResult.title,
                format: fileResult.format,
                type: "file"
            };
        } else {
            const downloadResult = await scraper.download(url, format);
            return {
                success: true,
                data: downloadResult,
                type: "info"
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message,
            type: "error"
        };
    }
}

module.exports = { allinOne };