// ===== LOGIN =====
const PASSWORD = "siaptugas";
const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");

if (loginBtn && passwordInput && errorMsg) {
  loginBtn.addEventListener("click", () => {
    const enteredPassword = passwordInput.value.trim();
    if (enteredPassword === PASSWORD) {
      window.location.href = "home.html";
    } else {
      errorMsg.textContent = "Password salah! Coba lagi.";
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") loginBtn.click();
  });
}

function highlightWinner(cell, winner) {
  cell.style.backgroundColor = 'transparent';
  if (winner === "WAITING") {
    cell.style.color = 'yellow';
  } else if (winner === "DRAW") {
    cell.style.color = '#00bfff';
  } else if (winner) {
    cell.style.color = '#28a745'; 
  } else {
    cell.style.color = '';
  }
}

}

// ===== MATCHES TABLE =====
const matchesTableBody = document.querySelector("#matches-table tbody");
const ligaSelect = document.getElementById("liga-select");
const matchesCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7c6Nn46_FqX3jOIJW5JIfwOwn6d8IoJczjSDjcgiyEKVaVpQttgNO54_RDJQblo0SRfB8Ksafs4Ab/pub?gid=1735155149&single=true&output=csv";

if (matchesTableBody && ligaSelect) {
  Papa.parse(matchesCSV, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      let ligaSet = new Set();
      matchesTableBody.innerHTML = "";

      data.forEach(row => {
        const liga = row.LIGA || "";
        const player1 = row.PLAYER || "";
        const logo1 = row.TEAM || "";
        const team1 = row.HOME || "";
        const poor = row.POOR || "";
        const team2 = row.AWAY || "";
        const logo2 = row.LOGO_2 || "";
        const player2 = row.PLAYER_2 || "";
        const realScore = row.REAL_SCORE || "";
        const totalScore = row.TOTAL_SCORE || "";
        const winner = row.WINNER || "";

        const tr = document.createElement("tr");
        tr.dataset.liga = liga;
        tr.innerHTML = `
          <td>${liga}</td>
          <td>${player1}</td>
          <td>${logo1 ? `<img src="${logo1}" alt="Logo" class="team-logo">` : ''}</td>
          <td>${team1}</td>
          <td>${poor}</td>
          <td>${team2}</td>
          <td>${logo2 ? `<img src="${logo2}" alt="Logo" class="team-logo">` : ''}</td>
          <td>${player2}</td>
          <td>${realScore}</td>
          <td>${totalScore}</td>
          <td class="winner-cell">${winner}</td>
        `;
        matchesTableBody.appendChild(tr);
        ligaSet.add(liga);

        const winnerCell = tr.querySelector(".winner-cell");
        highlightWinner(winnerCell, winner);
      });

      // ===== Dropdown Liga =====
      ligaSelect.innerHTML = '<option value="All">All</option>';
      Array.from(ligaSet).forEach(liga => {
        const option = document.createElement("option");
        option.value = liga;
        option.textContent = liga;
        ligaSelect.appendChild(option);
      });

      ligaSelect.addEventListener("change", () => {
        const value = ligaSelect.value;
        const tableRows = document.querySelectorAll("#matches-table tbody tr");
        tableRows.forEach(row => {
          row.style.display = (value === "All" || row.dataset.liga === value) ? "" : "none";
        });
      });
    },
    error: function(err) {
      console.error("Gagal load matches CSV:", err);
    }
  });
}

// ===== LEADERBOARD TABLE =====
const leaderboardBody = document.querySelector("#leaderboard-table tbody");
const leaderboardCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTkFDJVcyrG3EY9rv4jBvQc7JOAHAy9CsCMIFEB0oM1N3Afqi5ZuJCk5TD1hXKkFkMjq4VMEl3gHygg/pub?gid=1213844965&single=true&output=csv";

if (leaderboardBody) {
  leaderboardBody.innerHTML = "";

  Papa.parse(leaderboardCSV, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.RANK || ''}</td>
          <td>${row.NAMA || ''}</td>
          <td>${row.MATCHES || ''}</td>
          <td>${row.WIN || ''}</td>
          <td>${row.DRAW || ''}</td>
          <td>${row.LOSE || ''}</td>
          <td>${row.POINT || ''}</td>
        `;
        leaderboardBody.appendChild(tr);
      });
    },
    error: function(err) {
      console.error("Gagal load leaderboard CSV:", err);
    }
  });
}
