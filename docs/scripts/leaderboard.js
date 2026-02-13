window.onload = function () {
  loadLeaderboard("darts");
  loadLeaderboard("chess");

  startAutoRefresh("darts");
  startAutoRefresh("chess");
};

function startAutoRefresh(section) {
  setInterval(() => {
    loadLeaderboard(section);
  }, 3000); // refresh every 3 seconds
}

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
  try {
    const res = await fetch(`${API_BASE}/leaderboard/${section}`);

    if (!res.ok) {
      console.error("Failed:", res.status);
      return;
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Leaderboard response is not an array:", data);
      return;
    }

    const tbody = document.getElementById(`${section}-body`);
    if (!tbody) {
      console.error("Table body not found for section:", section);
      return;
    }

    tbody.innerHTML = "";

    data.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.rank}</td>
        <td>${entry.name}</td>
        <td>${entry.points}</td>
        <button onclick = "deleteScore(${entry.id})">Delete</button>
        <button onclick = "editScore(${entry.id})">Edit</button>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading leaderboard:", err);
  }
}

async function deleteScore(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in first!");
    return;
  }

  const res = await fetch(`${API_BASE}/admin/leaderboard/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    console.log("Score deleted successfully!");
    loadLeaderboard("darts");
    loadLeaderboard("chess");
  } else {
    const data = await res.json();
    alert("Failed to delete score:", data.error || res.StatusText);
  }
}

async function editScore(id) {
  const name = prompt("New name?");
  const points = prompt("New amount of points?");
  if (!name && !points) return;

  const token = localStorage.getItem("token");

  const newScore = {
    name,
    points,
  };

  const res = await fetch(`${API_BASE}/admin/leaderboard/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newScore),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Score updated!");
    loadLeaderboard("darts");
    loadLeaderboard("chess");
  } else {
    alert(data.error || "Failed to update score");
  }
}
