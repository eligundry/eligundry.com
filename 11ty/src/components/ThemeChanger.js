import {
  html,
  render,
  useState,
  useEffect,
} from "https://unpkg.com/htm@^3/preact/standalone.mjs?module";
import clsx from "https://unpkg.com/clsx@1.2.1/dist/clsx.m.js?module";

function ThemeChanger() {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" ? window.localStorage.theme === "dark" : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleModeChange = function (e) {
      console.log("dark mode changed", e.matches, e);
      window.themeChange(false);
      setDarkMode(e.matches);
    };
    mediaQuery.addEventListener("change", handleModeChange);

    return function cleanup() {
      mediaQuery.removeEventListener("change", handleModeChange);
    };
  }, []);

  return html`
    <label
      class=${clsx("swap", "swap-flip", darkMode && "swap-active")}
      data-toggle-theme="dark,light"
      onClick=${() => {
        window.themeChange(false);
        setDarkMode((mode) => !mode);
      }}
    >
      <input type="checkbox" />
      <div class="swap-on">🌚</div>
      <div class="swap-off">🌞</div>
    </label>
  `;
}

export default function (el) {
  render(html`<${ThemeChanger} />`, el);
}
