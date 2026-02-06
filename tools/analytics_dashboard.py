#!/usr/bin/env python3
"""
Analytics Dashboard for AI Skills Bootcamp
Tracks member growth, conversions, template usage, revenue
"""
import sqlite3
import json
from datetime import datetime, timedelta
from collections import defaultdict
import os

class AnalyticsDashboard:
    def __init__(self, db_path='analytics.db'):
        self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        """Initialize analytics database"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        # Events table
        c.execute('''CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            user_id TEXT,
            metadata TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        
        # Members table
        c.execute('''CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            plan TEXT,
            signup_date TIMESTAMP,
            last_active TIMESTAMP,
            revenue REAL DEFAULT 0,
            status TEXT DEFAULT 'active'
        )''')
        
        # Template usage
        c.execute('''CREATE TABLE IF NOT EXISTS template_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            template_id TEXT,
            user_id TEXT,
            action TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        
        conn.commit()
        conn.close()
    
    def track_event(self, event_type, user_id=None, metadata=None):
        """Track an event"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        c.execute('''INSERT INTO events (event_type, user_id, metadata)
                     VALUES (?, ?, ?)''',
                  (event_type, user_id, json.dumps(metadata) if metadata else None))
        
        conn.commit()
        conn.close()
    
    def get_growth_metrics(self, days=30):
        """Get member growth metrics"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        # Daily signups
        c.execute('''SELECT DATE(signup_date), COUNT(*) 
                     FROM members 
                     WHERE signup_date >= ?
                     GROUP BY DATE(signup_date)
                     ORDER BY signup_date''', (start_date,))
        
        daily_signups = {row[0]: row[1] for row in c.fetchall()}
        
        # Total members
        c.execute('SELECT COUNT(*) FROM members')
        total_members = c.fetchone()[0]
        
        # Active members (last 7 days)
        c.execute('''SELECT COUNT(DISTINCT user_id) FROM events 
                     WHERE timestamp >= datetime('now', '-7 days')''')
        active_members = c.fetchone()[0]
        
        # By plan
        c.execute('''SELECT plan, COUNT(*) FROM members GROUP BY plan''')
        by_plan = dict(c.fetchall())
        
        conn.close()
        
        return {
            'total_members': total_members,
            'active_members_7d': active_members,
            'daily_signups': daily_signups,
            'by_plan': by_plan,
            'churn_rate': self.calculate_churn(),
            'growth_rate': self.calculate_growth_rate(days)
        }
    
    def get_revenue_metrics(self, days=30):
        """Get revenue metrics"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        # Total revenue
        c.execute('SELECT SUM(revenue) FROM members')
        total_revenue = c.fetchone()[0] or 0
        
        # Monthly recurring revenue (MRR)
        c.execute('''SELECT plan, COUNT(*) FROM members 
                     WHERE status = 'active' GROUP BY plan''')
        
        plan_counts = dict(c.fetchall())
        
        # Plan prices (example)
        prices = {'free': 0, 'pro': 29, 'business': 79, 'elite': 199}
        mrr = sum(plan_counts.get(plan, 0) * price for plan, price in prices.items())
        
        # Revenue by day
        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        c.execute('''SELECT DATE(timestamp) as day, SUM(
                        CASE event_type 
                            WHEN 'subscription_created' THEN 29
                            WHEN 'upgrade' THEN 50
                            ELSE 0 
                        END
                     ) as revenue
                     FROM events
                     WHERE event_type IN ('subscription_created', 'upgrade')
                     AND timestamp >= ?
                     GROUP BY day
                     ORDER BY day''', (start_date,))
        
        daily_revenue = {row[0]: row[1] for row in c.fetchall()}
        
        conn.close()
        
        return {
            'total_revenue': total_revenue,
            'mrr': mrr,
            'arr': mrr * 12,
            'daily_revenue': daily_revenue,
            'average_revenue_per_user': total_revenue / max(1, self.get_total_members()),
            'projected_annual': mrr * 12
        }
    
    def get_conversion_metrics(self):
        """Get funnel conversion metrics"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        # Landing page visits
        c.execute('''SELECT COUNT(*) FROM events WHERE event_type = 'landing_page_view' ''')
        landing_visits = c.fetchone()[0]
        
        # Email captures
        c.execute('''SELECT COUNT(*) FROM events WHERE event_type = 'email_captured' ''')
        email_captures = c.fetchone()[0]
        
        # Free signups
        c.execute('''SELECT COUNT(*) FROM members WHERE plan = 'free' ''')
        free_signups = c.fetchone()[0]
        
        # Pro conversions
        c.execute('''SELECT COUNT(*) FROM members WHERE plan = 'pro' ''')
        pro_conversions = c.fetchone()[0]
        
        conn.close()
        
        return {
            'landing_visits': landing_visits,
            'email_captures': email_captures,
            'free_signups': free_signups,
            'pro_conversions': pro_conversions,
            'landing_to_email': (email_captures / max(1, landing_visits)) * 100,
            'email_to_free': (free_signups / max(1, email_captures)) * 100,
            'free_to_pro': (pro_conversions / max(1, free_signups)) * 100,
            'overall_conversion': (pro_conversions / max(1, landing_visits)) * 100
        }
    
    def get_template_analytics(self):
        """Get template usage analytics"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        # Most used templates
        c.execute('''SELECT template_id, COUNT(*) as uses 
                     FROM template_usage 
                     GROUP BY template_id 
                     ORDER BY uses DESC 
                     LIMIT 10''')
        
        popular_templates = [{'template': row[0], 'uses': row[1]} for row in c.fetchall()]
        
        # Downloads by category
        c.execute('''SELECT metadata->>'category', COUNT(*) 
                     FROM events 
                     WHERE event_type = 'template_download'
                     GROUP BY metadata->>'category' ''')
        
        by_category = dict(c.fetchall())
        
        conn.close()
        
        return {
            'popular_templates': popular_templates,
            'downloads_by_category': by_category,
            'total_downloads': sum(row['uses'] for row in popular_templates)
        }
    
    def get_affiliate_metrics(self):
        """Get affiliate performance"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        # Total affiliates
        c.execute('''SELECT COUNT(*) FROM events WHERE event_type = 'affiliate_signup' ''')
        total_affiliates = c.fetchone()[0]
        
        # Active affiliates (made a referral)
        c.execute('''SELECT COUNT(DISTINCT user_id) FROM events 
                     WHERE event_type = 'referral_conversion' ''')
        active_affiliates = c.fetchone()[0]
        
        # Total commissions
        c.execute('''SELECT SUM(metadata->>'commission') FROM events 
                     WHERE event_type = 'commission_earned' ''')
        total_commissions = c.fetchone()[0] or 0
        
        conn.close()
        
        return {
            'total_affiliates': total_affiliates,
            'active_affiliates': active_affiliates,
            'total_commissions': total_commissions,
            'avg_commission_per_affiliate': total_commissions / max(1, active_affiliates)
        }
    
    def calculate_churn(self):
        """Calculate churn rate"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        c.execute('''SELECT COUNT(*) FROM members 
                     WHERE status = 'cancelled' 
                     AND signup_date >= datetime('now', '-30 days')''')
        churned = c.fetchone()[0]
        
        c.execute('''SELECT COUNT(*) FROM members 
                     WHERE signup_date >= datetime('now', '-30 days')''')
        total = c.fetchone()[0]
        
        conn.close()
        
        return (churned / max(1, total)) * 100
    
    def calculate_growth_rate(self, days=30):
        """Calculate growth rate"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        # Members at start of period
        start_date = (datetime.now() - timedelta(days=days*2)).strftime('%Y-%m-%d')
        c.execute('SELECT COUNT(*) FROM members WHERE signup_date < ?', (start_date,))
        start_count = c.fetchone()[0]
        
        # Members now
        c.execute('SELECT COUNT(*) FROM members')
        end_count = c.fetchone()[0]
        
        conn.close()
        
        if start_count == 0:
            return 100
        
        return ((end_count - start_count) / start_count) * 100
    
    def get_total_members(self):
        """Get total member count"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        c.execute('SELECT COUNT(*) FROM members')
        count = c.fetchone()[0]
        conn.close()
        return count
    
    def generate_report(self):
        """Generate comprehensive analytics report"""
        report = {
            'generated_at': datetime.now().isoformat(),
            'growth': self.get_growth_metrics(),
            'revenue': self.get_revenue_metrics(),
            'conversions': self.get_conversion_metrics(),
            'templates': self.get_template_analytics(),
            'affiliates': self.get_affiliate_metrics()
        }
        
        # Save report
        with open('analytics_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def print_dashboard(self):
        """Print dashboard to console"""
        report = self.generate_report()
        
        print("\n" + "="*60)
        print("📊 AI SKILLS BOOTCAMP - ANALYTICS DASHBOARD")
        print("="*60)
        
        # Growth
        print("\n🚀 GROWTH METRICS")
        print("-" * 40)
        g = report['growth']
        print(f"Total Members: {g['total_members']}")
        print(f"Active (7d): {g['active_members_7d']}")
        print(f"Growth Rate: {g['growth_rate']:.1f}%")
        print(f"Churn Rate: {g['churn_rate']:.1f}%")
        print(f"By Plan: {g['by_plan']}")
        
        # Revenue
        print("\n💰 REVENUE METRICS")
        print("-" * 40)
        r = report['revenue']
        print(f"Total Revenue: ${r['total_revenue']:,.2f}")
        print(f"MRR: ${r['mrr']:,.2f}")
        print(f"ARR: ${r['arr']:,.2f}")
        print(f"ARPU: ${r['average_revenue_per_user']:.2f}")
        
        # Conversions
        print("\n🎯 CONVERSION METRICS")
        print("-" * 40)
        c = report['conversions']
        print(f"Landing Visits: {c['landing_visits']}")
        print(f"Email Captures: {c['email_captures']}")
        print(f"Free Signups: {c['free_signups']}")
        print(f"Pro Conversions: {c['pro_conversions']}")
        print(f"Landing→Email: {c['landing_to_email']:.1f}%")
        print(f"Email→Free: {c['email_to_free']:.1f}%")
        print(f"Free→Pro: {c['free_to_pro']:.1f}%")
        print(f"Overall Conv: {c['overall_conversion']:.2f}%")
        
        # Templates
        print("\n🎨 TEMPLATE ANALYTICS")
        print("-" * 40)
        t = report['templates']
        print(f"Total Downloads: {t['total_downloads']}")
        print("Top Templates:")
        for temp in t['popular_templates'][:5]:
            print(f"  - {temp['template']}: {temp['uses']} uses")
        
        # Affiliates
        print("\n🤝 AFFILIATE METRICS")
        print("-" * 40)
        a = report['affiliates']
        print(f"Total Affiliates: {a['total_affiliates']}")
        print(f"Active Affiliates: {a['active_affiliates']}")
        print(f"Total Commissions: ${a['total_commissions']:,.2f}")
        print(f"Avg/Active: ${a['avg_commission_per_affiliate']:.2f}")
        
        print("\n" + "="*60)
        print("✅ Report saved to: analytics_report.json")
        print("="*60)

if __name__ == '__main__':
    dashboard = AnalyticsDashboard()
    dashboard.print_dashboard()
