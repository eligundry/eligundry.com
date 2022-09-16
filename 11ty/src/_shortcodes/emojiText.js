module.exports = function emojiText(emoji, label, text) {
  return `<span role="img" aria-label="${label}">${emoji}</span> ${text}`;
};
