class DynamicGallery {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalImage = document.getElementById('modalImage');
        this.imageCounter = document.getElementById('imageCounter');
        this.imageInfo = document.getElementById('imageInfo');
        this.modalImageTitle = document.getElementById('modalImageTitle');
        this.modalImageDescription = document.getElementById('modalImageDescription');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.galleryContainer = document.getElementById('galleryContainer');
        this.projectTitle = document.getElementById('projectTitle');
        this.projectDescription = document.getElementById('projectDescription');
        this.breadcrumbTitle = document.getElementById('breadcrumbTitle');
        
        this.currentIndex = 0;
        this.images = [];
        this.projectData = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProject();
    }

    bindEvents() {
        // Modal navigation
        this.prevBtn.addEventListener('click', () => this.prevImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        this.closeBtn.addEventListener('click', () => this.closeModal());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                    case 'Escape':
                        this.closeModal();
                        break;
                }
            }
        });

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Touch gestures for mobile
        this.setupTouchGestures();
    }

    setupTouchGestures() {
        let startX = 0;
        let endX = 0;

        this.modal.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.modal.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            const threshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextImage();
                } else {
                    this.prevImage();
                }
            }
        };

        this.handleSwipe = handleSwipe;
    }

    // Get project key from URL parameters or localStorage
    getProjectKey() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectKey = urlParams.get('project') || localStorage.getItem('currentProject');
        return projectKey || 'default';
    }

    // Load project data and images
    async loadProject() {
        try {
            const projectKey = this.getProjectKey();
            
            // Load project description from text file
            await this.loadProjectDescription(projectKey);
            
            // Load images from folder
            await this.loadProjectImages(projectKey);
            
        } catch (error) {
            console.error('Error loading project:', error);
            this.showError('Failed to load project. Please try again.');
        }
    }

    // Load project description from .txt file
    async loadProjectDescription(projectKey) {
        try {
            const response = await fetch(`./projects/${projectKey}/description.txt`);
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n').filter(line => line.trim());
                
                const title = lines[0] || `Project ${projectKey}`;
                const description = lines.slice(1).join(' ') || 'No description available.';
                
                this.projectData = {
                    title: title,
                    description: description,
                    key: projectKey
                };
                
                this.updateProjectInfo();
            } else {
                throw new Error('Description file not found');
            }
        } catch (error) {
            console.warn('Could not load description:', error);
            this.projectData = {
                title: `Project ${projectKey}`,
                description: 'No description available.',
                key: projectKey
            };
            this.updateProjectInfo();
        }
    }

    // Load images from project folder
    async loadProjectImages(projectKey) {
        try {
            // Try to load image list from images.json file
            const response = await fetch(`./projects/${projectKey}/images.json`);
            if (response.ok) {
                const imageData = await response.json();
                this.images = imageData.map(item => ({
                    src: `./projects/${projectKey}/${item.filename}`,
                    title: item.title || item.filename,
                    description: item.description || ''
                }));
            } else {
                // Fallback: try common image extensions
                await this.loadImagesFromCommonExtensions(projectKey);
            }
            
            if (this.images.length === 0) {
                this.showEmpty('No images found in this project.');
                return;
            }
            
            this.renderGallery();
            
        } catch (error) {
            console.error('Error loading images:', error);
            this.showError('Failed to load images. Please check if the project folder exists.');
        }
    }

    // Fallback method to load images with common extensions
    async loadImagesFromCommonExtensions(projectKey) {
        const commonExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        const imagePromises = [];
        
        // Try to load up to 20 images with common naming patterns
        for (let i = 1; i <= 20; i++) {
            for (const ext of commonExtensions) {
                const filename = `image${i}.${ext}`;
                const src = `./projects/${projectKey}/${filename}`;
                
                imagePromises.push(
                    this.checkImageExists(src).then(exists => 
                        exists ? { src, title: `Image ${i}`, description: '' } : null
                    )
                );
                
                // Also try common naming patterns
                const altFilename = `${projectKey}_${i}.${ext}`;
                const altSrc = `./projects/${projectKey}/${altFilename}`;
                imagePromises.push(
                    this.checkImageExists(altSrc).then(exists => 
                        exists ? { src: altSrc, title: `Image ${i}`, description: '' } : null
                    )
                );
            }
        }
        
        const results = await Promise.all(imagePromises);
        this.images = results.filter(result => result !== null);
    }

    // Check if image exists
    checkImageExists(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    }

    updateProjectInfo() {
        this.projectTitle.textContent = this.projectData.title;
        this.projectDescription.textContent = this.projectData.description;
        this.breadcrumbTitle.textContent = this.projectData.title;
        document.title = `${this.projectData.title} - Architecture Portfolio`;
    }

    renderGallery() {
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'gallery-grid';
        galleryGrid.id = 'gallery';
        
        this.images.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-index', index);
            
            galleryItem.innerHTML = `
                <img src="${image.src}" alt="${image.title}" loading="lazy">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <h3>${image.title}</h3>
                        <p>${image.description}</p>
                    </div>
                </div>
            `;
            
            galleryItem.addEventListener('click', () => {
                this.openModal(index);
            });
            
            galleryGrid.appendChild(galleryItem);
        });
        
        this.galleryContainer.innerHTML = '';
        this.galleryContainer.appendChild(galleryGrid);
    }

    showError(message) {
        this.galleryContainer.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h3>Error Loading Project</h3>
                <p>${message}</p>
            </div>
        `;
    }

    showEmpty(message) {
        this.galleryContainer.innerHTML = `
            <div class="empty-container">
                <div class="empty-icon">📁</div>
                <h3>No Images Found</h3>
                <p>${message}</p>
            </div>
        `;
    }

    openModal(index) {
        this.currentIndex = index;
        this.updateModal();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateModal();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateModal();
    }

    updateModal() {
        const currentImage = this.images[this.currentIndex];
        
        // Add loading state
        this.modalImage.style.opacity = '0.5';
        
        // Update image
        this.modalImage.src = currentImage.src;
        this.modalImage.alt = currentImage.title;
        
        // Update counter
        this.imageCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        
        // Update image info
        this.modalImageTitle.textContent = currentImage.title;
        this.modalImageDescription.textContent = currentImage.description;
        
        // Show/hide image info based on content
        if (currentImage.title || currentImage.description) {
            this.imageInfo.style.display = 'block';
        } else {
            this.imageInfo.style.display = 'none';
        }
        
        // Remove loading state when image loads
        this.modalImage.onload = () => {
            this.modalImage.style.opacity = '1';
        };
    }
}

// Navigation functions
function goBack() {
    // Check if there's a referrer, otherwise go to a default portfolio page
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = './portfolio.html'; // Adjust this to your portfolio page
    }
}

// Function to be called from other pages
function loadProject(projectKey) {
    // Store project key for retrieval
    localStorage.setItem('currentProject', projectKey);
    
    // Update URL without reloading
    const url = new URL(window.location);
    url.searchParams.set('project', projectKey);
    window.history.pushState({}, '', url);
    
    // If gallery is already initialized, reload it
    if (window.galleryInstance) {
        window.galleryInstance.loadProject();
    }
}

// Header scroll effect
class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
                this.header.style.background = 'rgba(0, 0, 0, 0.9)';
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.galleryInstance = new DynamicGallery();
    new HeaderScroll();
});

// Make loadProject function globally available
window.loadProject = loadProject;