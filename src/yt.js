const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');

class YouTubeScraper {
    constructor() {
        this.PHANTOM_API = {
            MP3: "https://phantom-api.us.ci/api/download/ytmp3",
            MP4: "https://phantom-api.us.ci/api/download/ytmp4"
        };
        
        this.SSYOUTUBE_CONFIG = {
            BASE_URL: "https://ssyoutube.com",
            API: {
                CONVERT: "/api/convert"
            },
            SECRETS: {
                SALT: "384d5028ee4a399f6cae0175025a1708aa924fc0ccb08be1aa359cd856dd1639",
                FIXED_TS: "1765962059039"
            },
            HEADERS: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Origin": "https://ssyoutube.com",
                "Referer": "https://ssyoutube.com/"
            }
        };
        
        this.CREATED_BY = "Ditzzy";
        this.NOTE = "Thank you for using this YouTube scraper";
    }

    extractVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = String(url || "").match(regex);
        return match ? match[1] : null;
    }

    formatSize(bytes) {
        if (!bytes) return 'Unknown';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    }

    generateSignature(url, timestamp) {
        try {
            const rawString = url + timestamp + this.SSYOUTUBE_CONFIG.SECRETS.SALT;
            return crypto.createHash('sha256').update(rawString).digest('hex');
        } catch (e) {
            console.error("Error generating signature:", e);
            return null;
        }
    }

    wrapResponse(data) {
        return {
            status: true,
            created_by: this.CREATED_BY,
            note: this.NOTE,
            operator: "Phantom + ssyoutube",
            ...data
        };
    }

    // Primary method using Phantom API (recommended)
    async downloadWithPhantom(url, format = "mp3", quality = null) {
        try {
            const videoId = this.extractVideoId(url);
            if (!videoId) {
                throw new Error("Invalid YouTube URL format");
            }

            const isMp4 = format.toLowerCase() === "mp4";
            const apiUrl = isMp4 ? this.PHANTOM_API.MP4 : this.PHANTOM_API.MP3;
            
            // Build URL with quality parameter for MP4
            let fullUrl = `${apiUrl}?url=${encodeURIComponent(url)}`;
            if (isMp4 && quality) {
                fullUrl += `&quality=${quality}`;
            }

            console.log(`Fetching from Phantom API: ${fullUrl}`);
            
            const response = await axios.get(fullUrl, {
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                }
            });

            if (!response.data || !response.data.status) {
                throw new Error(response.data?.message || "Failed to fetch from Phantom API");
            }

            const data = response.data;
            
            const result = {
                title: data.title,
                channel: data.channel,
                thumbnail: data.thumbnail,
                duration: data.duration,
                videoId: videoId,
                url: url,
                timestamp: data.timestamp
            };

            // Handle MP4 response
            if (isMp4 && data.video) {
                result.video = {
                    url: data.video.url,
                    quality: data.video.quality || quality || "HD",
                    size: data.video.size,
                    ext: data.video.ext || "mp4",
                    mime: data.video.mime || "video/mp4"
                };
                result.download = data.video.url;
            } 
            // Handle MP3 response
            else if (!isMp4 && data.audio) {
                result.audio = {
                    url: data.audio.url,
                    quality: data.audio.quality || "48K",
                    size: data.audio.size,
                    ext: data.audio.ext || "m4a",
                    mime: data.audio.mime || "audio/m4a"
                };
                result.download = data.audio.url;
            }
            else {
                throw new Error("No media URL found in response");
            }

            return this.wrapResponse(result);

        } catch (error) {
            throw new Error(`Phantom API failed: ${error.message}`);
        }
    }

    // Backup method using ssyoutube
    async downloadWithSsYoutube(url, format = "mp3") {
        try {
            const videoId = this.extractVideoId(url);
            if (!videoId) {
                throw new Error("Invalid YouTube URL format");
            }

            const currentTs = Date.now().toString();
            const signature = this.generateSignature(url, currentTs);

            if (!signature) {
                throw new Error('Failed to generate security signature');
            }

            const payload = {
                sf_url: url,
                ts: currentTs,
                _ts: this.SSYOUTUBE_CONFIG.SECRETS.FIXED_TS,
                _tsc: '0',
                _s: signature
            };

            const response = await axios.post(
                this.SSYOUTUBE_CONFIG.BASE_URL + this.SSYOUTUBE_CONFIG.API.CONVERT,
                qs.stringify(payload),
                { headers: this.SSYOUTUBE_CONFIG.HEADERS }
            );

            const data = response.data;

            if (!data || !data.url) {
                throw new Error('Failed to fetch data from ssyoutube');
            }

            const result = {
                title: data.meta?.title || "Unknown",
                videoId: videoId,
                thumbnail: data.thumb,
                duration: data.meta?.duration,
                url: url
            };

            const isMp4 = format.toLowerCase() === "mp4";
            
            if (Array.isArray(data.url)) {
                if (isMp4) {
                    // Find video format (with audio)
                    const videoItem = data.url.find(item => 
                        !item.no_audio && item.ext === 'mp4'
                    );
                    if (videoItem) {
                        result.video = {
                            url: videoItem.url,
                            quality: videoItem.quality || videoItem.subname,
                            size: this.formatSize(videoItem.filesize),
                            ext: videoItem.ext,
                            mime: "video/mp4"
                        };
                        result.download = videoItem.url;
                    }
                } else {
                    // Find audio format
                    const audioItem = data.url.find(item => 
                        item.audio === true || item.ext === 'mp3' || item.ext === 'm4a'
                    );
                    if (audioItem) {
                        result.audio = {
                            url: audioItem.url,
                            quality: audioItem.quality || audioItem.subname,
                            size: this.formatSize(audioItem.filesize),
                            ext: audioItem.ext,
                            mime: audioItem.ext === 'mp3' ? "audio/mpeg" : "audio/m4a"
                        };
                        result.download = audioItem.url;
                    }
                }
            }

            if (!result.download) {
                throw new Error("No suitable download format found");
            }

            return this.wrapResponse(result);

        } catch (error) {
            throw new Error(`ssyoutube failed: ${error.message}`);
        }
    }

    // Main download method with fallback
    async download(url, format = "mp3", quality = null, useFallback = true) {
        try {
            // Try Phantom API first (primary)
            try {
                console.log("Attempting with Phantom API...");
                return await this.downloadWithPhantom(url, format, quality);
            } catch (phantomError) {
                console.warn("Phantom API failed:", phantomError.message);
                
                if (!useFallback) throw phantomError;
                
                // Try ssyoutube as fallback
                console.log("Trying ssyoutube as fallback...");
                return await this.downloadWithSsYoutube(url, format);
            }
        } catch (error) {
            return {
                status: false,
                error: `All download methods failed: ${error.message}`,
                created_by: this.CREATED_BY,
                note: this.NOTE
            };
        }
    }

    // Download just audio (MP3)
    async downloadAudio(url, quality = null) {
        return await this.download(url, "mp3", quality);
    }

    // Download video (MP4)
    async downloadVideo(url, quality = "720") {
        return await this.download(url, "mp4", quality);
    }

    // Get direct buffer for streaming
    async downloadBuffer(url, format = "mp3") {
        try {
            const result = await this.download(url, format);
            
            if (!result.download) {
                throw new Error("No download URL found");
            }

            const response = await axios.get(result.download, {
                responseType: "arraybuffer",
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            return {
                buffer: Buffer.from(response.data),
                title: result.title,
                format: format,
                size: response.data.length
            };
        } catch (error) {
            throw new Error(`Failed to get buffer: ${error.message}`);
        }
    }
}

// Helper functions for easy use
const quickDownload = async (url, format = "mp3") => {
    const scraper = new YouTubeScraper();
    return await scraper.download(url, format);
};

const downloadAudio = async (url) => {
    const scraper = new YouTubeScraper();
    return await scraper.downloadAudio(url);
};

const downloadVideo = async (url, quality = "720") => {
    const scraper = new YouTubeScraper();
    return await scraper.downloadVideo(url, quality);
};

module.exports = {
    YouTubeScraper,
    quickDownload,
    downloadAudio,
    downloadVideo
};