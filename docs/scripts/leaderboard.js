let leaderboards = {
  darts: [],
  chess: [],
};

async function addScore(section, name, points) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/leaderboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      section,
      name,
      points,
    }),
  });

  if (res.ok) {
    loadLeaderboard(section);
  } else {
    alert("Failed to add score");
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
