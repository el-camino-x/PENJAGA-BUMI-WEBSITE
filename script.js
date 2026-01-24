const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');

const PASSWORD = "vijaycrypto";

loginBtn.addEventListener('click', () => {
  if(passwordInput.value === PASSWORD){
    window.location.href = "home.html";
  } else {
    errorMsg.textContent = "Password salah!";
  }
});

passwordInput.addEventListener('keypress', (e) => {
  if(e.key === 'Enter'){
    loginBtn.click();
  }
});
