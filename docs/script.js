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

    // PDF CV Generation Logic
    const downloadButtons = [
        document.getElementById('download-cv-nav'),
        document.getElementById('download-cv-cta')
    ];

    function syncPortfolioToCV() {
        try {
            // Sync About Me
            const aboutText = document.querySelector('#about p');
            if (aboutText) document.getElementById('cv-about').textContent = aboutText.textContent;

            // Sync Experience
            const experienceList = document.querySelector('.experience-list');
            const cvExperience = document.getElementById('cv-experience');
            if (experienceList && cvExperience) {
                cvExperience.innerHTML = '';
                experienceList.querySelectorAll('.experience-card').forEach(card => {
                    const company = card.querySelector('.exp-header h3')?.textContent || '';
                    const duration = card.querySelector('.exp-duration')?.textContent || '';
                    const title = card.querySelector('.job-title')?.textContent || '';
                    const achievements = card.querySelector('ul')?.innerHTML || '';
                    
                    const item = document.createElement('div');
                    item.className = 'cv-item';
                    item.innerHTML = `
                        <div class="cv-item-header"><span>${company}</span><span>${duration}</span></div>
                        <div class="cv-item-subheader">${title}</div>
                        <div class="cv-content"><ul>${achievements}</ul></div>
                    `;
                    cvExperience.appendChild(item);
                });
            }

            // Sync Skills
            const skillsGrid = document.querySelector('.skills-grid');
            const cvSkills = document.getElementById('cv-skills');
            if (skillsGrid && cvSkills) {
                cvSkills.innerHTML = '';
                skillsGrid.querySelectorAll('.skill-category').forEach(cat => {
                    const title = cat.querySelector('h3')?.textContent || '';
                    const list = cat.querySelector('ul')?.innerHTML || '';
                    
                    const div = document.createElement('div');
                    div.className = 'cv-skill-cat';
                    div.innerHTML = `<h3>${title}</h3><ul>${list}</ul>`;
                    cvSkills.appendChild(div);
                });
            }

            // Sync Projects
            const projectGrid = document.querySelector('.project-grid');
            const cvProjects = document.getElementById('cv-projects');
            if (projectGrid && cvProjects) {
                cvProjects.innerHTML = '';
                projectGrid.querySelectorAll('.project-card').forEach(card => {
                    const title = card.querySelector('.project-info h3')?.textContent || '';
                    const description = card.querySelector('.project-info p:not(.achievement)')?.textContent || '';
                    const achievement = card.querySelector('.achievement')?.textContent || '';

                    const item = document.createElement('div');
                    item.className = 'cv-item';
                    item.innerHTML = `
                        <div class="cv-item-subheader" style="font-weight: bold;">${title}</div>
                        <div class="cv-content">
                            <p>${description}</p>
                            <p><strong>Impact:</strong> ${achievement}</p>
                        </div>
                    `;
                    cvProjects.appendChild(item);
                });
            }

            // Sync Education
            const educationGrid = document.querySelector('.education-grid');
            const cvEducation = document.getElementById('cv-education');
            if (educationGrid && cvEducation) {
                cvEducation.innerHTML = '';
                educationGrid.querySelectorAll('.education-block').forEach(block => {
                    const title = block.querySelector('h3')?.textContent || '';
                    const itemContent = block.querySelector('.education-item')?.innerHTML || '';
                    
                    const div = document.createElement('div');
                    div.className = 'cv-item';
                    div.style.marginBottom = '15px';
                    div.innerHTML = `
                        <div class="cv-item-subheader" style="font-weight: bold; margin-bottom: 5px;">${title}</div>
                        <div class="cv-content">${itemContent}</div>
                    `;
                    
                    const iframes = div.querySelectorAll('iframe');
                    iframes.forEach(f => f.remove());
                    
                    cvEducation.appendChild(div);
                });
            }
        } catch (e) {
            console.error("Error during sync:", e);
            throw e;
        }
    }

    function generatePDF() {
        console.log("Attempting to generate CV PDF...");
        
        if (typeof html2pdf === 'undefined') {
            console.error("html2pdf library is not loaded.");
            alert("Sorry, the PDF generation library failed to load. Please try again later.");
            return;
        }

        try {
            // 1. Sync data to the ORIGINAL hidden template
            syncPortfolioToCV();
            
            const originalTemplate = document.getElementById('cv-template');
            if (!originalTemplate) {
                alert("CV Template not found!");
                return;
            }

            // 2. Clone the synced template
            const clone = originalTemplate.cloneNode(true);
            
            // 3. Make the clone visible for capture but off-screen
            Object.assign(clone.style, {
                display: 'block',
                position: 'fixed',
                left: '-9999px',
                top: '0',
                width: '210mm', // Standard A4 width
                backgroundColor: 'white',
                zIndex: '-1000'
            });

            document.body.appendChild(clone);

            const opt = {
                margin: [10, 10, 10, 10],
                filename: 'Winassarin_Choudchum_CV.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    letterRendering: true,
                    logging: false
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // 4. Generate PDF from the CLONE
            html2pdf().set(opt).from(clone).save().then(() => {
                // 5. Cleanup the clone
                document.body.removeChild(clone);
                console.log("PDF generated successfully.");
            }).catch(err => {
                console.error("PDF generation failed:", err);
                if (clone.parentNode) document.body.removeChild(clone);
                alert("An error occurred while generating the PDF.");
            });
        } catch (error) {
            console.error("Preparation for PDF failed:", error);
            alert("Failed to prepare CV for download.");
        }
    }

    downloadButtons.forEach(btn => {
        if (btn) btn.addEventListener('click', generatePDF);
    });
});