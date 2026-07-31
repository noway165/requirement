// ============================================
// VLU SmartEdu — Login Page
// ============================================

const LoginPage = {
    init() {
        const form = document.getElementById('login-form');
        const passwordToggle = document.getElementById('password-toggle');

        // Demo card clicks
        document.querySelectorAll('.demo-card').forEach(card => {
            card.addEventListener('click', () => {
                document.getElementById('login-email').value = card.dataset.email;
                document.getElementById('login-password').value = card.dataset.password;
                // Highlight selected
                document.querySelectorAll('.demo-card').forEach(c => c.style.borderColor = '');
                card.style.borderColor = 'var(--primary)';
            });
        });

        // Password toggle
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => {
                const input = document.getElementById('login-password');
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                passwordToggle.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}"></i>`;
                if (window.lucide) lucide.createIcons();
            });
        }

        // Form submit
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    },

    handleLogin() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorEl = document.getElementById('login-error');
        const loginBtn = document.getElementById('login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');

        if (!email || !password) {
            this.showError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        // Show loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        loginBtn.disabled = true;
        errorEl.style.display = 'none';

        // Simulate network delay
        setTimeout(() => {
            const result = Store.login(email, password);

            if (result.success) {
                // Success animation
                loginBtn.style.background = 'var(--success)';
                btnLoader.innerHTML = '<i data-lucide="check" class=""></i>';
                if (window.lucide) lucide.createIcons();

                setTimeout(() => {
                    App.showApp();
                    Router.navigate(Router.getDefaultRoute(result.user.role));
                }, 500);
            } else {
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
                loginBtn.disabled = false;
                loginBtn.style.background = '';
                this.showError(result.error);
            }
        }, 800);
    },

    showError(message) {
        const errorEl = document.getElementById('login-error');
        if (errorEl) {
            errorEl.querySelector('span').textContent = message;
            errorEl.style.display = 'flex';
            errorEl.classList.add('animate-shake');
            setTimeout(() => errorEl.classList.remove('animate-shake'), 300);
        }
    }
};
