
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const registerBtn = document.getElementById('registerBtn');
  const btnLoader = registerBtn.querySelector('.btn-loader');
  const btnText = registerBtn.querySelector('.btn-text');

  const toast = document.getElementById('toast');
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-icon');

  // Utility to show toast notifications
  function showToast(message, success = true) {
      toastMessage.textContent = message;
      toastIcon.className = `toast-icon fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'} ${success ? 'success' : 'error'}`;
      toast.classList.add('show');
      setTimeout(() => {
          toast.classList.remove('show');
      }, 4000);
  }

  registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Show loader
      btnLoader.style.display = 'inline-block';
      btnText.textContent = 'Creating...';
      registerBtn.disabled = true;

      const payload = {
          username: document.getElementById('Username').value.trim(),
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          address: document.getElementById('location').value.trim(),
          businessname: document.getElementById('businessName').value.trim(),
          password: document.getElementById('password').value,
          role: "VENDOR"
      };

      try {
          const response = await fetch('http://127.0.0.1:8080/api/auth/signup', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
          });

          const result = await response.json();

          if (response.ok) {
              showToast(result.message, true);
              localStorage.setItem("jwtToken",result.jwtToken);
              registerForm.reset();
              window.location.href = 'ingredient_entry.html';
          } else {
              showToast(result.message || 'Registration failed', false);
          }
      } catch (error) {
          showToast('Server error. Please try again later.', false);
          console.error(error);
      } finally {
          // Hide loader
          btnLoader.style.display = 'none';
          btnText.textContent = 'Create Account';
          registerBtn.disabled = false;
      }
  });
});
