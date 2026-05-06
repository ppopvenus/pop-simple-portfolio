const toggleButton = document.getElementById('theme-toggle');

toggleButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    toggleButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});
