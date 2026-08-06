const AdvisorReports = {
    render: function() {
        const user = Store.getCurrentUser() || { id: 1 };
        const myStudents = Store.getStudentsByAdvisor ? Store.getStudentsByAdvisor(user.id) : [];
        
        let warningCount = 0;
        let behindCount = 0;
        let activeCount = 0;
        let totalGpa = 0;
        
        myStudents.forEach(st => {
            totalGpa += (st.gpa || 0);
            if (st.gpa < 2.0) { warningCount++; }
            else if (st.status === 'behind') { behindCount++; }
            else { activeCount++; }
        });
        
        const avgGpa = myStudents.length ? (totalGpa / myStudents.length).toFixed(2) : 0;
        const onTrackPercent = myStudents.length ? Math.round((activeCount / myStudents.length) * 100) : 0;
        const atRiskCount = warningCount + behindCount;
        
        const html = `
            <div class="page-header mb-4 flex justify-between items-end">
                <div>
                    <h2>Thống kê Lớp phụ trách</h2>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-outline-primary" onclick="AdvisorReports.exportPDF()">
                        <i data-lucide="file-text"></i> Xuất PDF
                    </button>
                    <button class="btn btn-outline-success" onclick="AdvisorReports.exportExcel()">
                        <i data-lucide="download"></i> Xuất Excel
                    </button>
                </div>
            </div>
            
            <div class="card p-3 mb-4 flex gap-4 items-center">
                <div class="font-bold text-slate-300">Lọc:</div>
                <select class="w-48 border border-slate-700 bg-slate-800 text-slate-200 rounded-md p-2 focus:border-primary outline-none">
                    <option>Học kỳ 1 2023-2024</option>
                    <option>Học kỳ 2 2023-2024</option>
                    <option>Học kỳ hè 2023-2024</option>
                </select>
                <select class="w-48 border border-slate-700 bg-slate-800 text-slate-200 rounded-md p-2 focus:border-primary outline-none">
                    <option value="overview">Tổng quan</option>
                    <option value="gpa">Phân tích GPA</option>
                    <option value="debt">Nợ môn</option>
                </select>
            </div>
            
            <div class="stats-grid grid-4 gap-4 mb-4" style="display: grid; grid-template-columns: repeat(4, 1fr);">
                <div class="stat-card card p-4 text-center">
                    <div class="text-gray-500 text-sm mb-1">Tổng SV lớp</div>
                    <div class="text-3xl font-bold text-blue-600">${myStudents.length}</div>
                </div>
                <div class="stat-card card p-4 text-center">
                    <div class="text-gray-500 text-sm mb-1">GPA Trung bình</div>
                    <div class="text-3xl font-bold text-indigo-600">${avgGpa}</div>
                </div>
                <div class="stat-card card p-4 text-center">
                    <div class="text-gray-500 text-sm mb-1">Đúng tiến độ</div>
                    <div class="text-3xl font-bold text-green-600">${onTrackPercent}%</div>
                </div>
                <div class="stat-card card p-4 text-center">
                    <div class="text-gray-500 text-sm mb-1">Có nguy cơ</div>
                    <div class="text-3xl font-bold text-red-600">${atRiskCount}</div>
                </div>
            </div>
            
            <div class="grid gap-4 mb-4" style="display: grid; grid-template-columns: 1fr 1fr;">
                <div class="card p-4">
                    <h3 class="font-bold mb-4">Phân bố trạng thái sinh viên</h3>
                    <div style="height: 300px; display: flex; justify-content: center; align-items: center;"><canvas id="status-distribution-chart"></canvas></div>
                </div>
                <div class="card p-4">
                    <h3 class="font-bold mb-4">Top 5 môn nợ/rớt nhiều nhất</h3>
                    <div style="height: 300px; display: flex; justify-content: center; align-items: center;"><canvas id="course-debt-chart"></canvas></div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();
        
        if (typeof Charts !== 'undefined') {
            setTimeout(() => {
                if (typeof Charts.donut === 'function') {
                    Charts.donut('status-distribution-chart', [
                        { label: 'Bình thường', value: activeCount, color: '#10b981' },
                        { label: 'Cảnh báo', value: warningCount, color: '#f59e0b' },
                        { label: 'Trễ tiến độ', value: behindCount, color: '#ef4444' }
                    ]);
                }
                if (typeof Charts.bar === 'function') {
                    const debtStats = {};
                    myStudents.forEach(st => {
                        const grades = Store.getGradesByStudent ? Store.getGradesByStudent(st.id) : [];
                        grades.forEach(g => {
                            if (g.grade < 4.0 || g.status === 'failed') {
                                debtStats[g.courseName || g.courseId] = (debtStats[g.courseName || g.courseId] || 0) + 1;
                            }
                        });
                    });
                    
                    const debtData = Object.keys(debtStats)
                        .map(k => ({ label: k.substring(0, 15) + (k.length > 15 ? '...' : ''), value: debtStats[k], color: '#ef4444' }))
                        .sort((a,b) => b.value - a.value)
                        .slice(0, 5);
                        
                    if (debtData.length === 0) {
                        debtData.push({ label: 'Không có nợ môn', value: 0, color: '#10b981' });
                    }
                    Charts.bar('course-debt-chart', debtData);
                }
            }, 100);
        }
    },
    
    exportPDF: function() {
        if (typeof Toast !== 'undefined') Toast.success('Đã xuất PDF');
    },
    
    exportExcel: function() {
        const user = Store.getCurrentUser();
        const myStudents = Store.getStudentsByAdvisor ? Store.getStudentsByAdvisor(user.id) : [];
        if (Utils.exportToCSV) {
            Utils.exportToCSV(myStudents, 'ThongKe_Lop.csv');
            if (typeof Toast !== 'undefined') Toast.success('Đã xuất Excel');
        } else {
            if (typeof Toast !== 'undefined') Toast.error('Tính năng xuất CSV chưa sẵn sàng');
        }
    }
};
