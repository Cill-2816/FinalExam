document.addEventListener('DOMContentLoaded', () => {
    const optionButtons = document.querySelectorAll('.option-btn');
    const deliveryInfo = document.querySelector('.delivery-info');
    const pickupInfo = document.querySelector('.pickup-info');
    const cartList = document.querySelector('.cart-list');
    const subtotalAmount = document.querySelector('.subtotal .amount');
    const totalAmount = document.querySelector('.total .amount');
    const orderButton = document.querySelector('.order-button');
    const orderForm = document.getElementById('orderForm');

    // Lấy thông tin người dùng và giỏ hàng
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Tự động điền thông tin người dùng
    function fillUserInfo() {
        if (currentUser && currentUser.isLoggedIn) {
            // Tìm thông tin chi tiết từ danh sách users
            const userDetails = users.find(user => user.email === currentUser.email);
            
            if (userDetails) {
                // Lấy các trường input
                const nameInput = orderForm.querySelector('input[placeholder="Họ và tên"]');
                const phoneInput = orderForm.querySelector('input[placeholder="Số điện thoại"]');
                const addressInput = orderForm.querySelector('input[placeholder="Địa chỉ giao hàng"]');

                // Điền thông tin mặc định
                if (nameInput) {
                    nameInput.value = userDetails.name || '';
                    nameInput.dataset.original = userDetails.name || ''; // Lưu giá trị gốc
                }
                if (phoneInput) {
                    phoneInput.value = userDetails.phone || '';
                    phoneInput.dataset.original = userDetails.phone || '';
                }
                if (addressInput) {
                    addressInput.value = userDetails.address || '';
                    addressInput.dataset.original = userDetails.address || '';
                }

            }
        }
    }

    // Gọi hàm điền thông tin khi trang load
    fillUserInfo();

    // Xử lý chuyển đổi phương thức nhận hàng
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            optionButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const shippingSection = document.querySelector('.shipping');
            const orderButton = document.querySelector('.order-button');
            
            if (button.dataset.option === 'delivery') {
                deliveryInfo.style.display = 'block';
                pickupInfo.style.display = 'none';
                shippingSection.style.display = 'flex'; // Hiện phí ship
                orderButton.textContent = 'Đặt hàng';
                updateTotal(true); // true = có phí ship
            } else {
                deliveryInfo.style.display = 'none';
                pickupInfo.style.display = 'block';
                shippingSection.style.display = 'none'; // Ẩn phí ship
                orderButton.textContent = 'Đặt bàn';
                updateTotal(false); // false = không có phí ship
            }
        });
    });

    // Cập nhật hàm updateTotal
    function updateTotal(includeShipping) {
        const subtotal = parseFloat(subtotalAmount.textContent.replace(/[^\d]/g, '')) || 0;
        // Chỉ tính phí ship nếu giỏ hàng không trống và đang ở chế độ giao hàng
        const shippingFee = (!isCartEmpty() && includeShipping) ? 0 : 0;
        const total = subtotal + shippingFee;
        totalAmount.textContent = `${total.toLocaleString()}đ`;
    }

    // Thêm hàm kiểm tra giỏ hàng trống
    function isCartEmpty() {
        return Object.keys(cart).length === 0;
    }

    // Cập nhật hàm displayCartItems
    function displayCartItems() {
        let subtotal = 0;
        cartList.innerHTML = '';

        Object.entries(cart).forEach(([name, item]) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            cartList.innerHTML += `
                <div class="cart-item">
                    <img src="./IMG/Menu/${name}.jpg" alt="${name}">
                    <div class="item-details">
                        <h4>${name}</h4>
                        <p>Số lượng: ${item.quantity}</p>
                        <p class="item-price">${item.price.toLocaleString()}đ</p>
                    </div>
                    <div class="item-total">
                        ${itemTotal.toLocaleString()}đ
                    </div>
                </div>
            `;
        });

        subtotalAmount.textContent = `${subtotal.toLocaleString()}đ`;
        
        // Kiểm tra giỏ hàng trống và cập nhật UI
        if (isCartEmpty()) {
            // Ẩn nút giao hàng và hiển thị chỉ đặt bàn
            const deliveryButton = document.querySelector('.option-btn[data-option="delivery"]');
            const pickupButton = document.querySelector('.option-btn[data-option="pickup"]');
            
            if (deliveryButton) {
                deliveryButton.style.display = 'none';
            }
            if (pickupButton) {
                pickupButton.classList.add('active');
            }
            
            // Ẩn phần giao hàng và hiển thị phần đặt bàn
            if (deliveryInfo) deliveryInfo.style.display = 'none';
            if (pickupInfo) pickupInfo.style.display = 'block';
            
            // Ẩn phần phí ship và cập nhật giá 0đ
            const shippingSection = document.querySelector('.shipping');
            if (shippingSection) {
                shippingSection.style.display = 'none';
                const shippingAmount = shippingSection.querySelector('.amount');
                if (shippingAmount) shippingAmount.textContent = '0đ';
            }
            
            // Cập nhật nút đặt hàng và tổng tiền
            if (orderButton) {
                orderButton.textContent = 'Đặt bàn';
            }
            
            // Cập nhật tổng tiền là 0đ
            totalAmount.textContent = '0đ';
            return; // Thoát khỏi hàm vì không cần tính toán thêm
        }

        // Nếu giỏ hàng không trống, kiểm tra phương thức hiện tại để tính phí ship
        const isDelivery = document.querySelector('.option-btn.active').dataset.option === 'delivery';
        updateTotal(isDelivery);
    }

    // Thêm vào phần đầu file, sau các khai báo const
    function updateTimeInput(value) {
        if (value) {
            document.getElementById('reservationTime').value = value;
        }
    }

    // Thêm validation cho input time
    document.getElementById('reservationTime').addEventListener('change', function() {
        const time = this.value;
        const hour = parseInt(time.split(':')[0]);
        const minute = parseInt(time.split(':')[1]);
        
        // Kiểm tra thời gian trong giờ hoạt động
        if (hour < 10 || (hour === 22 && minute > 0) || hour > 22) {
            alert('Vui lòng chọn thời gian từ 10:00 đến 22:00');
            this.value = '';
            return;
        }
        
        // Làm tròn đến 30 phút gần nhất
        if (minute > 0 && minute < 30) {
            this.value = `${hour.toString().padStart(2, '0')}:30`;
        } else if (minute > 30) {
            this.value = `${(hour + 1).toString().padStart(2, '0')}:00`;
        }
    });

    // Cập nhật phần xử lý đặt hàng
    orderButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!currentUser || !currentUser.isLoggedIn) {
            alert('Vui lòng đăng nhập để tiếp tục!');
            window.location.href = 'login.html';
            return;
        }

        const deliveryOption = document.querySelector('.option-btn.active').dataset.option;
        // Lấy thông tin từ form
        const formData = {
            name: orderForm.querySelector('input[placeholder="Họ và tên"]').value,
            phone: orderForm.querySelector('input[placeholder="Số điện thoại"]').value,
            address: orderForm.querySelector('input[placeholder="Địa chỉ giao hàng"]').value,
            note: orderForm.querySelector('textarea').value,
            deliveryOption: deliveryOption,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            reservationTime: document.getElementById('reservationTime').value
        };

        // Kiểm tra thông tin bắt buộc
        if (!formData.name || !formData.phone || 
            (formData.deliveryOption === 'delivery' && !formData.address)) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra thời gian đặt bàn cho trường hợp đặt bàn
        if (formData.deliveryOption === 'pickup' && !formData.reservationTime) {
            alert('Vui lòng chọn thời gian đặt bàn!');
            return;
        }

        // Tạo đơn hàng mới
        const order = {
            orderId: Date.now().toString(),
            userId: currentUser.email,
            ...formData,
            items: cart,
            total: parseFloat(totalAmount.textContent.replace(/[^\d]/g, '')),
            shippingFee: formData.deliveryOption === 'delivery' ? 0 : 0,
            orderDate: new Date().toISOString(),
            status: 'pending'
        };

        // Trước khi lưu đơn hàng, cập nhật thông tin người dùng
        if (formData.deliveryOption === 'delivery') {
            // Tìm user trong danh sách
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            if (userIndex !== -1) {
                // Tính toán điểm tích lũy (1% tổng giá trị đơn hàng)
                const orderTotal = parseFloat(totalAmount.textContent.replace(/[^\d]/g, ''));
                const pointsEarned = Math.floor(orderTotal * 0.01);

                // Cập nhật thông tin user
                users[userIndex] = {
                    ...users[userIndex],
                    totalSpent: (users[userIndex].totalSpent || 0) + orderTotal,
                    points: (users[userIndex].points || 0) + pointsEarned,
                    savedCart: {} // Xóa giỏ hàng đã lưu sau khi đặt hàng thành công
                };

                // Lưu lại vào localStorage
                localStorage.setItem('users', JSON.stringify(users));

                // Thông báo điểm tích lũy
                const newTotalPoints = users[userIndex].points;
                const newTotalSpent = users[userIndex].totalSpent;
                let membershipStatus = '';

                if (newTotalSpent >= 5000000) {
                    membershipStatus = 'Thành viên Vàng';
                } else if (newTotalSpent >= 3000000) {
                    membershipStatus = 'Thành viên Bạc';
                } else {
                    membershipStatus = 'Thành viên Đồng';
                }

                alert(`Đặt hàng thành công!\n\nBạn đã tích lũy thêm ${pointsEarned} điểm.\nTổng điểm hiện tại: ${newTotalPoints}\nHạng thành viên: ${membershipStatus}`);
            } else {
                alert('Đặt hàng thành công!');
            }
        } else {
            alert('Đặt bàn thành công!');
        }

        // Xóa giỏ hàng và chuyển hướng
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
    

    // Hiển thị giỏ hàng khi trang load
    displayCartItems();
}); 