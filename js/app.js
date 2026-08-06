// ============================================
// VLU SmartEdu — Main Application
// ============================================

const App = {
    async init() {
        // Initialize store
        await Store.init();

        // Initialize login page
        LoginPage.init();

        // Check if already logged in
        if (Store.isLoggedIn()) {
            this.showApp();
        } else {
            this.showLogin();
        }

        // Register all routes
        this.registerRoutes();

        // Initialize router
        Router.init();

        // Logout handler
        document.getElementById('btn-logout')?.addEventListener('click', () => {
            Modal.confirm({
                title: 'Đăng xuất',
                message: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
                confirmText: 'Đăng xuất',
                type: 'danger',
                onConfirm: () => {
                    Store.logout();
                    this.showLogin();
                    Router.navigate('/login');
                }
            });
        });

        // Render lucide icons
        if (window.lucide) lucide.createIcons();
    },

    showLogin() {
        document.getElementById('login-container').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
        if (window.lucide) lucide.createIcons();
    },

    showApp() {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        
        // Initialize components
        Sidebar.render();
        Sidebar.initToggle();
        Header.init();
        
        if (window.lucide) lucide.createIcons();
    },

    registerRoutes() {
        // Admin routes
        Router.register('/admin/dashboard', () => AdminDashboard.render());
        Router.register('/admin/forecast', () => {
            const content = document.getElementById('page-content');
            content.innerHTML = AdminForecast.render();
            AdminForecast.init();
        });
        Router.register('/admin/students', () => AdminStudents.render());
        Router.register('/admin/courses', () => AdminCourses.render());
        Router.register('/admin/curriculum', () => AdminCurriculum.render());
        Router.register('/admin/prerequisites', () => AdminPrerequisites.render());
        Router.register('/admin/sections', () => AdminSections.render());
        Router.register('/admin/reports', () => AdminReports.render());

        // Student routes
        Router.register('/student/dashboard', () => StudentDashboard.render());
        Router.register('/student/learning-path', () => StudentLearningPath.render());
        Router.register('/student/advisory', () => StudentAdvisory.render());
        Router.register('/student/career', () => StudentCareer.render());

        // Advisor routes
        Router.register('/advisor/dashboard', () => AdvisorDashboard.render());
        Router.register('/advisor/students', () => AdvisorStudents.render());
        Router.register('/advisor/approval', () => AdvisorApproval.render());
        Router.register('/advisor/alerts', () => AdvisorAlerts.render());
        Router.register('/advisor/reports', () => AdvisorReports.render());

        // Login
        Router.register('/login', () => {
            this.showLogin();
        });
    }
};

// Boot
document.addEventListener('DOMContentLoaded', async () => {
    await App.init();
});
