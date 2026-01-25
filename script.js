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

// ===== MATCHES DATA =====
const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7c6Nn46_FqX3jOIJW5JIfwOwn6d8IoJczjSDjcgiyEKVaVpQttgNO54_RDJQblo0SRfB8Ksafs4Ab/pub?gid=1735155149&single=true&output=csv";
const tableBody = document.querySelector('#matches-table tbody');
const ligaSelect = document.getElementById('liga-select');
const leaderboardBody = document.querySelector('#leaderboard-table tbody');

Papa.parse(csvURL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    const data = results.data;
    let ligaSet = new Set();

    // ===== TABLE MATCHES =====
    if (tableBody && ligaSelect) {
      tableBody.innerHTML = '';
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.dataset.liga = row.LIGA || '';
        tr.innerHTML = `
          <td>${row.LIGA || ''}</td>
          <td>${row.PLAYER || ''}</td>
          <td>${row.TEAM ? `<img src="${row.TEAM}" alt="Logo" class="team-logo">` : ''} ${row.HOME || ''}</td>
          <td>${row.HOME || ''}</td>
          <td>${row.POOR || ''}</td>
          <td>${row.AWAY || ''}</td>
          <td>${row.LOGO_2 ? `<img src="${row.LOGO_2}" alt="Logo" class="team-logo">` : ''}</td>
          <td>${row.PLAYER_2 || ''}</td>
          <td>${row.REAL_SCORE || ''}</td>
          <td>${row.TOTAL_SCORE || ''}</td>
          <td>${row.WINNER || ''}</td>
        `;
        tableBody.appendChild(tr);
        ligaSet.add(row.LIGA || '');
      });

      // Filter Liga
      ligaSelect.innerHTML = '<option value="All">All</option>';
      Array.from(ligaSet).forEach(liga => {
        const option = document.createElement('option');
        option.value = liga;
        option.textContent = liga;
        ligaSelect.appendChild(option);
      });

      ligaSelect.addEventListener("change", () => {
        const value = ligaSelect.value;
        document.querySelectorAll("#matches-table tbody tr").forEach(row => {
          row.style.display = (value === "All" || row.dataset.liga === value) ? "" : "none";
        });
      });
    }

    // ===== LEADERBOARD AUTO HITUNG =====
    if (leaderboardBody) {
      const leaderboard = {};

      data.forEach(row => {
        const player1 = row.PLAYER;
        const player2 = row.PLAYER_2;
        const winner = row.WINNER;
        const draw = row.WINNER && row.WINNER.toUpperCase() === "DRAW";

        [player1, player2].forEach(player => {
          if (!player) return;
          if (!leaderboard[player]) {
            leaderboard[player] = {MATCHES:0, WIN:0, DRAW:0, LOSE:0, POINT:0};
          }

          leaderboard[player].MATCHES += 1;

          if (draw) {
            leaderboard[player].DRAW += 1;
            leaderboard[player].POINT += 1;
          } else if (player === winner) {
            leaderboard[player].WIN += 1;
            leaderboard[player].POINT += 3;
          } else {
            leaderboard[player].LOSE += 1;
            leaderboard[player].POINT += 0;
          }
        });
      });

      // Convert ke array & sort by POINT
      const leaderboardArray = Object.keys(leaderboard)
        .map(name => ({NAMA: name, ...leaderboard[name]}))
        .sort((a,b) => b.POINT - a.POINT);

      // Inject ke table
      leaderboardBody.innerHTML = '';
      leaderboardArray.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${index+1}</td>
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
  }
});
