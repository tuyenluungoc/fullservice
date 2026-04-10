let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
let currentIndex = 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;

let media = null;

function save() {
  localStorage.setItem("playlist", JSON.stringify(playlist));
}

function render() {
  const list = document.getElementById("playlist");
  list.innerHTML = "";

  playlist.forEach((t, i) => {
    list.innerHTML += `
      <div class="track ${i===currentIndex?"active":""}" onclick="selectTrack(${i})">
        ${t.name}
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
  const reader = new FileReader();

  reader.onload = e => {
    playlist.push({name:file.name,src:e.target.result,type:"video"});
    save(); render();
  };

  reader.readAsDataURL(file);
}

function selectTrack(i){
  currentIndex=i;
  play();
}

function play(){
  const t = playlist[currentIndex];
  const player = document.getElementById("player");

  document.getElementById("nowPlaying").innerText = t.name;
  document.getElementById("miniTitle").innerText = t.name;

  if(t.type==="audio"){
    player.innerHTML=`<audio id="media" src="${t.src}"></audio>`;
  }else{
    player.innerHTML=`<video id="media" src="${t.src}" width="100%"></video>`;
  }

  media = document.getElementById("media");

  media.play();
  isPlaying=true;

  media.ontimeupdate = updateProgress;
  media.onended = handleEnd;

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