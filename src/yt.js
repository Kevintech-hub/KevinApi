const axios = require('axios');

class YouTubeScraper {
    constructor() {
        this.PHANTOM_API = {
            MP3: "https://phantom-api.us.ci/api/download/ytmp3",
            MP4: "https://phantom-api.us.ci/api/download/ytmp4"
        };
        
        this.CREATED_BY = "Kevin";
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

    wrapResponse(data) {
        return {
            status: true,
            created_by: this.CREATED_BY,
            note: this.NOTE,
            operator: "Phantom API",
            ...data
        };
    }

    // Main download method using Phantom API
    async download(url, format = "mp3", quality = null) {
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
            return {
                status: false,
                error: `Download failed: ${error.message}`,
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
            
            if (!result.status || !result.download) {
                throw new Error(result.error || "No download URL found");
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