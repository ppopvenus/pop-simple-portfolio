document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio script loaded.");

    // Theme Toggle Logic
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
        const themeIcon = toggleButton.querySelector('i');
        
        toggleButton.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const newTheme = isLight ? 'dark' : 'light';
            
            if (newTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
            }
            console.log("Theme toggled to:", newTheme);
        });
    }
});