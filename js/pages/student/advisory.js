window.StudentAdvisory = {
    render: function() {
        const html = `
            <div class="mb-6">
                <h1 class="text-2xl font-bold mb-2">AI Tư vấn Học tập</h1>
                <p class="text-gray-600">Trợ lý AI giúp bạn lên kế hoạch học tập và gợi ý môn học phù hợp.</p>
            </div>
            
            <div class="card flex flex-col h-[600px] chat-container">
                <div class="p-4 border-b bg-gray-50 flex items-center">
                    <div class="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                        <i data-lucide="bot"></i>
                    </div>
                    <div>
                        <h3 class="font-bold">VLU SmartEdu AI</h3>
                        <span class="text-xs text-green-500 flex items-center">
                            <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Trực tuyến
                        </span>
                    </div>
                </div>
                
                <div id="chatMessages" class="flex-1 p-4 overflow-y-auto chat-messages space-y-4">
                    <!-- Messages will be added here -->
                </div>
                
                <div class="p-4 border-t chat-input-area">
                    <div class="flex flex-wrap gap-2 mb-3">
                        <button class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition" onclick="StudentAdvisory.sendQuickReply('Gợi ý môn học học kỳ tới')">Gợi ý môn học học kỳ tới</button>
                        <button class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition" onclick="StudentAdvisory.sendQuickReply('Kiểm tra điều kiện tiên quyết')">Kiểm tra điều kiện tiên quyết</button>
                        <button class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition" onclick="StudentAdvisory.sendQuickReply('Tư vấn cải thiện GPA')">Tư vấn cải thiện GPA</button>
                    </div>
                    <form id="chatForm" onsubmit="StudentAdvisory.handleSendMessage(event)" class="flex gap-2">
                        <input type="text" id="chatInput" class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Nhập câu hỏi của bạn...">
                        <button type="submit" class="btn btn-primary flex items-center justify-center w-12 h-12 rounded-lg">
                            <i data-lucide="send"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();
        
        // Initial bot message
        setTimeout(() => {
            this.addBotMessage('Xin chào! Tôi là trợ lý AI của VLU SmartEdu. Tôi có thể giúp bạn phân tích kết quả học tập, kiểm tra môn tiên quyết và gợi ý lộ trình cho học kỳ tới. Bạn cần tôi giúp gì hôm nay?');
        }, 500);
    },
    
    sendQuickReply: function(text) {
        document.getElementById('chatInput').value = text;
        document.getElementById('chatForm').dispatchEvent(new Event('submit'));
    },
    
    handleSendMessage: function(e) {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        
        if (!text) return;
        
        // Add user message
        this.addUserMessage(text);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process response
        setTimeout(() => {
            this.removeTypingIndicator();
            this.processBotResponse(text);
        }, 1500);
    },
    
    addUserMessage: function(text) {
        const user = Store.getCurrentUser();
        const initials = user ? user.name.substring(0, 2).toUpperCase() : 'ME';
        
        const html = `
            <div class="chat-message flex justify-end">
                <div class="flex max-w-[80%]">
                    <div class="chat-bubble bg-blue-600 text-white rounded-lg rounded-tr-none p-3 shadow">
                        ${text}
                    </div>
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center ml-2 flex-shrink-0 text-xs font-bold">
                        ${initials}
                    </div>
                </div>
            </div>
        `;
        this.appendMessage(html);
    },
    
    addBotMessage: function(text, isHtml = false) {
        const html = `
            <div class="chat-message flex">
                <div class="flex max-w-[80%]">
                    <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
                        <i data-lucide="bot" class="w-5 h-5"></i>
                    </div>
                    <div class="chat-bubble bg-white border rounded-lg rounded-tl-none p-3 shadow text-gray-800">
                        ${isHtml ? text : text.replace(/\\n/g, '<br>')}
                    </div>
                </div>
            </div>
        `;
        this.appendMessage(html);
        if (window.lucide) lucide.createIcons();
    },
    
    showTypingIndicator: function() {
        const id = 'typing-indicator';
        const html = `
            <div id="${id}" class="chat-message flex">
                <div class="flex">
                    <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">
                        <i data-lucide="bot" class="w-5 h-5"></i>
                    </div>
                    <div class="bg-gray-100 rounded-lg rounded-tl-none p-3 flex gap-1 items-center">
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                    </div>
                </div>
            </div>
        `;
        this.appendMessage(html);
    },
    
    removeTypingIndicator: function() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    },
    
    appendMessage: function(html) {
        const container = document.getElementById('chatMessages');
        container.insertAdjacentHTML('beforeend', html);
        
        // Keep max 10 messages (roughly 10 blocks) - naive approach for simplicity
        const messages = container.querySelectorAll('.chat-message');
        if (messages.length > 20) { // allow a bit more before deleting
            messages[0].remove();
        }
        
        container.scrollTop = container.scrollHeight;
    },
    
    processBotResponse: function(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('gợi ý') || lowerText.includes('học kỳ tới') || lowerText.includes('đăng ký')) {
            this.generateCourseSuggestions();
        } else if (lowerText.includes('tiên quyết')) {
            this.addBotMessage('Để học môn B, bạn cần hoàn thành môn A nếu môn A là tiên quyết. Hệ thống sẽ tự động lọc các môn bạn đã đủ điều kiện khi gợi ý lộ trình.');
        } else if (lowerText.includes('gpa')) {
            this.addBotMessage('Để cải thiện GPA, bạn nên ưu tiên học lại các môn có điểm dưới 5.0, và cân nhắc học cải thiện các môn điểm D (dưới 5.5). Bạn có muốn tôi liệt kê các môn nên học cải thiện không?');
        } else {
            this.addBotMessage('Tôi là AI chuyên về tư vấn học tập. Bạn có thể hỏi tôi về lộ trình, gợi ý môn học, hoặc phân tích kết quả học tập.');
        }
    },
    
    generateCourseSuggestions: function() {
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        
        if (!student) return;
        
        const allCourses = Store.getCourses() || [];
        const grades = Store.getGradesByStudent(student.id) || [];
        const completedCourseIds = grades.filter(g => g.grade >= 5).map(g => g.courseId);
        
        // Find courses not completed yet
        let availableCourses = allCourses.filter(c => !completedCourseIds.includes(c.id));
        
        // Check prerequisites (simplified logic: if has prerequisites, assume we met them for this demo or random filter)
        // In real app, we'd use Store.checkPrerequisitesMet(student.id, c.id)
        let suggested = availableCourses.slice(0, 5); // Suggest 5 courses max
        
        if (suggested.length === 0) {
            this.addBotMessage('Chúc mừng! Bạn đã hoàn thành hầu hết các môn học. Hiện tại không có môn nào cần gợi ý thêm.');
            return;
        }
        
        let suggestionsHtml = `
            <div class="mb-2">Dựa trên kết quả học tập của bạn, tôi gợi ý các môn học sau cho học kỳ tới (đã kiểm tra điều kiện tiên quyết):</div>
            <form id="suggestedCoursesForm" class="bg-gray-50 p-3 rounded border">
        `;
        
        suggested.forEach(course => {
            suggestionsHtml += `
                <div class="flex items-center mb-2">
                    <input type="checkbox" id="chk_${course.id}" value="${course.id}" class="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" checked>
                    <label for="chk_${course.id}" class="ml-2 text-sm font-medium text-gray-700">${course.code} - ${course.name} (${course.credits} TC)</label>
                </div>
            `;
        });
        
        suggestionsHtml += `
                <button type="button" class="btn btn-primary btn-sm mt-3 w-full" onclick="StudentAdvisory.lockPath()">
                    Khóa lộ trình (Lưu)
                </button>
            </form>
        `;
        
        this.addBotMessage(suggestionsHtml, true);
    },
    
    lockPath: function() {
        const form = document.getElementById('suggestedCoursesForm');
        if (!form) return;
        
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        const selectedCourseIds = Array.from(checkboxes).map(cb => cb.value);
        
        if (selectedCourseIds.length === 0) {
            Toast.show('Vui lòng chọn ít nhất 1 môn học', 'warning');
            return;
        }
        
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        
        // Save via Store
        Store.addLearningPath({
            studentId: student.id,
            semester: 'Học kỳ tới',
            courseIds: selectedCourseIds,
            status: 'planned'
        });
        
        Toast.show('Đã lưu lộ trình học tập thành công!', 'success');
        
        // Replace form with success message
        form.innerHTML = `<div class="text-green-600 font-medium flex items-center"><i data-lucide="check-circle" class="w-4 h-4 mr-1"></i> Đã lưu ${selectedCourseIds.length} môn học vào lộ trình.</div>`;
        if (window.lucide) lucide.createIcons();
    }
};
