let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
let currentIndex = 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;
let media = null;
let searchText = "";

let progress, volume;

/* SAVE (chỉ dùng cho YouTube) */
function save() {
  try {
    localStorage.setItem("playlist", JSON.stringify(playlist));
  } catch (e) {
    console.warn("localStorage full, không thể lưu thêm");
  }
}

/* SEARCH */
function searchTrack(text){
  searchText = text.toLowerCase();
  render();
}

/* YOUTUBE */
function addYoutube(){
  const input = document.getElementById("youtubeLink");
  const link = input.value.trim();
  if(!link) return;

  const id = getYoutubeId(link);
  if(!id){
    alert("Link YouTube không hợp lệ");
    return;
  }

  playlist.push({
    name: "YouTube: " + id,
    src: link,
    type: "youtube"
  });

  input.value = "";
  save();
  render();
}

/* GET YOUTUBE ID (xịn hơn) */
function getYoutubeId(url){
  try{
    const u = new URL(url);

    if(u.hostname.includes("youtu.be")){
      return u.pathname.slice(1);
    }

    return u.searchParams.get("v");
  }catch{
    return null;
  }
}

/* RENDER */
function render() {
  const list = document.getElementById("playlist");
  list.innerHTML = "";

  const filtered = playlist.filter(t =>
    t.name.toLowerCase().includes(searchText)
  );

  filtered.forEach((t) => {
    const realIndex = playlist.indexOf(t);

    list.innerHTML += `
      <div class="track ${currentIndex === realIndex ? "active" : ""}">
        <span onclick="selectTrack(${realIndex})">
          ${t.name}
        </span>
        <button onclick="deleteTrack(${realIndex})">❌</button>
      </div>
    `;
  });
}

/* UPLOAD AUDIO (KHÔNG dùng base64 nữa) */
function uploadAudio() {
  const file = document.getElementById("audioInput").files[0];
  if(!file) return;

  const url = URL.createObjectURL(file);

  playlist.push({
    name: file.name,
    src: url,
    type: "audio"
  });

  render();
}

/* UPLOAD VIDEO */
function uploadVideo() {
  const file = document.getElementById("videoInput").files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  playlist.push({
    name: file.name,
    src: url,
    type: "video"
  });

  render();
}

/* SELECT */
function selectTrack(i){
  currentIndex = i;
  play();
}

/* PLAY */
function play(){
  const t = playlist[currentIndex];
  if(!t) return;

  const player = document.getElementById("player");

  document.getElementById("nowPlaying").innerText = t.name;
  document.getElementById("miniTitle").innerText = t.name;

  player.innerHTML = ""; // reset

  if(t.type==="audio"){
    player.innerHTML=`<audio id="media" src="${t.src}"></audio>`;
  }
  else if(t.type==="video"){
    player.innerHTML=`<video id="media" src="${t.src}" controls></video>`;
  }
  else if(t.type==="youtube"){
    const id = getYoutubeId(t.src);
    if(!id){
      alert("Link YouTube không hợp lệ");
      return;
    }

    player.innerHTML = `
      <iframe width="100%" height="220"
      src="https://www.youtube.com/embed/${id}?autoplay=1"
      allow="autoplay"
      allowfullscreen></iframe>
    `;

    isPlaying = true;
    return;
  }

  media = document.getElementById("media");

  media.onloadedmetadata = () => {
    progress.value = 0;
  };

  media.ontimeupdate = updateProgress;
  media.onended = handleEnd;

  media.volume = volume.value;

  // fix lỗi promise
  media.play().catch(err => {
    console.log("Play bị chặn:", err);
  });

  isPlaying = true;
}

/* DELETE */
function deleteTrack(index){
  if(index === currentIndex){
    media?.pause();
  }

  playlist.splice(index,1);

  if(currentIndex >= playlist.length){
    currentIndex = 0;
  }

  save();
  render();
}

/* PLAY/PAUSE */
function togglePlay(){
  if(!media) return;

  if(isPlaying){
    media.pause();
  }else{
    media.play().catch(()=>{});
  }

  isPlaying = !isPlaying;
}

/* NEXT */
function next(){
  if(playlist.length === 0) return;

  if(shuffle){
    currentIndex = Math.floor(Math.random()*playlist.length);
  }else{
    currentIndex = (currentIndex+1)%playlist.length;
  }

  play();
}

/* PREV */
function prev(){
  if(playlist.length === 0) return;

  currentIndex = (currentIndex-1+playlist.length)%playlist.length;
  play();
}

/* SHUFFLE */
function toggleShuffle(){
  shuffle=!shuffle;
  alert("Shuffle: "+(shuffle ? "ON" : "OFF"));
}

/* REPEAT */
function toggleRepeat(){
  repeat=!repeat;
  alert("Repeat: "+(repeat ? "ON" : "OFF"));
}

/* END */
function handleEnd(){
  if(repeat){
    play();
  }else{
    next();
  }
}

/* PROGRESS */
function updateProgress(){
  if(!media || !media.duration) return;
  progress.value = (media.currentTime / media.duration) * 100;
}

/* MINI PLAYER */
function toggleMini(){
  const app = document.querySelector(".music-app");
  app.style.display = app.style.display==="none"?"block":"none";
}

/* INIT */
window.onload = () => {
  progress = document.getElementById("progress");
  volume = document.getElementById("volume");

  volume.value = 1;

  progress.oninput = () => {
    if(media && media.duration){
      media.currentTime = (progress.value/100)*media.duration;
    }
  };

  volume.oninput = () => {
    if(media) media.volume = volume.value;
  };

  render();

  if(playlist.length > 0){
    play();
  }
};