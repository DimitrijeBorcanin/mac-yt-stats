const API_KEY = "AIzaSyDdQPb4VT03VcCs06jOv1vQDHlAjxXqsGg"
const PLAYLIST_ID = "PLr8USux2IpVgVJtSF8Cxg7cND_qCia9In"

const getPlaylistData = async () => {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=30`
    const response = await fetch(url)
    const data = await response.json()
    const videoListIds = []
    for(const item of data["items"]){
        if(!item["snippet"]["title"].includes("Gorki list")){
            videoListIds.push(item["snippet"]["resourceId"]["videoId"])
        }
    }
    return videoListIds
}

const getVideoData = async (videoId) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=AIzaSyDdQPb4VT03VcCs06jOv1vQDHlAjxXqsGg`
    const response = await fetch(url)
    const data = await response.json()
    videoData = {
        title: data["items"][0]["snippet"]["title"].replace(" /ROCK NUMERA #MAC2023Nominee", ""),
        likes: data["items"][0]["statistics"]["likeCount"]
    }
    return videoData
}

window.onload = async () => {

    const loadingDiv = document.getElementById("loading")
    loadingDiv.style.display = "flex"

    const videoIdList = await getPlaylistData()

    const videos = []
    for(const videoId of videoIdList){
        videos.push(await getVideoData(videoId))
    }
    videos.sort((a, b) => b.likes - a.likes)

    const renderedList = videos.map((video, index) => {
        if(video.title.includes("Lift")){
            return `<li class="text-blue-500 font-bold">${index + 1}. ${video.title} - ${video.likes}</li>`
        }
        return `<li>${index + 1}. ${video.title} - ${video.likes}</li>`
    }).join("")

    document.getElementById("list").innerHTML = renderedList;
    loadingDiv.style.display = "none"

}