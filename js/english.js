let words = JSON.parse(localStorage.getItem("words")) || [];

const questions = [
  "Do you like pets?",
  "What is your favorite room?",
  "Do you enjoy studying English?",
  "What do you do in your free time?",
  "Describe your best friend."
];

function save() {
  localStorage.setItem("words", JSON.stringify(words));
}

function render() {
  const list = document.getElementById("wordList");
  list.innerHTML = "";

  words.forEach((w, index) => {
    list.innerHTML += `
      <div class="card">
        <h3>${w.word}</h3>
        <p>${w.meaning}</p>
        <p><i>${w.example}</i></p>
        <button onclick="deleteWord(${index})">Xoá</button>
      </div>
    `;
  });
}

function addWord() {
  const word = document.getElementById("word").value;
  const meaning = document.getElementById("meaning").value;
  const example = document.getElementById("example").value;

  words.push({ word, meaning, example });
  save();
  render();
}

function deleteWord(index) {
  words.splice(index, 1);
  save();
  render();
}

function randomQuestion() {
  const q = questions[Math.floor(Math.random() * questions.length)];
  document.getElementById("question").innerText = q;
}

render();