const AdminDashboard = {
    render: function() {
        const data = Store.getReportData ? Store.getReportData() : {
            totalStudents: 0, activeCourses: 0, curricula: 0, openSections: 0
        };
        const students = Store.getStudents ? Store.getStudents() : [];
        const courses = Store.getCourses ? Store.getCourses() : [];
        const curricula = Store.getCurricula ? Store.getCurricula() : [];
        const sections = Store.getSections ? Store.getSections() : [];

        const html = `
            <div class="page-header mb-6">
                <h2 class="text-2xl font-bold">Bảng điều khiển</h2>
            </div>
            <div class="grid grid-cols-4 gap-4 mb-6">
                <div class="stat-card card p-4">
                    <h3 class="text-gray-500 text-sm">Tổng sinh viên</h3>
                    <div class="text-2xl font-bold mt-2">${students.length || data.totalStudents}</div>
                    <div class="badge badge-success mt-2">+5%</div>
                </div>
                <div class="stat-card card p-4">
                    <h3 class="text-gray-500 text-sm">Môn học đang mở</h3>
                    <div class="text-2xl font-bold mt-2">${courses.length || data.activeCourses}</div>
                    <div class="badge badge-success mt-2">+2%</div>
                </div>
                <div class="stat-card card p-4">
                    <h3 class="text-gray-500 text-sm">Chương trình đào tạo</h3>
                    <div class="text-2xl font-bold mt-2">${curricula.length || data.curricula}</div>
                    <div class="badge badge-warning mt-2">0%</div>
                </div>
                <div class="stat-card card p-4">
                    <h3 class="text-gray-500 text-sm">Lớp học phần mở</h3>
                    <div class="text-2xl font-bold mt-2">${sections.length || data.openSections}</div>
                    <div class="badge badge-success mt-2">+12%</div>
                </div>
            </div>
            
            <div class="grid grid-cols-6 gap-4 mb-6">
                <button class="btn btn-primary flex flex-col items-center justify-center p-4 h-24" onclick="Router.navigate('/admin/students')">
                    <i data-lucide="users" class="mb-2"></i>
                    <span>Sinh viên</span>
                </button>
                <button class="btn btn-secondary flex flex-col items-center justify-center p-4 h-24" onclick="Router.navigate('/admin/courses')">
                    <i data-lucide="book-open" class="mb-2"></i>
                    <span>Môn học</span>
                </button>
                <button class="btn btn-secondary flex flex-col items-center justify-center p-4 h-24" onclick="Router.navigate('/admin/curriculum')">
                    <i data-lucide="layout-list" class="mb-2"></i>
                    <span>CTĐT</span>
                </button>
                <button class="btn btn-secondary flex flex-col items-center justify-center p-4 h-24" onclick="Router.navigate('/admin/prerequisites')">
                    <i data-lucide="git-branch" class="mb-2"></i>
                    <span>Tiên quyết</span>
                </button>
                <button class="btn btn-secondary flex flex-col items-center justify-center p-4 h-24" onclick="Router.navigate('/admin/sections')">
                    <i data-lucide="layers" class="mb-2"></i>
                    <span>Lớp HP</span>
                </button>
                <button class="btn btn-secondary flex flex-col items-center justify-center p-4 h-24" onclick="Router.navigate('/admin/reports')">
                    <i data-lucide="pie-chart" class="mb-2"></i>
                    <span>Báo cáo</span>
                </button>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div class="card p-4 chart-container h-80">
                    <h3 class="mb-4 font-bold text-lg">Sinh viên theo khoa</h3>
                    <div class="h-64 relative flex justify-center"><canvas id="facultyChart"></canvas></div>
                </div>
                <div class="card p-4 chart-container h-80">
                    <h3 class="mb-4 font-bold text-lg">Phân bố điểm trung bình</h3>
                    <div class="h-64 relative"><canvas id="gpaChart"></canvas></div>
                </div>
            </div>
        `;

        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            const faculties = Store.getFaculties ? Store.getFaculties() : ['CNTT', 'Kinh tế', 'Ngoại ngữ'];
            
            // Faculty chart data
            const facultyData = [
                { label: faculties[0] || 'CNTT', value: 45 },
                { label: faculties[1] || 'Kinh tế', value: 30 },
                { label: faculties[2] || 'Ngoại ngữ', value: 25 }
            ];
            Charts.donut('facultyChart', facultyData);

            // GPA chart data
            const gpaData = [
                { label: '< 2.0', value: 5 },
                { label: '2.0-2.5', value: 15 },
                { label: '2.5-3.2', value: 50 },
                { label: '3.2-3.6', value: 20 },
                { label: '> 3.6', value: 10 }
            ];
            Charts.bar('gpaChart', gpaData);
        }, 100);
    }
};
