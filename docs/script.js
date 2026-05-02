const toggleButton = document.getElementById('theme-toggle');

toggleButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    toggleButton.textContent = newTheme === 'light' ? '☀️' : '🌙';
});
