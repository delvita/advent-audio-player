(function() {
  const container = document.getElementById('advent-player');
  if (!container) return;

  const script = document.currentScript;
  const config = script.dataset.config;
  const baseUrl = script.src.replace('/embed.js', '');
  
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/embed?${config}`;
  iframe.style.width = '100%';
  iframe.style.border = 'none';
  iframe.style.height = (parseInt(new URLSearchParams(config).get('height') || '600') + 400) + 'px';
  
  container.appendChild(iframe);
})();