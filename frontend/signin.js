const container = document.getElementById('container');
const toggleButtons = document.querySelectorAll('.toggle-password');

document.getElementById('signUp').addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

document.getElementById('signIn').addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

// Toggle password visibility
toggleButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "🙈";
    } else {
      input.type = "password";
      btn.textContent = "👁️";
    }
  });
});
