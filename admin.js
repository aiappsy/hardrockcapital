// Admin Panel JavaScript - Hard Rock Capital

// ========== GLOBAL STATE ==========
let sections = [];
let cards = [];
let uploadedMedia = [];
let currentEditingSection = null;
let currentEditingCard = null;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeTabNavigation();
    initializeRangeSliders();
    initializeColorPresets();
    initializeDragAndDrop();
    loadSavedSettings();
    loadSections();
    loadCards();
    loadMedia();
});

// ========== TAB NAVIGATION ==========
function initializeTabNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active class from all tabs and content
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const targetTab = document.getElementById(tabName + 'Tab');
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

// ========== RANGE SLIDERS ==========
function initializeRangeSliders() {
    const sliders = [
        { id: 'baseFontSize', suffix: 'px' },
        { id: 'headingFontSize', suffix: 'px' },
        { id: 'lineHeight', suffix: '' },
        { id: 'letterSpacing', suffix: 'px' },
        { id: 'containerWidth', suffix: 'px' },
        { id: 'sectionSpacing', suffix: 'px' },
        { id: 'borderRadius', suffix: 'px' }
    ];

    sliders.forEach(slider => {
        const input = document.getElementById(slider.id);
        const valueDisplay = document.getElementById(slider.id + 'Value');
        
        if (input && valueDisplay) {
            input.addEventListener('input', function() {
                valueDisplay.textContent = this.value + slider.suffix;
            });
        }
    });
}

// ========== COLOR PRESETS ==========
function initializeColorPresets() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const preset = this.dataset.preset;
            applyColorPreset(preset);
        });
    });
}

function applyColorPreset(preset) {
    const presets = {
        dark: {
            primary: '#1a1a2e',
            secondary: '#16213e',
            accent: '#0f3460',
            background: '#0a0e27',
            text: '#e9ecef'
        },
        light: {
            primary: '#0066cc',
            secondary: '#6c757d',
            accent: '#10b981',
            background: '#ffffff',
            text: '#333333'
        },
        blue: {
            primary: '#0066cc',
            secondary: '#004499',
            accent: '#0088ff',
            background: '#f0f8ff',
            text: '#1a1a1a'
        },
        green: {
            primary: '#10b981',
            secondary: '#059669',
            accent: '#34d399',
            background: '#f0fdf4',
            text: '#1a1a1a'
        },
        purple: {
            primary: '#8b5cf6',
            secondary: '#7c3aed',
            accent: '#a78bfa',
            background: '#faf5ff',
            text: '#1a1a1a'
        }
    };

    const colors = presets[preset];
    if (colors) {
        document.getElementById('primaryColor').value = colors.primary;
        document.getElementById('secondaryColor').value = colors.secondary;
        document.getElementById('accentColor').value = colors.accent;
        document.getElementById('backgroundColor').value = colors.background;
        document.getElementById('textColor').value = colors.text;
        
        showNotification('Color preset applied successfully!', 'success');
    }
}

// ========== GENERAL SETTINGS ==========
function saveGeneralSettings() {
    const settings = {
        siteTitle: document.getElementById('siteTitle').value,
        siteTagline: document.getElementById('siteTagline').value,
        metaDescription: document.getElementById('metaDescription').value,
        faviconUrl: document.getElementById('faviconUrl').value
    };

    localStorage.setItem('generalSettings', JSON.stringify(settings));
    showNotification('General settings saved successfully!', 'success');
}

// ========== COLOR SETTINGS ==========
function saveColorSettings() {
    const settings = {
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value,
        accentColor: document.getElementById('accentColor').value,
        backgroundColor: document.getElementById('backgroundColor').value,
        textColor: document.getElementById('textColor').value
    };

    localStorage.setItem('colorSettings', JSON.stringify(settings));
    showNotification('Color settings saved successfully!', 'success');
}

// ========== TYPOGRAPHY SETTINGS ==========
function saveTypographySettings() {
    const settings = {
        fontFamily: document.getElementById('fontFamily').value,
        baseFontSize: document.getElementById('baseFontSize').value,
        headingFontSize: document.getElementById('headingFontSize').value,
        lineHeight: document.getElementById('lineHeight').value,
        letterSpacing: document.getElementById('letterSpacing').value
    };

    localStorage.setItem('typographySettings', JSON.stringify(settings));
    showNotification('Typography settings saved successfully!', 'success');
}

// ========== LAYOUT SETTINGS ==========
function saveLayoutSettings() {
    const settings = {
        containerWidth: document.getElementById('containerWidth').value,
        sectionSpacing: document.getElementById('sectionSpacing').value,
        borderRadius: document.getElementById('borderRadius').value,
        headerStyle: document.getElementById('headerStyle').value
    };

    localStorage.setItem('layoutSettings', JSON.stringify(settings));
    showNotification('Layout settings saved successfully!', 'success');
}

// ========== SECTION MANAGEMENT ==========
function openSectionModal(sectionId = null) {
    const modal = document.getElementById('sectionModal');
    const modalTitle = document.getElementById('sectionModalTitle');
    
    if (sectionId) {
        // Edit mode
        const section = sections.find(s => s.id === sectionId);
        if (section) {
            modalTitle.textContent = 'Edit Section';
            document.getElementById('sectionId').value = section.id;
            document.getElementById('sectionTitle').value = section.title;
            document.getElementById('sectionContent').value = section.content;
            document.getElementById('sectionBackground').value = section.background;
            currentEditingSection = sectionId;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Section';
        document.getElementById('sectionId').value = '';
        document.getElementById('sectionTitle').value = '';
        document.getElementById('sectionContent').value = '';
        document.getElementById('sectionBackground').value = '#ffffff';
        currentEditingSection = null;
    }
    
    modal.classList.add('active');
}

function closeSectionModal() {
    const modal = document.getElementById('sectionModal');
    modal.classList.remove('active');
    currentEditingSection = null;
}

function saveSection() {
    const title = document.getElementById('sectionTitle').value;
    const content = document.getElementById('sectionContent').value;
    const background = document.getElementById('sectionBackground').value;

    if (!title || !content) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (currentEditingSection) {
        // Update existing section
        const index = sections.findIndex(s => s.id === currentEditingSection);
        if (index !== -1) {
            sections[index] = {
                id: currentEditingSection,
                title,
                content,
                background
            };
        }
    } else {
        // Add new section
        const newSection = {
            id: 'section-' + Date.now(),
            title,
            content,
            background
        };
        sections.push(newSection);
    }

    localStorage.setItem('sections', JSON.stringify(sections));
    loadSections();
    closeSectionModal();
    showNotification('Section saved successfully!', 'success');
}

function deleteSection(sectionId) {
    if (confirm('Are you sure you want to delete this section?')) {
        sections = sections.filter(s => s.id !== sectionId);
        localStorage.setItem('sections', JSON.stringify(sections));
        loadSections();
        showNotification('Section deleted successfully!', 'success');
    }
}

function loadSections() {
    const saved = localStorage.getItem('sections');
    if (saved) {
        sections = JSON.parse(saved);
    }

    const grid = document.getElementById('sectionsGrid');
    
    if (sections.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <h3>No sections yet</h3>
                <p>Click "Add New Section" to create your first section</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = sections.map(section => `
        <div class="section-card">
            <h3>${escapeHtml(section.title)}</h3>
            <p>${escapeHtml(section.content.substring(0, 100))}${section.content.length > 100 ? '...' : ''}</p>
            <div class="card-actions">
                <button class="btn-edit" onclick="openSectionModal('${section.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteSection('${section.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// ========== CARD MANAGEMENT ==========
function openCardModal(cardId = null) {
    const modal = document.getElementById('cardModal');
    const modalTitle = document.getElementById('cardModalTitle');
    
    if (cardId) {
        // Edit mode
        const card = cards.find(c => c.id === cardId);
        if (card) {
            modalTitle.textContent = 'Edit Card';
            document.getElementById('cardId').value = card.id;
            document.getElementById('cardTitle').value = card.title;
            document.getElementById('cardDescription').value = card.description;
            document.getElementById('cardImage').value = card.image || '';
            document.getElementById('cardButtonText').value = card.buttonText || '';
            document.getElementById('cardButtonUrl').value = card.buttonUrl || '';
            currentEditingCard = cardId;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Card';
        document.getElementById('cardId').value = '';
        document.getElementById('cardTitle').value = '';
        document.getElementById('cardDescription').value = '';
        document.getElementById('cardImage').value = '';
        document.getElementById('cardButtonText').value = '';
        document.getElementById('cardButtonUrl').value = '';
        currentEditingCard = null;
    }
    
    modal.classList.add('active');
}

function closeCardModal() {
    const modal = document.getElementById('cardModal');
    modal.classList.remove('active');
    currentEditingCard = null;
}

function saveCard() {
    const title = document.getElementById('cardTitle').value;
    const description = document.getElementById('cardDescription').value;
    const image = document.getElementById('cardImage').value;
    const buttonText = document.getElementById('cardButtonText').value;
    const buttonUrl = document.getElementById('cardButtonUrl').value;

    if (!title || !description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (currentEditingCard) {
        // Update existing card
        const index = cards.findIndex(c => c.id === currentEditingCard);
        if (index !== -1) {
            cards[index] = {
                id: currentEditingCard,
                title,
                description,
                image,
                buttonText,
                buttonUrl
            };
        }
    } else {
        // Add new card
        const newCard = {
            id: 'card-' + Date.now(),
            title,
            description,
            image,
            buttonText,
            buttonUrl
        };
        cards.push(newCard);
    }

    localStorage.setItem('cards', JSON.stringify(cards));
    loadCards();
    closeCardModal();
    showNotification('Card saved successfully!', 'success');
}

function deleteCard(cardId) {
    if (confirm('Are you sure you want to delete this card?')) {
        cards = cards.filter(c => c.id !== cardId);
        localStorage.setItem('cards', JSON.stringify(cards));
        loadCards();
        showNotification('Card deleted successfully!', 'success');
    }
}

function loadCards() {
    const saved = localStorage.getItem('cards');
    if (saved) {
        cards = JSON.parse(saved);
    }

    const grid = document.getElementById('cardsGrid');
    
    if (cards.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🗂️</div>
                <h3>No cards yet</h3>
                <p>Click "Add New Card" to create your first content card</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = cards.map(card => `
        <div class="content-card">
            ${card.image ? `<img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.title)}">` : ''}
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.description)}</p>
            ${card.buttonText ? `<div class="card-button-info">Button: ${escapeHtml(card.buttonText)}</div>` : ''}
            <div class="card-actions">
                <button class="btn-edit" onclick="openCardModal('${card.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteCard('${card.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// ========== DRAG AND DROP FILE UPLOAD ==========
function initializeDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // Click to upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    // Drag and drop events
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
}

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const mediaItem = {
                    id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    url: e.target.result,
                    uploadDate: new Date().toISOString()
                };
                
                uploadedMedia.push(mediaItem);
                localStorage.setItem('media', JSON.stringify(uploadedMedia));
                loadMedia();
                showNotification('Image uploaded successfully!', 'success');
            };
            
            reader.readAsDataURL(file);
        } else {
            showNotification('Please upload only image files', 'error');
        }
    });
}

function loadMedia() {
    const saved = localStorage.getItem('media');
    if (saved) {
        uploadedMedia = JSON.parse(saved);
    }

    const grid = document.getElementById('mediaGrid');
    
    if (uploadedMedia.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🖼️</div>
                <h3>No media yet</h3>
                <p>Upload images to start building your media library</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = uploadedMedia.map(media => `
        <div class="media-item">
            <img src="${media.url}" alt="${escapeHtml(media.name)}">
            <div class="media-item-actions">
                <button onclick="deleteMedia('${media.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteMedia(mediaId) {
    if (confirm('Are you sure you want to delete this media item?')) {
        uploadedMedia = uploadedMedia.filter(m => m.id !== mediaId);
        localStorage.setItem('media', JSON.stringify(uploadedMedia));
        loadMedia();
        showNotification('Media deleted successfully!', 'success');
    }
}

// ========== LOAD SAVED SETTINGS ==========
function loadSavedSettings() {
    // Load general settings
    const generalSettings = localStorage.getItem('generalSettings');
    if (generalSettings) {
        const settings = JSON.parse(generalSettings);
        document.getElementById('siteTitle').value = settings.siteTitle || '';
        document.getElementById('siteTagline').value = settings.siteTagline || '';
        document.getElementById('metaDescription').value = settings.metaDescription || '';
        document.getElementById('faviconUrl').value = settings.faviconUrl || '';
    }

    // Load color settings
    const colorSettings = localStorage.getItem('colorSettings');
    if (colorSettings) {
        const settings = JSON.parse(colorSettings);
        document.getElementById('primaryColor').value = settings.primaryColor || '#0066cc';
        document.getElementById('secondaryColor').value = settings.secondaryColor || '#6c757d';
        document.getElementById('accentColor').value = settings.accentColor || '#10b981';
        document.getElementById('backgroundColor').value = settings.backgroundColor || '#ffffff';
        document.getElementById('textColor').value = settings.textColor || '#333333';
    }

    // Load typography settings
    const typographySettings = localStorage.getItem('typographySettings');
    if (typographySettings) {
        const settings = JSON.parse(typographySettings);
        document.getElementById('fontFamily').value = settings.fontFamily || 'Inter';
        document.getElementById('baseFontSize').value = settings.baseFontSize || '16';
        document.getElementById('headingFontSize').value = settings.headingFontSize || '32';
        document.getElementById('lineHeight').value = settings.lineHeight || '1.5';
        document.getElementById('letterSpacing').value = settings.letterSpacing || '0';
        
        // Update value displays
        document.getElementById('baseFontSizeValue').textContent = settings.baseFontSize + 'px';
        document.getElementById('headingFontSizeValue').textContent = settings.headingFontSize + 'px';
        document.getElementById('lineHeightValue').textContent = settings.lineHeight;
        document.getElementById('letterSpacingValue').textContent = settings.letterSpacing + 'px';
    }

    // Load layout settings
    const layoutSettings = localStorage.getItem('layoutSettings');
    if (layoutSettings) {
        const settings = JSON.parse(layoutSettings);
        document.getElementById('containerWidth').value = settings.containerWidth || '1200';
        document.getElementById('sectionSpacing').value = settings.sectionSpacing || '80';
        document.getElementById('borderRadius').value = settings.borderRadius || '8';
        document.getElementById('headerStyle').value = settings.headerStyle || 'fixed';
        
        // Update value displays
        document.getElementById('containerWidthValue').textContent = settings.containerWidth + 'px';
        document.getElementById('sectionSpacingValue').textContent = settings.sectionSpacing + 'px';
        document.getElementById('borderRadiusValue').textContent = settings.borderRadius + 'px';
    }
}

// ========== PREVIEW AND PUBLISH ==========
document.getElementById('previewBtn').addEventListener('click', function() {
    showNotification('Opening preview...', 'info');
    // In a real implementation, this would open a preview of the site
    setTimeout(() => {
        window.open('/index.html', '_blank');
    }, 500);
});

document.getElementById('publishBtn').addEventListener('click', function() {
    // Collect all settings
    const allSettings = {
        general: JSON.parse(localStorage.getItem('generalSettings') || '{}'),
        colors: JSON.parse(localStorage.getItem('colorSettings') || '{}'),
        typography: JSON.parse(localStorage.getItem('typographySettings') || '{}'),
        layout: JSON.parse(localStorage.getItem('layoutSettings') || '{}'),
        sections: sections,
        cards: cards,
        media: uploadedMedia,
        publishedAt: new Date().toISOString()
    };

    localStorage.setItem('publishedSettings', JSON.stringify(allSettings));
    showNotification('Settings published successfully! 🎉', 'success');
    
    // In a real implementation, this would send the settings to a server
    console.log('Published settings:', allSettings);
});

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type]}</span>
        <span class="notification-message">${escapeHtml(message)}</span>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========== UTILITY FUNCTIONS ==========
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Make functions globally accessible
window.saveGeneralSettings = saveGeneralSettings;
window.saveColorSettings = saveColorSettings;
window.saveTypographySettings = saveTypographySettings;
window.saveLayoutSettings = saveLayoutSettings;
window.openSectionModal = openSectionModal;
window.closeSectionModal = closeSectionModal;
window.saveSection = saveSection;
window.deleteSection = deleteSection;
window.openCardModal = openCardModal;
window.closeCardModal = closeCardModal;
window.saveCard = saveCard;
window.deleteCard = deleteCard;
window.deleteMedia = deleteMedia;
