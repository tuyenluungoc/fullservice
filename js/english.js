let words = JSON.parse(localStorage.getItem("words")) || [];
let answers = JSON.parse(localStorage.getItem("answers")) || [];
let searchText = "";

const questions = [
  "Do you like pets?",
  "What is your favorite room?",
  "Do you enjoy studying English?",
  "What do you do in your free time?",
  "Describe your best friend."
];

/* SAVE */
function save() {
  localStorage.setItem("words", JSON.stringify(words));
}

function saveAnswers() {
  localStorage.setItem("answers", JSON.stringify(answers));
}

/* SEARCH */
function searchWord(text){
  searchText = text.toLowerCase();
  render();
}

/* RENDER */
function render() {
  const list = document.getElementById("wordList");
  list.innerHTML = "";

  const filtered = words.filter(w =>
    w.word.toLowerCase().includes(searchText)
  );

  filtered.forEach((w, index) => {
    list.innerHTML += `
      <div class="card">
        <h3>📖 ${w.word}</h3>
        <p>👉 ${w.meaning}</p>
        <p><i>"${w.example}"</i></p>
        <small>🕒 ${w.time || ""}</small>

        <div class="card-actions">
          <button class="edit-btn" onclick="editWord(${index})">✏️</button>
          <button class="delete-btn" onclick="deleteWord(${index})">🗑</button>
        </div>
      </div>
    `;
  });
}

/* ADD */
function addWord() {
  const word = document.getElementById("word").value.trim();
  const meaning = document.getElementById("meaning").value.trim();
  const example = document.getElementById("example").value.trim();

  if(!word || !meaning){
    alert("Nhập đầy đủ từ và nghĩa!");
    return;
  }

  words.push({
    word,
    meaning,
    example,
    time: new Date().toLocaleDateString()
  });

  clearInput();
  save();
  render();
}

/* CLEAR */
function clearInput(){
  document.getElementById("word").value = "";
  document.getElementById("meaning").value = "";
  document.getElementById("example").value = "";
}

/* DELETE */
function deleteWord(index) {
  words.splice(index, 1);
  save();
  render();
}

/* EDIT */
function editWord(index){
  const w = words[index];

  document.getElementById("word").value = w.word;
  document.getElementById("meaning").value = w.meaning;
  document.getElementById("example").value = w.example;

  deleteWord(index);
}

/* RANDOM QUESTION */
function randomQuestion() {
  const q = questions[Math.floor(Math.random() * questions.length)];
  document.getElementById("question").innerText = q;
}

/* COPY QUESTION */
function copyQuestion(){
  const text = document.getElementById("question").innerText;
  navigator.clipboard.writeText(text);
  alert("Đã copy!");
}

/* SAVE ANSWER */
function saveAnswer(){
  const text = document.getElementById("answerBox").value;

  if(!text) return;

  answers.push({
    question: document.getElementById("question").innerText,
    answer: text
  });

  saveAnswers();
  document.getElementById("answerBox").value = "";
  alert("Đã lưu câu trả lời!");
}

/* INIT */
render();