document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');

    if (!loginForm || !usernameInput || !passwordInput || !loginError) {
        return;
    }

    const clearError = () => {
        loginError.textContent = '';
    };

    usernameInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username && !password) {
            loginError.textContent = 'Please enter username and password.';
            usernameInput.focus();
            return;
        }

        if (!username) {
            loginError.textContent = 'Please enter username.';
            usernameInput.focus();
            return;
        }

        if (!password) {
            loginError.textContent = 'Please enter password.';
            passwordInput.focus();
            return;
        }

        localStorage.setItem('eatsyUsername', username);
        localStorage.setItem('quickbiteUsername', username);
        window.location.href = 'home.html';
    });
});
