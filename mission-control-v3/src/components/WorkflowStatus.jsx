import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Loader2, Check, X } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';

const formatTime = (ts) => {
  if (!ts) return '';
  const now = Date.now();
  const diff = Math.floor((now - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  return `${Math.floor(diff/3600)}h ago`;
};

const WorkflowCard = ({ run, id }) => {
  const steps = run.steps || {};
  const stepOrder = ['analyze', 'plan', 'implement', 'verify', 'test'];
  
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl mb-2">
      <div className="flex items-center gap-3">
        {run.status === 'running' ? (
          <Loader2 size={16} className="text-purple-400 animate-spin" />
        ) : run.status === 'completed' ? (
          <Check size={16} className="text-green-400" />
        ) : (
          <X size={16} className="text-red-400" />
        )}
        <div>
          <p className="text-sm font-bold text-white">{run.task}</p>
          <p className="text-[10px] text-white/40">{run.status} • {run.workflow}</p>
        </div>
      </div>
      <span className="text-[10px] text-white/30 font-mono">{formatTime(run.updated)}</span>
    </div>
  );
};

const WorkflowSection = () => {
  const [workflows, setWorkflows] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase for real-time updates
    const workflowsRef = ref(database, 'workflows');
    const unsubscribe = onValue(workflowsRef, (snapshot) => {
      const data = snapshot.val();
      setWorkflows(data || {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const workflowList = Object.entries(workflows).reverse();

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Custom Workflows</h3>
        <a 
          href="https://custom-workflows-dusky.vercel.app" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-green-400 flex items-center gap-1 cursor-pointer hover:text-green-300"
        >
          <Radio size={12} className="animate-pulse" />
          Live
        </a>
      </div>
      <div className="glass p-4 rounded-2xl border border-white/5">
        {loading ? (
          <div className="text-center py-4">
            <Loader2 size={20} className="animate-spin mx-auto text-white/40" />
          </div>
        ) : workflowList.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-white/40 text-sm">No workflows running</p>
            <p className="text-white/20 text-xs mt-1">Start via API</p>
          </div>
        ) : (
          workflowList.slice(0, 4).map(([id, run]) => (
            <a 
              key={id} 
              href="https://custom-workflows-dusky.vercel.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <WorkflowCard run={run} id={id} />
            </a>
          ))
        )}
        {workflowList.length > 0 && (
          <>
            <div className="flex gap-1 mt-3">
              {['analyze', 'plan', 'implement', 'verify', 'test'].map((step, i) => {
                const latest = workflowList[0]?.[1];
                const status = latest?.steps?.[step] || 'pending';
                return (
                  <div 
                    key={step} 
                    className={`flex-1 h-1.5 rounded-full ${
                      status === 'completed' ? 'bg-green-400' : 
                      status === 'running' ? 'bg-purple-400' : 'bg-white/10'
                    }`} 
                  />
                );
              })}
            </div>
            <p className="text-[10px] text-white/30 mt-2 text-center">analyze → plan → implement → verify → test</p>
          </>
        )}
      </div>
    </motion.div>
  );
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default WorkflowSection;
