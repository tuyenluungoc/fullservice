let musics = JSON.parse(localStorage.getItem("musics")) || [];

function save() {
  localStorage.setItem("musics", JSON.stringify(musics));
}

function render() {
  const list = document.getElementById("musicList");
  list.innerHTML = "";

  musics.forEach((m, index) => {
    list.innerHTML += `
      <div class="card">
        <p>${m.name}</p>
        <button onclick="playMusic('${m.link}')">Play</button>
        <button onclick="deleteMusic(${index})">Xoá</button>
      </div>
    `;
  });
}

function addMusic() {
  const name = document.getElementById("musicName").value;
  const link = document.getElementById("musicLink").value;

  musics.push({ name, link });
  save();
  render();
}

function deleteMusic(index) {
  musics.splice(index, 1);
  save();
  render();
}

function playMusic(link) {
  const player = document.getElementById("player");

  const videoId = link.split("v=")[1];

  player.innerHTML = `
    <iframe width="300" height="200"
      src="https://www.youtube.com/embed/${videoId}"
      frameborder="0" allowfullscreen>
    </iframe>
  `;
}

render();