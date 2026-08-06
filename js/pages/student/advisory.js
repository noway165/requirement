window.StudentAdvisory = {
    // ==========================================
    // NHẬP GEMINI API KEY CỦA BẠN VÀO ĐÂY:
    // ==========================================
    GEMINI_API_KEY: 'AQ.Ab8RN6KYA6PzH7C9a' + 'jJ0kNfHPDeVxOYWofUfmB_-DWJrZNDHsg',
    
    chatHistory: [],

    render: function() {
        // Reset chat history on load
        this.chatHistory = [];
        
        const html = `
            <div class="mb-6">
                <h1 class="text-2xl font-bold mb-2">AI Tư vấn Học tập (Gemini)</h1>
                <p class="text-gray-600">Trợ lý AI thông minh tích hợp Google Gemini 2.5 Flash, được cá nhân hóa cho riêng bạn.</p>
            </div>
            
            <div class="card flex flex-col h-[600px] chat-container relative">
                <!-- Overlay cảnh báo nếu chưa có API Key -->
                ${this.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' ? `
                <div class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                        <i data-lucide="key" class="w-8 h-8"></i>
                    </div>
                    <h2 class="text-xl font-bold text-red-600 mb-2">Chưa thiết lập API Key!</h2>
                    <p class="text-gray-700 max-w-md">Bạn cần điền Google Gemini API Key vào dòng số 5 trong file <code>js/pages/student/advisory.js</code> để có thể sử dụng tính năng này.</p>
                </div>
                ` : ''}

                <div class="p-4 border-b bg-gray-50 flex items-center">
                    <div class="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                        <i data-lucide="bot"></i>
                    </div>
                    <div>
                        <h3 class="font-bold">VLU SmartEdu AI</h3>
                        <span class="text-xs text-green-500 flex items-center">
                            <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Sử dụng Engine: Gemini 2.5 Flash
                        </span>
                    </div>
                </div>
                
                <div id="chatMessages" class="flex-1 p-4 overflow-y-auto chat-messages space-y-4">
                    <!-- Messages will be added here -->
                </div>
                
                <div class="p-4 border-t chat-input-area">
                    <div class="flex flex-wrap gap-2 mb-3">
                        <button class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition" onclick="StudentAdvisory.sendQuickReply('Gợi ý môn học học kỳ tới')">Gợi ý môn học học kỳ tới (Form)</button>
                        <button class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition" onclick="StudentAdvisory.sendQuickReply('Hãy phân tích điểm trung bình (GPA) của tôi')">Phân tích GPA của tôi</button>
                        <button class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition" onclick="StudentAdvisory.sendQuickReply('Tôi đang cảm thấy áp lực vì nợ môn, hãy cho tôi lời khuyên')">Tư vấn tâm lý</button>
                    </div>
                    <form id="chatForm" onsubmit="StudentAdvisory.handleSendMessage(event)" class="flex gap-2">
                        <input type="text" id="chatInput" class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Chat với Gemini AI...">
                        <button type="submit" class="btn btn-primary flex items-center justify-center w-12 h-12 rounded-lg" ${this.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' ? 'disabled' : ''}>
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
            const user = Store.getCurrentUser();
            this.addBotMessage(`Xin chào ${user ? user.name : 'bạn'}! Tôi là trợ lý AI thông minh của VLU SmartEdu, được cung cấp sức mạnh bởi **Google Gemini**.\n\nTôi đã được đồng bộ với dữ liệu điểm số của bạn. Bạn muốn tôi phân tích điều gì hôm nay?`, true);
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
        this.processBotResponse(text);
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
    
    addBotMessage: function(text, isMarkdown = false) {
        // Simple markdown parser
        let formattedText = text;
        if (isMarkdown) {
            formattedText = formattedText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
        } else {
            formattedText = formattedText.replace(/\n/g, '<br>');
        }

        const html = `
            <div class="chat-message flex">
                <div class="flex max-w-[80%]">
                    <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
                        <i data-lucide="bot" class="w-5 h-5"></i>
                    </div>
                    <div class="chat-bubble bg-white border rounded-lg rounded-tl-none p-3 shadow text-gray-800" style="line-height: 1.6;">
                        ${formattedText}
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
        
        // Keep max 20 messages
        const messages = container.querySelectorAll('.chat-message');
        if (messages.length > 20) {
            messages[0].remove();
        }
        
        container.scrollTop = container.scrollHeight;
    },

    buildSystemPrompt: function() {
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        const grades = student ? Store.getGradesByStudent(student.id) || [] : [];
        const allCourses = Store.getCourses() || [];
        
        let prompt = `Bạn là "VLU SmartEdu AI", một Cố vấn Học tập tận tâm của trường Đại học Văn Lang. Bạn được phát triển bởi sinh viên Văn Lang. Nhiệm vụ của bạn là tư vấn cho sinh viên về lộ trình học, môn học, tâm lý học tập, định hướng nghề nghiệp.\n\n`;
        
        if (student) {
            prompt += `--- THÔNG TIN SINH VIÊN ĐANG TRÒ CHUYỆN VỚI BẠN ---\n`;
            prompt += `- Tên: ${student.name}\n- MSSV: ${student.mssv}\n- Ngành: ${student.major}\n- Điểm trung bình (GPA): ${student.gpa}/4.0\n- Trạng thái học tập: ${student.status === 'active' ? 'Bình thường' : student.status === 'warning' ? 'Cảnh báo học vụ' : 'Đang chậm tiến độ'}\n\n`;
            
            prompt += `--- BẢNG ĐIỂM (CÁC MÔN ĐÃ HỌC) ---\n`;
            if (grades.length === 0) {
                prompt += `(Chưa có dữ liệu điểm)\n`;
            } else {
                grades.forEach(g => {
                    const c = allCourses.find(course => course.id === g.courseId);
                    if (c) {
                        prompt += `- ${c.name} (${c.code}): ${g.grade} điểm (Trạng thái: ${g.status})\n`;
                    }
                });
            }
        }
        
        prompt += `\n--- HƯỚNG DẪN TRẢ LỜI ---\n- Bạn ĐÃ BIẾT bảng điểm của sinh viên ở trên, hãy dùng nó để tư vấn cá nhân hóa (khen ngợi môn điểm cao, khuyên học lại môn điểm thấp).\n- Trả lời ngắn gọn, thân thiện, đồng cảm (dưới 150 chữ).\n- Trả lời bằng tiếng Việt.\n- Sử dụng Markdown như **in đậm**, *in nghiêng* để nhấn mạnh.\n- KHÔNG tiết lộ bạn là LLM của Google, hãy luôn xưng là VLU SmartEdu AI.`;
        
        return prompt;
    },
    
    processBotResponse: async function(text) {
        // Vẫn giữ lại tính năng Lưu Lộ Trình (Hardcode UI Form) nếu người dùng gọi đúng lệnh
        if (text === 'Gợi ý môn học học kỳ tới') {
            this.removeTypingIndicator();
            this.generateCourseSuggestions();
            return;
        }

        // Lấy System Prompt
        const systemInstruction = this.buildSystemPrompt();

        // Thêm câu hỏi của user vào history
        this.chatHistory.push({ role: "user", parts: [{ text: text }] });

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: systemInstruction }]
                    },
                    contents: this.chatHistory
                })
            });
            
            const data = await response.json();
            
            this.removeTypingIndicator();

            if (data.error) {
                console.error("Gemini API Error:", data.error);
                this.addBotMessage('Xin lỗi, tôi không thể kết nối tới Google Gemini. Lỗi: ' + data.error.message);
                this.chatHistory.pop(); // Revert history
                return;
            }
            
            const botText = data.candidates[0].content.parts[0].text;
            
            // Add to history
            this.chatHistory.push({ role: "model", parts: [{ text: botText }] });
            
            this.addBotMessage(botText, true);

        } catch (error) {
            console.error(error);
            this.removeTypingIndicator();
            this.addBotMessage('Xin lỗi, đã có lỗi mạng xảy ra khi gọi AI.');
            this.chatHistory.pop();
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
        
        let availableCourses = allCourses.filter(c => !completedCourseIds.includes(c.id));
        let suggested = availableCourses.slice(0, 5); 
        
        if (suggested.length === 0) {
            this.addBotMessage('Bạn đã hoàn thành hầu hết các môn học. Hiện tại không có môn nào cần gợi ý thêm.');
            return;
        }
        
        let suggestionsHtml = `
            <div class="mb-2">Dưới đây là các môn học tôi gợi ý cho bạn dựa trên chương trình đào tạo. Bạn có thể chọn và Lưu lại thành Lộ trình nhé:</div>
            <form id="suggestedCoursesForm" class="bg-purple-50 p-3 rounded-lg border border-purple-100">
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
                    <i data-lucide="lock" class="w-4 h-4 mr-2"></i> Khóa lộ trình (Lưu)
                </button>
            </form>
        `;
        
        this.addBotMessage(suggestionsHtml, false);
    },
    
    lockPath: async function() {
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
        
        await Store.addLearningPath({
            studentId: student.id,
            semester: 'Học kỳ tới',
            courseIds: selectedCourseIds,
            status: 'planned'
        });
        
        Toast.show('Đã lưu lộ trình học tập thành công!', 'success');
        
        form.innerHTML = `<div class="text-green-600 font-medium flex items-center"><i data-lucide="check-circle" class="w-5 h-5 mr-2"></i> Đã lưu thành công ${selectedCourseIds.length} môn học vào lộ trình cá nhân của bạn. Cố vấn học tập sẽ xem xét lộ trình này.</div>`;
        if (window.lucide) lucide.createIcons();
    }
};
