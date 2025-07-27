// No interactive logic required currently
// Optional: Scroll animations, auto-fill, or dynamic team loading can go here

// Example: Smooth scroll to cards (if needed)
document.querySelectorAll("a[href^='#']").forEach(anchor => {
<<<<<<< HEAD
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});
=======
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });
>>>>>>> 2769ba5186fdcab0b4d72d65af366f2429992ebf
