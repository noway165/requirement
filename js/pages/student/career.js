window.StudentCareer = {
    render: function() {
        const targets = Store.getCareerTargets && typeof Store.getCareerTargets === 'function' ? Store.getCareerTargets() : this.getMockTargets();
        
        let cardsHtml = '';
        targets.forEach(t => {
            cardsHtml += `
                <div class="career-card card p-5 border-2 border-transparent hover:border-purple-500 cursor-pointer transition-all" 
                     onclick="StudentCareer.showDetail('${t.id}')">
                    <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <i data-lucide="${t.icon || 'briefcase'}"></i>
                    </div>
                    <h3 class="font-bold text-lg mb-2">${t.title}</h3>
                    <p class="text-gray-600 text-sm line-clamp-2">${t.description}</p>
                </div>
            `;
        });

        const html = `
            <div class="mb-6">
                <h1 class="text-2xl font-bold mb-2">Định hướng nghề nghiệp</h1>
                <p class="text-gray-600">Khám phá các hướng đi nghề nghiệp và xem bạn cần trang bị những kỹ năng, môn học nào.</p>
            </div>
            
            <div class="career-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                ${cardsHtml}
            </div>
            
            <div id="careerDetailPanel" class="hidden">
                <!-- Detail content will be rendered here -->
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();
    },
    
    getMockTargets: function() {
        return [
            { id: '1', title: 'Kỹ sư Phần mềm', description: 'Phát triển ứng dụng, hệ thống phần mềm.', icon: 'monitor', skills: ['Lập trình', 'Thuật toán', 'CSDL'], recommendedCourses: ['C01', 'C02', 'C03'] },
            { id: '2', title: 'Chuyên viên Dữ liệu', description: 'Phân tích dữ liệu, Machine Learning.', icon: 'bar-chart-3', skills: ['Python', 'Thống kê', 'Machine Learning'], recommendedCourses: ['C04', 'C05'] },
            { id: '3', title: 'Chuyên gia Bảo mật', description: 'An toàn thông tin mạng và ứng dụng.', icon: 'shield', skills: ['Mạng máy tính', 'Mật mã học', 'Bảo mật web'], recommendedCourses: ['C06', 'C07'] },
            { id: '4', title: 'Quản trị Hệ thống', description: 'Quản lý server, Cloud, DevOps.', icon: 'server', skills: ['Linux', 'Docker', 'AWS'], recommendedCourses: ['C08', 'C09'] },
            { id: '5', title: 'Kiến trúc sư Giải pháp', description: 'Thiết kế kiến trúc hệ thống quy mô lớn.', icon: 'layers', skills: ['System Design', 'Cloud', 'Microservices'], recommendedCourses: ['C10', 'C11'] }
        ];
    },
    
    showDetail: function(targetId) {
        const targets = Store.getCareerTargets && typeof Store.getCareerTargets === 'function' ? Store.getCareerTargets() : this.getMockTargets();
        const target = targets.find(t => t.id === targetId);
        
        if (!target) return;
        
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        
        const grades = student ? Store.getGradesByStudent(student.id) || [] : [];
        const completedCourseIds = grades.filter(g => g.grade >= 5).map(g => g.courseId);
        
        // Mock courses if not provided in target
        const requiredCourseIds = target.recommendedCourses || ['C01', 'C02'];
        const allCourses = Store.getCourses() || [];
        
        let completedCount = 0;
        let coursesHtml = '';
        
        requiredCourseIds.forEach(cid => {
            const isCompleted = completedCourseIds.includes(cid);
            if (isCompleted) completedCount++;
            
            // Try to find course name
            const course = allCourses.find(c => c.id === cid) || { code: cid, name: 'Môn học ' + cid };
            
            coursesHtml += `
                <div class="flex items-center justify-between p-3 border-b last:border-0">
                    <div>
                        <div class="font-medium">${course.code} - ${course.name}</div>
                    </div>
                    <div>
                        ${isCompleted 
                            ? '<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><i data-lucide="check" class="w-3 h-3 inline"></i> Đã học</span>'
                            : '<span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Chưa học</span>'}
                    </div>
                </div>
            `;
        });
        
        const progressPercent = requiredCourseIds.length > 0 ? Math.round((completedCount / requiredCourseIds.length) * 100) : 0;
        
        const skillsHtml = (target.skills || ['Kỹ năng 1', 'Kỹ năng 2']).map(s => 
            `<span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm border border-blue-200">${s}</span>`
        ).join(' ');

        const html = `
            <div class="card p-6 border-t-4 border-purple-500 animate-fade-in">
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center">
                        <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mr-4">
                            <i data-lucide="${target.icon || 'briefcase'}" class="w-8 h-8"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold">${target.title}</h2>
                            <p class="text-gray-600">${target.description}</p>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="StudentCareer.saveTarget('${target.id}')">
                        <i data-lucide="bookmark" class="w-4 h-4 mr-2"></i> Lưu mục tiêu
                    </button>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-lg font-semibold mb-3 border-b pb-2">Kỹ năng yêu cầu</h3>
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${skillsHtml}
                        </div>
                        
                        <h3 class="text-lg font-semibold mb-3 border-b pb-2">Chứng chỉ & Dự án gợi ý</h3>
                        <ul class="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Chứng chỉ AWS Cloud Practitioner / Azure Fundamentals</li>
                            <li>Dự án: Xây dựng ứng dụng web quản lý với CRUD đầy đủ</li>
                            <li>Tham gia các cuộc thi Hackathon sinh viên</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-semibold mb-3 border-b pb-2">Độ phù hợp (Dựa trên môn học)</h3>
                        <div class="mb-4">
                            <div class="flex justify-between text-sm mb-1">
                                <span>Tiến độ hoàn thành môn học cốt lõi</span>
                                <span class="font-bold">${progressPercent}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="bg-purple-600 h-2.5 rounded-full" style="width: ${progressPercent}%"></div>
                            </div>
                        </div>
                        
                        <div class="border rounded-lg overflow-hidden">
                            <div class="bg-gray-50 px-4 py-2 font-semibold border-b">Môn học đề xuất</div>
                            <div class="divide-y">
                                ${coursesHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const panel = document.getElementById('careerDetailPanel');
        panel.innerHTML = html;
        panel.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
        
        // Scroll to panel
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    
    saveTarget: function(targetId) {
        // In real app, save to Store
        Toast.show('Đã lưu mục tiêu nghề nghiệp thành công!', 'success');
    }
};
