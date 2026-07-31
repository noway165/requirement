const AdvisorDashboard = {
    render: function() {
        const user = Store.getCurrentUser() || { name: 'Giảng viên' };
        const myStudents = Store.getStudentsByAdvisor ? Store.getStudentsByAdvisor(user.id) : [];
        const pendingApprovals = Store.getPendingApprovals ? Store.getPendingApprovals(user.id) : [];
        
        let warningCount = 0;
        let behindCount = 0;
        let activeCount = 0;
        
        myStudents.forEach(st => {
            if (st.gpa < 2.0) { warningCount++; }
            else if (st.status === 'behind') { behindCount++; }
            else { activeCount++; }
        });
        
        // Fetch recent logs dynamically
        const allLogs = Store.getAdvisoryLogs ? Store.getAdvisoryLogs() : [];
        const advisorLogs = allLogs.filter(l => l.advisorId === user.id);
        const recentLogs = advisorLogs.map(log => {
            const stu = Store.getStudentById ? Store.getStudentById(log.studentId) : null;
            return {
                studentName: stu ? stu.name : log.studentId,
                date: new Date(log.createdAt || Date.now()),
                note: log.note || log.action
            };
        }).sort((a,b) => b.date - a.date);

        const html = `
            <div class="page-header mb-4">
                <h2>Xin chào, ${user.name}</h2>
                <p>Tổng quan tình hình sinh viên phụ trách</p>
            </div>
            
            <div class="stats-grid grid-4 gap-4 mb-4" style="display: grid; grid-template-columns: repeat(4, 1fr);">
                <div class="stat-card card p-4">
                    <div class="stat-icon mb-2 text-blue-500"><i data-lucide="users"></i></div>
                    <div class="stat-info">
                        <div class="stat-value text-2xl font-bold">${myStudents.length}</div>
                        <div class="stat-label text-gray-500 text-sm">Tổng sinh viên quản lý</div>
                    </div>
                </div>
                <div class="stat-card card p-4">
                    <div class="stat-icon mb-2 text-orange-500"><i data-lucide="alert-triangle"></i></div>
                    <div class="stat-info">
                        <div class="stat-value text-2xl font-bold">${warningCount}</div>
                        <div class="stat-label text-gray-500 text-sm">Cảnh báo (GPA < 2.0)</div>
                    </div>
                </div>
                <div class="stat-card card p-4">
                    <div class="stat-icon mb-2 text-red-500"><i data-lucide="clock"></i></div>
                    <div class="stat-info">
                        <div class="stat-value text-2xl font-bold">${behindCount}</div>
                        <div class="stat-label text-gray-500 text-sm">Trễ tiến độ</div>
                    </div>
                </div>
                <div class="stat-card card p-4">
                    <div class="stat-icon mb-2 text-green-500"><i data-lucide="check-square"></i></div>
                    <div class="stat-info">
                        <div class="stat-value text-2xl font-bold">${pendingApprovals.length}</div>
                        <div class="stat-label text-gray-500 text-sm">Chờ duyệt KHHT</div>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-grid gap-4" style="display: grid; grid-template-columns: 1fr 1fr;">
                <div class="card p-4">
                    <h3 class="mb-4 font-bold">Phân bố trạng thái sinh viên</h3>
                    <div style="height: 300px; display: flex; justify-content: center; align-items: center;"><canvas id="student-status-chart"></canvas></div>
                </div>
                <div class="card p-4">
                    <h3 class="mb-4 font-bold">Nhật ký tư vấn gần đây</h3>
                    <div class="log-list">
                        ${recentLogs.length ? recentLogs.slice(0, 5).map(log => `
                            <div class="log-item p-3 border-b last:border-0">
                                <div class="flex justify-between mb-1">
                                    <strong class="text-blue-600">${log.studentName}</strong>
                                    <span class="text-xs text-gray-500">${Utils.formatDate ? Utils.formatDate(log.date) : log.date.toLocaleDateString()}</span>
                                </div>
                                <p class="text-sm text-gray-700">${log.note}</p>
                            </div>
                        `).join('') : '<p class="text-gray-500">Chưa có nhật ký nào.</p>'}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();
        
        if (typeof Charts !== 'undefined' && typeof Charts.donut === 'function') {
            setTimeout(() => {
                Charts.donut('student-status-chart', [
                    { label: 'Bình thường', value: activeCount, color: '#10b981' },
                    { label: 'Cảnh báo', value: warningCount, color: '#f59e0b' },
                    { label: 'Trễ tiến độ', value: behindCount, color: '#ef4444' }
                ]);
            }, 100);
        }
    }
};
