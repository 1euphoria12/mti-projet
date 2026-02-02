document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const wishlistItem = this.closest('.wishlist-item');
            if (confirm('Remove this item from your wishlist?')) {
                wishlistItem.style.opacity = '0.5';
                setTimeout(() => {
                    wishlistItem.remove();
                    updateWishlistCount();
                }, 300);
            }
        });
    });

    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.wishlist-item');
            const itemName = item.querySelector('h3').textContent;
            showNotification(`Added "${itemName}" to cart`, 'success');
        });
    });

    document.querySelectorAll('.btn-move-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.wishlist-item');
            const itemName = item.querySelector('h3').textContent;
            item.style.opacity = '0.5';
            setTimeout(() => {
                item.remove();
                updateWishlistCount();
                showNotification(`Moved "${itemName}" to cart`, 'success');
            }, 300);
        });
    });

    document.querySelectorAll('.btn-add-to-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-heart"></i> Added';
            this.disabled = true;
            showNotification('Added to wishlist', 'success');
        });
    });

    document.querySelector('.btn-primary').addEventListener('click', function() {
        const items = document.querySelectorAll('.wishlist-item');
        if (items.length > 0) {
            showNotification(`Added ${items.length} items to cart`, 'success');
        } else {
            showNotification('Your wishlist is empty', 'info');
        }
    });

    function updateWishlistCount() {
        const count = document.querySelectorAll('.wishlist-item').length;
        const countElement = document.querySelector('.wishlist-info strong');
        if (countElement) {
            countElement.textContent = `${count} items`;
        }
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
});