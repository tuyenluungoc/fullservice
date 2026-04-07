let customers = JSON.parse(localStorage.getItem("customers")) || [];

function save() {
  localStorage.setItem("customers", JSON.stringify(customers));
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  customers.forEach((c, index) => {
    list.innerHTML += `
      <li>
        ${c.name} - ${c.phone}
        <button onclick="deleteCustomer(${index})">X</button>
      </li>
    `;
  });
}

function addCustomer() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  customers.push({ name, phone });
  save();
  render();
}

function deleteCustomer(index) {
  customers.splice(index, 1);
  save();
  render();
}

render();