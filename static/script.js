// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
    document.querySelector('.navbar')?.classList.toggle('active');
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu if open
        document.querySelector('.navbar')?.classList.remove('active');
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});
// Update any JavaScript that might reference the old ID
// For example, if you have smooth scrolling, make sure to update the ID reference
document.querySelectorAll('a[href="#for-institutions"]').forEach(anchor => {
    anchor.setAttribute('href', '#for-brands');
});

// Image Hover Effects
const featureSections = document.querySelectorAll('.feature-section');
featureSections.forEach(section => {
    const img = section.querySelector('.feature-image img');
    
    section.addEventListener('mouseenter', function() {
        img.style.transform = 'scale(1.05)';
    });
    
    section.addEventListener('mouseleave', function() {
        img.style.transform = 'scale(1)';
    });
});

// Form Submission
// Replace the existing form submission handler with this
document.querySelector('.signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;
    
    // Validate all fields are filled
    if (!email || !password || !userType) {
        alert('Please fill in all fields');
        return;
    }
    
    // Redirect based on user type
    if (userType === 'student') {
        // Redirect to student dashboard or profile completion
        window.location.href = '/student-dashboard';
    } else if (userType === 'brand') {
        // Redirect to brand dashboard or profile completion
        window.location.href = '/brand-dashboard';
    }
    
    // For demo purposes:
    console.log('Signup attempt:', { email, password, userType });
    alert(`Signup successful! Redirecting to ${userType} dashboard...`);
});
// Mobile Menu Toggle (same as landing page)
document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
    document.querySelector('.navbar')?.classList.toggle('active');
});

// Sign-in Form Submission
document.querySelector('.signin-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Validate fields
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    // Here you would typically authenticate with your backend
    console.log('Sign-in attempt:', { email, password, rememberMe });
    
    // For demo purposes, redirect to appropriate dashboard
    // In a real app, you would determine user type from authentication response
    const userType = email.includes('@brand.') ? 'brand' : 'student';
    
    if (userType === 'student') {
        window.location.href = '/student-dashboard';
    } else {
        window.location.href = '/brand-dashboard';
    }
    
    // Demo message
    alert(`Sign-in successful! Redirecting to ${userType} dashboard...`);
});

// Dashboard specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Favorite button toggle
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas', 'text-accent');
            } else {
                icon.classList.remove('fas', 'text-accent');
                icon.classList.add('far');
            }
        });
    });
    
    // Simulate loading user data
    const userName = localStorage.getItem('userName') || 'Alex';
    const user_name_elem = document.querySelector('.user-name');
    if (user_name_elem) {
        user_name_elem.textContent = userName;
    }
    
    // You would typically fetch these from your backend
    const stats = {
        materials: 12,
        projects: 7,
        favorites: 15,
        challenges: 3
    };
    
    document.querySelectorAll('.stat-value').forEach((el, index) => {
        const values = Object.values(stats);
        if (values[index]) {
            el.textContent = values[index];
        }
    });
    
    // Mobile menu toggle (same as landing page)
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
        document.querySelector('.navbar')?.classList.toggle('active');
    });
});

// Brand Dashboard specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (same as other pages)
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
        document.querySelector('.navbar')?.classList.toggle('active');
    });
    
    // Simulate loading brand data
    const brandName = localStorage.getItem('brandName') || 'EcoFabrics';
    const brand_name_elem = document.querySelector('.brand-name');
    if (brand_name_elem) {
        brand_name_elem.textContent = brandName;
    }
    
    // You would typically fetch these from your backend
    const impactStats = {
        yardsDonated: 1250,
        studentsSupported: 85,
        wasteDiverted: 3200
    };
    
    // Update impact stats
    document.querySelectorAll('.impact-stat').forEach((el, index) => {
        const values = Object.values(impactStats);
        if (values[index]) {
            el.querySelector('.stat-value').textContent = values[index].toLocaleString();
        }
    });
    
    // Inventory status indicators
    document.querySelectorAll('.col-status').forEach(status => {
        if (status.classList.contains('available')) {
            status.innerHTML = '<i class="fas fa-check-circle"></i> ' + status.textContent;
        } else if (status.classList.contains('low')) {
            status.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + status.textContent;
        }
    });
    
    // Simulate loading requests count
    const pendingRequests = 5; // This would come from your backend
    const pending_requests_elem = document.querySelector('.pending-requests');
    if (pending_requests_elem) {
        pending_requests_elem.textContent = pendingRequests;
    }
});

// AI PORTFOLIO ASSISTANCE

// Wizard navigation
function nextStep(current, next) {
    document.getElementById(`step-${current}`).classList.remove('active');
    document.getElementById(`step-${next}`).classList.add('active');
    
    // Update progress bar
    const progress = document.querySelector('.progress');
    if (next === 2) {
        progress.style.width = '60%';
    } else if (next === 3) {
        progress.style.width = '100%';
    }
}

function prevStep(current, prev) {
    document.getElementById(`step-${current}`).classList.remove('active');
    document.getElementById(`step-${prev}`).classList.add('active');
    
    // Update progress bar
    const progress = document.querySelector('.progress');
    if (prev === 1) {
        progress.style.width = '25%';
    } else if (prev === 2) {
        progress.style.width = '60%';
    }
}

// File upload functionality
const uploadArea = document.getElementById('upload-area');
const fileUpload = document.getElementById('file-upload');
const uploadPreview = document.getElementById('upload-preview');

uploadArea?.addEventListener('click', () => fileUpload.click());

fileUpload?.addEventListener('change', function(e) {
    const files = e.target.files;
    if (!uploadPreview) return;
    uploadPreview.innerHTML = '';
    
    for (let i = 0; i < Math.min(files.length, 6); i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button class="remove-btn"><i class="fas fa-times"></i></button>
            `;
            uploadPreview.appendChild(previewItem);
            
            // Add remove functionality
            previewItem.querySelector('.remove-btn').addEventListener('click', function() {
                previewItem.remove();
            });
        }
        
        reader.readAsDataURL(file);
    }
});

// Drag and drop functionality
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea?.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea?.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea?.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    uploadArea?.classList.add('highlight');
}

function unhighlight() {
    uploadArea?.classList.remove('highlight');
}

uploadArea?.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Initialize first step
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('step-1').classList.add('active');
});

// CHALLENGES
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterBtn = document.querySelector('.btn-filter');
    const resetBtn = document.querySelector('.btn-outline');
    
    filterBtn.addEventListener('click', function() {
        const status = document.getElementById('status').value;
        const duration = document.getElementById('duration').value;
        const type = document.getElementById('type').value;
        const compensation = document.getElementById('compensation').value;
        
        // In a real app, you would filter challenges here
        console.log('Filtering by:', {status, duration, type, compensation});
        alert('Filters applied! (This is a demo)');
    });
    
    resetBtn.addEventListener('click', function() {
        document.getElementById('status').value = 'all';
        document.getElementById('duration').value = 'all';
        document.getElementById('type').value = 'all';
        document.getElementById('compensation').value = 'all';
    });
    
    // Join button functionality
    document.querySelectorAll('.btn-join').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const challengeTitle = this.closest('.challenge-card').querySelector('h3').textContent;
            alert(`Joining challenge: ${challengeTitle}`);
            // In real app, would redirect to challenge details or submission page
        });
    });
    
    // Mobile menu toggle (same as other pages)
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
        document.querySelector('.navbar')?.classList.toggle('active');
    });
});

//JOINCHALLENGE
document.addEventListener('DOMContentLoaded', function() {
    // Form submission
    const form = document.querySelector('.registration-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Validate form
        if (form.checkValidity()) {
            // In a real app, you would submit the form here
            alert('Form submitted successfully! Redirecting to next step...');
            // window.location.href = 'challenge-submission.html';
        } else {
            alert('Please fill in all required fields');
        }
    });
    
    // Mobile menu toggle (same as other pages)
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
        document.querySelector('.navbar')?.classList.toggle('active');
    });
    
    // Back button functionality
    document.querySelector('.btn-outline').addEventListener('click', function() {
        window.location.href = '/templates/challenges.html';
    });
});
// Portfolio Upload Functionality
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('portfolioUploadArea');
    const fileUpload = document.getElementById('portfolioUpload');
    const browseBtn = document.getElementById('browseFilesBtn');
    const uploadPreview = document.getElementById('uploadPreview');
    
    // Click on area or button to trigger file input
    uploadArea?.addEventListener('click', () => fileUpload.click());
    browseBtn?.addEventListener('click', () => fileUpload.click());
    
    // File selection handler
    fileUpload?.addEventListener('change', function(e) {
        const files = e.target.files;
        handleFiles(files);
    });
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea?.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea?.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea?.addEventListener(eventName, unhighlight, false);
    });
    
    uploadArea?.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        uploadArea?.classList.add('highlight');
    }
    
    function unhighlight() {
        uploadArea?.classList.remove('highlight');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        uploadPreview.innerHTML = '';
        
        for (let i = 0; i < Math.min(files.length, 10); i++) { // Limit to 10 files
            const file = files[i];
            
            if (!file.type.match('image.*|application/pdf|application/msword|application/vnd.ms-powerpoint')) {
                continue; // Skip unsupported files
            }
            
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button class="remove-btn"><i class="fas fa-times"></i></button>
                    `;
                    uploadPreview.appendChild(previewItem);
                    
                    // Add remove functionality
                    previewItem.querySelector('.remove-btn').addEventListener('click', function() {
                        previewItem.remove();
                    });
                }
                reader.readAsDataURL(file);
            } else {
                // For non-image files
                const fileType = file.name.split('.').pop().toUpperCase();
                previewItem.innerHTML = `
                    <div class="file-preview">
                        <i class="fas fa-file-alt"></i>
                        <span>${fileType}</span>
                    </div>
                    <button class="remove-btn"><i class="fas fa-times"></i></button>
                `;
                uploadPreview.appendChild(previewItem);
                
                // Add remove functionality
                previewItem.querySelector('.remove-btn').addEventListener('click', function() {
                    previewItem.remove();
                });
            }
        }
    }
});

//ADD MATERIALS 
document.addEventListener('DOMContentLoaded', function() {
    // Unit of measurement display
    const unitSelect = document.getElementById('unit');
    const unitDisplay = document.querySelector('.unit-display');
    
    unitSelect?.addEventListener('change', function() {
        unitDisplay?.textContent = this.value;
    });
    
    // Color picker functionality
    const colorOptions = document.querySelectorAll('.color-option');
    const primaryColor = document.getElementById('primary-color');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            primaryColor.value = color;
            
            // Update selected state
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Custom timeframe toggle
    const availabilitySelect = document.getElementById('availability');
    const customTimeframeGroup = document.getElementById('customTimeframeGroup');
    
    availabilitySelect?.addEventListener('change', function() {
        if (this.value === 'custom') {
            customTimeframeGroup?.style.display = 'block';
        } else {
            customTimeframeGroup?.style.display = 'none';
        }
    });
    
    
    // Image upload functionality
    const uploadArea = document.getElementById('imageUploadArea');
    const fileUpload = document.getElementById('imageUpload');
    const browseBtn = document.getElementById('browseImagesBtn');
    const uploadPreview = document.getElementById('imagePreview');
    
    // Click on area or button to trigger file input
    uploadArea?.addEventListener('click', () => fileUpload.click());
    browseBtn?.addEventListener('click', () => fileUpload.click());
    
    // File selection handler
    fileUpload?.addEventListener('change', function(e) {
        const files = e.target.files;
        handleFiles(files);
    });
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea?.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea?.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea?.addEventListener(eventName, unhighlight, false);
    });
    
    uploadArea?.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        uploadArea?.classList.add('highlight');
    }
    
    function unhighlight() {
        uploadArea?.classList.remove('highlight');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        uploadPreview.innerHTML = '';
        
        for (let i = 0; i < Math.min(files.length, 5); i++) { // Limit to 5 files
            const file = files[i];
            
            if (!file.type.match('image.*')) {
                continue; // Skip non-image files
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="remove-btn"><i class="fas fa-times"></i></button>
                `;
                uploadPreview.appendChild(previewItem);
                
                // Add remove functionality
                previewItem.querySelector('.remove-btn').addEventListener('click', function() {
                    previewItem.remove();
                });
            }
            reader.readAsDataURL(file);
        }
    }
    
    // Form submission
    const form = document.querySelector('.material-form');
    form?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (form.checkValidity()) {
            // In a real app, you would submit the form here
            alert('Material added successfully! Thank you for contributing to sustainable fashion.');
            // form.reset();
            // window.location.href = 'brand-dashboard.html';
        } else {
            alert('Please fill in all required fields');
        }
    });
    
    // Mobile menu toggle (same as other pages)
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
        document.querySelector('.navbar')?.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Dropdown toggle
    const profileBtn = document.querySelector('.brand-profile-btn');
    const dropdown = document.querySelector('.brand-profile-dropdown');
    
    if (profileBtn && dropdown) {
        // Toggle dropdown on button click
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.brand-profile-menu')) {
                dropdown.classList.remove('show');
            }
        });
        
        // Close when clicking a dropdown item
        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                dropdown.classList.remove('show');
            });
        });
    }
    
    // Logo upload functionality
    const logoUpload = document.getElementById('logoUpload');
    const logoPreview = document.getElementById('brandLogoPreview');
    
    if (logoUpload && logoPreview) {
        logoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    logoPreview.style.backgroundImage = `url(${event.target.result})`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

//TRACKORDERJS

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const statusFilter = document.querySelector('.status-filter');
    const orderCards = document.querySelectorAll('.order-card');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const status = this.value;
            
            orderCards.forEach(card => {
                if (status === 'all' || card.classList.contains(`status-${status}`)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            orderCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                if (cardText.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Button actions (placeholder - would connect to real functionality)
    document.querySelectorAll('.btn-track').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Redirecting to shipping carrier tracking...');
        });
    });
    
    document.querySelectorAll('.btn-message').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Opening messaging system...');
        });
    });
    
    // Initialize any other interactive elements
    initializeTimelineAnimation();
});

function initializeTimelineAnimation() {
    // This would animate the progress bars on scroll
    const timelines = document.querySelectorAll('.timeline-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width || '100%';
            }
        });
    }, { threshold: 0.5 });
    
    timelines.forEach(timeline => {
        observer.observe(timeline);
    });
}

//CONTACTUS
document.addEventListener('DOMContentLoaded', function() {
    // Toggle between student and brand forms
    const studentToggle = document.getElementById('student-toggle');
    const brandToggle = document.getElementById('brand-toggle');
    const studentForm = document.getElementById('student-form');
    const brandForm = document.getElementById('brand-form');
    
    if (studentToggle && brandToggle) {
        studentToggle.addEventListener('click', function() {
            this.classList.add('active');
            brandToggle.classList.remove('active');
            studentForm.classList.add('active');
            brandForm.classList.remove('active');
        });
        
        brandToggle.addEventListener('click', function() {
            this.classList.add('active');
            studentToggle.classList.remove('active');
            brandForm.classList.add('active');
            studentForm.classList.remove('active');
        });
    }
    
    // Form submission handling
    const forms = document.querySelectorAll('.contact-form form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Here you would typically send to server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! We will respond within 1-2 business days.');
            this.reset();
        });
    });
    
    // Live chat button functionality
    const liveChatBtn = document.querySelector('.btn-outline');
    if (liveChatBtn) {
        liveChatBtn.addEventListener('click', function() {
            // This would open your live chat system
            alert('Opening live chat...');
        });
    }
});

//MYPROJECTS.JS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lightGallery for project images
    if (document.getElementById('projects-gallery')) {
        lightGallery(document.getElementById('projects-gallery'), {
            selector: '.project-image',
            download: false,
            share: false
        });
    }

    // Add project modal
    const addProjectBtn = document.getElementById('add-project-btn');
    const addProjectModal = document.getElementById('add-project-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function() {
            addProjectModal.classList.add('active');
        });
    }
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            addProjectModal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    addProjectModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // Image upload preview
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('project-images');
    const previewGrid = document.getElementById('image-preview');
    
    if (dropZone && fileInput) {
        // Click to select files
        dropZone.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropZone.classList.add('highlight');
        }
        
        function unhighlight() {
            dropZone.classList.remove('highlight');
        }
        
        dropZone.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
        
        function handleFiles(files) {
            [...files].forEach(previewFile);
        }
        
        function previewFile(file) {
            if (!file.type.match('image.*')) return;
            
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function() {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${reader.result}" alt="Preview">
                    <button class="remove-image">&times;</button>
                `;
                previewGrid.appendChild(previewItem);
                
                // Remove image
                previewItem.querySelector('.remove-image').addEventListener('click', function() {
                    previewItem.remove();
                });
            };
        }
    }

    // Add materials functionality
    const materialsList = document.getElementById('materials-list');
    const addMaterialBtn = document.querySelector('.add-material');
    
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', function() {
            const nameInput = document.querySelector('.material-name');
            const qtyInput = document.querySelector('.material-qty');
            
            if (nameInput.value.trim() && qtyInput.value.trim()) {
                const materialItem = document.createElement('div');
                materialItem.className = 'material-item';
                materialItem.innerHTML = `
                    <span>${nameInput.value} (${qtyInput.value})</span>
                    <button class="remove-material">&times;</button>
                `;
                materialsList.appendChild(materialItem);
                
                // Clear inputs
                nameInput.value = '';
                qtyInput.value = '';
                
                // Remove material
                materialItem.querySelector('.remove-material').addEventListener('click', function() {
                    materialItem.remove();
                });
            }
        });
    }

    // Add skills functionality
    const skillInput = document.getElementById('skill-input');
    const skillTags = document.getElementById('skill-tags');
    
    if (skillInput) {
        skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                e.preventDefault();
                addSkillTag(this.value.trim());
                this.value = '';
            }
        });
        
        function addSkillTag(skill) {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `
                ${skill}
                <button class="remove-tag">&times;</button>
            `;
            skillTags.appendChild(tag);
            
            // Remove tag
            tag.querySelector('.remove-tag').addEventListener('click', function() {
                tag.remove();
            });
        }
    }

    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const liked = this.classList.toggle('liked');
            
            if (liked) {
                icon.classList.replace('far', 'fas');
                const currentLikes = parseInt(this.textContent.trim());
                this.innerHTML = `<i class="fas fa-heart"></i> ${currentLikes + 1}`;
            } else {
                icon.classList.replace('fas', 'far');
                const currentLikes = parseInt(this.textContent.trim());
                this.innerHTML = `<i class="far fa-heart"></i> ${currentLikes - 1}`;
            }
        });
    });

    // Filter and sort functionality
    const categoryFilter = document.querySelector('.category-filter');
    const materialFilter = document.querySelector('.material-filter');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.querySelector('.search-box input');
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterProjects();
        });
    }
    
    // Material filter
    if (materialFilter) {
        materialFilter.addEventListener('change', function() {
            filterProjects();
        });
    }
    
    // Sort buttons
    sortButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sortButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            sortProjects(this.dataset.sort);
        });
    });
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterProjects();
        });
    }
    
    function filterProjects() {
        const categoryValue = categoryFilter.value;
        const materialValue = materialFilter.value;
        const searchValue = searchInput.value.toLowerCase();
        
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardMaterial = card.dataset.material;
            const cardText = card.textContent.toLowerCase();
            
            const categoryMatch = categoryValue === 'all' || cardCategory === categoryValue;
            const materialMatch = materialValue === 'all' || cardMaterial === materialValue;
            const searchMatch = cardText.includes(searchValue);
            
            if (categoryMatch && materialMatch && searchMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function sortProjects(sortBy) {
        const container = document.querySelector('.projects-grid');
        const cards = Array.from(projectCards);
        
        cards.sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            } else if (sortBy === 'popular') {
                return parseInt(b.dataset.likes) - parseInt(a.dataset.likes);
            } else if (sortBy === 'material') {
                return a.dataset.material.localeCompare(b.dataset.material);
            }
            return 0;
        });
        
        // Re-append cards in sorted order
        cards.forEach(card => {
            container.appendChild(card);
        });
    }
    
    // Form submission
    const projectForm = document.querySelector('.project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the form data to your server
            alert('Project saved successfully!');
            addProjectModal.classList.remove('active');
            this.reset();
            previewGrid.innerHTML = '';
            materialsList.innerHTML = '';
            skillTags.innerHTML = '';
            
            // In a real app, you would add the new project to the grid
        });
    }
});

//REGISTEREDCHALLENGE
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Make the first tab active by default if none is active
    if (!document.querySelector('.tab-btn.active')) {
        tabBtns[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
    
    // View Team Status button
    const viewTeamBtn = document.querySelector('.btn-view-team');
    if (viewTeamBtn) {
        viewTeamBtn.addEventListener('click', function() {
            alert('Team status feature will be implemented soon!');
        });
    }
});
// This function waits for step 3 to be shown before attaching event listener
function enableAIGeneration() {
  const generateBtn = document.getElementById("generate-bio-btn");
  const bioTextarea = document.getElementById("bio-statement");
  const portfolioTitleInput = document.getElementById("portfolio-title");

  if (!generateBtn || !bioTextarea || !portfolioTitleInput) {
    console.warn("AI elements not found yet. Waiting...");
    return;
  }

  // Prevent multiple event bindings
  if (generateBtn.dataset.bound === "true") return;
  generateBtn.dataset.bound = "true";

  generateBtn.addEventListener("click", async () => {
    generateBtn.disabled = true;
    generateBtn.innerHTML = "Generating...";

    try {
      const portfolioTitle = portfolioTitleInput.value;

      const response = await fetch("/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          design_style: portfolioTitle,
          skills: [],
          purpose: "Portfolio bio",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate bio");
      const data = await response.json();
      bioTextarea.value = data.bio || "";

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = `<i class="fas fa-magic"></i> Generate with AI`;
    }
  });
}

// Single nextStep function, triggers AI binding on step 3
function nextStep(currentStep, nextStep) {
  const current = document.getElementById(`step-${currentStep}`);
  const next = document.getElementById(`step-${nextStep}`);

  if (current && next) {
    current.classList.remove("active");
    next.classList.add("active");
  }

  // Bind AI generate button only on step 3
  if (nextStep === 3) {
    enableAIGeneration();
  }

  // (Optional) Update progress bar here if needed
}
window.nextStep = nextStep;

// Single prevStep function
function prevStep(currentStep, prevStep) {
  const current = document.getElementById(`step-${currentStep}`);
  const prev = document.getElementById(`step-${prevStep}`);

  if (current && prev) {
    current.classList.remove("active");
    prev.classList.add("active");
  }
}
window.prevStep = prevStep;


// File upload handling
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file-upload");
  const previewArea = document.getElementById("upload-preview");
  const browseBtn = document.getElementById("browse-files-btn");

  if (browseBtn && fileInput && previewArea) {
    browseBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", function () {
      previewArea.innerHTML = ""; // clear previous previews
      const files = fileInput.files;

      if (files.length > 6) {
        alert("You can only upload a maximum of 6 images.");
        return;
      }

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.className = "upload-preview-img";
          img.style.width = "100px";
          img.style.margin = "10px";
          previewArea.appendChild(img);
        };
        reader.readAsDataURL(file);
      });

      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append("project_images", file);
      });

      fetch("/upload-project-images", {
        method: "POST",
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.uploaded) {
            alert("Images uploaded successfully!");
          } else {
            alert("Upload failed: " + (data.error || "Unknown error"));
          }
        })
        .catch(error => {
          console.error("Error uploading images:", error);
          alert("Upload error");
        });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const { jsPDF } = window.jspdf;

  const previewBtn = document.querySelector(".btn-preview");
  if (!previewBtn) return;

  previewBtn.addEventListener("click", () => {
    // Collect data just like before
    const purpose = document.getElementById("portfolio-purpose").value || "Not selected";
    
    const designFocusEls = document.querySelectorAll('input[name="design-focus"]:checked');
    const designFocus = [...designFocusEls].map(el => el.value).join(", ") || "None";

    const designStyle = document.getElementById("design-style").value || "Not provided";

    const skillEls = document.querySelectorAll('input[name="skills"]:checked');
    const skills = [...skillEls].map(el => el.value).join(", ") || "None";

    const projectTitle = document.getElementById("project-title").value || "Not provided";
    const projectYear = document.getElementById("project-year").value || "Not provided";
    const projectDescription = document.getElementById("project-description").value || "Not provided";

    const projectTypeEl = document.querySelector('input[name="project-type"]:checked');
    const projectType = projectTypeEl ? projectTypeEl.value : "Not selected";

    const portfolioLayoutEl = document.querySelector('input[name="portfolio-layout"]:checked');
    const portfolioLayout = portfolioLayoutEl ? portfolioLayoutEl.value : "Not selected";

    const colorSchemeEl = document.querySelector('input[name="color-scheme"]:checked');
    const colorScheme = colorSchemeEl ? colorSchemeEl.value : "Not selected";

    const portfolioTitle = document.getElementById("portfolio-title").value || "Not provided";
    const bioStatement = document.getElementById("bio-statement").value || "Not provided";

    // Initialize jsPDF
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Fashion Portfolio Preview", 10, 20);

    // Add content, split lines if needed
    doc.setFontSize(12);
    let y = 30;

    function addText(text) {
      const splitText = doc.splitTextToSize(text, 180);
      doc.text(splitText, 10, y);
      y += splitText.length * 7; // Adjust line height
    }

    addText(`Purpose: ${purpose}`);
    addText(`Design Focus: ${designFocus}`);
    addText(`Design Style: ${designStyle}`);
    addText(`Skills: ${skills}`);

    addText(`Project Title: ${projectTitle}`);
    addText(`Year Created: ${projectYear}`);
    addText(`Project Description: ${projectDescription}`);
    addText(`Project Type: ${projectType}`);

    addText(`Portfolio Layout: ${portfolioLayout}`);
    addText(`Color Scheme: ${colorScheme}`);
    addText(`Portfolio Title: ${portfolioTitle}`);

    addText(`Bio Statement:\n${bioStatement}`);

    // Save the PDF
    doc.save("portfolio-preview.pdf");
  });
});
