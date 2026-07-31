const AdvisorApproval = {
    render: function() {
        const user = Store.getCurrentUser() || { id: 1 };
        const pendingApprovals = Store.getPendingApprovals ? Store.getPendingApprovals(user.id) : [];
        
        let html = `
            <div class="page-header mb-4">
                <h2>Duyệt Kế Hoạch Học Tập</h2>
            </div>
        `;
        
        if (!pendingApprovals || pendingApprovals.length === 0) {
            html += `
                <div class="card p-8 text-center text-gray-500">
                    <i data-lucide="check-circle" class="w-12 h-12 mx-auto mb-2 text-green-500"></i>
                    <p>Không có kế hoạch học tập nào cần duyệt.</p>
                </div>
            `;
            document.getElementById('page-content').innerHTML = html;
            if (window.lucide) lucide.createIcons();
            return;
        }
        
        html += `<div class="grid gap-4" style="display: grid; grid-template-columns: 1fr;">`;
        
        pendingApprovals.forEach(plan => {
            const student = Store.getStudentById ? Store.getStudentById(plan.studentId) : { name: 'Unknown', mssv: 'N/A' };
            const courses = plan.selectedCourses || plan.suggestedCourses || [];
            let totalCredits = 0;
            let hasUnmetPrereq = false;
            
            const coursesHtml = courses.map(courseId => {
                const course = Store.getCourseById ? Store.getCourseById(courseId) : null;
                if (!course) return '';
                totalCredits += course.credits || 3;
                
                // Assuming plan has prereq status or we check it
                const prereqMet = Store.checkPrerequisitesMet ? Store.checkPrerequisitesMet(student.id, courseId) : [];
                const allMet = prereqMet.every(p => p.met);
                if (!allMet) hasUnmetPrereq = true;
                
                return `
                    <div class="flex justify-between items-center py-2 border-b last:border-0 text-sm">
                        <div>
                            <strong>${course.code}</strong> - ${course.name} (${course.credits || 3} TC)
                        </div>
                        <div>
                            ${allMet 
                                ? '<span class="badge bg-green-100 text-green-700">Đủ điều kiện</span>' 
                                : '<span class="badge bg-red-100 text-red-700">Thiếu tiên quyết</span>'}
                        </div>
                    </div>
                `;
            }).join('');
            
            html += `
                <div class="approval-card card p-4 mb-4">
                    <div class="flex justify-between items-center mb-3 border-b pb-2">
                        <div>
                            <h3 class="font-bold text-lg">${student.name} - ${student.mssv}</h3>
                            <p class="text-sm text-gray-500">Ngày nộp: ${Utils.formatDate ? Utils.formatDate(plan.submittedAt || new Date()) : ''}</p>
                        </div>
                        <div>
                            ${Utils.getApprovalStatusBadge ? Utils.getApprovalStatusBadge('pending') : '<span class="badge bg-yellow-100 text-yellow-700">Chờ duyệt</span>'}
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <h4 class="font-bold text-sm mb-2">Danh sách môn học dự kiến:</h4>
                        <div class="bg-gray-50 rounded p-2">
                            ${coursesHtml}
                        </div>
                        <div class="mt-2 text-right text-sm">
                            <strong>Tổng tín chỉ: ${totalCredits}</strong>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-4 pt-3 border-t">
                        <button class="btn btn-danger" onclick="AdvisorApproval.reject('${plan.id}')">
                            <i data-lucide="x"></i> Từ chối
                        </button>
                        <button class="btn btn-success" ${hasUnmetPrereq ? 'disabled title="Không thể duyệt do có môn thiếu ĐK tiên quyết"' : ''} onclick="AdvisorApproval.approve('${plan.id}')">
                            <i data-lucide="check"></i> Duyệt
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();
    },
    
    approve: function(planId) {
        if (typeof Modal !== 'undefined') {
            Modal.confirm({
                title: 'Xác nhận duyệt',
                message: 'Bạn có chắc chắn muốn duyệt kế hoạch học tập này?',
                onConfirm: async () => {
                    if (Store.updateLearningPath) await Store.updateLearningPath(planId, { approvalStatus: 'approved' });
                    if (Store.addAdvisoryLog) await Store.addAdvisoryLog({ planId, action: 'approved', date: new Date() });
                    if (typeof Toast !== 'undefined') Toast.success('Đã duyệt kế hoạch học tập');
                    this.render();
                }
            });
        }
    },
    
    reject: function(planId) {
        if (typeof Modal !== 'undefined') {
            Modal.form({
                title: 'Từ chối kế hoạch học tập',
                fields: [
                    { name: 'reason', label: 'Lý do từ chối (bắt buộc)', type: 'textarea', required: true }
                ],
                onSubmit: async (data) => {
                    if (!data.reason.trim()) {
                        if (typeof Toast !== 'undefined') Toast.error('Vui lòng nhập lý do từ chối');
                        return false; // Prevent close
                    }
                    if (Store.updateLearningPath) await Store.updateLearningPath(planId, { approvalStatus: 'rejected', advisorNote: data.reason });
                    if (Store.addAdvisoryLog) await Store.addAdvisoryLog({ planId, action: 'rejected', note: data.reason, date: new Date() });
                    if (typeof Toast !== 'undefined') Toast.success('Đã từ chối kế hoạch học tập');
                    this.render();
                    return true;
                }
            });
        }
    }
};
