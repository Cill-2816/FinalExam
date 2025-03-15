// Hàm kiểm tra form hợp lệ
function validateForm(name, email, phone, birthdate, address, password, confirmPassword) {
    // Kiểm tra tên
    if (name.length < 2) {
        alert('Tên phải có ít nhất 2 ký tự');
        return false;
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ');
        return false;
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại không hợp lệ');
        return false;
    }

    // Kiểm tra ngày sinh
    if (!birthdate) {
        alert('Vui lòng chọn ngày sinh');
        return false;
    }

    // Kiểm tra địa chỉ
    if (address.length < 5) {
        alert('Vui lòng nhập địa chỉ đầy đủ');
        return false;
    }

    // Kiểm tra password
    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự');
        return false;
    }

    // Kiểm tra password match
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp');
        return false;
    }

    return true;
}

// Hàm kiểm tra user đã tồn tại
function checkExistingUser(email, phone) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => 
        user.email === email || user.phone === phone
    );
}

// Hàm gửi email thông báo
async function sendWelcomeEmail(userEmail, userName) {
    try {
        const response = await fetch("https://formspree.io/f/xdkeodwe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userEmail,
                message: `
Xin chào ${userName},

Cảm ơn bạn đã đăng ký thành viên tại Chicken Duno!

Bạn sẽ nhận được các thông tin ưu đãi đặc biệt qua email này.

Thông tin tài khoản của bạn:
- Tên: ${userName}
- Email: ${userEmail}
- Hạng thành viên: Thành viên Đồng
- Điểm tích lũy: 0
- Tổng chi tiêu: 0đ

Trân trọng,
Chicken Duno Team
                `
            }),
        });

        if (response.ok) {
            console.log("Email sent successfully");
        } else {
            console.error("Failed to send email");
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// Hàm xử lý đăng ký
async function handleRegister(event) {
    event.preventDefault();

    // Lấy giá trị từ form
    const form = document.querySelector('.register-form');
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const phone = form.querySelector('input[type="tel"]').value.trim();
    const birthdate = form.querySelector('input[type="date"]').value;
    const address = form.querySelectorAll('input[type="text"]')[1].value.trim();
    const password = form.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;
    const newsletter = form.querySelector('.newsletter input[type="checkbox"]').checked;

    // Validate form
    if (!validateForm(name, email, phone, birthdate, address, password, confirmPassword)) {
        return;
    }

    // Kiểm tra user tồn tại
    if (checkExistingUser(email, phone)) {
        alert('Email hoặc số điện thoại đã được đăng ký!');
        return;
    }

    // Tạo user mới
    const newUser = {
        name,
        email,
        phone,
        birthdate,
        address,
        password,
        newsletter,
        points: 0,
        totalSpent: 0,
        membershipLevel: 'Bronze',
        createdAt: new Date().toISOString()
    };

    // Lưu user vào localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Nếu user đăng ký nhận thông báo qua email
    if (newsletter) {
        try {
            // Hiển thị loading
            const registerBtn = form.querySelector('.register-btn');
            const originalText = registerBtn.textContent;
            registerBtn.textContent = 'Đang xử lý...';
            registerBtn.disabled = true;

            // Gửi email
            await sendWelcomeEmail(email, name);

            // Khôi phục nút
            registerBtn.textContent = originalText;
            registerBtn.disabled = false;

            // Thông báo thành công
            alert('Đăng ký thành công! Vui lòng kiểm tra email của bạn.');
        } catch (error) {
            console.error('Lỗi khi gửi email:', error);
            alert('Đăng ký thành công! Tuy nhiên có lỗi khi gửi email thông báo.');
        }
    } else {
        alert('Đăng ký thành công!');
    }

    // Chuyển đến trang đăng nhập
    window.location.href = 'login.html';
}

// Thêm event listener khi trang load
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

