#!/usr/bin/env python3
"""
Affiliate Tracking System for AI Skills Bootcamp
Tracks referrals, calculates commissions (30% recurring)
"""
import sqlite3
import hashlib
import json
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, render_template_string
import secrets

app = Flask(__name__)

# Database setup
def init_db():
    conn = sqlite3.connect('affiliates.db')
    c = conn.cursor()
    
    # Affiliates table
    c.execute('''CREATE TABLE IF NOT EXISTS affiliates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        referral_code TEXT UNIQUE NOT NULL,
        commission_rate REAL DEFAULT 0.30,
        paypal_email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        active BOOLEAN DEFAULT 1
    )''')
    
    # Referrals table
    c.execute('''CREATE TABLE IF NOT EXISTS referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        affiliate_id INTEGER,
        referred_email TEXT,
        referral_code TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        converted_at TIMESTAMP,
        FOREIGN KEY (affiliate_id) REFERENCES affiliates(id)
    )''')
    
    # Commissions table
    c.execute('''CREATE TABLE IF NOT EXISTS commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        affiliate_id INTEGER,
        referral_id INTEGER,
        amount REAL,
        commission_amount REAL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP,
        FOREIGN KEY (affiliate_id) REFERENCES affiliates(id),
        FOREIGN KEY (referral_id) REFERENCES referrals(id)
    )''')
    
    # Clicks table (for tracking)
    c.execute('''CREATE TABLE IF NOT EXISTS clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        affiliate_id INTEGER,
        referral_code TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (affiliate_id) REFERENCES affiliates(id)
    )''')
    
    conn.commit()
    conn.close()

def generate_referral_code(name):
    """Generate unique referral code"""
    base = name.lower().replace(' ', '')[:8]
    random_part = secrets.token_hex(4)
    return f"{base}-{random_part}"

# API Routes
@app.route('/api/affiliate/register', methods=['POST'])
def register_affiliate():
    """Register new affiliate"""
    data = request.json
    name = data.get('name')
    email = data.get('email')
    paypal_email = data.get('paypal_email', email)
    
    if not name or not email:
        return jsonify({'error': 'Name and email required'}), 400
    
    referral_code = generate_referral_code(name)
    
    conn = sqlite3.connect('affiliates.db')
    c = conn.cursor()
    
    try:
        c.execute('''INSERT INTO affiliates (name, email, referral_code, paypal_email)
                     VALUES (?, ?, ?, ?)''', 
                  (name, email, referral_code, paypal_email))
        conn.commit()
        affiliate_id = c.lastrowid
        
        return jsonify({
            'success': True,
            'affiliate_id': affiliate_id,
            'referral_code': referral_code,
            'referral_link': f'https://ai-skills-bootcamp-portal.vercel.app/?ref={referral_code}'
        })
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already registered'}), 400
    finally:
        conn.close()

@app.route('/api/affiliate/<int:affiliate_id>')
def get_affiliate(affiliate_id):
    """Get affiliate details and stats"""
    conn = sqlite3.connect('affiliates.db')
    c = conn.cursor()
    
    # Get affiliate info
    c.execute('SELECT * FROM affiliates WHERE id = ?', (affiliate_id,))
    affiliate = c.fetchone()
    
    if not affiliate:
        return jsonify({'error': 'Affiliate not found'}), 404
    
    # Get stats
    c.execute('''SELECT COUNT(*) FROM referrals WHERE affiliate_id = ?''', (affiliate_id,))
    total_referrals = c.fetchone()[0]
    
    c.execute('''SELECT COUNT(*) FROM referrals WHERE affiliate_id = ? AND status = 'converted' ''', 
              (affiliate_id,))
    converted = c.fetchone()[0]
    
    c.execute('''SELECT SUM(commission_amount) FROM commissions WHERE affiliate_id = ? AND status = 'paid' ''',
              (affiliate_id,))
    total_earned = c.fetchone()[0] or 0
    
    c.execute('''SELECT SUM(commission_amount) FROM commissions WHERE affiliate_id = ? AND status = 'pending' ''',
              (affiliate_id,))
    pending = c.fetchone()[0] or 0
    
    c.execute('''SELECT COUNT(*) FROM clicks WHERE affiliate_id = ?''', (affiliate_id,))
    clicks = c.fetchone()[0]
    
    conn.close()
    
    return jsonify({
        'id': affiliate[0],
        'name': affiliate[1],
        'email': affiliate[2],
        'referral_code': affiliate[3],
        'commission_rate': affiliate[4],
        'total_referrals': total_referrals,
        'converted': converted,
        'conversion_rate': round((converted / total_referrals * 100), 2) if total_referrals > 0 else 0,
        'total_earned': round(total_earned, 2),
        'pending_commissions': round(pending, 2),
        'clicks': clicks,
        'referral_link': f'https://ai-skills-bootcamp-portal.vercel.app/?ref={affiliate[3]}'
    })

@app.route('/api/track/click', methods=['POST'])
def track_click():
    """Track affiliate link click"""
    data = request.json
    referral_code = data.get('referral_code')
    ip = request.remote_addr
    user_agent = request.headers.get('User-Agent', '')
    
    conn = sqlite3.connect('affiliates.db')
    c = conn.cursor()
    
    # Get affiliate_id from code
    c.execute('SELECT id FROM affiliates WHERE referral_code = ?', (referral_code,))
    result = c.fetchone()
    
    if result:
        affiliate_id = result[0]
        c.execute('''INSERT INTO clicks (affiliate_id, referral_code, ip_address, user_agent)
                     VALUES (?, ?, ?, ?)''', (affiliate_id, referral_code, ip, user_agent))
        conn.commit()
    
    conn.close()
    return jsonify({'success': True})

@app.route('/api/track/conversion', methods=['POST'])
def track_conversion():
    """Track a conversion (new paying member)"""
    data = request.json
    referral_code = data.get('referral_code')
    customer_email = data.get('customer_email')
    amount = data.get('amount', 0)
    
    conn = sqlite3.connect('affiliates.db')
    c = conn.cursor()
    
    # Get affiliate
    c.execute('SELECT id, commission_rate FROM affiliates WHERE referral_code = ?', (referral_code,))
    result = c.fetchone()
    
    if not result:
        return jsonify({'error': 'Invalid referral code'}), 400
    
    affiliate_id, commission_rate = result
    commission_amount = amount * commission_rate
    
    # Create referral record
    c.execute('''INSERT INTO referrals (affiliate_id, referred_email, referral_code, status, converted_at)
                 VALUES (?, ?, ?, 'converted', CURRENT_TIMESTAMP)''',
              (affiliate_id, customer_email, referral_code))
    referral_id = c.lastrowid
    
    # Create commission
    c.execute('''INSERT INTO commissions (affiliate_id, referral_id, amount, commission_amount)
                 VALUES (?, ?, ?, ?)''',
              (affiliate_id, referral_id, amount, commission_amount))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'commission_earned': round(commission_amount, 2),
        'commission_rate': commission_rate
    })

@app.route('/api/affiliate/<int:affiliate_id>/referrals')
def get_referrals(affiliate_id):
    """Get referral history for affiliate"""
    conn = sqlite3.connect('affiliates.db')
    c = conn.cursor()
    
    c.execute('''SELECT r.*, c.commission_amount, c.status as commission_status
                 FROM referrals r
                 LEFT JOIN commissions c ON r.id = c.referral_id
                 WHERE r.affiliate_id = ?
                 ORDER BY r.created_at DESC''', (affiliate_id,))
    
    referrals = []
    for row in c.fetchall():
        referrals.append({
            'id': row[0],
            'email': row[3],
            'status': row[5],
            'created_at': row[6],
            'converted_at': row[7],
            'commission': round(row[8], 2) if row[8] else 0,
            'commission_status': row[9]
        })
    
    conn.close()
    return jsonify(referrals)

@app.route('/dashboard/<int:affiliate_id>')
def affiliate_dashboard(affiliate_id):
    """Affiliate dashboard HTML"""
    conn = sqlite3.connect('affiliates.db')
    c = conn.cursor()
    
    # Get affiliate stats
    c.execute('SELECT * FROM affiliates WHERE id = ?', (affiliate_id,))
    affiliate = c.fetchone()
    
    if not affiliate:
        return "Affiliate not found", 404
    
    # Get stats (simplified for dashboard)
    c.execute('''SELECT COUNT(*) FROM referrals WHERE affiliate_id = ?''', (affiliate_id,))
    total_referrals = c.fetchone()[0]
    
    c.execute('''SELECT COUNT(*) FROM referrals WHERE affiliate_id = ? AND status = 'converted' ''', 
              (affiliate_id,))
    converted = c.fetchone()[0]
    
    c.execute('''SELECT SUM(commission_amount) FROM commissions WHERE affiliate_id = ? AND status = 'paid' ''',
              (affiliate_id,))
    total_earned = c.fetchone()[0] or 0
    
    c.execute('''SELECT SUM(commission_amount) FROM commissions WHERE affiliate_id = ? AND status = 'pending' ''',
              (affiliate_id,))
    pending = c.fetchone()[0] or 0
    
    conn.close()
    
    html = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Affiliate Dashboard</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', system-ui, sans-serif; 
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); 
                color: #fff; 
                min-height: 100vh;
                padding: 20px;
            }
            .container { max-width: 1200px; margin: 0 auto; }
            .header { text-align: center; padding: 40px 20px; }
            .header h1 { font-size: 2.5rem; background: linear-gradient(90deg, #00d4ff, #7b2cbf); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
            .stat-card { 
                background: rgba(255,255,255,0.05); 
                border: 1px solid rgba(255,255,255,0.1); 
                border-radius: 16px; 
                padding: 25px; 
                text-align: center;
            }
            .stat-value { font-size: 2.5rem; font-weight: 700; color: #00d4ff; }
            .stat-label { color: #888; margin-top: 10px; }
            .referral-box { 
                background: rgba(0,212,255,0.1); 
                border: 2px solid #00d4ff; 
                border-radius: 16px; 
                padding: 30px; 
                margin-bottom: 40px;
                text-align: center;
            }
            .referral-link { 
                background: rgba(0,0,0,0.3); 
                padding: 15px 25px; 
                border-radius: 10px; 
                font-family: monospace; 
                font-size: 1.1rem;
                color: #00d4ff;
                word-break: break-all;
            }
            .copy-btn { 
                margin-top: 15px; 
                padding: 12px 30px; 
                background: linear-gradient(90deg, #00d4ff, #7b2cbf); 
                border: none; 
                color: #fff; 
                border-radius: 10px; 
                cursor: pointer;
                font-size: 1rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Affiliate Dashboard</h1>
                <p style="color: #888; margin-top: 10px;">Welcome back, ''' + affiliate[1] + '''!</p>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-value">''' + str(total_referrals) + '''</div>
                    <div class="stat-label">Total Referrals</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">''' + str(converted) + '''</div>
                    <div class="stat-label">Converted</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">$''' + str(round(total_earned, 2)) + '''</div>
                    <div class="stat-label">Total Earned</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">$''' + str(round(pending, 2)) + '''</div>
                    <div class="stat-label">Pending</div>
                </div>
            </div>
            
            <div class="referral-box">
                <h3 style="margin-bottom: 20px;">Your Referral Link</h3>
                <div class="referral-link">https://ai-skills-bootcamp-portal.vercel.app/?ref=''' + affiliate[3] + '''</div>
                <button class="copy-btn" onclick="copyLink()">Copy Link</button>
            </div>
            
            <div style="text-align: center; color: #888;">
                <p>Commission Rate: 30% recurring on all payments</p>
                <p style="margin-top: 10px;">Payments processed monthly via PayPal</p>
            </div>
        </div>
        
        <script>
            function copyLink() {
                const link = "https://ai-skills-bootcamp-portal.vercel.app/?ref=''' + affiliate[3] + '''";
                navigator.clipboard.writeText(link);
                alert("Link copied!");
            }
        </script>
    </body>
    </html>
    '''
    
    return html

if __name__ == '__main__':
    init_db()
    print("✅ Affiliate System initialized!")
    print("🚀 Starting server on http://localhost:5000")
    app.run(debug=True, port=5000)
