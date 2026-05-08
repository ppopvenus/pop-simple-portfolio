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

    /**
     * Synchronizes portfolio data into the CV template.
     * @param {HTMLElement} container The CV template element (can be a clone).
     */
    function syncPortfolioToCV(container) {
        console.log("Syncing portfolio data to CV...");
        try {
            // Sync About Me
            const aboutText = document.querySelector('#about .about-content p') || document.querySelector('#about p');
            const cvAbout = container.querySelector('#cv-about');
            if (aboutText && cvAbout) {
                cvAbout.textContent = aboutText.textContent;
                console.log("Synced About Me");
            }

            // Sync Experience
            const experienceList = document.querySelector('.experience-list');
            const cvExperience = container.querySelector('#cv-experience');
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
                console.log("Synced Experience");
            }

            // Sync Skills
            const skillsGrid = document.querySelector('.skills-grid');
            const cvSkills = container.querySelector('#cv-skills');
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
                console.log("Synced Skills");
            }

            // Sync Projects
            const projectGrid = document.querySelector('.project-grid');
            
            const cvProjects = container.querySelector('#cv-projects');
            if (projectGrid && cvProjects) {
                cvProjects.style.pageBreakBefore = 'always';
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
                console.log("Synced Projects");
            }

            // Sync Education
            const educationGrid = document.querySelector('.education-grid');
            const cvEducation = container.querySelector('#cv-education');
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
                console.log("Synced Education");
            }
        } catch (e) {
            console.error("Error during sync:", e);
            throw e;
        }
    }

    let isGenerating = false;

    function generatePDF() {
        if (isGenerating) {
            console.log("PDF generation already in progress...");
            return;
        }

        console.log("Starting PDF generation process...");
        isGenerating = true;
        
        if (typeof html2pdf === 'undefined') {
            console.error("html2pdf library is not loaded.");
            alert("Sorry, the PDF generation library failed to load. Please try again later.");
            isGenerating = false;
            return;
        }

        const container = document.getElementById('cv-offscreen-container');
        const template = document.getElementById('cv-template');
        
        if (!container || !template) {
            console.error("CV template components not found in DOM.");
            alert("CV Template not found!");
            isGenerating = false;
            return;
        }

        try {
            // Sync data to the template
            syncPortfolioToCV(template);

            // Temporarily show the container but keep it hidden from view
            Object.assign(container.style, {
                display: 'block',
                position: 'fixed',
                top: '0',
                left: '0',
                width: '210mm',
                zIndex: '-1000',
                backgroundColor: 'white'
            });

            const opt = {
                margin: [10, 10, 10, 10],
                filename: 'Winassarin_Choudchum_CV.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    letterRendering: true,
                    logging: false,
                    scrollX: 0,
                    scrollY: 0
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: 'css' }
            };

            // Generate PDF from the visible-but-hidden template
            html2pdf().set(opt).from(template).save().then(() => {
                console.log("PDF generated and saved successfully.");
                container.style.display = 'none'; // Hide it again
                isGenerating = false;
            }).catch(err => {
                console.error("PDF generation failed:", err);
                container.style.display = 'none';
                alert("An error occurred while generating the PDF.");
                isGenerating = false;
            });
        } catch (error) {
            console.error("Critical failure during PDF generation:", error);
            container.style.display = 'none';
            alert("Failed to prepare CV for download.");
            isGenerating = false;
        }
    }

    downloadButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                generatePDF();
            });
        }
    });
});