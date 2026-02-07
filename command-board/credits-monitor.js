// ==================== CREDITS MONITOR ====================

// API Credit Tracking
let creditsData = {
    nvidia: {
        name: 'NVIDIA (Kimi K2.5)',
        total: 5000,
        used: 0,
        remaining: 5000,
        status: 'active',
        lastCheck: null,
        free: true
    },
    moonshot: {
        name: 'Moonshot (Kimi K2.5)',
        total: null, // Unlimited/paid
        used: 0,
        remaining: null,
        status: 'standby',
        lastCheck: null,
        free: false
    }
};

// Initialize credits monitoring
function initCreditsMonitor() {
    loadCreditsData();
    renderCreditsView();
    startCreditsAutoRefresh();
}

// Load credits from Firebase
async function loadCreditsData() {
    if (!workspaceId) return;
    
    const creditsRef = db.ref(`workspaces/${workspaceId}/credits`);
    creditsRef.on('value', (snap) => {
        const data = snap.val();
        if (data) {
            creditsData = { ...creditsData, ...data };
            renderCreditsView();
        }
    });
}

// Render the credits view
function renderCreditsView() {
    const container = document.getElementById('creditsContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="credits-grid">
            ${renderCreditCard('nvidia', creditsData.nvidia)}
            ${renderCreditCard('moonshot', creditsData.moonshot)}
        </div>
        
        <div class="credits-actions">
            <button class="btn btn-primary" onclick="manualRefreshCredits()">
                🔄 Refresh Now
            </button>
            <button class="btn btn-secondary" onclick="resetNvidiaCredits()">
                🔄 Reset NVIDIA (New Key)
            </button>
        </div>
        
        <div class="credits-logs">
            <h3>📊 Usage History</h3>
            <div id="creditsLogsList">
                ${renderCreditsLogs()}
            </div>
        </div>
    `;
}

// Render individual credit card
function renderCreditCard(key, data) {
    const percent = data.total ? Math.round((data.used / data.total) * 100) : 0;
    const isLow = data.total && data.remaining < 500;
    const isCritical = data.total && data.remaining < 100;
    
    let statusClass = 'status-ok';
    let statusIcon = '✅';
    
    if (isCritical) {
        statusClass = 'status-critical';
        statusIcon = '🔴';
    } else if (isLow) {
        statusClass = 'status-warning';
        statusIcon = '⚠️';
    }
    
    const progressColor = isCritical ? '#ff4444' : isLow ? '#ffaa00' : '#00d4ff';
    
    return `
        <div class="credit-card ${statusClass}">
            <div class="credit-header">
                <span class="credit-name">${data.name}</span>
                <span class="credit-status">${statusIcon} ${data.status.toUpperCase()}</span>
            </div>
            
            <div class="credit-progress">
                <div class="credit-progress-bar">
                    <div class="credit-progress-fill" style="width: ${percent}%; background: ${progressColor};"></div>
                </div>
                <div class="credit-stats">
                    <span>${data.used.toLocaleString()} used</span>
                    <span>${percent}%</span>
                </div>
            </div>
            
            <div class="credit-details">
                <div class="credit-stat">
                    <span class="credit-label">Total</span>
                    <span class="credit-value">${data.total ? data.total.toLocaleString() : '∞'}</span>
                </div>
                <div class="credit-stat">
                    <span class="credit-label">Remaining</span>
                    <span class="credit-value ${isCritical ? 'critical' : isLow ? 'low' : ''}">
                        ${data.remaining !== null ? data.remaining.toLocaleString() : '∞'}
                    </span>
                </div>
                <div class="credit-stat">
                    <span class="credit-label">Type</span>
                    <span class="credit-value">${data.free ? '🎁 Free' : '💰 Paid'}</span>
                </div>
            </div>
            
            ${data.lastCheck ? `
                <div class="credit-last-check">
                    Last updated: ${formatDate(data.lastCheck)}
                </div>
            ` : ''}
        </div>
    `;
}

// Render credits logs
function renderCreditsLogs() {
    const logs = creditsData.logs || [];
    const recentLogs = logs.slice(-20).reverse();
    
    if (recentLogs.length === 0) {
        return '<p style="color: #666; text-align: center; padding: 20px;">No usage recorded yet</p>';
    }
    
    return `
        <div class="credits-log-list">
            ${recentLogs.map(log => `
                <div class="credits-log-item ${log.provider}">
                    <span class="log-provider">${log.provider === 'nvidia' ? '🟢 NVIDIA' : '🔵 Moonshot'}</span>
                    <span class="log-action">${log.action}</span>
                    <span class="log-time">${formatDate(log.timestamp)}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Manual refresh
async function manualRefreshCredits() {
    await checkCreditsStatus();
    renderCreditsView();
}

// Reset NVIDIA credits (when new key added)
async function resetNvidiaCredits() {
    if (!confirm('Reset NVIDIA credits to 5000? Use this when you add a new API key.')) return;
    
    creditsData.nvidia.used = 0;
    creditsData.nvidia.remaining = 5000;
    creditsData.nvidia.status = 'active';
    creditsData.nvidia.lastCheck = Date.now();
    
    await saveCreditsData();
    renderCreditsView();
}

// Check credits status (simulated - real API would check actual usage)
async function checkCreditsStatus() {
    // In a real implementation, this would call the NVIDIA/Moonshot APIs
    // to check actual usage. For now, we track locally.
    
    creditsData.nvidia.lastCheck = Date.now();
    creditsData.moonshot.lastCheck = Date.now();
    
    await saveCreditsData();
}

// Save credits data to Firebase
async function saveCreditsData() {
    if (!workspaceId) return;
    await db.ref(`workspaces/${workspaceId}/credits`).set(creditsData);
}

// Log API usage
async function logApiUsage(provider, action) {
    if (!workspaceId) return;
    
    const logEntry = {
        provider,
        action,
        timestamp: Date.now()
    };
    
    // Add to logs
    if (!creditsData.logs) creditsData.logs = [];
    creditsData.logs.push(logEntry);
    
    // Update usage count
    if (provider === 'nvidia' && creditsData.nvidia.remaining > 0) {
        creditsData.nvidia.used++;
        creditsData.nvidia.remaining--;
        
        if (creditsData.nvidia.remaining <= 0) {
            creditsData.nvidia.status = 'depleted';
            creditsData.moonshot.status = 'active';
        } else if (creditsData.nvidia.remaining < 500) {
            creditsData.nvidia.status = 'low';
        }
    } else if (provider === 'moonshot') {
        creditsData.moonshot.used++;
    }
    
    await saveCreditsData();
    renderCreditsView();
}

// Auto-refresh credits every 5 minutes
function startCreditsAutoRefresh() {
    setInterval(() => {
        checkCreditsStatus();
    }, 5 * 60 * 1000);
}

// Get current active provider
function getActiveProvider() {
    if (creditsData.nvidia.status === 'active' && creditsData.nvidia.remaining > 0) {
        return 'nvidia';
    }
    return 'moonshot';
}

// Export for use in other scripts
window.creditsMonitor = {
    logApiUsage,
    getActiveProvider,
    getCreditsData: () => creditsData
};
