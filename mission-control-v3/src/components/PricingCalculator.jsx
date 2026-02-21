import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  DollarSign, 
  Zap, 
  Users, 
  TrendingUp,
  Copy,
  Check,
  Settings,
  RefreshCw,
  Info
} from 'lucide-react';

const MODEL_PRICING = {
  'gpt-4o': { input: 2.5, output: 10, name: 'GPT-4o' },
  'gpt-4o-mini': { input: 0.15, output: 0.6, name: 'GPT-4o Mini' },
  'claude-3-5-sonnet': { input: 3, output: 15, name: 'Claude 3.5 Sonnet' },
  'claude-3-haiku': { input: 0.25, output: 1.25, name: 'Claude 3 Haiku' },
  'gemini-1.5-pro': { input: 1.25, output: 5, name: 'Gemini 1.5 Pro' },
  'gemini-1.5-flash': { input: 0.075, output: 0.3, name: 'Gemini 1.5 Flash' },
  'minimax': { input: 0.1, output: 0.4, name: 'MiniMax M2.5' },
  'custom': { input: 0, output: 0, name: 'Custom Model' }
};

const PRESETS = [
  { name: 'Chatbot', prompts: 1000, tokens: 500, model: 'gpt-4o-mini' },
  { name: 'Content Writer', prompts: 200, tokens: 2000, model: 'gpt-4o' },
  { name: 'Code Assistant', prompts: 500, tokens: 1500, model: 'claude-3-5-sonnet' },
  { name: 'Data Analyzer', prompts: 100, tokens: 5000, model: 'gemini-1.5-pro' },
];

const PricingCalculator = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [config, setConfig] = useState({
    model: 'gpt-4o-mini',
    customInputPrice: 0,
    customOutputPrice: 0,
    dailyActiveUsers: 100,
    promptsPerUser: 10,
    avgInputTokens: 500,
    avgOutputTokens: 1000,
    margin: 30,
    hostingCost: 49,
    otherCosts: 0
  });
  
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState(false);
  const [embedCode, setEmbedCode] = useState('');

  useEffect(() => {
    calculatePricing();
  }, [config]);

  useEffect(() => {
    generateEmbedCode();
  }, [results, config]);

  const calculatePricing = () => {
    const model = config.model === 'custom' 
      ? { input: config.customInputPrice, output: config.customOutputPrice }
      : MODEL_PRICING[config.model];

    const totalDailyCalls = config.dailyActiveUsers * config.promptsPerUser;
    const dailyInputTokens = totalDailyCalls * config.avgInputTokens;
    const dailyOutputTokens = totalDailyCalls * config.avgOutputTokens;
    
    // Calculate daily AI costs (price is per 1M tokens)
    const dailyAICost = (
      (dailyInputTokens * model.input / 1000000) +
      (dailyOutputTokens * model.output / 1000000)
    );
    
    const monthlyAICost = dailyAICost * 30;
    const monthlyHosting = config.hostingCost;
    const monthlyOther = config.otherCosts;
    const totalMonthlyCost = monthlyAICost + monthlyHosting + monthlyOther;
    
    // Apply margin to get final price
    const markup = 1 + (config.margin / 100);
    const finalMonthlyPrice = totalMonthlyCost * markup;
    
    // Per-user pricing
    const pricePerUser = finalMonthlyPrice / config.dailyActiveUsers;
    
    // Revenue projections
    const revenue10Users = finalMonthlyPrice * 10;
    const revenue50Users = finalMonthlyPrice * 50;
    const revenue100Users = finalMonthlyPrice * 100;
    
    setResults({
      modelName: model.name,
      dailyAICost: dailyAICost.toFixed(2),
      monthlyAICost: monthlyAICost.toFixed(2),
      totalMonthlyCost: totalMonthlyCost.toFixed(2),
      finalMonthlyPrice: finalMonthlyPrice.toFixed(2),
      pricePerUser: pricePerUser.toFixed(2),
      revenue10: revenue10Users.toFixed(2),
      revenue50: revenue50Users.toFixed(2),
      revenue100: revenue100Users.toFixed(2),
      margin: config.margin,
      breakEven: Math.ceil(totalMonthlyCost / pricePerUser)
    });
  };

  const generateEmbedCode = () => {
    if (!results) return;
    const code = `<!-- AI Pricing Widget -->
<div id="ai-pricing-widget" data-price="${results.finalMonthlyPrice}" data-users="${config.dailyActiveUsers}"></div>
<script src="https://your-domain.com/pricing-widget.js"></script>`;
    setEmbedCode(code);
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset) => {
    setConfig(prev => ({
      ...prev,
      model: preset.model,
      promptsPerUser: preset.prompts,
      avgInputTokens: preset.tokens,
      avgOutputTokens: preset.tokens * 2
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Calculator className="w-6 h-6 text-gold" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">
              AI Pricing <span className="text-gold">Calculator</span>
            </h1>
          </div>
          <p className="text-white/50 font-mono text-sm">
            Dynamic pricing for AI services based on token economics
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'calculator', label: 'Calculator' },
            { id: 'tiers', label: 'Pricing Tiers' },
            { id: 'embed', label: 'Embed Code' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-mono text-sm uppercase tracking-wider transition-all ${
                activeTab === tab.id 
                  ? 'bg-gold text-black' 
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Presets */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-3">
                Quick Presets
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/50 rounded text-sm text-white/70 hover:text-gold transition-all"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-3">
                AI Model
              </h3>
              <select
                value={config.model}
                onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white font-mono text-sm focus:border-gold outline-none"
              >
                {Object.entries(MODEL_PRICING).map(([key, model]) => (
                  <option key={key} value={key}>
                    {model.name} (${model.input}/1M in, ${model.output}/1M out)
                  </option>
                ))}
              </select>
              
              {config.model === 'custom' && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-xs text-white/40 font-mono">Input $/1M</label>
                    <input
                      type="number"
                      value={config.customInputPrice}
                      onChange={(e) => setConfig(prev => ({ ...prev, customInputPrice: parseFloat(e.target.value) }))}
                      className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white font-mono text-sm mt-1"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 font-mono">Output $/1M</label>
                    <input
                      type="number"
                      value={config.customOutputPrice}
                      onChange={(e) => setConfig(prev => ({ ...prev, customOutputPrice: parseFloat(e.target.value) }))}
                      className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white font-mono text-sm mt-1"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Usage Parameters */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-3">
                Usage Parameters
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 font-mono flex items-center gap-1">
                    <Users className="w-3 h-3" /> Daily Active Users
                  </label>
                  <input
                    type="number"
                    value={config.dailyActiveUsers}
                    onChange={(e) => setConfig(prev => ({ ...prev, dailyActiveUsers: parseInt(e.target.value) }))}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white font-mono text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 font-mono flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Prompts per User
                  </label>
                  <input
                    type="number"
                    value={config.promptsPerUser}
                    onChange={(e) => setConfig(prev => ({ ...prev, promptsPerUser: parseInt(e.target.value) }))}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white font-mono text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 font-mono">Avg Input Tokens</label>
                  <input
                    type="number"
                    value={config.avgInputTokens}
                    onChange={(e) => setConfig(prev => ({ ...prev, avgInputTokens: parseInt(e.target.value) }))}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white font-mono text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 font-mono">Avg Output Tokens</label>
                  <input
                    type="number"
                    value={config.avgOutputTokens}
                    onChange={(e) => setConfig(prev => ({ ...prev, avgOutputTokens: parseInt(e.target.value) }))}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white font-mono text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Business Parameters */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-3">
                Business Parameters
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 font-mono flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Margin %
                  </label>
                  <input
                    type="number"
                    value={config.margin}
                    onChange={(e) => setConfig(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white font-mono text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 font-mono flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Hosting $/mo
                  </label>
                  <input
                    type="number"
                    value={config.hostingCost}
                    onChange={(e) => setConfig(prev => ({ ...prev, hostingCost: parseFloat(e.target.value) }))}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white font-mono text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 font-mono">Other $/mo</label>
                  <input
                    type="number"
                    value={config.otherCosts}
                    onChange={(e) => setConfig(prev => ({ ...prev, otherCosts: parseFloat(e.target.value) }))}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white font-mono text-sm mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Main Result */}
                <div className="bg-gradient-to-br from-gold/20 to-transparent border border-gold/30 rounded-lg p-6">
                  <div className="text-center">
                    <p className="font-mono text-xs text-gold/60 uppercase tracking-wider mb-2">
                      Recommended Monthly Price
                    </p>
                    <p className="text-5xl font-black text-gold tracking-tighter">
                      ${results.finalMonthlyPrice}
                    </p>
                    <p className="text-white/40 font-mono text-sm mt-2">
                      ${results.pricePerUser} per user • {results.margin}% margin
                    </p>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-4">
                    Cost Breakdown (Monthly)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 font-mono text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" /> AI Costs ({results.modelName})
                      </span>
                      <span className="text-white font-mono font-bold">${results.monthlyAICost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 font-mono text-sm flex items-center gap-2">
                        <Settings className="w-4 h-4 text-blue-500" /> Hosting + Other
                      </span>
                      <span className="text-white font-mono font-bold">${(config.hostingCost + config.otherCosts).toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-white/40 font-mono text-sm">Total Cost</span>
                      <span className="text-white font-mono font-bold">${results.totalMonthlyCost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gold/60 font-mono text-sm">Your Margin ({results.margin}%)</span>
                      <span className="text-gold font-mono font-bold">
                        ${(results.finalMonthlyPrice - results.totalMonthlyCost).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Revenue Projections */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-4">
                    Revenue Projections
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded">
                      <p className="text-white/40 font-mono text-xs mb-1">10 Users</p>
                      <p className="text-green-400 font-black text-xl">${results.revenue10}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded">
                      <p className="text-white/40 font-mono text-xs mb-1">50 Users</p>
                      <p className="text-green-400 font-black text-xl">${results.revenue50}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded">
                      <p className="text-white/40 font-mono text-xs mb-1">100 Users</p>
                      <p className="text-green-400 font-black text-xl">${results.revenue100}</p>
                    </div>
                  </div>
                </div>

                {/* Break-even */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-gold" />
                    <span className="font-mono text-xs text-white/40 uppercase">Break-even Point</span>
                  </div>
                  <p className="text-white font-mono">
                    You need <span className="text-gold font-bold">{results.breakEven}</span> paying users to break even
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Embed Code Section */}
        {activeTab === 'embed' && results && (
          <div className="mt-6 bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-sm text-white/60 uppercase tracking-wider">
                Embeddable Pricing Widget
              </h3>
              <button
                onClick={copyEmbedCode}
                className="flex items-center gap-2 px-3 py-1.5 bg-gold/20 hover:bg-gold/30 border border-gold/50 rounded text-gold text-sm font-mono transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-black border border-white/20 rounded p-4 text-white/60 font-mono text-xs overflow-x-auto">
              {embedCode}
            </pre>
          </div>
        )}

        {/* Pricing Tiers Section */}
        {activeTab === 'tiers' && results && (
          <div className="mt-6">
            <h3 className="font-mono text-sm text-white/60 uppercase tracking-wider mb-4">
              Suggested Pricing Tiers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Starter */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-green-500/50 transition-all">
                <h4 className="text-lg font-bold text-white mb-2">Starter</h4>
                <p className="text-3xl font-black text-green-400 mb-4">
                  ${Math.round(results.finalMonthlyPrice * 0.5)}
                  <span className="text-sm font-mono text-white/40">/mo</span>
                </p>
                <ul className="space-y-2 text-white/60 font-mono text-sm">
                  <li>• {Math.round(config.dailyActiveUsers * 0.2)} users</li>
                  <li>• {Math.round(config.promptsPerUser * 0.5)} prompts/day</li>
                  <li>• Basic support</li>
                </ul>
              </div>

              {/* Pro */}
              <div className="bg-gold/10 border border-gold/30 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-gold text-black text-xs font-bold font-mono rounded">POPULAR</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Pro</h4>
                <p className="text-3xl font-black text-gold mb-4">
                  ${results.finalMonthlyPrice}
                  <span className="text-sm font-mono text-white/40">/mo</span>
                </p>
                <ul className="space-y-2 text-white/60 font-mono text-sm">
                  <li>• {config.dailyActiveUsers} users</li>
                  <li>• {config.promptsPerUser} prompts/day</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              {/* Enterprise */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-purple-500/50 transition-all">
                <h4 className="text-lg font-bold text-white mb-2">Enterprise</h4>
                <p className="text-3xl font-black text-purple-400 mb-4">
                  ${Math.round(results.finalMonthlyPrice * 3)}
                  <span className="text-sm font-mono text-white/40">/mo</span>
                </p>
                <ul className="space-y-2 text-white/60 font-mono text-sm">
                  <li>• Unlimited users</li>
                  <li>• Unlimited prompts</li>
                  <li>• Dedicated support</li>
                  <li>• Custom integrations</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;
