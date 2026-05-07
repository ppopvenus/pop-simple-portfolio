const toggleButton = document.getElementById('theme-toggle');
// ดึง Tag <i> ที่อยู่ในปุ่มออกมาเพื่อเปลี่ยนรูป icon
const themeIcon = toggleButton.querySelector('i');

toggleButton.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    
    if (newTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        // เปลี่ยน Class เป็นพระจันทร์ (Font Awesome)
        themeIcon.className = 'fa-solid fa-moon';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        // เปลี่ยน Class เป็นพระอาทิตย์ (Font Awesome)
        themeIcon.className = 'fa-solid fa-sun';
    }
});
});

// PDF CV Generation Logic
const downloadButtons = [
    document.getElementById('download-cv-nav'),
    document.getElementById('download-cv-cta')
];

function syncPortfolioToCV() {
    // Sync About Me
    document.getElementById('cv-about').textContent = document.querySelector('#about p').textContent;

    // Sync Experience
    const experienceList = document.querySelector('.experience-list');
    const cvExperience = document.getElementById('cv-experience');
    cvExperience.innerHTML = '';
    
    experienceList.querySelectorAll('.experience-card').forEach(card => {
        const company = card.querySelector('.exp-header h3').textContent;
        const duration = card.querySelector('.exp-duration').textContent;
        const title = card.querySelector('.job-title').textContent;
        const achievements = card.querySelector('ul').innerHTML;
        
        const item = document.createElement('div');
        item.className = 'cv-item';
        item.innerHTML = `
            <div class="cv-item-header"><span>${company}</span><span>${duration}</span></div>
            <div class="cv-item-subheader">${title}</div>
            <div class="cv-content"><ul>${achievements}</ul></div>
        `;
        cvExperience.appendChild(item);
    });

    // Sync Skills
    const skillsGrid = document.querySelector('.skills-grid');
    const cvSkills = document.getElementById('cv-skills');
    cvSkills.innerHTML = '';
    
    skillsGrid.querySelectorAll('.skill-category').forEach(cat => {
        const title = cat.querySelector('h3').textContent;
        const list = cat.querySelector('ul').innerHTML;
        
        const div = document.createElement('div');
        div.className = 'cv-skill-cat';
        div.innerHTML = `<h3>${title}</h3><ul>${list}</ul>`;
        cvSkills.appendChild(div);
    });

    // Sync Education
    document.getElementById('cv-education').innerHTML = document.querySelector('.education-item').innerHTML;
}

function generatePDF() {
    syncPortfolioToCV();
    
    const element = document.getElementById('cv-template');
    element.style.display = 'block'; // Temporarily show for capture
    
    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'Winassarin_Choudchum_CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.display = 'none'; // Hide again
    });
}

downloadButtons.forEach(btn => {
    if (btn) btn.addEventListener('click', generatePDF);
});
