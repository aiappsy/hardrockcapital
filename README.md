# Hard Rock Capital Website

A complete single-page website with admin panel and GitHub API integration for content management.

## Features

### Website Sections
- **Header:** Fixed navigation with logo and responsive menu
- **Hero:** Full-screen hero section with background image
- **Intro:** Company overview and value proposition
- **Services:** Grid layout showcasing 4 core services
- **Mechanism:** 4-step value creation process
- **Process:** Client onboarding process with numbered steps
- **FAQ:** 6 common questions with detailed answers
- **CTA:** Call-to-action section with contact information
- **Footer:** Company information and legal disclaimer

### Admin Panel
Access the admin panel by pressing **Ctrl+Alt+A** on your keyboard.

#### Features:
- **Content Editing:** Click on any text to edit (when edit mode is enabled)
- **Menu Management:** Add, edit, or delete navigation menu items
- **GitHub Integration:** Save changes directly to the repository
- **Backup/Restore:** Export and import content as JSON files
- **Token Management:** Securely store your GitHub Personal Access Token

## Setup Instructions

### For End Users
1. Open `index.html` in a web browser
2. The website will automatically load content from `content.json`
3. All content is editable through the admin panel

### For Administrators

#### First-Time Setup
1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "Hard Rock Capital Admin"
   - Select scopes: `repo` (Full control of private repositories)
   - Click "Generate token" and copy it

2. Access the admin panel:
   - Press **Ctrl+Alt+A** on the website
   - Paste your token in the "GitHub Personal Access Token" field
   - Click "Save Token"

#### Editing Content
1. Press **Ctrl+Alt+A** to open admin panel
2. Click "Enable Content Editing"
3. Click on any text element to edit it
4. Click "Save Changes to GitHub" to commit your changes
5. Changes will be pushed to the repository's `content.json` file

#### Managing Menu Items
1. Press **Ctrl+Alt+A** to open admin panel
2. Click "Manage Menu Items"
3. Follow the prompts to add, edit, or delete menu items
4. Remember to save changes to GitHub

#### Backup and Restore
- **Export:** Click "Export Content JSON" to download a backup
- **Import:** Click "Import Content JSON" to restore from a backup file

## Technical Details

### Architecture
- Single-file HTML with embedded CSS and JavaScript
- No external dependencies or frameworks
- Self-contained and portable

### Content Management
- All content stored in `content.json`
- 37+ editable text elements throughout the page
- Content loaded via GitHub API with local fallback

### Responsive Design
- Mobile-first approach
- Breakpoint at 768px for tablet/mobile devices
- Hamburger menu for mobile navigation

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features

## Files

- **index.html** - Main website file (1,081 lines)
- **content.json** - Content data structure (162 lines)
- **README.md** - This documentation file

## Security

- GitHub tokens stored in browser's localStorage
- No hardcoded credentials
- HTTPS API calls to GitHub
- Content sanitization for XSS prevention

## Development

### Local Testing
```bash
# Start a local server
python3 -m http.server 8000

# Open in browser
http://localhost:8000
```

### Modifying Content Structure
Edit `content.json` to change the content structure. The file includes:
- Meta information (title, description)
- Navigation menu items
- Hero section content
- All section content (intro, services, mechanism, process, FAQ, CTA, footer)

## Support

For issues or questions, contact: contact@hardrockcapital.com

## License

© 2025 Hard Rock Capital. All rights reserved.