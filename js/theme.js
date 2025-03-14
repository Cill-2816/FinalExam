// Kiểm tra và áp dụng theme từ localStorage ngay khi file được load
(function() {
    // Kiểm tra theme từ localStorage
    const savedTheme = localStorage.getItem('theme') || 'light'; // Mặc định là light nếu chưa có
    
    // Áp dụng theme
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

// Xử lý tương tác với nút theme-switch
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.querySelector('.theme-switch');
    if (themeSwitch) {
        const icon = themeSwitch.querySelector('i');
        
        // Cập nhật icon dựa trên theme hiện tại từ localStorage
        const currentTheme = localStorage.getItem('theme') || 'light';
        icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

        // Xử lý sự kiện click
        themeSwitch.addEventListener('click', () => {
            // Lấy theme hiện tại từ localStorage
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Lưu theme mới vào localStorage
            localStorage.setItem('theme', newTheme);
            
            // Áp dụng theme mới
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Cập nhật icon với animation
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                icon.style.transform = '';
            }, 200);
        });
    }
}); 