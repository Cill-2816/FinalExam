// Hàm kiểm tra đăng nhập
function handleLogin(event) {
    event.preventDefault();

    // Lấy giá trị từ form
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value;
    const rememberMe = document.querySelector('input[type="checkbox"]').checked;

    // Lấy danh sách users từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Tìm user trong danh sách
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Lưu thông tin đăng nhập
        const loggedInUser = {
            username: user.username,
            email: user.email,
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };
        
        // Lưu session người dùng
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));

        // Thông báo thành công và chuyển hướng
        alert('Đăng nhập thành công!');
        window.location.href = 'index.html';
    } else {
        // Thông báo lỗi
        alert('Email hoặc mật khẩu không chính xác!');
    }
}


// Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.isLoggedIn) {
        // Nếu đã đăng nhập và không phải ở trang login, chuyển về trang chủ
        if (!window.location.href.includes('login.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Hàm đăng xuất
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Thêm event listener khi trang load
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra trạng thái đăng nhập
    checkLoginStatus();

    // Thêm event listener cho form đăng nhập
    const loginForm = document.querySelector('.form-box.login form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Cập nhật UI dựa trên trạng thái đăng nhập
    updateUI();
});

// Cập nhật UI dựa trên trạng thái đăng nhập
function updateUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.isLoggedIn) {
        // Nếu đã đăng nhập, cập nhật UI tương ứng
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Đã đăng nhập';
            loginBtn.disabled = true;
        }

        // Có thể thêm tên người dùng vào header
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <span>Xin chào, ${currentUser.username}</span>
            <button onclick="logout()" class="logout-btn">Đăng xuất</button>
        `;

        // Thêm vào header nếu cần
        const header = document.querySelector('.HD');
        if (header) {
            header.appendChild(userInfo);
        }
    }
}

// Xử lý quên mật khẩu (có thể thêm sau)
document.querySelector('a[href="#"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Chức năng đang được phát triển!');
});

// const loginBtn = document.querySelector('.login-btn');
