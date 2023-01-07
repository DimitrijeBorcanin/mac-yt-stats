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
        likes: data["items"][0]["statistics"]["likeCount"],
        views: data["items"][0]["statistics"]["viewCount"]
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

    for(let i = 0; i < videos.length; i++){
        let up = null
        let down = null
        if(videos[i-1]){
            up = videos[i-1]["likes"] - videos[i]["likes"]
        }
        if(videos[i+1]){
            down = videos[i]["likes"] - videos[i+1]["likes"]
        }
        const difference = {
            up,
            down
        }
        videos[i]['difference'] = difference
    }

    const renderedList = videos.map((video, index) => {
        if(video.title.includes("Lift")){
            return `<li class="text-blue-500 font-bold">
                        ${index + 1}. ${video.title} - ${video.likes} 
                        <span class="text-red-500 pl-2 ${video.difference.up ? '' : 'hidden'}"><i class="fa-solid fa-caret-down"></i> ${video.difference.up}</span> 
                        <span class="text-green-500 pl-2 ${video.difference.down ? '' : 'hidden'}"><i class="fa-solid fa-caret-up"></i> ${video.difference.down}</span>
                        <span class="text-sm pl-2">(${video.views} pregleda)</span>
                    </li>`
        }
        return `<li>${index + 1}. ${video.title} - ${video.likes} <span class="text-sm">(${video.views} pregleda)</span></li>`
    }).join("")

    document.getElementById("list").innerHTML = renderedList;
    loadingDiv.style.display = "none"

    if(videos[0]["title"].includes("Lift")){
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti()
    }

}