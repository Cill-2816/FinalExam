document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo giỏ hàng từ localStorage hoặc tạo mới
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    updateCartCount();

    // Thêm event listeners cho tất cả các nút + và -
    document.querySelectorAll('.menu-item').forEach(item => {
        const minusBtn = item.querySelector('.minus');
        const plusBtn = item.querySelector('.plus');
        const quantitySpan = item.querySelector('.quantity');
        const itemName = item.querySelector('h3').textContent;
        const itemPrice = parseFloat(item.querySelector('.price').textContent.replace(/[^\d]/g, ''));

        // Khôi phục số lượng từ giỏ hàng
        if (cart[itemName]) {
            quantitySpan.textContent = cart[itemName].quantity;
        }

        plusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantitySpan.textContent);
            quantity++;
            quantitySpan.textContent = quantity;
            updateCart(itemName, quantity, itemPrice);
        });

        minusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantitySpan.textContent);
            if (quantity > 0) {
                quantity--;
                quantitySpan.textContent = quantity;
                updateCart(itemName, quantity, itemPrice);
            }
        });
    });

    // Hàm cập nhật giỏ hàng
    function updateCart(itemName, quantity, price) {
        if (quantity > 0) {
            cart[itemName] = {
                quantity: quantity,
                price: price
            };
        } else {
            delete cart[itemName];
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Hàm cập nhật số lượng hiển thị trên icon giỏ hàng
    function updateCartCount() {
        const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
    }
}); 