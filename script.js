const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    root.classList.toggle("dark");
  });
}
