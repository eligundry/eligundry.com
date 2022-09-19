module.exports = (props) => {
  const attributes = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
<is-land>
  <lite-youtube ${attributes}></lite-youtube>
  <script type="module/island">
    import "https://cdn.jsdelivr.net/npm/@justinribeiro/lite-youtube@1.4.0/lite-youtube.js"
  </script>
</is-land>
  `;
};
