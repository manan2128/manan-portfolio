try {
  const theme = localStorage.getItem("manan-portfolio-theme");
  document.documentElement.dataset.theme = theme === "dark" || (!theme && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
} catch { document.documentElement.dataset.theme = "light"; }

