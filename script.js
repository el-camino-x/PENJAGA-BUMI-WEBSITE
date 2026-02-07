const PASSWORD = "156156";
const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");

if (loginBtn && passwordInput && errorMsg) {
  loginBtn.addEventListener("click", () => {
    const enteredPassword = passwordInput.value.trim();
    if (enteredPassword === PASSWORD) {
      window.location.href = "homes.html";
    } else {
      errorMsg.textContent = "Password salah!";
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener("keypress", e => {
    if (e.key === "Enter") loginBtn.click();
  });
}

function highlightWinner(cell, winner) {
  cell.style.color = "";
  cell.classList.remove("playing-blink");

  if (winner === "BOOKED") {
    cell.style.color = "yellow";
  } else if (winner === "DRAW") {
    cell.style.color = "#999";
  } else if (winner === "PLAYING") {
    cell.classList.add("playing-blink");
  } else if (winner) {
    cell.style.color = "#28a745";
  }
}

const matchesTableBody = document.querySelector("#matches-table tbody");
const ligaSelect = document.getElementById("liga-select");

const matchesCSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7c6Nn46_FqX3jOIJW5JIfwOwn6d8IoJczjSDjcgiyEKVaVpQttgNO54_RDJQblo0SRfB8Ksafs4Ab/pub?gid=1735155149&single=true&output=csv";

if (matchesTableBody && ligaSelect) {
  Papa.parse(matchesCSV, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: results => {
      const data = results.data;
      const ligaSet = new Set();
      matchesTableBody.innerHTML = "";

      data.forEach(row => {
        const liga = row.LIGA || "";
        const date = row.DATE || "";
        const player1 = row.PLAYER || "";
        const logo1 = row.TEAM || "";
        const home = row.HOME || "";
        const poor = row.POOR || "";
        const away = row.AWAY || "";
        const logo2 = row.LOGO_2 || "";
        const player2 = row.PLAYER_2 || "";
        const realScore = row.REAL_SCORE || "";
        const totalScore = row.TOTAL_SCORE || "";
        const winner = row.WINNER || "";

        const tr = document.createElement("tr");
        tr.dataset.liga = liga;

        tr.innerHTML = `
          <td>${liga}</td>
          <td>${date}</td>
          <td>${player1}</td>
          <td>${logo1 ? `<img src="${logo1}" class="team-logo">` : ""}</td>
          <td>${home}</td>
          <td>${poor}</td>
          <td>${away}</td>
          <td>${logo2 ? `<img src="${logo2}" class="team-logo">` : ""}</td>
          <td>${player2}</td>
          <td>${realScore}</td>
          <td>${totalScore}</td>
          <td class="winner-cell">${winner}</td>
        `;

        matchesTableBody.appendChild(tr);
        ligaSet.add(liga);

        const winnerCell = tr.querySelector(".winner-cell");
        highlightWinner(winnerCell, winner);

        // 🔹 warnain nama tim menang / seri
        if (winner === "DRAW") {
          tr.children[4].style.color = "#777";
          tr.children[6].style.color = "#777";
        } else if (winner === home) {
          tr.children[4].style.color = "#28a745";
        } else if (winner === away) {
          tr.children[6].style.color = "#28a745";
        }
      });

      ligaSelect.innerHTML = `<option value="All">All</option>`;
      Array.from(ligaSet).forEach(liga => {
        const opt = document.createElement("option");
        opt.value = liga;
        opt.textContent = liga;
        ligaSelect.appendChild(opt);
      });

      ligaSelect.addEventListener("change", () => {
        const val = ligaSelect.value;
        document.querySelectorAll("#matches-table tbody tr").forEach(tr => {
          tr.style.display =
            val === "All" || tr.dataset.liga === val ? "" : "none";
        });
      });
    }
  });
}

const leaderboardBody = document.querySelector("#leaderboard-table tbody");
const leaderboardCSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTkFDJVcyrG3EY9rv4jBvQc7JOAHAy9CsCMIFEB0oM1N3Afqi5ZuJCk5TD1hXKkFkMjq4VMEl3gHygg/pub?gid=1213844965&single=true&output=csv";

if (leaderboardBody) {
  Papa.parse(leaderboardCSV, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: results => {
      leaderboardBody.innerHTML = "";
      results.data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.RANK}</td>
          <td>${row.NAMA}</td>
          <td>${row.MATCHES}</td>
          <td>${row.WIN}</td>
          <td>${row.DRAW}</td>
          <td>${row.LOSE}</td>
          <td>${row.POINT}</td>
        `;
        leaderboardBody.appendChild(tr);
      });
    }
  });
}
