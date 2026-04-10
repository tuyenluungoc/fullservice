let customers = JSON.parse(localStorage.getItem("customers")) || [];
let currentFilter = "all";

function save() {
  localStorage.setItem("customers", JSON.stringify(customers));
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let filtered = customers;

  if (currentFilter !== "all") {
    filtered = customers.filter(c => c.status === currentFilter);
  }

  filtered.forEach((c, index) => {
    list.innerHTML += `
      <div class="card">
        <h3>${c.name}</h3>
        <p>📞 ${c.phone}</p>
        <p>📌 ${getStatusText(c.status)}</p>
        <p>📝 ${c.note}</p>

        <button onclick="deleteCustomer(${index})">Xoá</button>
      </div>
    `;
  });
}

function getStatusText(status) {
  if (status === "new") return "Chưa gọi";
  if (status === "called") return "Đã gọi";
  return "Tiềm năng";
}

function addCustomer() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const status = document.getElementById("status").value;
  const note = document.getElementById("note").value;

  customers.push({ name, phone, status, note });
  save();
  render();
}

function deleteCustomer(index) {
  customers.splice(index, 1);
  save();
  render();
}

function filterStatus(value) {
  currentFilter = value;
  render();
}

render();