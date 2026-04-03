/* ============================================
   ADMIN.JS - Gallery Management Dashboard
   ============================================ */

// Default admin password (SHA-256 hash of "iloveyou")
// You can change this — see instructions below
const ADMIN_PASSWORD_HASH = '43b1e6e28e3af39e655bcc05eb3eb8d0db2a763c210e0a95ef8c3bfbbb tried';
const ADMIN_PASSWORD = 'iloveyou'; // Simple check for personal site

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initLogin();
    initUpload();
    initConfig();
    initLogout();
});

/* ============================================
   SESSION MANAGEMENT
   ============================================ */
function checkSession() {
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    loadAdminGallery();
}

function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    sessionStorage.removeItem('admin_logged_in');
}

/* ============================================
   LOGIN
   ============================================ */
function initLogin() {
    const form = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const errorMsg = document.getElementById('login-error');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = passwordInput.value.trim();

        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_logged_in', 'true');
            errorMsg.textContent = '';
            showDashboard();
        } else {
            errorMsg.textContent = '❌ Wrong password! Try again.';
            passwordInput.value = '';
            passwordInput.focus();
            
            // Shake animation
            const container = document.querySelector('.login-container');
            container.style.animation = 'shake 0.5s ease';
            setTimeout(() => container.style.animation = '', 500);
        }
    });

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   LOGOUT
   ============================================ */
function initLogout() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        showLogin();
    });
}

/* ============================================
   FILE UPLOAD
   ============================================ */
function initUpload() {
    const zone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const progressContainer = document.getElementById('upload-progress-container');

    // Click to browse
    zone.addEventListener('click', () => fileInput.click());

    // File selected
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = ''; // Reset
    });

    // Drag & Drop
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
}

async function handleFiles(files) {
    if (!files || files.length === 0) return;

    const progressContainer = document.getElementById('upload-progress-container');
    const uploadItems = document.getElementById('upload-items');
    progressContainer.classList.remove('hidden');

    for (const file of files) {
        const itemId = 'upload-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        
        // Create progress UI
        const itemEl = document.createElement('div');
        itemEl.className = 'upload-item';
        itemEl.id = itemId;
        itemEl.innerHTML = `
            <div class="upload-item-info">
                <div class="upload-item-name">${file.name}</div>
                <div class="upload-progress-bar">
                    <div class="upload-progress-fill" id="${itemId}-fill"></div>
                </div>
            </div>
            <div class="upload-item-status" id="${itemId}-status">0%</div>
        `;
        uploadItems.appendChild(itemEl);

        try {
            const result = await uploadToCloudinary(file, (percent) => {
                document.getElementById(`${itemId}-fill`).style.width = `${percent}%`;
                document.getElementById(`${itemId}-status`).textContent = `${percent}%`;
            });

            document.getElementById(`${itemId}-fill`).style.width = '100%';
            document.getElementById(`${itemId}-fill`).style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            document.getElementById(`${itemId}-status`).textContent = '✅ Done';
            document.getElementById(`${itemId}-status`).className = 'upload-item-status success';

            console.log('Uploaded:', result);
        } catch (err) {
            document.getElementById(`${itemId}-fill`).style.background = '#ef4444';
            document.getElementById(`${itemId}-status`).textContent = '❌ Failed';
            document.getElementById(`${itemId}-status`).className = 'upload-item-status error';
            console.error('Upload error:', err);
        }
    }

    // Refresh gallery after all uploads
    setTimeout(() => loadAdminGallery(), 2000);
}

/* ============================================
   ADMIN GALLERY
   ============================================ */
async function loadAdminGallery() {
    const grid = document.getElementById('admin-gallery-grid');
    grid.innerHTML = '<div class="loading-placeholder">Loading gallery...</div>';

    const [images, videos] = await Promise.all([
        fetchGalleryMedia(),
        fetchVideoMedia()
    ]);

    const allMedia = [
        ...images.map(m => ({ ...m, mediaType: 'photo' })),
        ...videos.map(m => ({ ...m, mediaType: 'video' }))
    ];

    // Update stats
    document.getElementById('stat-total').textContent = allMedia.length;
    document.getElementById('stat-photos').textContent = images.length;
    document.getElementById('stat-videos').textContent = videos.length;

    if (allMedia.length === 0) {
        grid.innerHTML = '<div class="loading-placeholder">No media uploaded yet. Use the upload section above to add photos and videos!</div>';
        return;
    }

    grid.innerHTML = '';

    allMedia.forEach(item => {
        const div = document.createElement('div');
        div.className = 'admin-gallery-item';
        div.innerHTML = `
            <img src="${item.thumbnail}" alt="Media" loading="lazy">
            <span class="media-badge">${item.mediaType === 'video' ? '🎬 Video' : '📷 Photo'}</span>
        `;
        grid.appendChild(div);
    });
}

// Refresh button
document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-gallery');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadAdminGallery);
    }
});

/* ============================================
   CLOUDINARY CONFIG
   ============================================ */
function initConfig() {
    // Load saved config
    const savedConfig = localStorage.getItem('cloudinary_config');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        document.getElementById('config-cloud-name').value = config.cloudName || '';
        document.getElementById('config-upload-preset').value = config.uploadPreset || '';
        document.getElementById('config-folder').value = config.folder || '';
        document.getElementById('config-tag').value = config.tag || '';
        
        // Apply to global config
        Object.assign(CloudinaryConfig, config);
    }

    document.getElementById('save-config').addEventListener('click', () => {
        const config = {
            cloudName: document.getElementById('config-cloud-name').value.trim(),
            uploadPreset: document.getElementById('config-upload-preset').value.trim(),
            folder: document.getElementById('config-folder').value.trim(),
            tag: document.getElementById('config-tag').value.trim()
        };

        // Save to localStorage
        localStorage.setItem('cloudinary_config', JSON.stringify(config));

        // Apply to global config
        Object.assign(CloudinaryConfig, config);

        // Visual feedback
        const btn = document.getElementById('save-config');
        const originalText = btn.textContent;
        btn.textContent = '✅ Saved!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);

        // Reload gallery with new config
        loadAdminGallery();
    });
}
