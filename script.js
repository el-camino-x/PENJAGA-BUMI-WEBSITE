const PASSWORD = "penjagabumi123";
const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");

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

const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7c6Nn46_FqX3jOIJW5JIfwOwn6d8IoJczjSDjcgiyEKVaVpQttgNO54_RDJQblo0SRfB8Ksafs4Ab/pub?gid=1735155149&single=true&output=csv";

const tableBody = document.querySelector('#matches-table tbody');
const ligaSelect = document.getElementById('liga-select');

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
