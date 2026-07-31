// ============================================
// VLU SmartEdu — SPA Router
// ============================================

const Router = {
    routes: {},
    currentRoute: null,

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    register(path, handler) {
        this.routes[path] = handler;
    },

    navigate(path) {
        window.location.hash = path;
    },

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const user = Store.getCurrentUser();

        // Auth guard
        if (!Store.isLoggedIn() && hash !== '/login') {
            this.navigate('/login');
            return;
        }

        if (Store.isLoggedIn() && hash === '/login') {
            const defaultRoute = this.getDefaultRoute(user.role);
            this.navigate(defaultRoute);
            return;
        }

        // Role guard
        if (user && !this.canAccess(hash, user.role)) {
            const defaultRoute = this.getDefaultRoute(user.role);
            this.navigate(defaultRoute);
            return;
        }

        // Find and execute route handler
        const handler = this.routes[hash];
        if (handler) {
            this.currentRoute = hash;
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.classList.add('page-exit');
                setTimeout(() => {
                    handler();
                    pageContent.classList.remove('page-exit');
                    pageContent.classList.add('page-enter');
                    setTimeout(() => pageContent.classList.remove('page-enter'), 300);
                    // Re-render icons
                    if (window.lucide) lucide.createIcons();
                    // Update sidebar active state
                    this.updateSidebarActive(hash);
                    // Update breadcrumb
                    this.updateBreadcrumb(hash);
                }, 150);
            }
        } else {
            // 404 - redirect to default
            if (user) {
                this.navigate(this.getDefaultRoute(user.role));
            } else {
                this.navigate('/login');
            }
        }
    },

    getDefaultRoute(role) {
        const defaults = {
            'admin': '/admin/dashboard',
            'advisor': '/advisor/dashboard',
            'student': '/student/dashboard',
        };
        return defaults[role] || '/login';
    },

    canAccess(path, role) {
        const roleAccess = {
            'admin': ['/admin'],
            'advisor': ['/advisor'],
            'student': ['/student'],
        };
        const allowed = roleAccess[role] || [];
        return allowed.some(prefix => path.startsWith(prefix));
    },

    updateSidebarActive(hash) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.route === hash) {
                item.classList.add('active');
            }
        });
    },

    updateBreadcrumb(hash) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        const routeNames = {
            '/admin/dashboard': ['Phòng Đào tạo', 'Dashboard'],
            '/admin/students': ['Phòng Đào tạo', 'Quản lý Sinh viên'],
            '/admin/courses': ['Phòng Đào tạo', 'Quản lý Học phần'],
            '/admin/curriculum': ['Phòng Đào tạo', 'Chương trình Đào tạo'],
            '/admin/prerequisites': ['Phòng Đào tạo', 'Học phần Tiên quyết'],
            '/admin/sections': ['Phòng Đào tạo', 'Mở lớp Học phần'],
            '/admin/reports': ['Phòng Đào tạo', 'Báo cáo & Thống kê'],
            '/student/dashboard': ['Sinh viên', 'Tổng quan'],
            '/student/learning-path': ['Sinh viên', 'Lộ trình Học tập'],
            '/student/advisory': ['Sinh viên', 'Tư vấn Lộ trình'],
            '/student/career': ['Sinh viên', 'Tư vấn Nghề nghiệp'],
            '/advisor/dashboard': ['Cố vấn', 'Tổng quan'],
            '/advisor/students': ['Cố vấn', 'Theo dõi Sinh viên'],
            '/advisor/approval': ['Cố vấn', 'Phê duyệt Lộ trình'],
            '/advisor/alerts': ['Cố vấn', 'Cảnh báo Học tập'],
            '/advisor/reports': ['Cố vấn', 'Báo cáo Thống kê'],
        };

        const names = routeNames[hash] || ['Trang chủ'];
        breadcrumb.innerHTML = names.map((name, i) => 
            `<span class="breadcrumb-item ${i === names.length - 1 ? 'active' : ''}">${name}</span>` +
            (i < names.length - 1 ? '<i data-lucide="chevron-right" style="width:14px;height:14px;color:var(--text-tertiary)"></i>' : '')
        ).join('');
    },
};
