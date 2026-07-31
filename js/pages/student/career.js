window.StudentCareer = {
    render: function() {
        let targets = Store.getCareerTargets && typeof Store.getCareerTargets === 'function' ? Store.getCareerTargets() : this.getMockTargets();
        
        // ── AI MATCHING ALGORITHM ──
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        const grades = student ? Store.getGradesByStudent(student.id) || [] : [];
        const allCourses = Store.getCourses() || [];
        
        // Calculate match score for each target
        const targetsWithScore = targets.map(t => {
            let score = 0;
            let matchingCourses = [];
            // Handle both JSON string or array
            let reqCourses = [];
            try {
                reqCourses = typeof t.recommendedCourses === 'string' ? JSON.parse(t.recommendedCourses) : (t.recommendedCourses || []);
            } catch(e) { reqCourses = []; }
            
            reqCourses.forEach(cid => {
                const grade = grades.find(g => g.courseId === cid && g.status === 'completed');
                if (grade && grade.grade !== null) {
                    const gradeVal = parseFloat(grade.grade);
                    // Base score for completing the course
                    score += 5;
                    // Bonus score for high grades
                    if (gradeVal >= 8.0) {
                        score += 15;
                        matchingCourses.push({id: cid, grade: gradeVal});
                    } else if (gradeVal >= 6.5) {
                        score += 5;
                        matchingCourses.push({id: cid, grade: gradeVal});
                    }
                }
            });
            
            return { ...t, matchScore: score, matchingCourses, reqCourses };
        });
        
        // Sort by score
        targetsWithScore.sort((a, b) => b.matchScore - a.matchScore);
        
        const topTarget = targetsWithScore[0];
        const hasGoodMatch = topTarget && topTarget.matchScore > 0;
        
        // ── RENDER UI ──
        let suggestionHtml = '';
        if (hasGoodMatch) {
            // Get course names for the explanation
            const strongCourseNames = topTarget.matchingCourses.slice(0, 2).map(mc => {
                const c = allCourses.find(course => course.id === mc.id);
                return c ? `<strong>${c.name} (${mc.grade}đ)</strong>` : '';
            }).filter(Boolean).join(' và ');

            suggestionHtml = `
                <div class="ai-suggestion-banner" style="background: linear-gradient(135deg, var(--primary-100), #e0e7ff); padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-6); border: 1px solid var(--primary-200); position: relative; overflow: hidden;">
                    <div style="position: absolute; right: -20px; top: -20px; opacity: 0.1; transform: scale(3);">
                        <i data-lucide="sparkles"></i>
                    </div>
                    <div style="display: flex; gap: var(--space-4); align-items: flex-start; position: relative; z-index: 1;">
                        <div style="background: white; padding: var(--space-3); border-radius: 50%; color: var(--primary); box-shadow: var(--shadow-sm);">
                            <i data-lucide="bot" style="width: 32px; height: 32px;"></i>
                        </div>
                        <div>
                            <h2 style="color: var(--primary-800); margin: 0 0 var(--space-2) 0; font-size: 1.25rem;">AI Gợi ý: ${topTarget.title}</h2>
                            <p style="color: var(--text-secondary); margin: 0 0 var(--space-3) 0; line-height: 1.5;">
                                Dựa trên kết quả học tập của bạn, đặc biệt là điểm số xuất sắc ở môn ${strongCourseNames || 'các môn cốt lõi'}, 
                                hệ thống nhận thấy bạn rất có tiềm năng theo đuổi con đường <strong>${topTarget.title}</strong>.
                            </p>
                            <button class="btn btn-primary" onclick="StudentCareer.showDetail('${topTarget.id}')">
                                Xem chi tiết lộ trình này
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            suggestionHtml = `
                <div class="ai-suggestion-banner" style="background: var(--bg-secondary); padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-6); border: 1px dashed var(--border-color);">
                    <div style="display: flex; gap: var(--space-4); align-items: center;">
                        <div style="color: var(--text-tertiary);">
                            <i data-lucide="lightbulb" style="width: 32px; height: 32px;"></i>
                        </div>
                        <div>
                            <h3 style="margin: 0 0 var(--space-1) 0;">Chưa có đủ dữ liệu để AI gợi ý</h3>
                            <p style="color: var(--text-secondary); margin: 0; font-size: 0.9rem;">Hãy cập nhật thêm điểm số các môn học chuyên ngành để AI phân tích thế mạnh của bạn nhé!</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        let cardsHtml = '';
        targetsWithScore.forEach(t => {
            let skills = [];
            try { skills = typeof t.requiredSkills === 'string' ? JSON.parse(t.requiredSkills) : (t.requiredSkills || []); } catch(e) {}
            
            const isTopMatch = hasGoodMatch && t.id === topTarget.id;
            const borderStyle = isTopMatch ? 'border: 2px solid var(--primary); box-shadow: 0 0 15px rgba(200, 16, 46, 0.2);' : '';
            const badgeHtml = isTopMatch ? `<div style="position:absolute; top:-10px; right:20px; background:var(--primary); color:white; padding: 2px 10px; border-radius: 10px; font-size: 12px; font-weight: bold;"><i data-lucide="star" style="width:12px;height:12px;display:inline-block;margin-right:4px;"></i>Phù hợp nhất</div>` : '';

            cardsHtml += `
                <div class="card career-card" style="padding: var(--space-5); cursor: pointer; transition: all 0.2s; position: relative; ${borderStyle}" 
                     onclick="StudentCareer.showDetail('${t.id}')"
                     onmouseover="this.style.transform='translateY(-4px)'"
                     onmouseout="this.style.transform='translateY(0)'">
                    ${badgeHtml}
                    <div style="width: 48px; height: 48px; background: var(--primary-100); color: var(--primary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-4);">
                        <i data-lucide="${t.icon || 'briefcase'}"></i>
                    </div>
                    <h3 style="font-weight: bold; font-size: 1.1rem; margin-bottom: var(--space-2);">${t.title}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: var(--space-4); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${t.description}
                    </p>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                        ${skills.slice(0, 3).map(s => `<span style="background: var(--bg-secondary); font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; color: var(--text-secondary);">${s}</span>`).join('')}
                        ${skills.length > 3 ? `<span style="background: var(--bg-secondary); font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; color: var(--text-secondary);">+${skills.length - 3}</span>` : ''}
                    </div>
                </div>
            `;
        });

        const html = `
            <div style="margin-bottom: var(--space-6);">
                <h1 class="page-title">Định hướng Nghề nghiệp AI</h1>
                <p class="page-description">Trợ lý AI sẽ phân tích điểm số các môn học của bạn để đưa ra những lộ trình nghề nghiệp phù hợp nhất.</p>
            </div>
            
            ${suggestionHtml}
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8);">
                ${cardsHtml}
            </div>
            
            <div id="careerDetailPanel" style="display: none;"></div>
        `;
        
        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();
    },
    
    getMockTargets: function() {
        return [
            { id: '1', title: 'Kỹ sư Phần mềm', description: 'Phát triển ứng dụng, hệ thống phần mềm.', icon: 'monitor', requiredSkills: '["Lập trình", "Thuật toán", "CSDL"]', recommendedCourses: '["C001", "C002", "C003"]' },
            { id: '2', title: 'Chuyên viên Dữ liệu', description: 'Phân tích dữ liệu, Machine Learning.', icon: 'bar-chart-3', requiredSkills: '["Python", "Thống kê", "Machine Learning"]', recommendedCourses: '["C009", "C010"]' },
            { id: '3', title: 'Chuyên gia Bảo mật', description: 'An toàn thông tin mạng và ứng dụng.', icon: 'shield', requiredSkills: '["Mạng máy tính", "Mật mã học", "Bảo mật web"]', recommendedCourses: '["C007", "C011"]' }
        ];
    },
    
    showDetail: function(targetId) {
        let targets = Store.getCareerTargets && typeof Store.getCareerTargets === 'function' ? Store.getCareerTargets() : this.getMockTargets();
        const target = targets.find(t => t.id === targetId);
        if (!target) return;
        
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        
        const grades = student ? Store.getGradesByStudent(student.id) || [] : [];
        const completedCourseIds = grades.filter(g => g.status === 'completed' && parseFloat(g.grade) >= 5.0).map(g => g.courseId);
        
        let reqCourses = [];
        try { reqCourses = typeof target.recommendedCourses === 'string' ? JSON.parse(target.recommendedCourses) : (target.recommendedCourses || []); } catch(e) {}
        
        const allCourses = Store.getCourses() || [];
        
        let completedCount = 0;
        let coursesHtml = '';
        
        reqCourses.forEach(cid => {
            const isCompleted = completedCourseIds.includes(cid);
            if (isCompleted) completedCount++;
            
            const course = allCourses.find(c => c.id === cid) || { code: cid, name: 'Môn học ' + cid };
            const gradeObj = grades.find(g => g.courseId === cid);
            const gradeText = gradeObj && gradeObj.grade ? `(${gradeObj.grade}đ)` : '';
            
            coursesHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); border-bottom: 1px solid var(--border-color);">
                    <div>
                        <div style="font-weight: 500;">${course.code} - ${course.name}</div>
                    </div>
                    <div>
                        ${isCompleted 
                            ? `<span class="badge" style="background: var(--success-100); color: var(--success);"><i data-lucide="check" style="width:14px;height:14px;margin-right:4px;"></i>Đã học ${gradeText}</span>`
                            : `<span class="badge" style="background: var(--bg-secondary); color: var(--text-secondary);">Chưa học</span>`}
                    </div>
                </div>
            `;
        });
        
        const progressPercent = reqCourses.length > 0 ? Math.round((completedCount / reqCourses.length) * 100) : 0;
        
        let skills = [];
        try { skills = typeof target.requiredSkills === 'string' ? JSON.parse(target.requiredSkills) : (target.requiredSkills || []); } catch(e) {}
        
        const skillsHtml = skills.map(s => 
            `<span style="background: var(--primary-100); color: var(--primary-800); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; border: 1px solid var(--primary-200);">${s}</span>`
        ).join(' ');

        const html = `
            <div class="card" style="padding: var(--space-6); border-top: 4px solid var(--primary); animation: fadeIn 0.3s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-6);">
                    <div style="display: flex; align-items: center; gap: var(--space-4);">
                        <div style="width: 64px; height: 64px; background: var(--primary-100); color: var(--primary); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="${target.icon || 'briefcase'}" style="width: 32px; height: 32px;"></i>
                        </div>
                        <div>
                            <h2 style="font-size: 1.5rem; font-weight: bold; margin: 0 0 var(--space-1) 0;">${target.title}</h2>
                            <p style="color: var(--text-secondary); margin: 0;">${target.description}</p>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="StudentCareer.saveTarget('${target.id}')">
                        <i data-lucide="bookmark" style="width:16px;height:16px;margin-right:8px;"></i> Lưu mục tiêu
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8);">
                    <div>
                        <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: var(--space-3); border-bottom: 2px solid var(--bg-secondary); padding-bottom: var(--space-2);">Kỹ năng yêu cầu</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: var(--space-6);">
                            ${skillsHtml}
                        </div>
                        
                        <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: var(--space-3); border-bottom: 2px solid var(--bg-secondary); padding-bottom: var(--space-2);">Chứng chỉ & Dự án gợi ý</h3>
                        <ul style="padding-left: var(--space-4); color: var(--text-secondary); line-height: 1.8;">
                            <li>Chứng chỉ chuyên ngành tương ứng (AWS, Azure, CCNA...)</li>
                            <li>Dự án thực tế: Cố gắng hoàn thành ít nhất 2 project lớn trong các môn cốt lõi.</li>
                            <li>Tham gia các hoạt động ngoại khóa liên quan đến ngành nghề.</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: var(--space-3); border-bottom: 2px solid var(--bg-secondary); padding-bottom: var(--space-2);">Độ phù hợp (Dựa trên môn học)</h3>
                        <div style="margin-bottom: var(--space-4);">
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 4px;">
                                <span>Tiến độ hoàn thành môn học cốt lõi</span>
                                <span style="font-weight: bold; color: var(--primary);">${progressPercent}%</span>
                            </div>
                            <div style="width: 100%; background: var(--bg-secondary); border-radius: 10px; height: 10px; overflow: hidden;">
                                <div style="background: var(--primary); height: 100%; width: ${progressPercent}%; transition: width 1s ease-out;"></div>
                            </div>
                        </div>
                        
                        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                            <div style="background: var(--bg-secondary); padding: 10px 16px; font-weight: 600; border-bottom: 1px solid var(--border-color);">Môn học đề xuất</div>
                            <div>
                                ${coursesHtml || '<div style="padding:16px;text-align:center;color:var(--text-secondary);">Chưa có môn học đề xuất</div>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const panel = document.getElementById('careerDetailPanel');
        panel.innerHTML = html;
        panel.style.display = 'block';
        if (window.lucide) lucide.createIcons();
        
        // Scroll to panel
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    
    saveTarget: function(targetId) {
        Toast.success('Thành công', 'Đã lưu mục tiêu nghề nghiệp vào hồ sơ của bạn!');
    }
};
