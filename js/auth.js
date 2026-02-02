// auth.js - Authentication functionality

document.addEventListener('DOMContentLoaded', function() {
    // Role Selection
    const roleOptions = document.querySelectorAll('.role-option');
    const selectedRoleInput = document.getElementById('selectedRole');
    const roleText = document.getElementById('roleText');
    const descriptionContents = document.querySelectorAll('.description-content');
    
    // Set first role as active by default
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
        
        // Show corresponding description
        descriptionContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${role}-desc`).classList.add('active');
    }
    
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            if (isPassword) {
              icon.classList.remove('fa-eye');
              icon.classList.add('fa-eye-slash');
            } else {
              icon.classList.remove('fa-eye-slash');
              icon.classList.add('fa-eye');
            }
        });
    }
    
    // Form submission
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = selectedRoleInput.value;
            const remember = document.getElementById('remember').checked;
            
            // Simple validation
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // For now, just redirect based on role
                // In real app, you would send this to Django backend
                redirectBasedOnRole(role);
                
            }, 1500);
        });
    }
    
    // Redirect function
    function redirectBasedOnRole(role) {
        let redirectUrl = '';
        
        switch(role) {
            case 'buyer':
                redirectUrl = 'buyer-dashboard.html';
                break;
            case 'seller':
                redirectUrl = 'seller-dashboard.html';
                break;
            case 'admin':
                redirectUrl = 'admin-dashboard.html';
                break;
            default:
                redirectUrl = 'index.html';
        }
        
        // Store role in localStorage (for demo purposes)
        localStorage.setItem('userRole', role);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Show success message
        alert(`Login successful! Redirecting to ${role} dashboard...`);
        
        // Redirect after 1 second
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    }
    
    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.classList.contains('google') ? 'Google' : 'Facebook';
            alert(`${type} login would be implemented here. For now, please use form login.`);
        });
    });
});