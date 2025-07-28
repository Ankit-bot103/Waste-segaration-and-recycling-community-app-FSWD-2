const API = "http://localhost:5000/api";
let currentUserEmail = "";
let totalPoints = 0;

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });

  if (res.ok) {
    currentUserEmail = email;
    document.getElementById("report-section").style.display = "block";
    document.getElementById("recycle-section").style.display = "block";
    loadUserPoints();
  } else {
    alert("Registration failed");
  }
}

async function report() {
  const name = document.getElementById("reportName").value;
  const wasteType = document.getElementById("wasteType").value;
  const description = document.getElementById("description").value;
  await fetch(`${API}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, wasteType, description })
  });
  alert("Report submitted");
}

async function loadReports() {
  const data = await (await fetch(`${API}/load-reports`)).json();
  document.getElementById("reports").innerHTML =
    data.map(r => `<p>${r.name} - ${r.wasteType}: ${r.description}</p>`).join("");
}

async function submitRecycle() {
  const type = document.getElementById("recycleType").value;
  const quantity = parseInt(document.getElementById("recycleQuantity").value);

  if (!type || quantity <= 0) {
    alert("Invalid input");
    return;
  }

  const res = await fetch(`${API}/recycle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userEmail: currentUserEmail, type, quantity })
  });

  if (res.ok) {
    const data = await res.json();
    totalPoints = data.newPoints;
    document.getElementById("points").innerText = totalPoints;
    loadRecycleList();
  } else {
    alert("Recycle failed");
  }
}

async function loadRecycleList() {
  const data = await (await fetch(`${API}/recycle-list`)).json();
  document.getElementById("recycle-list").innerHTML =
    data.map(i => `<p>${i.quantity} x ${i.type}</p>`).join("");
}

async function loadUserPoints() {
  const res = await fetch(`${API}/user-points/${currentUserEmail}`);
  const data = await res.json();
  document.getElementById("points").innerText = data.points;
}

async function findCenters() {
  const data = await (await fetch(`${API}/centers`)).json();
  document.getElementById("centers").innerHTML =
    data.map(c => `<p>${c.name} - ${c.distance} km</p>`).join("");
}
