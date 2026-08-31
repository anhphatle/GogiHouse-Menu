// Main application script for menu list page

document.addEventListener('DOMContentLoaded', function() {
    // Detect Zalo webview
    const isZalo = /zalo/i.test(navigator.userAgent) || 
                   /zalo/i.test(navigator.vendor) ||
                   window.__ZALO__ !== undefined;
    
    // Splash Screen functionality
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.querySelector('.main-content');
    
    // Adjust timing for Zalo webview
    const splashDuration = isZalo ? 2000 : 3500;
    
    // Ensure splash screen is visible initially
    if (splashScreen) {
        splashScreen.style.display = 'flex';
        splashScreen.style.opacity = '1';
        
        // For Zalo, simplify animations
        if (isZalo) {
            splashScreen.style.transition = 'opacity 0.5s ease-out';
        }
    }
    
    // Ensure main content is hidden initially
    if (mainContent) {
        mainContent.style.opacity = '0';
    }
    
    // Auto-dismiss splash screen
    setTimeout(function() {
        if (splashScreen) {
            if (isZalo) {
                // Simple fade for Zalo
                splashScreen.style.opacity = '0';
            } else {
                splashScreen.classList.add('fade-out');
            }
            
            // Show main content after splash screen starts fading
            setTimeout(function() {
                if (mainContent) {
                    mainContent.classList.add('visible');
                    mainContent.style.opacity = '1';
                }
                
                // Remove splash screen from DOM after animation completes
                setTimeout(function() {
                    if (splashScreen) {
                        splashScreen.style.display = 'none';
                        splashScreen.remove();
                    }
                }, isZalo ? 500 : 800);
            }, isZalo ? 200 : 400);
        }
    }, splashDuration);
    
    // Main application functionality
    const loadingElement = document.getElementById('loading');
    const errorMessageElement = document.getElementById('error-message');
    const menuListElement = document.getElementById('menu-list');
    
    // Load menus from JSON file
    loadMenus();
    
    async function loadMenus() {
        try {
            const response = await fetch('menus.json');
            
            if (!response.ok) {
                throw new Error('Failed to load menus.json');
            }
            
            const menus = await response.json();
            
            // Hide loading and show menu list
            loadingElement.classList.add('d-none');
            menuListElement.classList.remove('d-none');
            
            // Render menu cards
            renderMenuCards(menus);
            
        } catch (error) {
            console.error('Error loading menus:', error);
            
            // Hide loading and show error
            loadingElement.classList.add('d-none');
            errorMessageElement.classList.remove('d-none');
        }
    }
    
    function renderMenuCards(menus) {
        menuListElement.innerHTML = '';
        
        menus.forEach(menu => {
            const card = createMenuCard(menu);
            menuListElement.appendChild(card);
        });
    }
    
    function createMenuCard(menu) {
        const card = document.createElement('a');
        card.className = 'menu-card';
        card.href = `menu.html?id=${encodeURIComponent(menu.id)}`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        
        // Create cover image
        const coverImg = document.createElement('img');
        coverImg.className = 'menu-card-cover';
        coverImg.src = menu.cover;
        coverImg.alt = menu.name;
        coverImg.loading = 'lazy';
        
        // Handle image error
        coverImg.onerror = function() {
            this.style.display = 'none';
        };
        
        // Create overlay with background
        const overlay = document.createElement('div');
        overlay.className = 'menu-card-overlay';
        
        // Create info section
        const info = document.createElement('div');
        info.className = 'menu-card-info';
        
        const name = document.createElement('h2');
        name.className = 'menu-card-name';
        
        // Split menu name at "-" for subtitle
        if (menu.name.includes('-')) {
            const parts = menu.name.split('-');
            const mainTitle = document.createElement('span');
            mainTitle.className = 'main-title';
            mainTitle.textContent = parts[0].trim();
            
            const subtitle = document.createElement('span');
            subtitle.className = 'subtitle';
            subtitle.textContent = parts[1].trim();
            
            name.appendChild(mainTitle);
            name.appendChild(subtitle);
        } else {
            name.textContent = menu.name;
        }
        
        info.appendChild(name);
        overlay.appendChild(info);
        card.appendChild(coverImg);
        card.appendChild(overlay);
        
        return card;
    }
});
