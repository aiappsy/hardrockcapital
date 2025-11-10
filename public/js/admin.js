// Admin JavaScript for Hard Rock Capital

const API_BASE = '/api';
let currentPages = [];
let editingPageId = null;

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE}/auth/status`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = '/admin/login';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/admin/login';
    }
}

// Load all pages
async function loadPages() {
    try {
        const response = await fetch(`${API_BASE}/pages`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to load pages');
        }
        
        currentPages = await response.json();
        displayPages();
    } catch (error) {
        console.error('Error loading pages:', error);
        showAlert('Failed to load pages', 'error');
    }
}

// Display pages in the list
function displayPages() {
    const pagesList = document.getElementById('pages-list');
    
    if (currentPages.length === 0) {
        pagesList.innerHTML = `
            <div class="content-section" style="text-align: center;">
                <p>No pages yet. Create your first page!</p>
            </div>
        `;
        return;
    }
    
    pagesList.innerHTML = currentPages.map(page => `
        <div class="page-item">
            <div class="page-info">
                <h3>${escapeHtml(page.title)}</h3>
                <p>Slug: /${escapeHtml(page.slug)} | Status: ${page.is_published ? 'Published' : 'Draft'}</p>
                <small>Last updated: ${new Date(page.updated_at).toLocaleString()}</small>
            </div>
            <div class="page-actions">
                <button onclick="previewPage(${page.id})" class="btn btn-secondary">Preview</button>
                <button onclick="editPage(${page.id})" class="btn">Edit</button>
                <button onclick="deletePage(${page.id}, '${escapeHtml(page.title)}')" class="btn btn-danger">Delete</button>
            </div>
        </div>
    `).join('');
}

// Show create modal
function showCreateModal() {
    editingPageId = null;
    document.getElementById('modal-title').textContent = 'Create New Page';
    document.getElementById('page-form').reset();
    document.getElementById('page-id').value = '';
    document.getElementById('page-published').checked = true;
    document.getElementById('page-modal').classList.add('active');
}

// Edit page
async function editPage(pageId) {
    try {
        const response = await fetch(`${API_BASE}/pages/${pageId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to load page');
        }
        
        const page = await response.json();
        editingPageId = pageId;
        
        document.getElementById('modal-title').textContent = 'Edit Page';
        document.getElementById('page-id').value = page.id;
        document.getElementById('page-title').value = page.title;
        document.getElementById('page-slug').value = page.slug;
        document.getElementById('page-content').value = page.content || '';
        document.getElementById('page-meta').value = page.meta_description || '';
        document.getElementById('page-published').checked = page.is_published;
        
        document.getElementById('page-modal').classList.add('active');
    } catch (error) {
        console.error('Error loading page:', error);
        showAlert('Failed to load page details', 'error');
    }
}

// Preview page
async function previewPage(pageId) {
    try {
        const response = await fetch(`${API_BASE}/pages/${pageId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to load page');
        }
        
        const page = await response.json();
        
        document.getElementById('preview-title').textContent = page.title;
        document.getElementById('preview-content').innerHTML = page.content;
        document.getElementById('preview-modal').classList.add('active');
    } catch (error) {
        console.error('Error loading page:', error);
        showAlert('Failed to load page preview', 'error');
    }
}

// Delete page
async function deletePage(pageId, pageTitle) {
    if (!confirm(`Are you sure you want to delete "${pageTitle}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/pages/${pageId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete page');
        }
        
        showAlert('Page deleted successfully', 'success');
        loadPages();
    } catch (error) {
        console.error('Error deleting page:', error);
        showAlert('Failed to delete page', 'error');
    }
}

// Handle page form submission
document.getElementById('page-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const pageData = {
        title: document.getElementById('page-title').value,
        slug: document.getElementById('page-slug').value,
        content: document.getElementById('page-content').value,
        metaDescription: document.getElementById('page-meta').value,
        isPublished: document.getElementById('page-published').checked
    };
    
    try {
        const url = editingPageId 
            ? `${API_BASE}/pages/${editingPageId}`
            : `${API_BASE}/pages`;
        
        const method = editingPageId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(pageData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save page');
        }
        
        showAlert(editingPageId ? 'Page updated successfully' : 'Page created successfully', 'success');
        closeModal();
        loadPages();
    } catch (error) {
        console.error('Error saving page:', error);
        showAlert(error.message, 'error');
    }
});

// Close modal
function closeModal() {
    document.getElementById('page-modal').classList.remove('active');
    editingPageId = null;
}

// Close preview modal
function closePreviewModal() {
    document.getElementById('preview-modal').classList.remove('active');
}

// Show alert
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    
    alertContainer.innerHTML = `
        <div class="alert ${alertClass}">
            ${escapeHtml(message)}
        </div>
    `;
    
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Logout
async function logout() {
    try {
        const response = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/admin/login';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-generate slug from title
document.getElementById('page-title').addEventListener('input', (e) => {
    if (!editingPageId) { // Only auto-generate for new pages
        const slug = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        document.getElementById('page-slug').value = slug;
    }
});

// Close modals on outside click
document.getElementById('page-modal').addEventListener('click', (e) => {
    if (e.target.id === 'page-modal') {
        closeModal();
    }
});

document.getElementById('preview-modal').addEventListener('click', (e) => {
    if (e.target.id === 'preview-modal') {
        closePreviewModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    loadPages();
});
