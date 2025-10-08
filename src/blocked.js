// Get the blocked domain from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const blockedDomain = urlParams.get('domain') || 'Unknown Site';
document.getElementById('blockedDomain').textContent = blockedDomain;

// Add button functionality
document.getElementById('goBackBtn').addEventListener('click', () => {
  history.back();
});

document.getElementById('searchBtn').addEventListener('click', () => {
  window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(blockedDomain);
});

// Add some interactive effects
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousedown', () => {
    btn.style.transform = 'scale(0.95)';
  });
  btn.addEventListener('mouseup', () => {
    btn.style.transform = 'scale(1)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
  });
});