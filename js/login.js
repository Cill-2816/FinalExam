document.addEventListener('DOMContentLoaded', function() {
    const switchForms = document.querySelectorAll('.switch-form');
    const loginForm = document.querySelector('.form-box.login');
    const registerForm = document.querySelector('.form-box.register');

    switchForms.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
            registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
        });
    });
});