// register.js - Registration functionality

document.addEventListener('DOMContentLoaded', function() {
    // Role Selection
    const roleOptions = document.querySelectorAll('.role-option');
    const selectedRoleInput = document.getElementById('selectedRole');
    const roleText = document.getElementById('roleText');
    const benefitsContents = document.querySelectorAll('.benefits-content');
    const sellerInfoSection = document.getElementById('sellerInfo');
    
    // Set buyer as default
    setActiveRole('buyer');
    
    // Add click event to each role option
    roleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            setActiveRole(role);
        });
    });
    
    function setActiveRole(role) {
        // Remove active class from all options
        roleOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to selected option
        document.querySelector(`.role-option[data-role="${role}"]`).classList.add('active');
        
        // Update hidden input
        selectedRoleInput.value = role;
        
        // Update button text
        roleText.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        // Show corresponding benefits
        benefitsContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${role}-benefits`).classList.add('active');
        
        // Show/hide seller info section
        if (role === 'seller') {
            sellerInfoSection.style.display = 'block';
            // Make seller fields required
            document.getElementById('shopName').required = true;
        } else {
            sellerInfoSection.style.display = 'none';
            document.getElementById('shopName').required = false;
        }
    }
    
    // Password validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    function validatePasswords() {
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords don't match");
            return false;
        } else {
            confirmPassword.setCustomValidity('');
            return true;
        }
    }
    
    if (password && confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswords);
        password.addEventListener('input', validatePasswords);
    }
    
    // Form submission
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate passwords
            if (!validatePasswords()) {
                alert("Passwords don't match!");
                return;
            }
            
            // Get form values
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                username: document.getElementById('username').value,
                password: password.value,
                role: selectedRoleInput.value,
                terms: document.getElementById('terms').checked,
                newsletter: document.getElementById('newsletter').checked
            };
            
            // Add seller info if applicable
            if (formData.role === 'seller') {
                formData.shopName = document.getElementById('shopName').value;
                formData.shopCategory = document.getElementById('shopCategory').value;
            }
            
            // Validate required fields
            if (!formData.firstName || !formData.lastName || !formData.email || 
                !formData.username || !formData.password || !formData.terms) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // For demo, store in localStorage
                const userData = {
                    ...formData,
                    id: Date.now(),
                    registeredAt: new Date().toISOString()
                };
                
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('userRole', formData.role);
                localStorage.setItem('isLoggedIn', 'true');
                
                // Show success message
                alert(`Account created successfully! Welcome to E-Shop as a ${formData.role}.`);
                
                // Redirect based on role
                let redirectUrl = '';
                switch(formData.role) {
                    case 'buyer':
                        redirectUrl = 'buyer-dashboard.html';
                        break;
                    case 'seller':
                        redirectUrl = 'seller-dashboard.html';
                        break;
                    default:
                        redirectUrl = 'index.html';
                }
                
                // Redirect
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1500);
                
            }, 2000);
        });
    }
    
    // Real-time username validation
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        let usernameTimeout;
        
        usernameInput.addEventListener('input', function() {
            clearTimeout(usernameTimeout);
            usernameTimeout = setTimeout(() => {
                const username = this.value;
                if (username.length < 3) {
                    showInputError(this, 'Username must be at least 3 characters');
                } else if (username.length > 20) {
                    showInputError(this, 'Username must be less than 20 characters');
                } else {
                    clearInputError(this);
                }
            }, 500);
        });
    }
    
    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                showInputError(this, 'Please enter a valid email address');
            } else {
                clearInputError(this);
            }
        });
    }
    
    // Helper functions for validation messages
    function showInputError(input, message) {
        clearInputError(input);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#ef4444';
    }
    
    function clearInputError(input) {
        const existingError = input.parentNode.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '#e0e0e0';
    }
});