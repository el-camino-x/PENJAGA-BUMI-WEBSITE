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

// ===== MATCHES CSV URL =====
const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7c6Nn46_FqX3jOIJW5JIfwOwn6d8IoJczjSDjcgiyEKVaVpQttgNO54_RDJQblo0SRfB8Ksafs4Ab/pub?gid=1735155149&single=true&output=csv";

// ===== MATCHES TABLE =====
const tableBody = document.querySelector('#matches-table tbody');
const ligaSelect = document.getElementById('liga-select');

if (tableBody && ligaSelect) {
  Papa.parse(csvURL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      let ligaSet = new Set();
      tableBody.innerHTML = '';

      data.forEach(row => {
        const liga = row.LIGA || '';
        const player1 = row.PLAYER || '';
        const logo1 = row.TEAM || '';
        const team1 = row.HOME || '';
        const poor = row.POOR || '';
        const team2 = row.AWAY || '';
        const logo2 = row.LOGO_2 || '';
        const player2 = row.PLAYER_2 || '';
        const realScore = row.REAL_SCORE || '';
        const totalScore = row.TOTAL_SCORE || '';
        const winner = row.WINNER || '';

        const tr = document.createElement('tr');
        tr.dataset.liga = liga;
        tr.innerHTML = `
          <td>${liga}</td>
          <td>${player1}</td>
          <td>${logo1 ? `<img src="${logo1}" alt="Logo" class="team-logo">` : ''} ${team1}</td>
          <td>${team1}</td>
          <td>${poor}</td>
          <td>${team2}</td>
          <td>${logo2 ? `<img src="${logo2}" alt="Logo" class="team-logo">` : ''}</td>
          <td>${player2}</td>
          <td>${realScore}</td>
          <td>${totalScore}</td>
          <td>${winner}</td>
        `;
        tableBody.appendChild(tr);
        ligaSet.add(liga);
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
        const tableRows = document.querySelectorAll("#matches-table tbody tr");
        tableRows.forEach(row => {
          row.style.display = (value === "All" || row.dataset.liga === value) ? "" : "none";
        });
      });
    }
  });
}

// ===== LEADERBOARD =====
const leaderboardBody = document.querySelector('#leaderboard-table tbody');

if (leaderboardBody) {
  Papa.parse(csvURL, {  // Pakai CSV matches yang sama
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      const stats = {};

      data.forEach(row => {
        const winPoints = 3;
        const drawPoints = 1;
        const losePoints = -2;

        // Player 1
        const p1 = row.PLAYER || '';
        if (p1) {
          if (!stats[p1]) stats[p1] = {MATCHES:0, WIN:0, DRAW:0, LOSE:0, POINT:0};
          stats[p1].MATCHES++;
          if (row.WINNER === p1) {
            stats[p1].WIN++;
            stats[p1].POINT += winPoints;
          } else if (row.WINNER === 'DRAW') {
            stats[p1].DRAW++;
            stats[p1].POINT += drawPoints;
          } else if (row.WINNER && row.WINNER !== p1) {
            stats[p1].LOSE++;
            stats[p1].POINT += losePoints;
          }
        }

        // Player 2
        const p2 = row.PLAYER_2 || '';
        if (p2) {
          if (!stats[p2]) stats[p2] = {MATCHES:0, WIN:0, DRAW:0, LOSE:0, POINT:0};
          stats[p2].MATCHES++;
          if (row.WINNER === p2) {
            stats[p2].WIN++;
            stats[p2].POINT += winPoints;
          } else if (row.WINNER === 'DRAW') {
            stats[p2].DRAW++;
            stats[p2].POINT += drawPoints;
          } else if (row.WINNER && row.WINNER !== p2) {
            stats[p2].LOSE++;
            stats[p2].POINT += losePoints;
          }
        }
      });

      // Convert stats object ke array
      const leaderboardData = Object.keys(stats).map(name => ({
        NAMA: name,
        ...stats[name]
      }));

      // Sort by POINT descending
      leaderboardData.sort((a,b)=>b.POINT - a.POINT);

      // Inject ke tabel
      leaderboardBody.innerHTML = '';
      leaderboardData.forEach((row, index)=>{
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
  });
}
