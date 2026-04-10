let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
let currentIndex = 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;

let media = null;

function save() {
  localStorage.setItem("playlist", JSON.stringify(playlist));
}
let searchText = "";

function searchTrack(text){
  searchText = text.toLowerCase();
  render();
}
function addYoutube(){
  const link = document.getElementById("youtubeLink").value;

  if(!link) return;

  playlist.push({
    name: "YouTube Video",
    src: link,
    type: "youtube"
  });

  save();
  render();
}
function render() {
  const list = document.getElementById("playlist");
  list.innerHTML = "";

  const filtered = playlist.filter(t =>
    t.name.toLowerCase().includes(searchText)
  );

  filtered.forEach((t, i) => {
    list.innerHTML += `
      <div class="track">
        <span onclick="selectTrack(${i})">${t.name}</span>
        <button onclick="deleteTrack(${i})">❌</button>
      </div>
    `;
  });
}

function uploadAudio() {
  const file = audioInput.files[0];
  const reader = new FileReader();

  reader.onload = e => {
    playlist.push({name:file.name,src:e.target.result,type:"audio"});
    save(); render();
  };

  reader.readAsDataURL(file);
}

function uploadVideo() {
  const file = videoInput.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  playlist.push({
    name: file.name,
    src: url,
    type: "video"
  });

  render(); // không save!
}

function selectTrack(i){
  currentIndex=i;
  play();
}

function play(){
  const t = playlist[currentIndex];
  const player = document.getElementById("player");

  document.getElementById("nowPlaying").innerText = t.name;

  if(t.type==="audio"){
    player.innerHTML=`<audio id="media" src="${t.src}"></audio>`;
  }
  else if(t.type==="video"){
    player.innerHTML=`<video id="media" src="${t.src}" controls></video>`;
  }
  else if(t.type==="youtube"){
    const id = t.src.split("v=")[1];
    player.innerHTML = `
      <iframe width="100%" height="200"
      src="https://www.youtube.com/embed/${id}"
      allowfullscreen></iframe>
    `;
    return;
  }

  media = document.getElementById("media");
  media.play();

  media.ontimeupdate = updateProgress;
  media.onended = handleEnd;
}
function deleteTrack(index){
  playlist.splice(index,1);
  save();
  render();
}
function togglePlay(){
  if(!media) return;
  if(isPlaying){
    media.pause();
  }else{
    media.play();
  }
  isPlaying=!isPlaying;
}

function next(){
  if(shuffle){
    currentIndex = Math.floor(Math.random()*playlist.length);
  }else{
    currentIndex = (currentIndex+1)%playlist.length;
  }
  play();
}

function prev(){
  currentIndex = (currentIndex-1+playlist.length)%playlist.length;
  play();
}

function toggleShuffle(){
  shuffle=!shuffle;
  alert("Shuffle: "+shuffle);
}

function toggleRepeat(){
  repeat=!repeat;
  alert("Repeat: "+repeat);
}

function handleEnd(){
  if(repeat){
    play();
  }else{
    next();
  }
}

/* progress */
const progress = document.getElementById("progress");

function updateProgress(){
  progress.value = (media.currentTime / media.duration) * 100 || 0;
}

progress.oninput = () => {
  media.currentTime = (progress.value/100)*media.duration;
};

/* volume */
const volume = document.getElementById("volume");
volume.value = 1;

volume.oninput = () => {
  if(media) media.volume = volume.value;
};

/* mini player */
function toggleMini(){
  const app = document.querySelector(".music-app");
  app.style.display = app.style.display==="none"?"block":"none";
}

render();