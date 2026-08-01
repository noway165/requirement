// ============================================
// VLU SmartEdu — Header Component
// ============================================

const Header = {
    init() {
        if (!this.initialized) {
            this.initNotifications();
            this.initThemeToggle();
            this.initSearch();
            this.initialized = true;
        } else {
            this.updateBadge();
        }
    },

    initSearch() {
        const searchInput = document.getElementById('global-search');
        if (!searchInput) return;

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    if (typeof Toast !== 'undefined') {
                        Toast.info('Tìm kiếm', `Đang tìm kiếm: ${query}`);
                    } else {
                        alert(`Đang tìm kiếm: ${query}`);
                    }
                }
            }
        });
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
                <i data-lucide="bell-off" style="width:40px;height:40px;color:var(--text-tertiary);margin-bottom:var(--space-2);"></i>
                <p style="color:var(--text-secondary);">Không có thông báo</p>
            </div>`;
        } else {
            list.innerHTML = notifications.map(n => {
                let icon = 'bell';
                let color = 'var(--primary)';
                let bg = 'var(--primary-100)';
                
                if (n.type === 'warning') { icon = 'alert-triangle'; color = 'var(--warning)'; bg = 'var(--warning-bg)'; }
                else if (n.type === 'danger') { icon = 'alert-circle'; color = 'var(--danger)'; bg = 'var(--danger-bg)'; }
                else if (n.type === 'info') { icon = 'info'; color = 'var(--info)'; bg = 'var(--info-bg)'; }
                else if (n.type === 'reminder') { icon = 'clock'; color = 'var(--primary)'; bg = 'var(--primary-100)'; }

                return `
                <div class="notification-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}" style="display:flex; gap:12px; padding:16px; border-bottom:1px solid var(--border-secondary); cursor:pointer; align-items:flex-start; ${n.read ? 'opacity:0.7;' : 'background:var(--bg-elevated);'}">
                    <div style="background:${n.read ? 'transparent' : bg}; color:${n.read ? 'var(--text-tertiary)' : color}; padding:8px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <i data-lucide="${icon}" style="width:20px; height:20px;"></i>
                    </div>
                    <div class="notification-content" style="flex:1;">
                        <div class="notification-text" style="font-size:0.9rem; margin-bottom:4px;">
                            <strong style="color:${n.read ? 'var(--text-secondary)' : 'var(--text-primary)'}">${n.title}</strong>
                        </div>
                        <div class="notification-text" style="color:var(--text-secondary); font-size:0.8rem; line-height:1.4;">${Utils.truncate(n.content, 80)}</div>
                        <div class="notification-time" style="color:var(--text-tertiary); font-size:0.75rem; margin-top:6px;">
                            ${Utils.timeAgo(n.createdAt)}
                        </div>
                    </div>
                    ${!n.read ? `<div style="width:8px; height:8px; border-radius:50%; background:var(--primary); margin-top:14px; flex-shrink:0;"></div>` : ''}
                </div>
            `}).join('');

            list.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', () => {
                    Store.markNotificationRead(item.dataset.id);
                    this.renderNotifications(); // Re-render to update styles
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
