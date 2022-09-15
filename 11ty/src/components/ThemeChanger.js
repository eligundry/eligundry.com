import { html, render } from "https://unpkg.com/htm/preact/index.mjs?module";

function ThemeChanger() {
  return html`
    <label
      class="swap swap-flip"
      data-toggle-theme="dark,light"
      onClick=${() => window.themeChange(false)}
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
