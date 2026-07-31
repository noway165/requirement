// ============================================
// VLU SmartEdu — Dynamic Table Component
// ============================================

const DataTable = {
    render({ containerId, columns, data, searchFields, filters, actions, onRowClick, pageSize = 10, title, addBtn }) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let currentPage = 1;
        let searchQuery = '';
        let sortField = null;
        let sortDir = 'asc';
        let filterValues = {};

        function getFilteredData() {
            let filtered = [...data];
            // Search
            if (searchQuery && searchFields) {
                filtered = filtered.filter(item => Utils.matchSearch(item, searchQuery, searchFields));
            }
            // Filters (AND logic)
            Object.entries(filterValues).forEach(([key, value]) => {
                if (value) {
                    filtered = filtered.filter(item => String(item[key]) === value);
                }
            });
            // Sort
            if (sortField) {
                filtered = Utils.sortBy(filtered, sortField, sortDir);
            }
            return filtered;
        }

        function renderTable() {
            const filtered = getFilteredData();
            const paginated = Utils.paginate(filtered, currentPage, pageSize);

            let html = `<div class="data-table-wrapper">`;

            // Header
            html += `<div class="data-table-header">`;
            html += `<div style="display:flex;align-items:center;gap:var(--space-3);">`;
            if (title) html += `<h3 class="data-table-title">${title}</h3>`;
            html += `<span class="badge badge-neutral">${filtered.length} kết quả</span>`;
            html += `</div>`;
            html += `<div class="data-table-actions">`;
            
            // Search
            if (searchFields) {
                html += `<div class="search-box">
                    <i data-lucide="search"></i>
                    <input type="text" id="${containerId}-search" placeholder="Tìm kiếm..." value="${searchQuery}">
                </div>`;
            }

            // Filters
            if (filters) {
                filters.forEach(f => {
                    const filterKey = f.field || f.key;
                    html += `<select id="${containerId}-filter-${filterKey}" class="filter-select">`;
                    html += `<option value="">${f.label}</option>`;
                    f.options.forEach(opt => {
                        const selected = filterValues[filterKey] === opt.value ? 'selected' : '';
                        html += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
                    });
                    html += `</select>`;
                });
            }

            // Add button
            if (addBtn) {
                const btnLabel = addBtn.label || addBtn.text;
                html += `<button class="btn btn-primary" id="${containerId}-add-btn">
                    <i data-lucide="plus"></i> ${btnLabel}
                </button>`;
            }

            html += `</div></div>`;

            // Table
            if (paginated.data.length === 0) {
                html += `<div class="empty-state">
                    <i data-lucide="inbox"></i>
                    <h4>Không có dữ liệu</h4>
                    <p>Không tìm thấy kết quả phù hợp với bộ lọc hiện tại.</p>
                </div>`;
            } else {
                html += `<div style="overflow-x:auto;"><table class="data-table">`;
                html += `<thead><tr>`;
                columns.forEach(col => {
                    const colKey = col.field || col.key;
                    const isSorted = sortField === colKey;
                    const icon = isSorted ? (sortDir === 'asc' ? 'arrow-up' : 'arrow-down') : 'arrow-up-down';
                    html += `<th class="${isSorted ? 'sorted' : ''}" data-sort="${colKey}" ${col.width ? `style="width:${col.width}"` : ''}>
                        ${col.label}
                        ${col.sortable !== false ? `<span class="sort-icon"><i data-lucide="${icon}" style="width:12px;height:12px;"></i></span>` : ''}
                    </th>`;
                });
                if (actions) html += `<th style="width:120px;text-align:center;">Thao tác</th>`;
                html += `</tr></thead>`;

                html += `<tbody>`;
                paginated.data.forEach(item => {
                    html += `<tr data-id="${item.id}" ${onRowClick ? 'style="cursor:pointer;"' : ''}>`;
                    columns.forEach(col => {
                        const colKey = col.field || col.key;
                        let value = item[colKey];
                        if (col.render) value = col.render(value, item);
                        else if (value === null || value === undefined) value = '—';
                        html += `<td>${value}</td>`;
                    });
                    if (actions) {
                        html += `<td><div class="table-actions">`;
                        actions.forEach(act => {
                            if (act.condition && !act.condition(item)) return;
                            html += `<button class="btn-icon ${act.class || ''}" data-action="${act.key}" data-id="${item.id}" title="${act.label}">
                                <i data-lucide="${act.icon}"></i>
                            </button>`;
                        });
                        html += `</div></td>`;
                    }
                    html += `</tr>`;
                });
                html += `</tbody></table></div>`;

                // Pagination
                if (paginated.totalPages > 1) {
                    html += `<div class="pagination">`;
                    html += `<div class="pagination-info">Hiển thị ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, paginated.total)} / ${paginated.total}</div>`;
                    html += `<div class="pagination-controls">`;
                    html += `<button class="pagination-btn" data-page="prev" ${!paginated.hasPrev ? 'disabled' : ''}>
                        <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
                    </button>`;
                    
                    for (let p = 1; p <= paginated.totalPages; p++) {
                        if (paginated.totalPages > 7 && p > 2 && p < paginated.totalPages - 1 && Math.abs(p - currentPage) > 1) {
                            if (p === 3 || p === paginated.totalPages - 2) html += `<span class="pagination-btn" style="cursor:default;">...</span>`;
                            continue;
                        }
                        html += `<button class="pagination-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
                    }
                    
                    html += `<button class="pagination-btn" data-page="next" ${!paginated.hasNext ? 'disabled' : ''}>
                        <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
                    </button>`;
                    html += `</div></div>`;
                }
            }

            html += `</div>`;
            container.innerHTML = html;
            if (window.lucide) lucide.createIcons();

            // Bind events
            bindEvents();
        }

        function bindEvents() {
            // Search
            const searchInput = document.getElementById(`${containerId}-search`);
            if (searchInput) {
                searchInput.addEventListener('input', Utils.debounce((e) => {
                    searchQuery = e.target.value;
                    currentPage = 1;
                    renderTable();
                    // Re-focus
                    const newInput = document.getElementById(`${containerId}-search`);
                    if (newInput) { newInput.focus(); newInput.selectionStart = newInput.value.length; }
                }, 300));
            }

            // Filters
            if (filters) {
                filters.forEach(f => {
                    const select = document.getElementById(`${containerId}-filter-${f.key}`);
                    if (select) {
                        select.addEventListener('change', (e) => {
                            filterValues[f.key] = e.target.value;
                            currentPage = 1;
                            renderTable();
                        });
                    }
                });
            }

            // Sort
            container.querySelectorAll('th[data-sort]').forEach(th => {
                th.addEventListener('click', () => {
                    const field = th.dataset.sort;
                    if (sortField === field) {
                        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
                    } else {
                        sortField = field;
                        sortDir = 'asc';
                    }
                    renderTable();
                });
            });

            // Pagination
            container.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const page = btn.dataset.page;
                    if (page === 'prev') currentPage--;
                    else if (page === 'next') currentPage++;
                    else currentPage = parseInt(page);
                    renderTable();
                });
            });

            // Actions
            container.querySelectorAll('[data-action]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    const id = btn.dataset.id;
                    const item = data.find(d => d.id === id);
                    if (actions) {
                        const act = actions.find(a => a.key === action);
                        if (act && act.onClick) act.onClick(item);
                    }
                });
            });

            // Row click
            if (onRowClick) {
                container.querySelectorAll('tbody tr').forEach(tr => {
                    tr.addEventListener('click', () => {
                        const id = tr.dataset.id;
                        const item = data.find(d => d.id === id);
                        if (item) onRowClick(item);
                    });
                });
            }

            // Add button
            if (addBtn) {
                const addBtnEl = document.getElementById(`${containerId}-add-btn`);
                if (addBtnEl) addBtnEl.addEventListener('click', addBtn.onClick);
            }
        }

        renderTable();

        return {
            refresh(newData) {
                if (newData) data = newData;
                renderTable();
            },
            setPage(page) {
                currentPage = page;
                renderTable();
            }
        };
    }
};
