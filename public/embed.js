(function() {
  const container = document.getElementById('advent-player');
  if (!container) return;

  const script = document.currentScript;
  const embedId = script.dataset.embedId;
  const baseUrl = script.src.replace('/embed.js', '');
  
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/embed/${embedId}`;
  iframe.style.width = '100%';
  iframe.style.border = 'none';
  iframe.style.height = '800px';
  
  container.appendChild(iframe);
})();