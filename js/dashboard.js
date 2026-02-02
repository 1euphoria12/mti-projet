document.addEventListener('DOMContentLoaded', function() {
    function getUserRole() {
        if (window.location.pathname.includes('buyer')) return 'buyer';
        if (window.location.pathname.includes('seller')) return 'seller';
        if (window.location.pathname.includes('admin')) return 'admin';
        return localStorage.getItem('userRole') || 'buyer';
    }
    
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
            if (csrfToken) {
                formData.append('csrfmiddlewaretoken', csrfToken.value);
            }
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showNotification('Product saved successfully!', 'success');
                this.reset();
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }, 2000);
        });
    }
    
    document.querySelectorAll('.btn-ship, .btn-deliver, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            const action = this.dataset.action;
            updateOrderStatus(orderId, action);
        });
    });
    
    document.querySelectorAll('.btn-approve, .btn-reject').forEach(btn => {
        btn.addEventListener('click', function() {
            const shopId = this.dataset.shopId;
            const action = this.classList.contains('btn-approve') ? 'approve' : 'reject';
            reviewShop(shopId, action);
        });
    });
    
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const statType = this.querySelector('h3').textContent;
            showNotification(`Viewing details for: ${statType}`, 'info');
        });
    });
    
    function initTooltips() {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }
    
    function initNotifications() {
        const unreadCount = 3;
        if (unreadCount > 0) {
            showNotification(`You have ${unreadCount} unread notifications`, 'info');
        }
    }
    
    function initCharts() {
        if (typeof Chart !== 'undefined') {
            const ctx = document.getElementById('salesChart');
            if (ctx) {
                new Chart(ctx.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Sales',
                            data: [12000, 19000, 15000, 25000, 22000, 30000],
                            borderColor: '#8f4a11',
                            backgroundColor: 'rgba(143, 74, 17, 0.1)',
                            borderWidth: 2,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }
        }
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    function updateOrderStatus(orderId, action) {
        fetch(`/api/orders/${orderId}/update-status/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                action: action,
                notes: 'Updated via dashboard'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`Order ${orderId} status updated to ${action}`, 'success');
                const statusElement = document.querySelector(`[data-order="${orderId}"] .order-status`);
                if (statusElement) {
                    statusElement.textContent = action.charAt(0).toUpperCase() + action.slice(1);
                    statusElement.className = `order-status status-${action}`;
                }
            }
        })
        .catch(error => {
            showNotification('Failed to update order status', 'error');
        });
    }
    
    function reviewShop(shopId, action) {
        fetch(`/admin/shops/${shopId}/review/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                action: action,
                notes: action === 'approve' ? 'Shop meets requirements' : 'Shop does not meet requirements'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`Shop ${action === 'approve' ? 'approved' : 'rejected'}`, 'success');
                const shopElement = document.querySelector(`[data-shop="${shopId}"]`);
                if (shopElement) {
                    shopElement.remove();
                }
            }
        })
        .catch(error => {
            showNotification('Failed to review shop', 'error');
        });
    }
    
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    function connectWebSocket() {
        const role = getUserRole();
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/ws/dashboard/${role}/`;
    }
    
    const searchInput = document.querySelector('.dashboard-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value;
            if (query.length > 2) {
                searchDashboard(query);
            }
        }, 300));
    }
    
    function searchDashboard(query) {
        fetch(`/api/search/?q=${encodeURIComponent(query)}&role=${getUserRole()}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            updateSearchResults(data.results);
        });
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    document.querySelectorAll('.btn-export').forEach(btn => {
        btn.addEventListener('click', function() {
            const exportType = this.dataset.type;
            exportData(exportType);
        });
    });
    
    function exportData(type) {
        window.location.href = `/dashboard/export/${type}/?${new URLSearchParams({
            start_date: '2025-01-01',
            end_date: '2025-01-31'
        })}`;
    }
});