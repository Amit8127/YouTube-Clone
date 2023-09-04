const apiKey = "AIzaSyCtTIBP0Jv-UlRfnu_Y9_Ia5IXD6rlriXI";
const baseUrl = "https://www.googleapis.com/youtube/v3";
const commentContainer = document.getElementById("commentContainer");

window.addEventListener("load", () => {
  let videoId = document.cookie.split("=")[1];
  if (YT) {
    new YT.Player("videoPlayer", {
      height: "100%",
      width: "100%",
      videoId: videoId,
    });

    loadComments(videoId);
  }
});

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

async function loadComments(videoId) {
  console.log(videoId);
  let endpoint = `${baseUrl}/commentThreads?key=${apiKey}&videoId=${videoId}&maxResults=10&part=snippet`;

  const response = await fetch(endpoint);
  const result = await response.json();

  result.items.forEach((item) => {
    const repliesCount = item.snippet.totalReplyCount;
    const {
      authorDisplayName,
      textDisplay,
      likeCount,
      authorProfileImageUrl: profileUrl,
      publishedAt,
    } = item.snippet.topLevelComment.snippet;

    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <img src="${profileUrl}" class="author-profile" alt="author profile" />
      <div class="co-div"><b>${authorDisplayName} <span>${calculateTheTimeGap(publishedAt)}</span></b>
      <p>${textDisplay}</p>
      <div class="co-div-l">
      <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 13 12" fill="none">
      <path d="M10.5133 5.33335H7.69333L8.70667 2.04002C8.92 1.35335 8.36 0.666687 7.58667 0.666687C7.2 0.666687 6.82667 0.826687 6.57333 1.10002L2.66667 5.33335H0V12H2.66667H3.33333H9.62C10.3267 12 10.94 11.5534 11.08 10.9267L11.9733 6.92669C12.1533 6.10002 11.4533 5.33335 10.5133 5.33335ZM2.66667 11.3334H0.666667V6.00002H2.66667V11.3334ZM11.32 6.78002L10.4267 10.78C10.36 11.1 10.02 11.3334 9.62 11.3334H3.33333V5.59335L7.06667 1.55335C7.19333 1.41335 7.38667 1.33335 7.58667 1.33335C7.76 1.33335 7.92 1.40669 8.00667 1.53335C8.05333 1.60002 8.10667 1.70669 8.06667 1.84669L7.05333 5.14002L6.78667 6.00002H7.68667H10.5067C10.78 6.00002 11.04 6.11335 11.1933 6.30669C11.28 6.40669 11.3667 6.57335 11.32 6.78002Z" fill="white"/>
    </svg> ${likeCount}</p>
      <p><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 13 12" fill="none">
      <path d="M10.3335 0.666687H9.66687H3.38021C2.66687 0.666687 2.06021 1.11335 1.92021 1.74002L1.02687 5.74002C0.846875 6.56669 1.54687 7.33335 2.48687 7.33335H5.30688L4.29354 10.6267C4.08021 11.3134 4.64021 12 5.41354 12C5.80021 12 6.17354 11.84 6.42688 11.5667L10.3335 7.33335H13.0002V0.666687H10.3335ZM5.93354 11.1134C5.80687 11.2534 5.61354 11.3334 5.41354 11.3334C5.24021 11.3334 5.08021 11.26 4.99354 11.1334C4.94687 11.0667 4.89354 10.96 4.93354 10.82L5.94688 7.52669L6.21354 6.66669H5.30688H2.48687C2.21354 6.66669 1.95354 6.55335 1.80021 6.36002C1.72021 6.26002 1.63354 6.09335 1.68021 5.88002L2.57354 1.88002C2.64021 1.56669 2.98021 1.33335 3.38021 1.33335H9.66687V7.07335L5.93354 11.1134ZM12.3335 6.66669H10.3335V1.33335H12.3335V6.66669Z" fill="white"/>
    </svg></div></p>
      </div>`;

    commentContainer.appendChild(div);
  });
}
