// Menu viewer script with lazy loading and preloading

document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('loading');
    const errorMessageElement = document.getElementById('error-message');
    const errorTextElement = document.getElementById('error-text');
    const errorBackButton = document.getElementById('error-back-button');
    const menuPagesElement = document.getElementById('menu-pages');
    const backButton = document.getElementById('back-button');
    const menuTitle = document.getElementById('menu-title');
    
    // Get menu ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const menuId = urlParams.get('id');
    
    // Preload configuration
    const PRELOAD_COUNT = 3; // Number of pages to preload ahead
    const PRELOAD_THRESHOLD = 0.5; // Intersection threshold for triggering preload
    
    // Store loaded images for preloading
    const preloadedImages = new Map();
    
    // Initialize
    if (menuId) {
        loadMenu(menuId);
    } else {
        showError('Không tìm thấy menu ID.');
    }
    
    // Back button functionality
    backButton.addEventListener('click', function() {
        goBack();
    });
    
    errorBackButton.addEventListener('click', function() {
        goBack();
    });
    
    function goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    }
    
    async function loadMenu(id) {
        try {
            const response = await fetch('menus.json');
            
            if (!response.ok) {
                throw new Error('Failed to load menus.json');
            }
            
            const menus = await response.json();
            const menu = menus.find(m => m.id === id);
            
            if (!menu) {
                throw new Error('Menu not found');
            }
            
            // Update title
            menuTitle.textContent = menu.name;
            
            // Hide loading and show menu pages
            loadingElement.classList.add('d-none');
            menuPagesElement.classList.remove('d-none');
            
            // Render menu pages
            renderMenuPages(menu);
            
        } catch (error) {
            console.error('Error loading menu:', error);
            showError('Không tìm thấy menu.');
        }
    }
    
    function showError(message) {
        loadingElement.classList.add('d-none');
        menuPagesElement.classList.add('d-none');
        errorTextElement.textContent = message;
        errorMessageElement.classList.remove('d-none');
    }
    
    function renderMenuPages(menu) {
        menuPagesElement.innerHTML = '';
        
        // Create page elements for all pages
        for (let i = 1; i <= menu.pages; i++) {
            const pageElement = createPageElement(menu, i);
            menuPagesElement.appendChild(pageElement);
        }
        
        // Set up intersection observer for lazy loading and preloading
        setupIntersectionObserver(menu);
        
        // Load first page immediately
        loadPage(menu, 1);
        
        // Preload next few pages
        for (let i = 2; i <= Math.min(PRELOAD_COUNT + 1, menu.pages); i++) {
            preloadPage(menu, i);
        }
    }
    
    function createPageElement(menu, pageNumber) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'menu-page';
        pageDiv.dataset.pageNumber = pageNumber;
        
        // Create loading placeholder
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'menu-page-loading';
        loadingDiv.id = `page-${pageNumber}-loading`;
        loadingDiv.innerHTML = '<i class="bi bi-hourglass-split"></i> Đang tải...';
        
        // Create image element (hidden initially)
        const img = document.createElement('img');
        img.className = 'menu-page-img';
        img.id = `page-${pageNumber}-img`;
        img.alt = `${menu.name} - Trang ${pageNumber}`;
        img.style.display = 'none';
        
        // Create error element (hidden initially)
        const errorDiv = document.createElement('div');
        errorDiv.className = 'menu-page-error';
        errorDiv.id = `page-${pageNumber}-error`;
        errorDiv.style.display = 'none';
        errorDiv.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Không thể tải hình ảnh.';
        
        pageDiv.appendChild(loadingDiv);
        pageDiv.appendChild(img);
        pageDiv.appendChild(errorDiv);
        
        return pageDiv;
    }
    
    function setupIntersectionObserver(menu) {
        const observerOptions = {
            root: null,
            rootMargin: '200px', // Start preloading when page is 200px away
            threshold: PRELOAD_THRESHOLD
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const pageNumber = parseInt(entry.target.dataset.pageNumber);
                    
                    // Load the current page if not already loaded
                    loadPage(menu, pageNumber);
                    
                    // Preload next pages
                    for (let i = 1; i <= PRELOAD_COUNT; i++) {
                        const nextPage = pageNumber + i;
                        if (nextPage <= menu.pages) {
                            preloadPage(menu, nextPage);
                        }
                    }
                }
            });
        }, observerOptions);
        
        // Observe all page elements
        const pageElements = document.querySelectorAll('.menu-page');
        pageElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    function loadPage(menu, pageNumber) {
        const img = document.getElementById(`page-${pageNumber}-img`);
        const loading = document.getElementById(`page-${pageNumber}-loading`);
        const error = document.getElementById(`page-${pageNumber}-error`);
        
        // Check if already loaded
        if (img && img.dataset.loaded === 'true') {
            return;
        }
        
        const imageUrl = getPageImageUrl(menu, pageNumber);
        
        // Check if already preloaded
        if (preloadedImages.has(imageUrl)) {
            const preloadedImg = preloadedImages.get(imageUrl);
            if (preloadedImg.complete) {
                // Use preloaded image
                img.src = imageUrl;
                img.style.display = 'block';
                loading.style.display = 'none';
                img.dataset.loaded = 'true';
                return;
            }
        }
        
        // Load image
        img.src = imageUrl;
        
        img.onload = function() {
            img.style.display = 'block';
            loading.style.display = 'none';
            error.style.display = 'none';
            img.dataset.loaded = 'true';
        };
        
        img.onerror = function() {
            loading.style.display = 'none';
            error.style.display = 'flex';
            img.style.display = 'none';
        };
    }
    
    function preloadPage(menu, pageNumber) {
        const imageUrl = getPageImageUrl(menu, pageNumber);
        
        // Skip if already preloaded
        if (preloadedImages.has(imageUrl)) {
            return;
        }
        
        // Create new image for preloading
        const img = new Image();
        preloadedImages.set(imageUrl, img);
        img.src = imageUrl;
        
        // Clean up preloaded images that are too far away to save memory
        cleanupPreloadedImages(pageNumber);
    }
    
    function cleanupPreloadedImages(currentPageNumber) {
        // Remove preloaded images that are more than PRELOAD_COUNT * 2 pages away
        const maxDistance = PRELOAD_COUNT * 2;
        
        preloadedImages.forEach((img, imageUrl) => {
            const pageNumber = extractPageNumberFromUrl(imageUrl);
            
            if (pageNumber && Math.abs(pageNumber - currentPageNumber) > maxDistance) {
                // Remove from cache
                preloadedImages.delete(imageUrl);
            }
        });
    }
    
    function getPageImageUrl(menu, pageNumber) {
        // Use folder field if available, otherwise fall back to constructing from id
        const folder = menu.folder || `menus/${menu.id}`;
        // Format page number with leading zeros (01, 02, etc.)
        const formattedPageNumber = pageNumber.toString().padStart(2, '0');
        return `${folder}/${formattedPageNumber}.webp`;
    }
    
    function extractPageNumberFromUrl(url) {
        const match = url.match(/(\d+)\.webp$/);
        return match ? parseInt(match[1]) : null;
    }
});
