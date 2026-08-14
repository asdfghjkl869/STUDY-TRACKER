const SUBJECTS_DEF = {
    "Mathematics": {
        stages: ["Lectures & Formula", "NCERT Full", "Modules Full", "ML Agarwal (HOTS)"],
        chapters: [
            "Real Numbers", "Polynomials", "Pair of Linear Equations", "Quadratic Equations", 
            "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", 
            "Some Applications of Trigonometry", "Circles", "Areas Related to Circles", "Surface Areas and Volumes", 
            "Statistics", "Probability"
        ]
    },
    "Science": {
        stages: ["One-Shot Video", "NCERT Topic-wise", "S. Chand Reading", "S. Chand Practice"],
        chapters: [
            "Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-Metals", 
            "Carbon and its Compounds", "Life Processes", "Control and Coordination", 
            "How do Organisms Reproduce", "Heredity", "Light Reflection & Refraction", 
            "Human Eye & Colorful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment"
        ]
    },
    "Social Science": {
        stages: ["Detailed Lecture", "Homework Practice", "Chapter Test & Analysis"],
        chapters: [
            "The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", 
            "Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", 
            "Power Sharing", "Federalism", "Gender, Religion and Caste", "Political Parties", 
            "Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation"
        ]
    },
    "English": {
        stages: ["Literature Reading/Theme", "Board Question Practice", "Grammar Drills", "Writing Formats"],
        chapters: [
            "A Letter to God", "Nelson Mandela", "Two Stories about Flying", "From the Diary of Anne Frank", 
            "Glimpses of India", "Mijbil the Otter", "Madam Rides the Bus", "The Sermon at Benares", 
            "The Proposal", "Dust of Snow", "Fire and Ice", "A Tiger in the Zoo", "How to Tell Wild Animals", 
            "The Ball Poem", "Amanda!", "The Trees", "Fog", "The Tale of Custard the Dragon", "For Anne Gregory"
        ]
    },
    "Hindi": {
        stages: ["Literature Reading/Summary", "Board Question Practice", "Grammar Vyakaran", "Writing Lekhan"],
        chapters: [
            "दो बैलों की कथा", "ल्हासा की ओर", "उपभोक्तावाद की संस्कृति", "सालेम अली की याद", 
            "प्रेमचंद के फटे जूते", "महादेवी वर्मा", "मेरे बचपन के दिन", "एक कुत्ता और एक मैना", 
            "साखी एवं सबद", "वाख", "सवैया", "कैदी और कोकिला", "ग्राम श्री", "मेघ आए", 
            "बच्चे काम पर जा रहे हैं", "इस जल प्रलय में", "रीढ़ की हड्डी", "माता का आंचल", "साना-साना हाथ जोड़ि"
        ]
    }
};

let profiles = JSON.parse(localStorage.getItem('umang_profiles') || '[]');
let currentProfileName = localStorage.getItem('umang_active_profile') || '';
let currentTab = 'home';
let currentChapterSubject = 'Mathematics';
let isLightMode = localStorage.getItem('umang_theme') === 'light';

// Setup wizard state (3 steps)
let setupStep = 1;
let setupData = {
    name: '',
    grade: 'Class 10',
    dates: {},
    syllabus: {}
};

function initApp() {
    if (isLightMode) {
        document.body.classList.add('light-mode');
        document.getElementById('theme-toggle-btn').innerText = '🌙 Dark';
    }

    if (profiles.length === 0) {
        renderSetupWizard();
        document.getElementById('bottom-nav').style.display = 'none';
        return;
    }

    if (!currentProfileName || !profiles.find(p => p.name === currentProfileName)) {
        currentProfileName = profiles[0].name;
    }
    localStorage.setItem('umang_active_profile', currentProfileName);

    document.getElementById('bottom-nav').style.display = 'flex';
    updateProfileDropdown();
    renderApp();
}

function updateProfileDropdown() {
    const select = document.getElementById('profile-select');
    select.innerHTML = '';
    profiles.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.innerText = `${p.name} (${p.grade || 'Class 10'})`;
        if (p.name === currentProfileName) opt.selected = true;
        select.appendChild(opt);
    });
    const addOpt = document.createElement('option');
    addOpt.value = '__add_new__';
    addOpt.innerText = '+ Add New Profile';
    select.appendChild(addOpt);
}

function switchProfile(name) {
    if (name === '__add_new__') {
        setupStep = 1;
        setupData = { name: '', grade: 'Class 10', dates: {}, syllabus: {} };
        document.getElementById('bottom-nav').style.display = 'none';
        renderSetupWizard();
        return;
    }
    currentProfileName = name;
    localStorage.setItem('umang_active_profile', currentProfileName);
    renderApp();
}

function getCurrentProfile() {
    return profiles.find(p => p.name === currentProfileName) || profiles[0];
}

function toggleTheme() {
    isLightMode = !isLightMode;
    localStorage.setItem('umang_theme', isLightMode ? 'light' : 'dark');
    if (isLightMode) {
        document.body.classList.add('light-mode');
        document.getElementById('theme-toggle-btn').innerText = '🌙 Dark';
    } else {
        document.body.classList.remove('light-mode');
        document.getElementById('theme-toggle-btn').innerText = '☀️ Light';
    }
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderApp();
}

// Setup Wizard
function renderSetupWizard() {
    const main = document.getElementById('main-content');
    let html = `<div class="card setup-wizard">`;
    
    if (setupStep === 1) {
        html += `
            <div class="wizard-title">Welcome to UMANG Bhaiya Study Tracker</div>
            <div class="wizard-step">Step 1 of 3: Student Details</div>
            <div class="form-group">
                <label>Student Name</label>
                <input type="text" id="setup-name" class="form-control" placeholder="e.g. Umang" value="${setupData.name}">
            </div>
            <div class="form-group">
                <label>Class / Grade</label>
                <select id="setup-grade" class="form-control">
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                </select>
            </div>
            <button class="btn" onclick="nextSetupStep(1)">Next: Set Datesheet &rarr;</button>
        `;
    } else if (setupStep === 2) {
        html += `
            <div class="wizard-title">Welcome to UMANG Bhaiya Study Tracker</div>
            <div class="wizard-step">Step 2 of 3: Exam Datesheet</div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:15px;">Set your upcoming exam dates for each subject.</p>
        `;
        Object.keys(SUBJECTS_DEF).forEach(sub => {
            let val = setupData.dates[sub] || '2026-10-15';
            html += `
                <div class="form-group">
                    <label>${sub} Exam Date</label>
                    <input type="date" id="date-${sub}" class="form-control" value="${val}">
                </div>
            `;
        });
        html += `<button class="btn" onclick="nextSetupStep(2)">Next: Select Exam Syllabus &rarr;</button>`;
    } else if (setupStep === 3) {
        html += `
            <div class="wizard-title">Welcome to UMANG Bhaiya Study Tracker</div>
            <div class="wizard-step">Step 3 of 3: Exam Syllabus Selection</div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:15px;">💡 Uncheck any chapter NOT included in your exam.</p>
            <div style="margin-bottom:15px;">
                <select id="syllabus-sub-select" class="form-control" onchange="renderSyllabusChecklist(this.value)">
        `;
        Object.keys(SUBJECTS_DEF).forEach(sub => {
            html += `<option value="${sub}">${sub}</option>`;
        });
        html += `</select></div><div id="syllabus-checklist-box" class="checklist-container"></div>`;
        html += `<button class="btn" onclick="finishSetup()">Start Tracking 🚀</button>`;
    }

    html += `</div><footer>Built by UMANG Bhaiya[cite: 1]</footer>`;
    main.innerHTML = html;

    if (setupStep === 3) {
        renderSyllabusChecklist(Object.keys(SUBJECTS_DEF)[0]);
    }
}

function nextSetupStep(curr) {
    if (curr === 1) {
        const nameVal = document.getElementById('setup-name').value.trim();
        if (!nameVal) { alert('Please enter student name.'); return; }
        setupData.name = nameVal;
        setupData.grade = document.getElementById('setup-grade').value;
        setupStep = 2;
    } else if (curr === 2) {
        Object.keys(SUBJECTS_DEF).forEach(sub => {
            setupData.dates[sub] = document.getElementById(`date-${sub}`).value || '2026-10-15';
        });
        Object.keys(SUBJECTS_DEF).forEach(sub => {
            if (!setupData.syllabus[sub]) {
                setupData.syllabus[sub] = {};
                SUBJECTS_DEF[sub].chapters.forEach((ch, idx) => {
                    setupData.syllabus[sub][idx] = true;
                });
            }
        });
        setupStep = 3;
    }
    renderSetupWizard();
}

function renderSyllabusChecklist(sub) {
    const container = document.getElementById('syllabus-checklist-box');
    if (!container) return;
    const chapters = SUBJECTS_DEF[sub].chapters;
    if (!setupData.syllabus[sub]) {
        setupData.syllabus[sub] = {};
        chapters.forEach((ch, idx) => setupData.syllabus[sub][idx] = true);
    }
    let html = '';
    chapters.forEach((ch, idx) => {
        const checked = setupData.syllabus[sub][idx] !== false ? 'checked' : '';
        html += `
            <div class="checklist-item">
                <input type="checkbox" id="chk-${sub}-${idx}" ${checked} onchange="toggleSetupSyllabus('${sub}', ${idx}, this.checked)">
                <label for="chk-${sub}-${idx}">Ch ${idx+1}: ${ch}</label>
            </div>
        `;
    });
    container.innerHTML = html;
}

function toggleSetupSyllabus(sub, idx, val) {
    setupData.syllabus[sub][idx] = val;
}

function finishSetup() {
    const newProfile = {
        name: setupData.name,
        grade: setupData.grade,
        dates: setupData.dates,
        syllabus: setupData.syllabus,
        progress: {}
    };
    profiles.push(newProfile);
    localStorage.setItem('umang_profiles', JSON.stringify(profiles));
    currentProfileName = newProfile.name;
    localStorage.setItem('umang_active_profile', currentProfileName);
    document.getElementById('bottom-nav').style.display = 'flex';
    updateProfileDropdown();
    currentTab = 'home';
    renderApp();
}

// Main App Router
function renderApp() {
    const main = document.getElementById('main-content');
    const profile = getCurrentProfile();
    if (!profile) return;

    if (currentTab === 'home') {
        renderHomeTab(main, profile);
    } else if (currentTab === 'chapters') {
        renderChaptersTab(main, profile);
    } else if (currentTab === 'insights') {
        renderInsightsTab(main, profile);
    } else if (currentTab === 'settings') {
        renderSettingsTab(main, profile);
    }
}

function renderHomeTab(container, profile) {
    let streak = 1;
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
                <h2 style="margin: 0; font-size: 1.5rem;">Hi, ${profile.name}!</h2>
                <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 0.85rem;">${profile.grade || 'Class 10'} Exam Preparation Tracker</p>
            </div>
            <div class="streak-badge">&#128293; ${streak} Day Streak</div>
        </div>

        <div class="card">
            <h3 style="margin-top:0; font-size:1.1rem;">Subject Preparation Status</h3>
            <div class="subject-cards-grid">
    `;

    Object.keys(SUBJECTS_DEF).forEach(sub => {
        let totalStages = 0;
        let doneStages = 0;
        const chapters = SUBJECTS_DEF[sub].chapters;
        const stages = SUBJECTS_DEF[sub].stages;
        const syllabus = profile.syllabus?.[sub] || {};
        const prog = profile.progress?.[sub] || {};

        chapters.forEach((ch, chIdx) => {
            if (syllabus[chIdx] !== false) {
                stages.forEach((st, stIdx) => {
                    totalStages++;
                    if (prog[chIdx]?.[stIdx] === 2) doneStages++;
                });
            }
        });

        const pct = totalStages > 0 ? Math.round((doneStages / totalStages) * 100) : 0;
        html += `
            <div class="subject-status-card">
                <div class="status-tag on-track">On Track</div>
                <h4 style="margin:0 0 10px 0; font-size:1rem; color:var(--primary);">${sub}</h4>
                <div style="font-size:1.5rem; font-weight:bold; margin-bottom:5px;">${pct}%</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">Exam Date: ${profile.dates?.[sub] || 'Not Set'}<br>${totalStages - doneStages} stages pending (${chapters.length} ch).</div>
            </div>
        `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}

function renderChaptersTab(container, profile) {
    const subjects = Object.keys(SUBJECTS_DEF);
    if (!subjects.includes(currentChapterSubject)) currentChapterSubject = subjects[0];

    let pillHtml = `<div class="subject-pill-filters">`;
    subjects.forEach(sub => {
        const active = currentChapterSubject === sub ? 'active' : '';
        pillHtml += `<button class="pill-btn ${active}" onclick="switchChapterSubject('${sub}')">${sub}</button>`;
    });
    pillHtml += `</div>`;

    const info = SUBJECTS_DEF[currentChapterSubject];
    const chapters = info.chapters;
    const stages = info.stages;
    const syllabus = profile.syllabus?.[currentChapterSubject] || {};
    const prog = profile.progress?.[currentChapterSubject] || {};

    let html = `
        <div class="chapters-header-row">
            <div>
                <h2 style="margin:0 0 5px 0;">${currentChapterSubject} Chapters</h2>
                <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">Manage your chapter progress across all preparation stages.</p>
            </div>
            ${pillHtml}
        </div>
    `;

    chapters.forEach((ch, chIdx) => {
        if (syllabus[chIdx] === false) return;
        let stagesHtml = '';
        stages.forEach((stName, stIdx) => {
            const state = prog[chIdx]?.[stIdx] || 0;
            let cls = '';
            let icon = '○ ';
            if (state === 1) { cls = 'in-progress'; icon = '⏳ '; }
            else if (state === 2) { cls = 'done'; icon = '✓ '; }

            stagesHtml += `
                <button class="stage-chip ${cls}" onclick="cycleStage('${currentChapterSubject}', ${chIdx}, ${stIdx})">
                    ${icon}${stName}
                </button>
            `;
        });

        html += `
            <div class="chapter-item">
                <div class="chapter-title-row">
                    <span>Ch ${chIdx + 1}: ${ch}</span>
                </div>
                <div class="stages-chips">${stagesHtml}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function switchChapterSubject(sub) {
    currentChapterSubject = sub;
    renderApp();
}

function cycleStage(sub, chIdx, stIdx) {
    const profile = getCurrentProfile();
    if (!profile.progress) profile.progress = {};
    if (!profile.progress[sub]) profile.progress[sub] = {};
    if (!profile.progress[sub][chIdx]) profile.progress[sub][chIdx] = {};

    const current = profile.progress[sub][chIdx][stIdx] || 0;
    profile.progress[sub][chIdx][stIdx] = (current + 1) % 3;

    localStorage.setItem('umang_profiles', JSON.stringify(profiles));
    renderApp();
}

function renderInsightsTab(container, profile) {
    let totalAll = 0;
    let doneAll = 0;

    let subStatsHtml = '';
    Object.keys(SUBJECTS_DEF).forEach(sub => {
        let subTotal = 0;
        let subDone = 0;
        const info = SUBJECTS_DEF[sub];
        const syllabus = profile.syllabus?.[sub] || {};
        const prog = profile.progress?.[sub] || {};

        info.chapters.forEach((ch, chIdx) => {
            if (syllabus[chIdx] !== false) {
                info.stages.forEach((st, stIdx) => {
                    subTotal++;
                    if (prog[chIdx]?.[stIdx] === 2) subDone++;
                });
            }
        });
        totalAll += subTotal;
        doneAll += subDone;
        const pct = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;

        subStatsHtml += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 5px;">
                    <span><b>${sub}</b></span>
                    <span>${pct}% Complete</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    });

    const overallPct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

    container.innerHTML = `
        <div class="card">
            <h3 style="margin-top:0;">Study Insights & Analytics</h3>
            <p style="font-size:0.85rem; color:var(--text-muted);">Visual analytics and preparation progress.</p>
            <hr style="border:0; border-top:1px solid var(--border); margin: 15px 0;">
            <h4 style="margin:0 0 10px 0;">Overall Progress (${overallPct}%)</h4>
            <div class="progress-bar" style="height: 12px; margin-bottom: 15px;">
                <div class="progress-fill" style="width: ${overallPct}%"></div>
            </div>
        </div>
        <div class="card">
            <h3 style="margin-top:0;">Subject Analytics</h3>
            ${subStatsHtml}
        </div>
    `;
}

function renderSettingsTab(container, profile) {
    let datesHtml = '';
    Object.keys(SUBJECTS_DEF).forEach(sub => {
        const val = profile.dates?.[sub] || '2026-10-15';
        datesHtml += `
            <div class="form-group">
                <label>${sub} Exam Date</label>
                <input type="date" id="settings-date-${sub}" class="form-control" value="${val}">
            </div>
        `;
    });

    container.innerHTML = `
        <div class="card">
            <h3 style="margin-top:0;">Settings & Profile Management</h3>
            
            <div class="form-group" style="margin-top:20px;">
                <label>Student Name</label>
                <input type="text" id="settings-profile-name" class="form-control" value="${profile.name}">
            </div>

            <h4 style="margin:20px 0 10px 0;">Exam Datesheet</h4>
            ${datesHtml}
            <button class="btn" onclick="saveSettingsDates()" style="margin-top:10px;">Save Changes</button>

            <h4 style="margin:25px 0 10px 0;">Data Backup & Restore</h4>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button class="btn btn-secondary" onclick="exportData()" style="flex:1;">Export JSON</button>
                <button class="btn btn-secondary" onclick="triggerImport()" style="flex:1;">Import JSON</button>
                <input type="file" id="import-file" style="display:none;" onchange="importData(event)">
            </div>
        </div>
    `;
}

function saveSettingsDates() {
    const profile = getCurrentProfile();
    const newName = document.getElementById('settings-profile-name').value.trim();
    if (newName) profile.name = newName;

    Object.keys(SUBJECTS_DEF).forEach(sub => {
        const val = document.getElementById(`settings-date-${sub}`).value;
        if (val) {
            if (!profile.dates) profile.dates = {};
            profile.dates[sub] = val;
        }
    });

    localStorage.setItem('umang_profiles', JSON.stringify(profiles));
    currentProfileName = profile.name;
    localStorage.setItem('umang_active_profile', currentProfileName);
    updateProfileDropdown();
    alert('Settings saved successfully!');
    renderApp();
}

function exportData() {
    const profile = getCurrentProfile();
    let blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `umang-tracker-${profile.name}.json`;
    a.click();
}

function triggerImport() {
    document.getElementById('import-file').click();
}

function importData(event) {
    let file = event.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        try {
            let json = JSON.parse(e.target.result);
            if (json.name) {
                const idx = profiles.findIndex(p => p.name === json.name);
                if (idx >= 0) profiles[idx] = json;
                else profiles.push(json);
                localStorage.setItem('umang_profiles', JSON.stringify(profiles));
                currentProfileName = json.name;
                localStorage.setItem('umang_active_profile', currentProfileName);
                initApp();
                alert("Profile restored successfully!");
            }
        } catch (err) {
            alert("Invalid JSON file.");
        }
    };
    reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
