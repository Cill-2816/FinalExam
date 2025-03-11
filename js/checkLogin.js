document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra trạng thái đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    
    const loginDiv = document.querySelector('.Login');
    const mobileLoginLink = document.querySelector('.mobile-menu .mobile-login');
    const cartCount = document.querySelector('.cart-count');

    // Cập nhật số lượng trong giỏ hàng
    function updateCartCount() {
        const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    // Lấy thông tin chi tiết user từ danh sách users
    function getUserDetails(email) {
        return users.find(user => user.email === email);
    }

    // Hàm tính hạng thành viên dựa trên tổng chi tiêu
    function calculateMemberTier(totalSpent) {
        if (totalSpent >= 5000000) return 'gold';
        if (totalSpent >= 3000000) return 'silver';
        return 'bronze';
    }

    // Hàm format số tiền thành định dạng VND
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    // Hàm lấy tên hạng thành viên
    function getMemberTierName(tier) {
        switch(tier) {
            case 'gold': return 'Thành viên Vàng';
            case 'silver': return 'Thành viên Bạc';
            default: return 'Thành viên Đồng';
        }
    }

    if (currentUser && currentUser.isLoggedIn) {
        // Tìm thông tin chi tiết của user
        const userDetails = getUserDetails(currentUser.email);
        
        if (userDetails) {
            // Tính toán hạng thành viên
            const totalSpent = userDetails.totalSpent || 0;
            const points = userDetails.points || 0;
            const memberTier = calculateMemberTier(totalSpent);
            const memberTierName = getMemberTierName(memberTier);

            // Cập nhật currentUser với thông tin đầy đủ
            currentUser.name = userDetails.name;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Cập nhật UI cho desktop menu
            if (loginDiv) {
                loginDiv.innerHTML = `
                    <div class="user-profile">
                        <a href="#" class="profile-trigger">
                            <span class="username">${userDetails.name}</span>
                            <i class="fas fa-user"></i>
                        </a>
                        <div class="profile-dropdown">
                            <div class="profile-info">
                                <div class="member-tier ${memberTier}">
                                    <i class="fas fa-crown"></i>
                                    <span>Hạng: ${memberTierName}</span>
                                </div>
                                <div class="points">
                                    <i class="fas fa-star"></i>
                                    <span>Điểm tích lũy: ${points}</span>
                                </div>
                                <div class="total-spent">
                                    <i class="fas fa-coins"></i>
                                    <span>Tổng chi tiêu: ${formatCurrency(totalSpent)}</span>
                                </div>
                            </div>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="logout-btn" onclick="logout()">
                                <i class="fas fa-sign-out-alt"></i>
                                Đăng xuất
                            </a>
                        </div>
                    </div>
                `;
            }

            // Cập nhật UI cho mobile menu
            if (mobileLoginLink) {
                mobileLoginLink.innerHTML = `
                    <div class="mobile-user-info">
                        <span>Xin chào, ${userDetails.name}</span>
                        <div class="mobile-member-tier ${memberTier}">
                            <i class="fas fa-crown"></i>
                            <span>${memberTierName}</span>
                        </div>
                        <button onclick="logout()" class="mobile-logout-btn">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                `;
                mobileLoginLink.style.display = 'flex';
                mobileLoginLink.style.justifyContent = 'space-between';
                mobileLoginLink.style.alignItems = 'center';
            }
        }
    }

    // Cập nhật số lượng giỏ hàng
    updateCartCount();
});

// Thêm style cho các nút và menu
const style = document.createElement('style');
style.textContent = `
    .user-menu {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .username {
        font-size: 16px;
        color: #333;
    }

    .logout-btn, .mobile-logout-btn {
        background: none;
        border: none;
        color: #333;
        cursor: pointer;
        padding: 5px;
        font-size: 16px;
        transition: color 0.3s ease;
    }

    .logout-btn:hover, .mobile-logout-btn:hover {
        color: #ff0000;
    }

    .mobile-menu .mobile-login {
        padding: 10px 15px;
        color: #333;
        text-decoration: none;
        width: 100%;
        box-sizing: border-box;
    }

    .mobile-menu .mobile-login span {
        font-size: 16px;
        color: #333;
    }

    .cart-icon {
        position: relative;
        display: inline-block;
        margin-right: 15px;
    }

    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: #ff4444;
        color: white;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 50%;
        min-width: 15px;
        text-align: center;
    }

    @media (max-width: 768px) {
        .username {
            font-size: 14px;
        }
        
        .logout-btn, .mobile-logout-btn {
            font-size: 14px;
        }

        .cart-icon {
            margin-right: 10px;
        }
    }

    .mobile-user-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .mobile-member-tier {
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .mobile-member-tier.gold i {
        color: #FFD700;
    }

    .mobile-member-tier.silver i {
        color: #C0C0C0;
    }

    .mobile-member-tier.bronze i {
        color: #CD7F32;
    }

    /* User Profile Dropdown Styles */
    .user-profile {
        position: relative;
    }

    .profile-trigger {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        text-decoration: none;
        color: #333;
    }

    .profile-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        width: 250px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 15px;
        display: none;
        z-index: 1000;
    }

    .user-profile:hover .profile-dropdown {
        display: block;
    }

    .profile-info {
        padding: 10px 0;
    }

    .profile-info > div {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        color: #333;
    }

    .profile-dropdown .logout-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 8px 0;
        color: #ff0000;
        text-decoration: none;
    }

    .profile-dropdown .logout-btn:hover {
        opacity: 0.8;
    }

    .dropdown-divider {
        height: 1px;
        background: #eee;
        margin: 10px 0;
    }
`;
document.head.appendChild(style);

// Cập nhật hàm đăng xuất
function logout() {
    // Lưu giỏ hàng hiện tại vào thông tin user trước khi đăng xuất
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    
    if (currentUser && currentUser.isLoggedIn) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        
        if (userIndex !== -1) {
            // Lưu giỏ hàng vào thông tin user
            users[userIndex].savedCart = cart;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    // Xóa thông tin đăng nhập và giỏ hàng
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    
    // Chuyển về trang chủ
    window.location.href = 'index.html';
}

// Thêm xử lý cho nút đăng xuất trên mobile
document.querySelector('.mobile-logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

// Thêm xử lý cho nút đăng xuất trên desktop
document.querySelector('.logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

// Thêm sự kiện click cho icon giỏ hàng
document.querySelector('.cart-icon')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Kiểm tra đăng nhập trước khi chuyển đến trang thanh toán
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isLoggedIn) {
        alert('Vui lòng đăng nhập để xem giỏ hàng!');
        window.location.href = 'login.html';
        return;
    }
    window.location.href = 'pay.html';
}); 