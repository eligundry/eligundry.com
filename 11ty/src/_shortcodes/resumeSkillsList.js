module.exports = function resumeSkillList(skills) {
  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });
  const skillsLinks = Object.entries(skills).map(
    ([name, url]) => `<a href="${url}" itemprop="knowsAbout">${name}</a>`
  );

  return formatter.format(skillsLinks);
};
