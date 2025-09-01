// GLTF Model Viewer JavaScript
class GLTFModelViewer {
    constructor() {
        this.modelViewer = document.getElementById('model-viewer');
        this.fileInput = document.getElementById('file-input');
        this.fileLabel = document.querySelector('.file-upload-label');
        this.loadingIndicator = document.getElementById('loading');
        this.errorMessage = document.getElementById('error-message');
        this.errorText = document.getElementById('error-text');
        this.errorClose = document.getElementById('error-close');
        this.dragOverlay = document.getElementById('drag-overlay');
        
        // Maximum file size in bytes (50MB)
        this.maxFileSize = 50 * 1024 * 1024;
        
        // Supported file types
        this.supportedTypes = ['model/gltf-binary', 'model/gltf+json', '.gltf', '.glb'];
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.fileInput.addEventListener('change', this.handleFileUpload.bind(this));
        this.errorClose.addEventListener('click', this.hideError.bind(this));
        
        // Add explicit click handler for the upload button to ensure it works
        this.fileLabel.addEventListener('click', (e) => {
            e.preventDefault();
            this.fileInput.click();
        });
        
        // Add model viewer event listeners
        this.modelViewer.addEventListener('load', this.onModelLoad.bind(this));
        this.modelViewer.addEventListener('error', this.onModelError.bind(this));
        this.modelViewer.addEventListener('progress', this.onModelProgress.bind(this));
        
        // Wait for model-viewer to be ready, then configure it
        customElements.whenDefined('model-viewer').then(() => {
            this.configureModelViewer();
        });
        
        // Hide error message initially
        this.hideError();
        
        console.log('GLTF Model Viewer initialized');
    }
    
    configureModelViewer() {
        // Ensure auto-rotate is enabled
        this.modelViewer.autoRotate = true;
        this.modelViewer.autoRotateDelay = 2000;
        this.modelViewer.rotationPerSecond = '30deg';
        
        // Enable all camera controls
        this.modelViewer.cameraControls = true;
        this.modelViewer.interactionPolicy = 'always-allow';
        
        console.log('Model viewer configured with auto-rotate and controls');
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        
        if (!file) {
            return;
        }
        
        console.log('File selected:', file.name, 'Size:', this.formatFileSize(file.size));
        
        // Validate file
        if (!this.validateFile(file)) {
            return;
        }
        
        // Show loading state
        this.showLoading();
        this.hideError();
        
        // Create object URL for the file
        const objectURL = URL.createObjectURL(file);
        
        // Update model viewer source
        this.modelViewer.src = objectURL;
        
        // Clean up previous object URL to prevent memory leaks
        if (this.currentObjectURL) {
            URL.revokeObjectURL(this.currentObjectURL);
        }
        this.currentObjectURL = objectURL;
        
        console.log(`Loading model: ${file.name}`);
    }
    
    validateFile(file) {
        // Check file size
        if (file.size > this.maxFileSize) {
            this.showError(`File size too large. Maximum allowed size is ${this.formatFileSize(this.maxFileSize)}.`);
            return false;
        }
        
        // Check file type
        const fileName = file.name.toLowerCase();
        const isValidType = fileName.endsWith('.gltf') || fileName.endsWith('.glb') || 
                          this.supportedTypes.includes(file.type);
        
        if (!isValidType) {
            this.showError('Invalid file type. Please upload a GLTF (.gltf) or GLB (.glb) file.');
            return false;
        }
        
        return true;
    }
    
    onModelLoad() {
        console.log('Model loaded successfully');
        this.hideLoading();
        this.hideError();
        
        // Re-enable auto-rotate after loading new model
        setTimeout(() => {
            this.modelViewer.autoRotate = true;
        }, 1000);
    }
    
    onModelError(event) {
        console.error('Model loading error:', event);
        this.hideLoading();
        this.showError('Failed to load the 3D model. Please check if the file is valid and try again.');
    }
    
    onModelProgress(event) {
        const progress = event.detail.totalProgress;
        const progressBar = this.modelViewer.querySelector('.update-bar');
        
        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
            
            if (progress >= 1) {
                // Hide progress bar when complete
                setTimeout(() => {
                    const progressBarContainer = this.modelViewer.querySelector('.progress-bar');
                    if (progressBarContainer) {
                        progressBarContainer.classList.add('hide');
                    }
                }, 300);
            }
        }
    }
    
    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
    }
    
    hideLoading() {
        this.loadingIndicator.classList.add('hidden');
    }
    
    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
        
        // Auto-hide error after 8 seconds
        setTimeout(() => {
            this.hideError();
        }, 8000);
    }
    
    hideError() {
        this.errorMessage.classList.add('hidden');
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Additional utility functions for enhanced interaction
class ModelViewerEnhancements {
    constructor(modelViewer) {
        this.modelViewer = modelViewer;
        this.init();
    }
    
    init() {
        // Add keyboard controls
        this.addKeyboardControls();
        
        // Add touch gesture improvements for mobile
        this.addTouchEnhancements();
        
        // Add camera position reset functionality
        this.addCameraReset();
        
        // Disable context menu on model viewer for better right-click control
        this.disableContextMenu();
    }
    
    disableContextMenu() {
        this.modelViewer.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            return false;
        });
    }
    
    addKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            if (!this.modelViewer) return;
            
            // Only handle keyboard shortcuts when not typing in an input
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(event.key.toLowerCase()) {
                case 'r':
                    // Reset camera
                    this.resetCamera();
                    event.preventDefault();
                    break;
                case ' ':
                    // Toggle auto-rotate
                    this.toggleAutoRotate();
                    event.preventDefault();
                    break;
                case 'f':
                    // Toggle fullscreen (if supported)
                    this.toggleFullscreen();
                    event.preventDefault();
                    break;
            }
        });
    }
    
    addTouchEnhancements() {
        // Improve touch controls for mobile
        let touchStartTime = 0;
        
        this.modelViewer.addEventListener('touchstart', (event) => {
            touchStartTime = Date.now();
        });
        
        this.modelViewer.addEventListener('touchend', (event) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // Double tap to reset camera (like double click)
            if (touchDuration < 300 && event.changedTouches.length === 1) {
                if (this.lastTouchEnd && (touchStartTime - this.lastTouchEnd) < 300) {
                    this.resetCamera();
                    event.preventDefault();
                }
                this.lastTouchEnd = touchStartTime;
            }
        });
    }
    
    addCameraReset() {
        // Double-click to reset camera
        let clickCount = 0;
        let clickTimer = null;
        
        this.modelViewer.addEventListener('click', (event) => {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 300);
            } else if (clickCount === 2) {
                clearTimeout(clickTimer);
                clickCount = 0;
                this.resetCamera();
                event.preventDefault();
            }
        });
    }
    
    resetCamera() {
        try {
            if (this.modelViewer.resetTurntableRotation) {
                this.modelViewer.resetTurntableRotation();
            }
            if (this.modelViewer.jumpCameraToGoal) {
                this.modelViewer.jumpCameraToGoal();
            }
            console.log('Camera reset');
        } catch (error) {
            console.log('Camera reset methods not available');
        }
    }
    
    toggleAutoRotate() {
        this.modelViewer.autoRotate = !this.modelViewer.autoRotate;
        console.log(`Auto-rotate: ${this.modelViewer.autoRotate ? 'enabled' : 'disabled'}`);
    }
    
    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            this.modelViewer.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported or denied:', err);
            });
        }
    }
}

// Drag and drop functionality
class DragAndDropManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.dropZone = document.querySelector('.viewer-container');
        this.dragOverlay = document.getElementById('drag-overlay');
        this.dragCount = 0;
        
        this.init();
    }
    
    init() {
        if (!this.dropZone) return;
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, this.preventDefaults.bind(this), false);
            document.body.addEventListener(eventName, this.preventDefaults.bind(this), false);
        });
        
        // Handle drag events
        this.dropZone.addEventListener('dragenter', this.handleDragEnter.bind(this), false);
        this.dropZone.addEventListener('dragover', this.handleDragOver.bind(this), false);
        this.dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this), false);
        this.dropZone.addEventListener('drop', this.handleDrop.bind(this), false);
        
        console.log('Drag and drop initialized');
    }
    
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    handleDragEnter(e) {
        this.dragCount++;
        this.showDragOverlay();
    }
    
    handleDragOver(e) {
        // Keep showing drag overlay
        this.showDragOverlay();
    }
    
    handleDragLeave(e) {
        this.dragCount--;
        if (this.dragCount <= 0) {
            this.hideDragOverlay();
            this.dragCount = 0;
        }
    }
    
    handleDrop(e) {
        this.dragCount = 0;
        this.hideDragOverlay();
        
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            const file = files[0];
            console.log('File dropped:', file.name);
            
            // Simulate file input change
            const fileInput = document.getElementById('file-input');
            
            // Create a new FileList-like object
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            
            // Set the files to the file input
            fileInput.files = dataTransfer.files;
            
            // Trigger the change event
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    }
    
    showDragOverlay() {
        if (this.dragOverlay) {
            this.dragOverlay.classList.remove('hidden');
        }
    }
    
    hideDragOverlay() {
        if (this.dragOverlay) {
            this.dragOverlay.classList.add('hidden');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing GLTF Model Viewer...');
    
    // Initialize the main GLTF viewer
    const viewer = new GLTFModelViewer();
    
    // Wait for model-viewer to be defined, then add enhancements
    customElements.whenDefined('model-viewer').then(() => {
        console.log('model-viewer custom element defined');
        
        const modelViewer = document.getElementById('model-viewer');
        const enhancements = new ModelViewerEnhancements(modelViewer);
        const dragDrop = new DragAndDropManager(viewer);
        
        console.log('All components loaded and initialized');
        
        // Force auto-rotate after everything is loaded
        setTimeout(() => {
            modelViewer.autoRotate = true;
            console.log('Auto-rotate force enabled');
        }, 2000);
    }).catch(error => {
        console.error('Error initializing model-viewer:', error);
    });
});

// Export for potential use in other scripts
window.GLTFModelViewer = GLTFModelViewer;
window.ModelViewerEnhancements = ModelViewerEnhancements;
window.DragAndDropManager = DragAndDropManager;