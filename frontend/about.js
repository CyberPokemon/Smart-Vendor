// No interactive logic required currently
// Optional: Scroll animations, auto-fill, or dynamic team loading can go here

// Example: Smooth scroll to cards (if needed)
document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });