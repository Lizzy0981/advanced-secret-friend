// ===== ADVANCED SECRET FRIEND - DATA SCIENCE EDITION =====
// Author: Elizabeth Díaz Familia
// Description: Professional secret friend draw with multiple algorithms, analytics and data visualization
// Version: 1.0.0

// ===== INTERNATIONALIZATION (i18n) =====
const i18n = {
    es: {
        hero: {
            title: "Advanced Secret Friend\nData Science Edition",
            subtitle: "Sorteo profesional con algoritmos múltiples, análisis estadístico en tiempo real y visualización de datos avanzada"
        },
        card: {
            friends: "Gestión de Amigos",
            results: "Resultados",
            analytics: "Analytics Dashboard"
        },
        input: {
            label: "Nombre del amigo:",
            placeholder: "Escribe un nombre..."
        },
        buttons: {
            add: "Añadir",
            draw: "Sortear Amigo Secreto",
            clear: "Limpiar Historial"
        },
        algorithm: {
            label: "Algoritmo de Sorteo:",
            simple: { name: "Simple", desc: "Math.random()" },
            fisher: { name: "Fisher-Yates", desc: "Algorítmico" },
            weighted: { name: "Ponderado", desc: "Con pesos" },
            crypto: { name: "Crypto", desc: "Seguro" }
        },
        friends: {
            empty: "No hay amigos agregados aún..."
        },
        result: {
            waiting: "Esperando sorteo...",
            winner: "🎉 ¡Ganador seleccionado!",
            selected: "Amigo seleccionado:"
        },
        stats: {
            total: "Total Sorteos",
            friends: "Amigos",
            fairness: "Equidad",
            algorithm: "Algoritmo"
        },
        history: {
            title: "Historial de Sorteos",
            empty: "No hay sorteos realizados aún..."
        },
        analytics: {
            title: "Métricas Avanzadas"
        },
        export: {
            json: "JSON",
            csv: "CSV"
        },
        footer: {
            motto: "Data Science & Advanced Programming",
            made: "Made with"
        },
        notifications: {
            friendAdded: "Amigo agregado exitosamente",
            friendRemoved: "Amigo eliminado",
            duplicateFriend: "Este amigo ya está en la lista",
            emptyName: "Por favor ingresa un nombre válido",
            minFriends: "Necesitas al menos 2 amigos para sortear",
            historyCleared: "Historial limpiado",
            dataExported: "Datos exportados exitosamente"
        }
    },
    en: {
        hero: {
            title: "Advanced Secret Friend\nData Science Edition",
            subtitle: "Professional drawing with multiple algorithms, real-time statistical analysis and advanced data visualization"
        },
        card: {
            friends: "Friends Management",
            results: "Results",
            analytics: "Analytics Dashboard"
        },
        input: {
            label: "Friend's name:",
            placeholder: "Enter a name..."
        },
        buttons: {
            add: "Add",
            draw: "Draw Secret Friend",
            clear: "Clear History"
        },
        algorithm: {
            label: "Drawing Algorithm:",
            simple: { name: "Simple", desc: "Math.random()" },
            fisher: { name: "Fisher-Yates", desc: "Algorithmic" },
            weighted: { name: "Weighted", desc: "With weights" },
            crypto: { name: "Crypto", desc: "Secure" }
        },
        friends: {
            empty: "No friends added yet..."
        },
        result: {
            waiting: "Waiting for draw...",
            winner: "🎉 Winner selected!",
            selected: "Selected friend:"
        },
        stats: {
            total: "Total Draws",
            friends: "Friends",
            fairness: "Fairness",
            algorithm: "Algorithm"
        },
        history: {
            title: "Draw History",
            empty: "No draws performed yet..."
        },
        analytics: {
            title: "Advanced Metrics"
        },
        export: {
            json: "JSON",
            csv: "CSV"
        },
        footer: {
            motto: "Data Science & Advanced Programming",
            made: "Made with"
        },
        notifications: {
            friendAdded: "Friend added successfully",
            friendRemoved: "Friend removed",
            duplicateFriend: "This friend is already on the list",
            emptyName: "Please enter a valid name",
            minFriends: "You need at least 2 friends to draw",
            historyCleared: "History cleared",
            dataExported: "Data exported successfully"
        }
    }
};

// ===== APPLICATION STATE CLASS =====
class SecretFriendApp {
    constructor() {
        this.friends = [];
        this.drawHistory = [];
        this.currentLanguage = 'es';
        this.selectedAlgorithm = 'simple';
        this.charts = {};
        this.version = '1.0.0';
        
        this.init();
    }

    // ===== INITIALIZATION =====
    init() {
        this.loadData();
        this.bindEvents();
        this.updateUI();
        this.initCharts();
        this.updateLanguage();
        
        console.log(`🎯 Advanced Secret Friend v${this.version} initialized`);
    }

    // ===== DATA PERSISTENCE =====
    loadData() {
        try {
            const savedData = localStorage.getItem('secretFriendData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.friends = data.friends || [];
                this.drawHistory = data.drawHistory || [];
                this.currentLanguage = data.language || 'es';
                this.selectedAlgorithm = data.algorithm || 'simple';
            }
        } catch (error) {
            console.warn('Error loading saved data:', error);
            this.resetData();
        }
    }

    saveData() {
        try {
            const data = {
                friends: this.friends,
                drawHistory: this.drawHistory,
                language: this.currentLanguage,
                algorithm: this.selectedAlgorithm,
                version: this.version,
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem('secretFriendData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Error al guardar datos', 'error');
        }
    }

    resetData() {
        this.friends = [];
        this.drawHistory = [];
        this.currentLanguage = 'es';
        this.selectedAlgorithm = 'simple';
        this.saveData();
    }

    // ===== EVENT BINDING =====
    bindEvents() {
        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Add friend
        const addBtn = document.getElementById('addFriendBtn');
        const friendInput = document.getElementById('friendInput');
        
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addFriend());
        }
        
        if (friendInput) {
            friendInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addFriend();
                }
            });
            
            // Real-time validation
            friendInput.addEventListener('input', (e) => {
                this.validateFriendInput(e.target.value);
            });
        }

        // Algorithm selection
        document.querySelectorAll('.algorithm-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectAlgorithm(option.dataset.algorithm);
            });
        });

        // Draw button
        const drawBtn = document.getElementById('drawBtn');
        if (drawBtn) {
            drawBtn.addEventListener('click', () => this.drawSecretFriend());
        }

        // Clear history
        const clearBtn = document.getElementById('clearHistoryBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearHistory());
        }

        // Export buttons
        const exportJSON = document.getElementById('exportJSON');
        const exportCSV = document.getElementById('exportCSV');
        
        if (exportJSON) {
            exportJSON.addEventListener('click', () => this.exportData('json'));
        }
        
        if (exportCSV) {
            exportCSV.addEventListener('click', () => this.exportData('csv'));
        }

        // Keyboard shortcuts
        this.bindKeyboardShortcuts();
    }

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to draw
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (this.friends.length >= 2) {
                    this.drawSecretFriend();
                }
            }
            
            // Ctrl/Cmd + L to toggle language
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                this.toggleLanguage();
            }
            
            // Ctrl/Cmd + T to toggle theme
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
            
            // Escape to clear input
            if (e.key === 'Escape') {
                const input = document.getElementById('friendInput');
                if (input && input.value) {
                    input.value = '';
                    input.focus();
                }
            }
        });
    }

    // ===== LANGUAGE MANAGEMENT =====
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
        this.updateLanguage();
        this.saveData();
        
        // Track language change
        this.trackEvent('Language', 'Toggle', this.currentLanguage);
    }

    updateLanguage() {
        const lang = this.currentLanguage;
        document.documentElement.lang = lang;
        
        const langText = document.getElementById('langText');
        if (langText) {
            langText.textContent = lang === 'es' ? 'EN' : 'ES';
        }

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                if (key.includes('hero.title')) {
                    element.innerHTML = translation.replace('\n', '<br>');
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });

        this.updateUI();
        this.updateCharts();
    }

    getTranslation(key) {
        const keys = key.split('.');
        let translation = i18n[this.currentLanguage];
        for (const k of keys) {
            translation = translation?.[k];
        }
        return translation;
    }

    // ===== THEME MANAGEMENT =====
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Update charts for theme
        setTimeout(() => {
            this.updateCharts();
        }, 100);
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
        
        // Track theme change
        this.trackEvent('Theme', 'Toggle', newTheme);
    }

    // ===== FRIEND MANAGEMENT =====
    validateFriendInput(value) {
        const input = document.getElementById('friendInput');
        const addBtn = document.getElementById('addFriendBtn');
        
        if (!input || !addBtn) return;
        
        const isValid = value.trim().length > 0 && 
                       value.trim().length <= 50 && 
                       !this.friends.includes(value.trim());
        
        // Visual feedback
        input.style.borderColor = isValid ? 'var(--primary-color)' : 'var(--error-color)';
        addBtn.disabled = !isValid;
    }

    addFriend() {
        const input = document.getElementById('friendInput');
        if (!input) return;
        
        const name = input.value.trim();

        // Validation
        if (!name) {
            this.showNotification('emptyName', 'warning');
            input.focus();
            return;
        }

        if (name.length > 50) {
            this.showNotification('El nombre es demasiado largo (máximo 50 caracteres)', 'warning');
            return;
        }

        if (this.friends.includes(name)) {
            this.showNotification('duplicateFriend', 'warning');
            input.focus();
            return;
        }

        // Add friend
        this.friends.push(name);
        input.value = '';
        input.style.borderColor = 'var(--border-color)';
        input.focus();
        
        this.updateUI();
        this.saveData();
        this.showNotification('friendAdded', 'success');
        
        // Track friend addition
        this.trackEvent('Friend', 'Add', this.friends.length);
    }

    removeFriend(name) {
        const index = this.friends.indexOf(name);
        if (index > -1) {
            this.friends.splice(index, 1);
            this.updateUI();
            this.saveData();
            this.showNotification('friendRemoved', 'info');
            
            // Track friend removal
            this.trackEvent('Friend', 'Remove', this.friends.length);
        }
    }

    // ===== ALGORITHM MANAGEMENT =====
    selectAlgorithm(algorithm) {
        this.selectedAlgorithm = algorithm;
        
        // Update UI
        document.querySelectorAll('.algorithm-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const selectedOption = document.querySelector(`[data-algorithm="${algorithm}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
        
        this.saveData();
        
        // Track algorithm selection
        this.trackEvent('Algorithm', 'Select', algorithm);
    }

    // ===== DRAWING ALGORITHMS =====
    async drawSecretFriend() {
        if (this.friends.length < 2) {
            this.showNotification('minFriends', 'warning');
            return;
        }

        // Show loading state
        const drawBtn = document.getElementById('drawBtn');
        const originalText = drawBtn.innerHTML;
        drawBtn.innerHTML = '<div class="loading"></div> Sorteando...';
        drawBtn.disabled = true;

        try {
            // Add dramatic pause for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            let winner;
            const algorithm = this.selectedAlgorithm;

            switch (algorithm) {
                case 'simple':
                    winner = this.simpleRandom();
                    break;
                case 'fisher-yates':
                    winner = this.fisherYatesRandom();
                    break;
                case 'weighted':
                    winner = this.weightedRandom();
                    break;
                case 'crypto':
                    winner = await this.cryptoRandom();
                    break;
                default:
                    winner = this.simpleRandom();
            }

            this.recordDraw(winner, algorithm);
            this.displayResult(winner);
            this.updateUI();
            this.saveData();
            
            // Track draw
            this.trackEvent('Draw', 'Complete', algorithm);
            
        } catch (error) {
            console.error('Error during draw:', error);
            this.showNotification('Error durante el sorteo', 'error');
        } finally {
            // Restore button
            drawBtn.innerHTML = originalText;
            drawBtn.disabled = false;
        }
    }

    // Random Algorithm Implementations
    simpleRandom() {
        const randomIndex = Math.floor(Math.random() * this.friends.length);
        return this.friends[randomIndex];
    }

    fisherYatesRandom() {
        const shuffled = [...this.friends];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled[0];
    }

    weightedRandom() {
        // Calculate weights based on draw frequency (inverse weighting for fairness)
        const drawCounts = {};
        this.friends.forEach(friend => {
            drawCounts[friend] = this.drawHistory.filter(draw => draw.winner === friend).length;
        });

        const maxCount = Math.max(...Object.values(drawCounts), 0);
        const weights = this.friends.map(friend => {
            return maxCount - drawCounts[friend] + 1; // +1 to avoid zero weights
        });

        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < this.friends.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return this.friends[i];
            }
        }

        // Fallback
        return this.friends[0];
    }

    async cryptoRandom() {
        try {
            if (crypto && crypto.getRandomValues) {
                const array = new Uint32Array(1);
                crypto.getRandomValues(array);
                const randomIndex = array[0] % this.friends.length;
                return this.friends[randomIndex];
            } else {
                console.warn('Crypto API not available, falling back to simple random');
                return this.simpleRandom();
            }
        } catch (error) {
            console.error('Crypto random failed:', error);
            return this.simpleRandom();
        }
    }

    // ===== DRAW RECORDING =====
    recordDraw(winner, algorithm) {
        const draw = {
            id: Date.now(),
            winner,
            algorithm,
            timestamp: new Date().toISOString(),
            participantCount: this.friends.length,
            participants: [...this.friends]
        };
        
        this.drawHistory.unshift(draw);
        
        // Keep only last 100 draws to prevent storage bloat
        if (this.drawHistory.length > 100) {
            this.drawHistory = this.drawHistory.slice(0, 100);
        }
    }

    // ===== UI UPDATES =====
    updateUI() {
        this.updateFriendsList();
        this.updateStats();
        this.updateHistory();
        this.updateDrawButton();
        this.updateCharts();
    }

    updateFriendsList() {
        const container = document.getElementById('friendsList');
        const count = document.getElementById('friendCount');
        
        if (!container || !count) return;
        
        count.textContent = this.friends.length;

        if (this.friends.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="color: var(--text-secondary); padding: 2rem;" data-i18n="friends.empty">
                    ${this.getTranslation('friends.empty')}
                </div>
            `;
            return;
        }

        container.innerHTML = this.friends.map((friend, index) => `
            <div class="friend-item slide-in" style="animation-delay: ${index * 0.1}s">
                <span class="friend-name">${this.escapeHtml(friend)}</span>
                <div class="friend-actions">
                    <button class="btn btn-secondary btn-small" onclick="app.removeFriend('${this.escapeHtml(friend)}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const elements = {
            totalDraws: document.getElementById('totalDraws'),
            totalFriends: document.getElementById('totalFriends'),
            fairnessScore: document.getElementById('fairnessScore'),
            lastAlgorithm: document.getElementById('lastAlgorithm')
        };

        if (elements.totalDraws) elements.totalDraws.textContent = this.drawHistory.length;
        if (elements.totalFriends) elements.totalFriends.textContent = this.friends.length;
        if (elements.fairnessScore) elements.fairnessScore.textContent = this.calculateFairness() + '%';
        if (elements.lastAlgorithm) {
            elements.lastAlgorithm.textContent = this.drawHistory.length > 0 ? 
                this.drawHistory[0].algorithm : '-';
        }
    }

    updateHistory() {
        const container = document.getElementById('historyList');
        if (!container) return;
        
        if (this.drawHistory.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="color: var(--text-secondary); padding: 2rem;" data-i18n="history.empty">
                    ${this.getTranslation('history.empty')}
                </div>
            `;
            return;
        }

        container.innerHTML = this.drawHistory.slice(0, 10).map((draw, index) => `
            <div class="history-item" style="animation-delay: ${index * 0.05}s">
                <div class="history-info">
                    <div class="history-winner">${this.escapeHtml(draw.winner)}</div>
                    <div class="history-details">
                        ${new Date(draw.timestamp).toLocaleString()} - ${draw.algorithm} 
                        (${draw.participantCount} participantes)
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateDrawButton() {
        const btn = document.getElementById('drawBtn');
        if (btn) {
            btn.disabled = this.friends.length < 2;
        }
    }

    displayResult(winner) {
        const container = document.getElementById('resultContainer');
        if (!container) return;
        
        const timestamp = new Date().toLocaleString(this.currentLanguage === 'es' ? 'es-ES' : 'en-US');
        
        container.innerHTML = `
            <div class="result-title">${this.getTranslation('result.winner')}</div>
            <div class="result-name">${this.escapeHtml(winner)}</div>
            <div class="result-timestamp">${timestamp}</div>
        `;
        
        // Add animation
        container.classList.add('slide-in');
        setTimeout(() => {
            container.classList.remove('slide-in');
        }, 500);

        // Confetti effect (optional)
        this.showConfetti();
    }

    // ===== ANALYTICS & STATISTICS =====
    calculateFairness() {
        if (this.drawHistory.length === 0 || this.friends.length === 0) return 100;

        const drawCounts = {};
        this.friends.forEach(friend => {
            drawCounts[friend] = 0;
        });

        this.drawHistory.forEach(draw => {
            if (drawCounts.hasOwnProperty(draw.winner)) {
                drawCounts[draw.winner]++;
            }
        });

        const counts = Object.values(drawCounts);
        const mean = counts.reduce((sum, count) => sum + count, 0) / counts.length;
        const variance = counts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / counts.length;
        
        // Convert variance to fairness score (lower variance = higher fairness)
        const fairness = Math.max(0, 100 - (variance * 10));

        return Math.round(fairness);
    }

    // ===== CHARTS & VISUALIZATION =====
    initCharts() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#ffffff' : '#1a1a1a';
        const gridColor = isDark ? '#404040' : '#e2e8f0';

        // Distribution Chart
        const distributionCtx = document.getElementById('distributionChart');
        if (distributionCtx) {
            this.charts.distribution = new Chart(distributionCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#6366f1', '#8b5cf6', '#3b82f6', '#10b981',
                            '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'
                        ],
                        borderWidth: 2,
                        borderColor: isDark ? '#2d2d2d' : '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: textColor,
                                padding: 15,
                                font: { size: 12 }
                            }
                        }
                    }
                }
            });
        }

        // Timeline Chart
        const timelineCtx = document.getElementById('timelineChart');
        if (timelineCtx) {
            this.charts.timeline = new Chart(timelineCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Sorteos por día',
                        data: [],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: textColor,
                                font: { size: 12 }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: textColor },
                            grid: { color: gridColor }
                        },
                        y: {
                            ticks: { color: textColor },
                            grid: { color: gridColor },
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    updateCharts() {
        this.updateDistributionChart();
        this.updateTimelineChart();
    }

    updateDistributionChart() {
        if (!this.charts.distribution) return;

        const drawCounts = {};
        this.friends.forEach(friend => {
            drawCounts[friend] = 0;
        });

        this.drawHistory.forEach(draw => {
            if (drawCounts.hasOwnProperty(draw.winner)) {
                drawCounts[draw.winner]++;
            }
        });

        const labels = Object.keys(drawCounts);
        const data = Object.values(drawCounts);

        this.charts.distribution.data.labels = labels;
        this.charts.distribution.data.datasets[0].data = data;
        this.charts.distribution.update();
    }

    updateTimelineChart() {
        if (!this.charts.timeline) return;

        // Group draws by date
        const drawsByDate = {};
        this.drawHistory.forEach(draw => {
            const date = new Date(draw.timestamp).toDateString();
            drawsByDate[date] = (drawsByDate[date] || 0) + 1;
        });

        const sortedDates = Object.keys(drawsByDate).sort((a, b) => new Date(a) - new Date(b));
        const labels = sortedDates.map(date => new Date(date).toLocaleDateString());
        const data = sortedDates.map(date => drawsByDate[date]);

        this.charts.timeline.data.labels = labels;
        this.charts.timeline.data.datasets[0].data = data;
        this.charts.timeline.data.datasets[0].label = 
            this.currentLanguage === 'es' ? 'Sorteos por día' : 'Draws per day';
        this.charts.timeline.update();
    }

    // ===== EXPORT FUNCTIONALITY =====
    exportData(format) {
        const data = {
            metadata: {
                appName: 'Advanced Secret Friend',
                version: this.version,
                exportDate: new Date().toISOString(),
                language: this.currentLanguage
            },
            friends: this.friends,
            drawHistory: this.drawHistory,
            statistics: {
                totalDraws: this.drawHistory.length,
                totalFriends: this.friends.length,
                fairnessScore: this.calculateFairness(),
                lastAlgorithm: this.drawHistory.length > 0 ? this.drawHistory[0].algorithm : null,
                algorithms: this.getAlgorithmStats()
            }
        };

        if (format === 'json') {
            this.downloadJSON(data);
        } else if (format === 'csv') {
            this.downloadCSV(data);
        }

        this.showNotification('dataExported', 'success');
        this.trackEvent('Export', 'Data', format);
    }

    getAlgorithmStats() {
        const stats = {};
        this.drawHistory.forEach(draw => {
            stats[draw.algorithm] = (stats[draw.algorithm] || 0) + 1;
        });
        return stats;
    }

    downloadJSON(data) {
        try {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `secret-friend-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading JSON:', error);
            this.showNotification('Error al exportar JSON', 'error');
        }
    }

    downloadCSV(data) {
        try {
            const csvContent = [
                // Header
                ['Winner', 'Algorithm', 'Date', 'Time', 'Participants', 'Total_Friends'].join(','),
                // Data rows
                ...data.drawHistory.map(draw => [
                    `"${draw.winner.replace(/"/g, '""')}"`, // Escape quotes
                    draw.algorithm,
                    new Date(draw.timestamp).toLocaleDateString(),
                    new Date(draw.timestamp).toLocaleTimeString(),
                    draw.participantCount,
                    draw.participants ? draw.participants.length : draw.participantCount
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `secret-friend-history-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading CSV:', error);
            this.showNotification('Error al exportar CSV', 'error');
        }
    }

    // ===== UTILITY FUNCTIONS =====
    clearHistory() {
        if (this.drawHistory.length === 0) {
            this.showNotification('No hay historial para limpiar', 'info');
            return;
        }

        // Confirmation dialog
        const confirmed = confirm(
            this.currentLanguage === 'es' 
                ? '¿Estás seguro de que quieres limpiar todo el historial?' 
                : 'Are you sure you want to clear all history?'
        );

        if (confirmed) {
            this.drawHistory = [];
            this.updateUI();
            this.saveData();
            this.showNotification('historyCleared', 'info');
            this.trackEvent('History', 'Clear', 'Confirmed');
        }
    }

    showNotification(messageKey, type = 'info') {
        const message = typeof messageKey === 'string' && messageKey.includes('.') 
            ? this.getTranslation(`notifications.${messageKey}`)
            : messageKey;
            
        const container = document.getElementById('notificationContainer');
        if (!container) {
            console.warn('Notification container not found');
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; margin-left: 10px; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide notification after 4 seconds
        setTimeout(() => {
            if (container.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (container.contains(notification)) {
                        container.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    }

    showConfetti() {
        // Simple confetti effect using CSS animations
        const colors = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    z-index: 9999;
                    border-radius: 50%;
                    animation: confetti-fall 3s ease-out forwards;
                    pointer-events: none;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (document.body.contains(confetti)) {
                        document.body.removeChild(confetti);
                    }
                }, 3000);
            }, i * 50);
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // ===== ANALYTICS & TRACKING =====
    trackEvent(category, action, label) {
        const eventData = {
            category,
            action,
            label,
            timestamp: new Date().toISOString(),
            version: this.version,
            language: this.currentLanguage
        };
        
        console.log(`📊 Event tracked:`, eventData);
        
        // Here you can integrate with Google Analytics, Mixpanel, etc.
        // Example for Google Analytics 4:
        // gtag('event', action, {
        //     event_category: category,
        //     event_label: label,
        //     custom_parameter: this.version
        // });
    }

    // ===== ADVANCED FEATURES =====
    generateInsights() {
        if (this.drawHistory.length < 5) return null;

        const insights = {
            mostLuckyFriend: this.getMostLuckyFriend(),
            favoriteAlgorithm: this.getFavoriteAlgorithm(),
            drawingFrequency: this.getDrawingFrequency(),
            fairnessTrend: this.getFairnessTrend()
        };

        return insights;
    }

    getMostLuckyFriend() {
        const counts = {};
        this.drawHistory.forEach(draw => {
            counts[draw.winner] = (counts[draw.winner] || 0) + 1;
        });

        const maxCount = Math.max(...Object.values(counts));
        const luckyFriend = Object.keys(counts).find(friend => counts[friend] === maxCount);
        
        return { name: luckyFriend, wins: maxCount };
    }

    getFavoriteAlgorithm() {
        const algorithmCounts = this.getAlgorithmStats();
        const maxCount = Math.max(...Object.values(algorithmCounts));
        const favoriteAlgorithm = Object.keys(algorithmCounts).find(alg => algorithmCounts[alg] === maxCount);
        
        return { algorithm: favoriteAlgorithm, uses: maxCount };
    }

    getDrawingFrequency() {
        if (this.drawHistory.length < 2) return null;

        const dates = this.drawHistory.map(draw => new Date(draw.timestamp).getTime());
        const intervals = [];
        
        for (let i = 1; i < dates.length; i++) {
            intervals.push(dates[i-1] - dates[i]);
        }

        const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        const avgDays = avgInterval / (1000 * 60 * 60 * 24);
        
        return Math.round(avgDays * 10) / 10; // Round to 1 decimal
    }

    getFairnessTrend() {
        // Calculate fairness over time (last 10 draws vs previous)
        if (this.drawHistory.length < 10) return null;

        const recent = this.drawHistory.slice(0, 10);
        const older = this.drawHistory.slice(10, 20);
        
        const recentFairness = this.calculateFairnessForDraws(recent);
        const olderFairness = this.calculateFairnessForDraws(older);
        
        return recentFairness - olderFairness; // Positive = improving fairness
    }

    calculateFairnessForDraws(draws) {
        if (draws.length === 0) return 100;

        const drawCounts = {};
        const allParticipants = new Set();
        
        draws.forEach(draw => {
            if (draw.participants) {
                draw.participants.forEach(p => allParticipants.add(p));
            }
            drawCounts[draw.winner] = (drawCounts[draw.winner] || 0) + 1;
        });

        const counts = Array.from(allParticipants).map(p => drawCounts[p] || 0);
        const mean = counts.reduce((sum, count) => sum + count, 0) / counts.length;
        const variance = counts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / counts.length;
        
        return Math.max(0, 100 - (variance * 10));
    }

    // ===== PERFORMANCE MONITORING =====
    measurePerformance(functionName, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        console.log(`⚡ ${functionName} took ${(end - start).toFixed(2)}ms`);
        return result;
    }

    // ===== ERROR HANDLING =====
    handleError(error, context = 'Unknown') {
        console.error(`❌ Error in ${context}:`, error);
        
        // Log error for debugging
        const errorLog = {
            context,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store error log (could be sent to error tracking service)
        const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
        errorLogs.push(errorLog);
        
        // Keep only last 10 errors
        if (errorLogs.length > 10) {
            errorLogs.splice(0, errorLogs.length - 10);
        }
        
        localStorage.setItem('errorLogs', JSON.stringify(errorLogs));
        
        // Show user-friendly error message
        this.showNotification(
            this.currentLanguage === 'es' 
                ? 'Ha ocurrido un error inesperado' 
                : 'An unexpected error occurred',
            'error'
        );
    }
}

// ===== GLOBAL INITIALIZATION =====
let app;

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the application
        app = new SecretFriendApp();
        
        // Set up global error handling
        window.addEventListener('error', (event) => {
            if (app) {
                app.handleError(event.error, 'Global Error');
            }
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            if (app) {
                app.handleError(new Error(event.reason), 'Unhandled Promise Rejection');
            }
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            const themeIcon = document.querySelector('#themeToggle i');
            if (themeIcon) {
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        // Update current year in footer
        const currentYearEl = document.getElementById('currentYear');
        if (currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
        
        // Add confetti CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confetti-fall {
                0% {
                    transform: translateY(-100px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        console.log('🎯 Advanced Secret Friend application initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Show fallback error message
        document.body.innerHTML = `
            <div style="
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                text-align: center; 
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: white;
            ">
                <div>
                    <h1>⚠️ Error de Inicialización</h1>
                    <p>No se pudo cargar la aplicación correctamente.</p>
                    <button onclick="window.location.reload()" style="
                        padding: 10px 20px; 
                        background: white; 
                        color: #6366f1; 
                        border: none; 
                        border-radius: 8px; 
                        cursor: pointer;
                        font-size: 16px;
                        margin-top: 20px;
                    ">
                        Recargar Página
                    </button>
                </div>
            </div>
        `;
    }
});

// ===== PWA SERVICE WORKER =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('✅ SW registered successfully:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available
                            if (app) {
                                app.showNotification(
                                    app.currentLanguage === 'es' 
                                        ? 'Nueva versión disponible. Recarga la página.' 
                                        : 'New version available. Please reload the page.',
                                    'info'
                                );
                            }
                        }
                    });
                });
            })
            .catch(registrationError => {
                console.log('❌ SW registration failed:', registrationError);
            });
    });
}

// ===== EXPORT FOR GLOBAL ACCESS =====
window.SecretFriendApp = SecretFriendApp;

// ===== DEBUGGING HELPERS (Development Only) =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugApp = () => {
        console.log('🔍 Debug Info:', {
            friends: app.friends,
            drawHistory: app.drawHistory,
            language: app.currentLanguage,
            algorithm: app.selectedAlgorithm,
            fairness: app.calculateFairness(),
            insights: app.generateInsights()
        });
    };
    
    window.addDemoData = () => {
        app.friends = ['Ana García', 'Carlos López', 'María Rodríguez', 'Juan Pérez', 'Sofia Martínez'];
        app.updateUI();
        app.saveData();
        console.log('✅ Demo data added');
    };
    
    window.simulateDraws = (count = 10) => {
        for (let i = 0; i < count; i++) {
            if (app.friends.length >= 2) {
                setTimeout(() => {
                    app.drawSecretFriend();
                }, i * 500);
            }
        }
        console.log(`🎲 Simulating ${count} draws...`);
    };
    
    console.log('🛠️ Debug helpers available: debugApp(), addDemoData(), simulateDraws()');
}