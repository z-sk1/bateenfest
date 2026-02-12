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
  localStorage.setItem(`leaderboard-${section}`, leaderboards);

  displayScores(scores);

  nameInput.value = "";
  pointsInput.value = "";
}

function displayScores(section) {
  const list = document.getElementById(`${section}-list`);
  list.innerHTML = "";

  const saved = localStorage.getItem(`leaderboard-${section}`);

  saved.forEach((player, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} ${player.name} - ${player.points}`;
    list.appendChild(li);
  });
}
