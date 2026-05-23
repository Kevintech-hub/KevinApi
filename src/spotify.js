// In src/spotify.js, modify the function to return data instead of just console.log
async function downloadSpotify(spotifyUrl) {
    try {
        const response = await axios.post(
            "https://spotyloader.com/api/spotify/track",
            { url: spotifyUrl },
            {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    Referer: "https://spotyloader.com/",
                    Origin: "https://spotyloader.com",
                },
            },
        );

        const data = response.data;
        if (data.downloadLink) {
            return {
                title: data.post.name,
                artist: data.post.artist,
                duration: data.post.duration,
                thumbnail: data.post.thumbnail,
                download_url: data.downloadLink,
                status: true
            };
        }
        return { status: false, error: "No download link found" };
    } catch (error) {
        return { status: false, error: error.message };
    }
}

module.exports = downloadSpotify;