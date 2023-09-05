const apiKey = "AIzaSyAA_pLBId-4ZtwfWNShpPC5DsFuQna38IA";
// const apiKey = "AIzaSyCtTIBP0Jv-UlRfnu_Y9_Ia5IXD6rlriXI";
const baseUrl = "https://www.googleapis.com/youtube/v3";

const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const container = document.getElementById("container");

function calculateTheTimeGap(publishTime) {
  let publishDate = new Date(publishTime);
  let currentDate = new Date();

  let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;

  const secondsPerDay = 24 * 60 * 60;
  const secondsPerWeek = 7 * secondsPerDay;
  const secondsPerMonth = 30 * secondsPerDay;
  const secondsPerYear = 365 * secondsPerDay;

  if (secondsGap > secondsPerMonth * 12) {
    return `${Math.ceil(secondsGap / secondsPerYear)-1} years ago`;
  }
  if (secondsGap > secondsPerMonth) {
    return `${Math.ceil(secondsGap / secondsPerMonth)-1} months ago`;
  }
  if (secondsGap > secondsPerWeek) {
    return `${Math.ceil(secondsGap / secondsPerWeek)-1} weeks ago`;
  }
  if (secondsGap > secondsPerDay) {
    return `${Math.ceil(secondsGap / (24 * 60 * 60))-1} Days ago`;
  } else return `${Math.ceil(secondsGap / (60 * 60))-1} hrs ago`;
}

function goToVideoDetails(videoId) {
  document.cookie = `id=${videoId}; path=/play.html`;
  setTimeout(() => {
    window.location.href = "play.html";
  });
}

function calculateTheveiwCount(count) {
  const hajar = 1000;
  const tenLakhs = 1000000;
  if (count <= 1000) {
    return count;
  }
  if (count <= tenLakhs) {
    return `${Math.ceil(count / hajar)-1}K views`;
  } else {
    return `${Math.ceil(count / tenLakhs)-1}M views`;
  }
}

function renderVideosOnPage(videosList) {
  container.innerHTML = "";
  videosList.forEach((video) => {
    const videoContainer = document.createElement("div");
    videoContainer.className = "video-card";
    videoContainer.innerHTML = `
    <div class="img">
      <img src="${video.snippet.thumbnails.high.url}"alt="Thumbnail"/>
    </div>
    <div class="channel">
      <img src="${video.channelLogo}" alt="cLogo"/>
        <div class="chDsc">
            <p id="title">${video.snippet.title}</p>
            <p>${video.snippet.channelTitle}</p>
            <div class="chDsc-info">
                <p>${calculateTheveiwCount(video.statistics.viewCount)}</p>
                <span class="dot">&#9679;</span>
                <p>${calculateTheTimeGap(video.snippet.publishTime)}</p>
            </div>
        </div>
    </div>
  `;

  videoContainer.addEventListener("click", () => {
    goToVideoDetails(video.id.videoId);
  })
    container.appendChild(videoContainer);
  });
}

async function fetchChannelLogo(channelId) {
  const endpoint = `${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`;

  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    return result.items[0].snippet.thumbnails.high.url;
  } catch (error) {
    alert("Failed to load channel logo for ", channelId);
  }
}
/**
 * this will take videoId and returns the statics of the video.
 */
async function getVideoStatistics(videoId) {
  const endpoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    return result.items[0].statistics;
  } catch (error) {
    alert("Failed to fetch Statistics for ", videoId);
  }
}

async function fetchSearchResults(searchInput) {
  const endPoint = `${baseUrl}/search?key=${apiKey}&q=${searchInput}&part=snippet&maxResults=5`;

  try {
    const responce = await fetch(endPoint);
    const result = await responce.json();

    for (let i = 0; i < result.items.length; i++) {
      let videoId = result.items[i].id.videoId;
      let channelId = result.items[i].snippet.channelId;

      let statistics = await getVideoStatistics(videoId);
      let channelLogo = await fetchChannelLogo(channelId);

      result.items[i].statistics = statistics;
      result.items[i].channelLogo = channelLogo;
    }

    renderVideosOnPage(result.items);
  } catch (e) {
    alert("custom" + e);
  }
}

// click event listener
searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value;
  fetchSearchResults(searchValue);
});

window.addEventListener("load", () => {
  fetchSearchResults("");
});