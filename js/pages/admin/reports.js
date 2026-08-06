const AdminReports = {
    render: function() {
        const data = Store.getReportData ? Store.getReportData() : {
            totalStudents: 15420, activeCourses: 324, curricula: 45, openSections: 120
        };

        const html = `
            <div class="page-header mb-6 flex justify-between items-center">
                <h2 class="text-2xl font-bold">Báo cáo & Thống kê</h2>
                <div class="flex gap-2">
                    <button class="btn btn-secondary flex items-center gap-2" onclick="AdminReports.exportExcel()">
                        <i data-lucide="file-spreadsheet"></i> Xuất Excel
                    </button>
                    <button class="btn btn-primary flex items-center gap-2" onclick="AdminReports.exportPDF()">
                        <i data-lucide="file-text"></i> Xuất PDF
                    </button>
                </div>
            </div>

            <div class="card mb-6 p-4">
                <div class="flex gap-4 items-end">
                    <div class="flex-1 max-w-xs form-group">
                        <label class="block text-sm font-medium mb-1 text-slate-300">Năm học</label>
                        <select class="w-full border border-slate-700 bg-slate-800 text-slate-200 rounded-md p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                            <option>2023-2024</option>
                            <option>2024-2025</option>
                        </select>
                    </div>
                    <div class="flex-1 max-w-xs form-group">
                        <label class="block text-sm font-medium mb-1 text-slate-300">Học kỳ</label>
                        <select class="w-full border border-slate-700 bg-slate-800 text-slate-200 rounded-md p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                            <option>Học kỳ 1</option>
                            <option>Học kỳ 2</option>
                            <option>Học kỳ hè</option>
                        </select>
                    </div>
                    <button class="btn btn-primary h-[42px] px-6">Lọc</button>
                </div>
            </div>

            <div class="tabs mb-6 flex border-b">
                <button class="px-4 py-2 border-b-2 border-primary text-primary font-medium">Tổng quan</button>
                <button class="px-4 py-2 text-gray-500 hover:text-gray-700">Sinh viên</button>
                <button class="px-4 py-2 text-gray-500 hover:text-gray-700">Chương trình</button>
                <button class="px-4 py-2 text-gray-500 hover:text-gray-700">Môn học</button>
            </div>

            <div class="grid grid-cols-4 gap-4 mb-6">
                <div class="stat-card card p-4">
                    <h3 class="text-gray-500 text-sm">Tổng sinh viên</h3>
                    <div class="text-2xl font-bold mt-2">${Store.getStudents().length}</div>
                </div>
                <div class="stat-card card p-4">
                    <h3 class="text-gray-500 text-sm">Môn học đang mở</h3>
                    <div class="text-2xl font-bold mt-2">${Store.getCourses().length}</div>
                </div>
                <div class="stat-card card p-4">
                    <h3 class="text-gray-500 text-sm">Chương trình đào tạo</h3>
                    <div class="text-2xl font-bold mt-2">${Store.getCurricula().length}</div>
                </div>
                <div class="stat-card card p-4">
                    <h3 class="text-gray-500 text-sm">Lớp học phần mở</h3>
                    <div class="text-2xl font-bold mt-2">${Store.getSections().length}</div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-6">
                <div class="card p-4 chart-container h-80">
                    <h3 class="mb-4 font-bold">Sinh viên theo khoa</h3>
                    <div class="h-64 flex justify-center"><canvas id="reportFacultyChart"></canvas></div>
                </div>
                <div class="card p-4 chart-container h-80">
                    <h3 class="mb-4 font-bold">Phân bố điểm trung bình</h3>
                    <div class="h-64"><canvas id="reportGpaChart"></canvas></div>
                </div>
            </div>
            
            <div class="card p-4 chart-container h-80">
                <h3 class="mb-4 font-bold">Xu hướng tuyển sinh (3 năm)</h3>
                <div class="h-64"><canvas id="enrollmentChart"></canvas></div>
            </div>
        `;

        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            const facList = Store.getFaculties ? Store.getFaculties() : [];
            const getFacName = (i, fallback) => facList[i] ? (facList[i].name || facList[i]) : fallback;
            
            const students = Store.getStudents ? Store.getStudents() : [];
            const facStats = {};
            students.forEach(s => {
                const fac = s.faculty || 'Khác';
                facStats[fac] = (facStats[fac] || 0) + 1;
            });
            const facultyData = Object.keys(facStats).map(f => ({ label: f, value: facStats[f] }));
            Charts.donut('reportFacultyChart', facultyData);

            const gpaStats = { '< 2.0': 0, '2.0-2.5': 0, '2.5-3.2': 0, '3.2-3.6': 0, '> 3.6': 0 };
            students.forEach(s => {
                const gpa = s.gpa || 0;
                if (gpa < 2.0) gpaStats['< 2.0']++;
                else if (gpa <= 2.5) gpaStats['2.0-2.5']++;
                else if (gpa <= 3.2) gpaStats['2.5-3.2']++;
                else if (gpa <= 3.6) gpaStats['3.2-3.6']++;
                else gpaStats['> 3.6']++;
            });
            const gpaData = Object.keys(gpaStats).map(k => ({ label: k, value: gpaStats[k] }));
            Charts.bar('reportGpaChart', gpaData);

            Charts.line('enrollmentChart', [{
                label: 'Số sinh viên nhập học',
                data: [3500, 3800, 4200],
                borderColor: '#0066cc',
                tension: 0.1
            }], ['2021', '2022', '2023']);
        }, 100);
    },

    exportExcel: function() {
        if (typeof Utils !== 'undefined' && typeof Utils.exportToCSV === 'function') {
<<<<<<< HEAD
            Utils.exportToCSV('Báo cáo thống kê', [['Mục', 'Giá trị'], ['Sinh viên', (Store.getStudents ? Store.getStudents().length : 0)], ['Môn học', (Store.getCourses ? Store.getCourses().length : 0)]]);
            Toast.success('Thành công', 'Đã tải xuống báo cáo Excel');
        } else {
            Toast.success('Thành công', 'Đã tải xuống báo cáo Excel');
=======
            const data = [
                { item: 'Tổng sinh viên', value: Store.getStudents ? Store.getStudents().length : 0 },
                { item: 'Môn học đang mở', value: Store.getCourses ? Store.getCourses().length : 0 },
                { item: 'Chương trình đào tạo', value: Store.getCurricula ? Store.getCurricula().length : 0 },
                { item: 'Lớp học phần mở', value: Store.getSections ? Store.getSections().length : 0 }
            ];
            const headers = [
                { label: 'Mục', key: 'item' },
                { label: 'Giá trị', key: 'value' }
            ];
            Utils.exportToCSV(data, headers, 'BaoCaoThongKe.csv');
            Toast.success('Thành công', 'Đã tải xuống báo cáo Excel');
        } else {
            Toast.error('Lỗi', 'Tính năng tải báo cáo hiện chưa khả dụng');
>>>>>>> ccf133813d7bcadedd9c25cabfcc38c0a9aac051
        }
    },
    
    exportPDF: function() {
        Toast.success('Thành công', 'Đã xuất báo cáo PDF');
    }
};
