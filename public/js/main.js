// Main JavaScript for Hard Rock Capital public site

// API base URL
const API_BASE = '/api';

// Get current page slug from URL
function getCurrentSlug() {
    const path = window.location.pathname;
    const match = path.match(/\/page\/([^\/]+)/);
    return match ? match[1] : null;
}

// Load page content by slug
async function loadPageContent(slug) {
    try {
        const response = await fetch(`${API_BASE}/pages/slug/${slug}`);
        if (!response.ok) {
            throw new Error('Page not found');
        }
        
        const page = await response.json();
        displayPageContent(page);
    } catch (error) {
        console.error('Error loading page:', error);
        displayError('Failed to load page content');
    }
}

// Display page content
function displayPageContent(page) {
    const heroSection = document.getElementById('hero');
    const contentSection = document.getElementById('page-content');
    const homeSections = document.getElementById('home-sections');
    
    if (heroSection) {
        heroSection.innerHTML = `
            <h2>${escapeHtml(page.title)}</h2>
        `;
    }
    
    if (contentSection) {
        contentSection.innerHTML = page.content;
        contentSection.style.display = 'block';
    }
    
    if (homeSections) {
        homeSections.style.display = 'none';
    }
    
    // Update page title
    document.title = `${page.title} - Hard Rock Capital`;
}

// Load home page
function loadHomePage() {
    const heroSection = document.getElementById('hero');
    const contentSection = document.getElementById('page-content');
    const homeSections = document.getElementById('home-sections');
    
    if (heroSection) {
        heroSection.innerHTML = `
            <h2>Welcome to Hard Rock Capital</h2>
            <p class="lead">Your trusted partner in financial excellence and investment success</p>
        `;
    }
    
    if (contentSection) {
        contentSection.style.display = 'none';
    }
    
    if (homeSections) {
        homeSections.style.display = 'block';
    }
    
    document.title = 'Hard Rock Capital';
}

// Display error message
function displayError(message) {
    const contentSection = document.getElementById('page-content');
    if (contentSection) {
        contentSection.innerHTML = `
            <div class="alert alert-error">
                <h3>Error</h3>
                <p>${escapeHtml(message)}</p>
                <a href="/" class="btn">Return Home</a>
            </div>
        `;
        contentSection.style.display = 'block';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle navigation
function handleNavigation(event) {
    const target = event.target.closest('a.nav-link');
    if (!target) return;
    
    // Don't prevent default for admin links or external links
    if (target.classList.contains('admin-link') || target.hostname !== window.location.hostname) {
        return;
    }
    
    event.preventDefault();
    const href = target.getAttribute('href');
    
    // Update browser history
    window.history.pushState({}, '', href);
    
    // Load appropriate content
    const slug = getCurrentSlug();
    if (slug) {
        loadPageContent(slug);
    } else {
        loadHomePage();
    }
    
    // Update active nav link
    updateActiveNavLink();
}

// Update active navigation link
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Initialize page
function initializePage() {
    const slug = getCurrentSlug();
    
    if (slug) {
        loadPageContent(slug);
    } else {
        loadHomePage();
    }
    
    updateActiveNavLink();
}

// Event listeners
document.addEventListener('DOMContentLoaded', initializePage);
document.addEventListener('click', handleNavigation);

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    initializePage();
});
