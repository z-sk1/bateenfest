let leaderboards = {
  darts: [],
  chess: [],
};

function addScore(section) {
  const nameInput = document.getElementById(`${section}-name`);
  const pointsInput = document.getElementById(`${section}-points`);

  const name = nameInput.value.trim();
  const points = parseInt(pointsInput.value);

  if (!name || isNaN(points)) {
    alert("Please enter valid name and points");
    return;
  }

  leaderboards[section].push({ name, points });
  leaderboards[section].sort((a, b) => b.points - a.points);
  localStorage.setItem(
    `leaderboard-${section}`,
    JSON.stringify(leaderboards[section]),
  );

  displayScores(section);

  nameInput.value = "";
  pointsInput.value = "";
}

function displayScores(section) {
  const body = document.getElementById(`${section}-body`);
  body.innerHTML = "";

  const saved = localStorage.getItem(`leaderboard-${section}`);
  if (!saved) return;

  const players = JSON.parse(saved);

  players.forEach((player, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${i + 1}</td>
              <td>${player.name}</td>
              <td>${player.points}</td>
            `;
    if (i === 0) row.style.backgroundColor = "gold";
    if (i === 1) row.style.backgroundColor = "silver";
    if (i === 2) row.style.backgroundColor = "#cd7f32"; // bronze
    body.append(row);
  });
}
