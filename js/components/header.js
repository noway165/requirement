// ============================================
// VLU SmartEdu — Header Component
// ============================================

const Header = {
    init() {
        this.initNotifications();
        this.initThemeToggle();
    },

    initNotifications() {
        const btn = document.getElementById('notifications-btn');
        const panel = document.getElementById('notification-panel');
        const markAllBtn = document.getElementById('mark-all-read');
        const countBadge = document.getElementById('notification-count');

        if (!btn || !panel) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) this.renderNotifications();
        });

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== btn) {
                panel.style.display = 'none';
            }
        });

        if (markAllBtn) {
            markAllBtn.addEventListener('click', () => {
                const user = Store.getCurrentUser();
                if (user) {
                    const studentId = user.role === 'student' ? 
                        (Store.getStudents().find(s => s.email === user.email)?.id || user.id) : user.id;
                    Store.markAllNotificationsRead(studentId);
                    this.renderNotifications();
                    this.updateBadge();
                }
            });
        }

        this.updateBadge();
    },

    renderNotifications() {
        const list = document.getElementById('notification-list');
        if (!list) return;

        const user = Store.getCurrentUser();
        if (!user) return;

        const studentId = user.role === 'student' ? 
            (Store.getStudents().find(s => s.email === user.email)?.id || user.id) : user.id;
        const notifications = Store.getNotificationsForUser(studentId).slice(0, 10);

        if (notifications.length === 0) {
            list.innerHTML = `<div class="empty-state" style="padding:var(--space-8);">
                <i data-lucide="bell-off" style="width:40px;height:40px;"></i>
                <p>Không có thông báo</p>
            </div>`;
        } else {
            list.innerHTML = notifications.map(n => `
                <div class="notification-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}">
                    <span class="notification-dot"></span>
                    <div class="notification-content">
                        <div class="notification-text"><strong>${n.title}</strong></div>
                        <div class="notification-text" style="color:var(--text-secondary);margin-top:2px;">${Utils.truncate(n.content, 60)}</div>
                        <div class="notification-time">${Utils.timeAgo(n.createdAt)}</div>
                    </div>
                </div>
            `).join('');

            list.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', () => {
                    Store.markNotificationRead(item.dataset.id);
                    item.classList.remove('unread');
                    item.classList.add('read');
                    this.updateBadge();
                });
            });
        }

        if (window.lucide) lucide.createIcons();
    },

    updateBadge() {
        const countBadge = document.getElementById('notification-count');
        if (!countBadge) return;

        const user = Store.getCurrentUser();
        if (!user) return;

        const studentId = user.role === 'student' ? 
            (Store.getStudents().find(s => s.email === user.email)?.id || user.id) : user.id;
        const count = Store.getUnreadCount(studentId);
        
        countBadge.textContent = count;
        countBadge.style.display = count > 0 ? 'flex' : 'none';
    },

    initThemeToggle() {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            if (window.lucide) lucide.createIcons();
        });
    }
};
