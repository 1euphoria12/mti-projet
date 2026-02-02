document.addEventListener('DOMContentLoaded', function() {
    const addProductBtn = document.getElementById('addProductBtn');
    const modal = document.getElementById('addProductModal');
    const modalClose = document.querySelectorAll('.modal-close');
    const selectAll = document.getElementById('selectAll');
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    const selectedCount = document.querySelector('.selected-count');
    
    if (addProductBtn && modal) {
        addProductBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    
    modalClose.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const isChecked = this.checked;
            productCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            updateSelectedCount();
        });
    }
    
    productCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedCount();
            updateSelectAll();
        });
    });
    
    function updateSelectedCount() {
        const checked = document.querySelectorAll('.product-checkbox:checked');
        selectedCount.textContent = `${checked.length} products selected`;
    }
    
    function updateSelectAll() {
        if (!selectAll) return;
        const allChecked = document.querySelectorAll('.product-checkbox:checked').length;
        const total = productCheckboxes.length;
        selectAll.checked = allChecked === total && total > 0;
        selectAll.indeterminate = allChecked > 0 && allChecked < total;
    }
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const productRow = this.closest('tr');
            const productName = productRow.querySelector('strong').textContent;
            alert(`Editing: ${productName}`);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const productRow = this.closest('tr');
            const productName = productRow.querySelector('strong').textContent;
            if (confirm(`Delete "${productName}"?`)) {
                productRow.style.opacity = '0.5';
                setTimeout(() => {
                    productRow.remove();
                }, 300);
            }
        });
    });
    
    const newProductForm = document.getElementById('newProductForm');
    if (newProductForm) {
        newProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const productName = this.querySelector('input[type="text"]').value;
            modal.style.display = 'none';
            showNotification(`Product "${productName}" added successfully`, 'success');
            this.reset();
        });
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