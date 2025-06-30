// DOM Elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const form = document.getElementById('upload-form');
const loading = document.getElementById('loading');
const submitBtn = document.getElementById('submit-btn');

// Initialize drag and drop functionality
function initializeDragAndDrop() {
    // Click to open file dialog
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Drag over effect
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    // Drag leave effect
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    // Drop file
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                fileInput.files = files;
                updateUploadArea(file);
            }
        }
    });
}

// File input change handler
function initializeFileInput() {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                updateUploadArea(file);
            }
        }
    });
}

// Validate file type and size
function validateFile(file) {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
        showError('Please select a valid CSV file');
        return false;
    }
    
    if (file.size > maxSize) {
        showError('File size must be less than 10MB');
        return false;
    }
    
    return true;
}

// Update upload area appearance when file is selected
function updateUploadArea(file) {
    const uploadText = uploadArea.querySelector('.upload-text');
    const uploadIcon = uploadArea.querySelector('.upload-icon');
    const uploadSubtext = uploadArea.querySelector('.upload-subtext');
    
    uploadIcon.textContent = '✅';
    uploadText.textContent = `Selected: ${file.name}`;
    uploadSubtext.textContent = `Size: ${formatFileSize(file.size)}`;
    uploadArea.style.borderColor = '#28a745';
    uploadArea.style.background = 'linear-gradient(135deg, rgba(40, 167, 69, 0.05), rgba(40, 167, 69, 0.1))';
}

// Format file size for display
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Form submission handler
function initializeFormSubmission() {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!fileInput.files[0]) {
            showError('Please select a CSV file');
            return;
        }

        showLoading();
        hideError();
        
        // Submit the form normally - Flask will handle the response
        form.submit();
    });
}

// Show loading state
function showLoading() {
    loading.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
}

// Hide loading state
function hideLoading() {
    loading.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Generate Forecast';
}

// Show error message
function showError(message) {
    const errorDiv = document.querySelector('.error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Hide error message
function hideError() {
    const errorDiv = document.querySelector('.error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Add smooth scrolling to results
function scrollToResults() {
    const resultsSection = document.getElementById('results');
    if (resultsSection && resultsSection.style.display === 'block') {
        resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Enhanced table interactions
function initializeTableInteractions() {
    const table = document.querySelector('.forecast-table');
    if (table) {
        // Add click-to-highlight functionality
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('click', function() {
                // Remove highlight from other rows
                rows.forEach(r => r.classList.remove('highlighted'));
                // Add highlight to clicked row
                this.classList.add('highlighted');
            });
        });
    }
}

// Add CSS for highlighted row
function addHighlightStyle() {
    const style = document.createElement('style');
    style.textContent = `
        .forecast-table tbody tr.highlighted {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)) !important;
            border-left: 4px solid #667eea;
        }
        
        .forecast-table tbody tr {
            cursor: pointer;
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(style);
}

// Initialize page functionality
function initializePage() {
    initializeDragAndDrop();
    initializeFileInput();
    initializeFormSubmission();
    initializeTableInteractions();
    addHighlightStyle();
    
    // If results are already present (after form submission), scroll to them
    setTimeout(scrollToResults, 500);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Page is visible again, ensure UI is in correct state
        hideLoading();
    }
});

// Prevent form resubmission on page refresh
window.addEventListener('beforeunload', function() {
    hideLoading();
});

// Add keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Allow Enter key to trigger file upload
    if (e.key === 'Enter' && e.target === uploadArea) {
        fileInput.click();
    }
    
    // Allow Escape key to clear file selection
    if (e.key === 'Escape' && fileInput.files.length > 0) {
        fileInput.value = '';
        resetUploadArea();
    }
});

// Reset upload area to initial state
function resetUploadArea() {
    const uploadText = uploadArea.querySelector('.upload-text');
    const uploadIcon = uploadArea.querySelector('.upload-icon');
    const uploadSubtext = uploadArea.querySelector('.upload-subtext');
    
    uploadIcon.textContent = '📁';
    uploadText.textContent = 'Drop your CSV file here or click to browse';
    uploadSubtext.textContent = 'Supports CSV files up to 10MB';
    uploadArea.style.borderColor = '#667eea';
    uploadArea.style.background = '';
}