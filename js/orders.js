document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const orders = document.querySelectorAll('.order-card');
            orders.forEach(order => {
                if (filter === 'all' || order.dataset.status === filter) {
                    order.style.display = 'block';
                } else {
                    order.style.display = 'none';
                }
            });
        });
    });
    
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.order;
            if (confirm('Are you sure you want to cancel this order?')) {
                fetch(`/api/orders/${orderId}/cancel/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const orderCard = this.closest('.order-card');
                        const statusBadge = orderCard.querySelector('.order-status-badge');
                        statusBadge.textContent = 'Cancelled';
                        statusBadge.className = 'order-status-badge status-cancelled';
                        this.remove();
                        showNotification('Order cancelled successfully', 'success');
                    }
                });
            }
        });
    });
    
    document.querySelectorAll('.btn-track').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.order;
            window.open(`/orders/${orderId}/tracking/`, '_blank');
        });
    });
    
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.order;
            window.open(`/orders/${orderId}/invoice/`, '_blank');
        });
    });
    
    document.querySelectorAll('.btn-review').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            openReviewModal(productId);
        });
    });
    
    document.querySelectorAll('.btn-reorder').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            fetch(`/api/cart/add/${productId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Product added to cart', 'success');
                }
            });
        });
    });
    
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            fetch(`/api/orders/search/?q=${encodeURIComponent(query)}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                updateOrdersList(data.orders);
            });
        }
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
    
    function showNotification(message, type) {
        if (typeof showNotification === 'undefined') {
            alert(message);
        }
    }
});