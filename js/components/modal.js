// ============================================
// VLU SmartEdu — Modal Component
// ============================================

const Modal = {
    show({ title, content, footer, size = '', onClose } = {}) {
        const overlay = document.getElementById('modal-overlay');
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalFooter = document.getElementById('modal-footer');
        const closeBtn = document.getElementById('modal-close');

        if (!overlay || !modal) return;

        modal.className = `modal ${size}`;
        modalTitle.textContent = title || '';
        modalBody.innerHTML = typeof content === 'string' ? content : '';
        if (typeof content === 'object' && content instanceof HTMLElement) {
            modalBody.innerHTML = '';
            modalBody.appendChild(content);
        }
        modalFooter.innerHTML = footer || '';
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const close = () => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
            if (onClose) onClose();
        };

        closeBtn.onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        // Re-render icons
        if (window.lucide) lucide.createIcons();

        return { close };
    },

    confirm({ title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', type = 'danger', onConfirm } = {}) {
        const footer = `
            <button class="btn btn-secondary" id="modal-cancel">${cancelText}</button>
            <button class="btn btn-${type}" id="modal-confirm">${confirmText}</button>
        `;

        const instance = this.show({
            title,
            content: `<p style="color:var(--text-secondary);font-size:var(--text-sm);line-height:1.6;">${message}</p>`,
            footer,
        });

        setTimeout(() => {
            document.getElementById('modal-cancel')?.addEventListener('click', () => instance.close());
            document.getElementById('modal-confirm')?.addEventListener('click', () => {
                if (onConfirm) onConfirm();
                instance.close();
            });
        }, 50);

        return instance;
    },

    close() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    },

    form({ title, fields, onSubmit, submitText = 'Lưu', size = '' } = {}) {
        let formHTML = '<form id="modal-form" class="modal-form">';
        fields.forEach(field => {
            const key = field.name || field.key;
            formHTML += `<div class="form-group">`;
            formHTML += `<label for="field-${key}">${field.label}${field.required ? ' <span style="color:var(--danger)">*</span>' : ''}</label>`;
            
            if (field.type === 'select') {
                formHTML += `<select id="field-${key}" ${field.required ? 'required' : ''}>`;
                formHTML += `<option value="">-- Chọn --</option>`;
                (field.options || []).forEach(opt => {
                    const selected = opt.value === field.value ? 'selected' : '';
                    formHTML += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
                });
                formHTML += `</select>`;
            } else if (field.type === 'textarea') {
                formHTML += `<textarea id="field-${key}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} rows="4" ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}>${field.value || ''}</textarea>`;
            } else {
                formHTML += `<input type="${field.type || 'text'}" id="field-${key}" value="${field.value || ''}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} ${field.min !== undefined ? `min="${field.min}"` : ''} ${field.max !== undefined ? `max="${field.max}"` : ''}>`;
            }
            formHTML += `</div>`;
        });
        formHTML += '</form>';

        const footer = `
            <button class="btn btn-secondary" id="modal-cancel">Hủy</button>
            <button class="btn btn-primary" id="modal-submit">${submitText}</button>
        `;

        const instance = this.show({ title, content: formHTML, footer, size });

        setTimeout(() => {
            document.getElementById('modal-cancel')?.addEventListener('click', () => instance.close());
            document.getElementById('modal-submit')?.addEventListener('click', () => {
                const form = document.getElementById('modal-form');
                if (form && !form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
                const data = {};
                fields.forEach(field => {
                    const key = field.name || field.key;
                    const el = document.getElementById(`field-${key}`);
                    if (el) {
                        data[key] = field.type === 'number' ? parseFloat(el.value) : el.value;
                    }
                });
                if (onSubmit) onSubmit(data, instance);
            });
        }, 50);

        return instance;
    }
};
