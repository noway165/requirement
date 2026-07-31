const AdvisorAlerts = {
    render: function() {
        const user = Store.getCurrentUser() || { id: 1 };
        const myStudents = Store.getStudentsByAdvisor ? Store.getStudentsByAdvisor(user.id) : [];
        const history = Store.getNotifications ? Store.getNotifications().filter(n => n.senderId === user.id) : [];
        
        const html = `
            <div class="page-header mb-4">
                <h2>Gửi Cảnh Báo Học Tập</h2>
            </div>
            
            <div class="grid gap-4" style="display: grid; grid-template-columns: 3fr 2fr;">
                <div class="alert-compose card p-4">
                    <h3 class="font-bold mb-3 border-b pb-2">Soạn tin nhắn</h3>
                    
                    <div class="mb-3">
                        <label class="block text-sm font-bold mb-1">Chọn sinh viên nhận:</label>
                        <div class="flex gap-2 mb-2">
                            <button class="btn btn-sm btn-outline-secondary" onclick="AdvisorAlerts.filterStudents('all')">Tất cả</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="AdvisorAlerts.filterStudents('warning')">Cảnh báo GPA</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="AdvisorAlerts.filterStudents('behind')">Trễ tiến độ</button>
                        </div>
                        <div class="border rounded p-2 max-h-40 overflow-y-auto bg-gray-50">
                            ${myStudents.map(st => {
                                let badge = '';
                                if (st.gpa < 2.0) badge = 'text-yellow-600 font-bold';
                                else if (st.status === 'behind') badge = 'text-red-600 font-bold';
                                return `
                                    <label class="flex items-center gap-2 py-1">
                                        <input type="checkbox" name="student_select" value="${st.id}" data-status="${st.gpa < 2.0 ? 'warning' : (st.status === 'behind' ? 'behind' : 'active')}">
                                        <span class="${badge}">${st.mssv} - ${st.name}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="block text-sm font-bold mb-1">Mẫu tin nhắn:</label>
                        <select id="alert-template" class="form-select" onchange="AdvisorAlerts.applyTemplate()">
                            <option value="">-- Chọn mẫu --</option>
                            <option value="Nhắc đăng ký HP|Các em nhớ đăng ký học phần đúng hạn nhé.">Nhắc đăng ký HP</option>
                            <option value="Cảnh báo GPA|Cảnh báo: Điểm trung bình của em đang ở mức nguy hiểm. Đề nghị đến văn phòng gặp cố vấn.">Cảnh báo GPA</option>
                            <option value="Hẹn tư vấn|Thầy/Cô hẹn em lên văn phòng khoa để tư vấn kế hoạch học tập.">Hẹn tư vấn</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label class="block text-sm font-bold mb-1">Tiêu đề:</label>
                        <input type="text" id="alert-title" class="form-control" placeholder="Nhập tiêu đề...">
                    </div>
                    
                    <div class="mb-3">
                        <label class="block text-sm font-bold mb-1">Nội dung:</label>
                        <textarea id="alert-content" class="form-control" rows="5" placeholder="Nhập nội dung tin nhắn..." oninput="AdvisorAlerts.updateCharCount()"></textarea>
                        <div id="char-counter" class="text-right text-sm text-gray-500 mt-1">0/500</div>
                    </div>
                    
                    <button class="btn btn-primary w-full" onclick="AdvisorAlerts.sendAlert()">
                        <i data-lucide="send"></i> Gửi thông báo
                    </button>
                </div>
                
                <div class="card p-4">
                    <h3 class="font-bold mb-3 border-b pb-2">Lịch sử đã gửi</h3>
                    <div class="history-list max-h-96 overflow-y-auto">
                        ${history.sort((a,b) => new Date(b.date) - new Date(a.date)).map(h => `
                            <div class="p-3 border-b last:border-0 hover:bg-gray-50">
                                <h4 class="font-bold text-sm text-blue-700">${h.title}</h4>
                                <div class="text-xs text-gray-500 flex justify-between mt-1">
                                    <span>${Utils.formatDateTime ? Utils.formatDateTime(h.date) : new Date(h.date).toLocaleString()}</span>
                                    <span>${h.recipients ? h.recipients.length : 0} người nhận</span>
                                </div>
                            </div>
                        `).join('') || '<p class="text-sm text-gray-500 text-center py-4">Chưa gửi thông báo nào.</p>'}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();
    },
    
    filterStudents: function(status) {
        const checkboxes = document.querySelectorAll('input[name="student_select"]');
        checkboxes.forEach(cb => {
            if (status === 'all') {
                cb.checked = true;
            } else {
                cb.checked = cb.dataset.status === status;
            }
        });
    },
    
    applyTemplate: function() {
        const val = document.getElementById('alert-template').value;
        if (!val) return;
        const [title, content] = val.split('|');
        document.getElementById('alert-title').value = title;
        document.getElementById('alert-content').value = content;
        this.updateCharCount();
    },
    
    updateCharCount: function() {
        const content = document.getElementById('alert-content').value;
        const count = content.length;
        const counter = document.getElementById('char-counter');
        
        counter.textContent = `${count}/500`;
        if (count > 500) {
            document.getElementById('alert-content').value = content.substring(0, 500);
            counter.textContent = `500/500`;
        }
        
        if (count >= 480) counter.className = 'text-right text-sm text-red-600 font-bold mt-1';
        else if (count >= 400) counter.className = 'text-right text-sm text-yellow-600 font-bold mt-1';
        else counter.className = 'text-right text-sm text-gray-500 mt-1';
    },
    
    sendAlert: function() {
        const selected = Array.from(document.querySelectorAll('input[name="student_select"]:checked')).map(cb => cb.value);
        const title = document.getElementById('alert-title').value.trim();
        const content = document.getElementById('alert-content').value.trim();
        
        if (selected.length === 0) {
            if (window.Toast) Toast.warning('Vui lòng chọn ít nhất 1 sinh viên');
            return;
        }
        if (!title || !content) {
            if (window.Toast) Toast.warning('Vui lòng nhập tiêu đề và nội dung');
            return;
        }
        
        if (window.Modal) {
            Modal.confirm({
                title: 'Xác nhận gửi',
                message: `Bạn sẽ gửi thông báo này đến ${selected.length} sinh viên?`,
                onConfirm: async () => {
                    const user = Store.getCurrentUser();
                    for (const stId of selected) {
                        if (Store.addNotification) {
                            await Store.addNotification({
                                senderId: user.id,
                                recipientId: stId,
                                title: title,
                                content: content,
                                date: new Date(),
                                read: false
                            });
                        }
                    }
                    if (window.Toast) Toast.success('Đã gửi thông báo thành công');
                    this.render(); // refresh
                }
            });
        }
    }
};
