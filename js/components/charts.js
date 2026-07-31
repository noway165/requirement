// ============================================
// VLU SmartEdu — Charts (Canvas-based)
// ============================================

const Charts = {
    colors: ['#C8102E', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'],

    // ── Bar Chart ──
    bar(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = (options.width || rect.width - 32) * dpr;
        canvas.height = (options.height || 300) * dpr;
        canvas.style.width = (options.width || rect.width - 32) + 'px';
        canvas.style.height = (options.height || 300) + 'px';
        ctx.scale(dpr, dpr);

        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const padding = { top: 20, right: 20, bottom: 50, left: 50 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;

        const maxVal = Math.max(...data.map(d => d.value)) * 1.15;
        const barWidth = Math.min(40, (chartW / data.length) * 0.6);
        const gap = (chartW - barWidth * data.length) / (data.length + 1);

        ctx.clearRect(0, 0, w, h);

        // Grid lines
        ctx.strokeStyle = 'rgba(148,163,184,0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();

            ctx.fillStyle = '#94A3B8';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padding.left - 10, y + 4);
        }

        // Bars with animation
        data.forEach((d, i) => {
            const x = padding.left + gap + i * (barWidth + gap);
            const barH = (d.value / maxVal) * chartH;
            const y = padding.top + chartH - barH;
            
            const color = d.color || this.colors[i % this.colors.length];
            
            // Bar shadow
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, barWidth, barH, [4, 4, 0, 0]);
            ctx.fill();

            // Bar
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
            ctx.fill();

            // Value on top
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 13px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(d.value, x + barWidth / 2, y - 8);

            // Label
            ctx.fillStyle = '#CBD5E1';
            ctx.font = '13px Inter, sans-serif';
            ctx.fillText(Utils.truncate(d.label, 12), x + barWidth / 2, h - padding.bottom + 20);
        });
    },

    // ── Donut Chart ──
    donut(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const rect = canvas.parentElement.getBoundingClientRect();
        // Give donut chart more width for legend if needed
        const cWidth = options.width || rect.width || 300;
        const cHeight = options.height || 250;
        canvas.width = cWidth * dpr;
        canvas.height = cHeight * dpr;
        canvas.style.width = cWidth + 'px';
        canvas.style.height = cHeight + 'px';
        ctx.scale(dpr, dpr);

        const cx = (cHeight) / 2; // Keep circle on left
        const cy = cHeight / 2;
        const radius = Math.min(cx, cy) - 20;
        const innerRadius = radius * 0.6;
        const total = data.reduce((s, d) => s + (d.value || 0), 0);

        let startAngle = -Math.PI / 2;

        data.forEach((d, i) => {
            const val = d.value || 0;
            if (val === 0) return;
            const sliceAngle = (val / total) * Math.PI * 2;
            const color = d.color || this.colors[i % this.colors.length];

            ctx.beginPath();
            ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
            ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();

            // Draw legend
            const legendX = cx + radius + 30;
            const legendY = cy - radius + (i * 24) + 12;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(legendX, legendY, 6, 0, Math.PI*2);
            ctx.fill();

            ctx.fillStyle = '#F8FAFC';
            ctx.font = '13px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const pct = Math.round((val / total) * 100);
            ctx.fillText(`${d.label} (${pct}%)`, legendX + 15, legendY);

            startAngle += sliceAngle;
        });

        // Center text
        if (options.centerText) {
            ctx.fillStyle = '#F1F5F9';
            ctx.font = 'bold 24px Be Vietnam Pro, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(options.centerText, cx, cy - 8);
            if (options.centerLabel) {
                ctx.fillStyle = '#94A3B8';
                ctx.font = '12px Inter, sans-serif';
                ctx.fillText(options.centerLabel, cx, cy + 14);
            }
        }
    },

    // ── Line Chart ──
    line(canvasId, datasets, labels, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = (options.width || rect.width - 32) * dpr;
        canvas.height = (options.height || 280) * dpr;
        canvas.style.width = (options.width || rect.width - 32) + 'px';
        canvas.style.height = (options.height || 280) + 'px';
        ctx.scale(dpr, dpr);

        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const padding = { top: 20, right: 20, bottom: 50, left: 50 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;

        const allValues = datasets.flatMap(ds => ds.data);
        const maxVal = Math.max(...allValues) * 1.15;
        const minVal = Math.min(0, Math.min(...allValues));

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(148,163,184,0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();

            ctx.fillStyle = '#64748B';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(maxVal - ((maxVal - minVal) / 4) * i), padding.left - 8, y + 4);
        }

        // X labels
        const stepX = chartW / (labels.length - 1);
        labels.forEach((label, i) => {
            ctx.fillStyle = '#94A3B8';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, padding.left + i * stepX, h - padding.bottom + 20);
        });

        // Lines
        datasets.forEach((ds, di) => {
            const color = ds.color || this.colors[di % this.colors.length];

            // Area fill
            ctx.beginPath();
            ds.data.forEach((val, i) => {
                const x = padding.left + i * stepX;
                const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.lineTo(padding.left + (ds.data.length - 1) * stepX, padding.top + chartH);
            ctx.lineTo(padding.left, padding.top + chartH);
            ctx.closePath();
            ctx.fillStyle = color + '15';
            ctx.fill();

            // Line
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.lineJoin = 'round';
            ds.data.forEach((val, i) => {
                const x = padding.left + i * stepX;
                const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Points
            ds.data.forEach((val, i) => {
                const x = padding.left + i * stepX;
                const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = '#1A1D2E';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        });
    },

    // ── Progress Ring ──
    progressRing(canvasId, value, max, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const size = options.size || 140;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
        ctx.scale(dpr, dpr);

        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2 - 12;
        const lineWidth = options.lineWidth || 10;
        const percentage = Math.min(value / max, 1);
        const color = options.color || '#C8102E';

        // Background ring
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(148,163,184,0.1)';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Progress ring
        ctx.beginPath();
        ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + percentage * Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Center text
        ctx.fillStyle = '#F1F5F9';
        ctx.font = `bold ${size / 5}px Be Vietnam Pro, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(percentage * 100) + '%', cx, cy);
    },

    // ── Horizontal Bar ──
    horizontalBar(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const rect = canvas.parentElement.getBoundingClientRect();
        const barHeight = 28;
        const gap = 12;
        const totalH = data.length * (barHeight + gap) + 40;
        
        canvas.width = (options.width || rect.width - 32) * dpr;
        canvas.height = totalH * dpr;
        canvas.style.width = (options.width || rect.width - 32) + 'px';
        canvas.style.height = totalH + 'px';
        ctx.scale(dpr, dpr);

        const w = canvas.width / dpr;
        const maxVal = Math.max(...data.map(d => d.value));
        const barMaxW = w - 160;

        data.forEach((d, i) => {
            const y = 10 + i * (barHeight + gap);
            const barW = (d.value / maxVal) * barMaxW;
            const color = d.color || this.colors[i % this.colors.length];

            // Label
            ctx.fillStyle = '#94A3B8';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(Utils.truncate(d.label, 12), 100, y + barHeight / 2 + 4);

            // Bar bg
            ctx.fillStyle = 'rgba(148,163,184,0.08)';
            ctx.beginPath();
            ctx.roundRect(110, y, barMaxW, barHeight, 4);
            ctx.fill();

            // Bar fill
            const gradient = ctx.createLinearGradient(110, 0, 110 + barW, 0);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, color + 'AA');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(110, y, Math.max(barW, 4), barHeight, 4);
            ctx.fill();

            // Value
            ctx.fillStyle = '#F1F5F9';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(d.value, 110 + barW + 8, y + barHeight / 2 + 4);
        });
    },
};
