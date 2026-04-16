let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
let currentIndex = 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;
let media = null;
let searchText = "";

/* SAVE */
function save() {
  localStorage.setItem("playlist", JSON.stringify(playlist));
}

/* SEARCH */
function searchTrack(text){
  searchText = text.toLowerCase();
  render();
}

/* ADD YOUTUBE */
function addYoutube(){
  const input = document.getElementById("youtubeLink");
  const link = input.value.trim();
  if(!link) return;

  playlist.push({
    name: "YouTube Video",
    src: link,
    type: "youtube"
  });

  input.value = "";
  save();
  render();
}

/* GET YOUTUBE ID */
function getYoutubeId(url){
  const reg = /(?:v=|youtu\.be\/)([^&]+)/;
  const match = url.match(reg);
  return match ? match[1] : null;
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
      <div class="track">
        <span onclick="selectTrack(${realIndex})"
          style="cursor:pointer;
          ${currentIndex === realIndex ? 'color:red;font-weight:bold' : ''}">
          ${t.name}
        </span>
        <button onclick="deleteTrack(${realIndex})">❌</button>
      </div>
    `;
  });
}

/* UPLOAD AUDIO */
function uploadAudio() {
  const input = document.getElementById("audioInput");
  const file = input.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = e => {
    playlist.push({
      name: file.name,
      src: e.target.result,
      type: "audio"
    });
    save();
    render();
  };

  reader.readAsDataURL(file);
}

/* UPLOAD VIDEO */
function uploadVideo() {
  const input = document.getElementById("videoInput");
  const file = input.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  playlist.push({
    name: file.name,
    src: url,
    type: "video"
  });

  save(); // FIX mất dữ liệu
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

  if(t.type==="audio"){
    player.innerHTML=`<audio id="media" src="${t.src}" autoplay></audio>`;
  }
  else if(t.type==="video"){
    player.innerHTML=`<video id="media" src="${t.src}" controls autoplay></video>`;
  }
  else if(t.type==="youtube"){
    const id = getYoutubeId(t.src);
    if(!id){
      alert("Link YouTube không hợp lệ");
      return;
    }

    player.innerHTML = `
      <iframe width="100%" height="200"
      src="https://www.youtube.com/embed/${id}?autoplay=1"
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

  isPlaying = true;
}

/* DELETE */
function deleteTrack(index){
  playlist.splice(index,1);
  save();
  render();
}

/* PLAY/PAUSE */
function togglePlay(){
  if(!media) return;

  if(isPlaying){
    media.pause();
  }else{
    media.play();
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
  alert("Shuffle: "+shuffle);
}

/* REPEAT */
function toggleRepeat(){
  repeat=!repeat;
  alert("Repeat: "+repeat);
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
const progress = document.getElementById("progress");

function updateProgress(){
  if(!media || !media.duration) return;
  progress.value = (media.currentTime / media.duration) * 100;
}

progress.oninput = () => {
  if(media && media.duration){
    media.currentTime = (progress.value/100)*media.duration;
  }
};

/* VOLUME */
const volume = document.getElementById("volume");
volume.value = 1;

volume.oninput = () => {
  if(media) media.volume = volume.value;
};

/* MINI PLAYER */
function toggleMini(){
  const app = document.querySelector(".music-app");
  app.style.display = app.style.display==="none"?"block":"none";
}

/* INIT */
render();