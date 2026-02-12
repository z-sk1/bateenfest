let leaderboards = {
  darts: [],
  chess: [],
};

async function addScore(section) {
  const token = localStorage.getItem("token"); // JWT from login

  let nameInput = document.getElementById(`${section}-name`);
  let pointsInput = document.getElementById(`${section}-points`);

  const name = nameInput.value;
  const points = parseInt(pointsInput.value);

  // You can use the username from the logged-in user (stored in localStorage)
  const username = localStorage.getItem("username"); // make sure you save this at login

  if (!token) {
    alert("You must be logged in as admin to add a score!");
    return;
  }

  if (!name || isNaN(points)) {
    alert("Please fill in both name and points!");
    return;
  }

  const res = await fetch(`${API_BASE}/admin/leaderboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      username, // required by backend
      name, // display name
      section, // darts, chess, etc.
      points, // score
    }),
  });

  if (res.ok) {
    loadLeaderboard(section); // refresh the table
  } else {
    const text = await res.text();
    alert("Failed to add score: " + text);
  }
}

async function loadLeaderboard(section) {
  const res = await fetch(`${API_BASE}/leaderboard/${section}`);
  const data = await res.json();

  const tbody = document.getElementById(`${section}-body`);
  tbody.innerHTML = "";

  data.forEach((entry) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${entry.rank}</td>
      <td>${entry.name}</td>
      <td>${entry.points}</td>
    `;

    tbody.appendChild(row);
  });
}
