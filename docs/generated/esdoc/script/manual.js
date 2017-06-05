(function() {
  const matched = location.pathname.match(/\/(manual\/.*?\/.*\.html)$/);
  if (!matched) return;

  const currentName = matched[1];
  const cssClass = `.navigation .manual-toc li[data-link="${currentName}"]`;
  const styleText = `${cssClass}{ display: block; }\n`;
  const style = document.createElement('style');
  style.textContent = styleText;
  document.querySelector('head').appendChild(style);
})();
