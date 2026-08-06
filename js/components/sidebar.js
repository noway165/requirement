// ============================================
// VLU SmartEdu — Sidebar Component
// ============================================

const Sidebar = {
    render() {
        const user = Store.getCurrentUser();
        if (!user) return;

        const nav = document.getElementById('sidebar-nav');
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');
        const userAvatar = document.getElementById('user-avatar');

        if (userName) userName.textContent = user.name;
        if (userAvatar) userAvatar.textContent = user.avatar || user.name.charAt(0);

        const roleLabels = { admin: 'Phòng Đào tạo', advisor: 'Cố vấn Học tập', student: 'Sinh viên' };
        if (userRole) userRole.textContent = roleLabels[user.role] || user.role;

        const navItems = this.getNavItems(user.role);
        if (nav) {
            nav.innerHTML = navItems.map(section => `
                <div class="nav-section">
                    ${section.label ? `<div class="nav-label">${section.label}</div>` : ''}
                    ${section.items.map(item => `
                        <a class="nav-item ${Router.currentRoute === item.route ? 'active' : ''}" 
                           data-route="${item.route}" href="#${item.route}">
                            <i data-lucide="${item.icon}"></i>
                            <span class="nav-text">${item.text}</span>
                            ${item.badge ? `<span class="badge badge-danger" style="margin-left:auto;font-size:10px;">${item.badge}</span>` : ''}
                        </a>
                    `).join('')}
                </div>
            `).join('');
        }

        if (window.lucide) lucide.createIcons();
    },

    getNavItems(role) {
        const pendingCount = role === 'advisor' ? Store.getPendingApprovals(Store.getCurrentUser().id).length : 0;

        const navMap = {
            admin: [
                { label: 'Tổng quan', items: [
                    { icon: 'layout-dashboard', text: 'Dashboard', route: '/admin/dashboard' },
                ]},
<<<<<<< HEAD
                { label: 'Quản lý', items: [
                    { icon: 'users', text: 'Sinh viên', route: '/admin/students' },
                    { icon: 'book-open', text: 'Học phần', route: '/admin/courses' },
                    { icon: 'graduation-cap', text: 'Chương trình ĐT', route: '/admin/curriculum' },
                    { icon: 'git-branch', text: 'Môn tiên quyết', route: '/admin/prerequisites' },
                    { icon: 'calendar-plus', text: 'Mở lớp HP', route: '/admin/sections' },
                ]},
                { label: 'Báo cáo', items: [
                    { icon: 'bar-chart-3', text: 'Thống kê & Báo cáo', route: '/admin/reports' },
=======
                { label: 'Khung CT & Điều kiện', items: [
                    { icon: 'graduation-cap', text: 'Khung Chương trình', route: '/admin/curriculum' },
                    { icon: 'book-open', text: 'Quản lý Học phần', route: '/admin/courses' },
                    { icon: 'git-branch', text: 'Môn tiên quyết', route: '/admin/prerequisites' },
                ]},
                { label: 'Dự báo & Kế hoạch', items: [
                    { icon: 'trending-up', text: 'Dự báo Nhu cầu', route: '/admin/forecast' },
                    { icon: 'calendar-plus', text: 'Kế hoạch Mở lớp', route: '/admin/sections' },
                ]},
                { label: 'Thống kê & Quản lý', items: [
                    { icon: 'bar-chart-3', text: 'Báo cáo Tổng hợp', route: '/admin/reports' },
                    { icon: 'users', text: 'Dữ liệu Sinh viên', route: '/admin/students' },
>>>>>>> ccf133813d7bcadedd9c25cabfcc38c0a9aac051
                ]},
            ],
            advisor: [
                { label: 'Tổng quan', items: [
                    { icon: 'layout-dashboard', text: 'Dashboard', route: '/advisor/dashboard' },
                ]},
                { label: 'Quản lý', items: [
                    { icon: 'users', text: 'Theo dõi Sinh viên', route: '/advisor/students' },
                    { icon: 'check-square', text: 'Phê duyệt Lộ trình', route: '/advisor/approval', badge: pendingCount || null },
                    { icon: 'bell-ring', text: 'Cảnh báo Học tập', route: '/advisor/alerts' },
                ]},
                { label: 'Báo cáo', items: [
                    { icon: 'bar-chart-3', text: 'Thống kê Lớp', route: '/advisor/reports' },
                ]},
            ],
            student: [
                { label: 'Tổng quan', items: [
                    { icon: 'layout-dashboard', text: 'Dashboard', route: '/student/dashboard' },
                ]},
                { label: 'Học tập', items: [
                    { icon: 'route', text: 'Lộ trình Học tập', route: '/student/learning-path' },
                    { icon: 'bot', text: 'Tư vấn AI', route: '/student/advisory' },
                    { icon: 'briefcase', text: 'Tư vấn Nghề nghiệp', route: '/student/career' },
                ]},
            ],
        };

        return navMap[role] || [];
    },

    initToggle() {
        if (this.toggleInitialized) return;
        this.toggleInitialized = true;

        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('sidebar-toggle');
        const mobileToggle = document.getElementById('mobile-menu-toggle');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
            });
        }

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }

        // Close on mobile when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-open')) {
                if (!sidebar.contains(e.target) && e.target !== mobileToggle) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });

        // Restore collapsed state
        if (localStorage.getItem('sidebar_collapsed') === 'true' && window.innerWidth > 768) {
            sidebar.classList.add('collapsed');
        }
    }
};
