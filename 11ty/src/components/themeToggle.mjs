const toggle = document.getElementById("theme-toggle");
const htmlElement = document.querySelector("html");
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

// console.log({ toggle, htmlElement, mediaQuery });

const changeTheme = (theme, options = { save: false, updateInput: false }) => {
  htmlElement.setAttribute("data-theme", theme);

  console.log({ theme, ...options });

  if (options.save) {
    localStorage.setItem("theme", theme);
  }

  if (options.updateInput) {
    toggle.value = theme === "dark" ? "on" : "off";
  }
};

if (localStorage.getItem("theme")) {
  changeTheme(localStorage.getItem("theme"), {
    updateInput: true,
  });
} else {
  changeTheme(mediaQuery.matches ? "dark" : "light", {
    updateInput: true,
  });
}

mediaQuery.addEventListener("change", (e) => {
  changeTheme(e.matches ? "dark" : "light", {
    updateInput: true,
  });
});

toggle.addEventListener("change", () => {
  const currentHTML = document.querySelector("html");
  const currentTheme = currentHTML.getAttribute("data-theme");
  changeTheme(currentTheme === "light" ? "dark" : "light", {
    save: true,
  });
});
