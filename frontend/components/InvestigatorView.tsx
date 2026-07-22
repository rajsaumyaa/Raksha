'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Network, 
  ShieldAlert, 
  PhoneCall, 
  CreditCard, 
  Users, 
  AlertTriangle, 
  Search, 
  Layers, 
  Maximize2, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function InvestigatorView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<any>(null);

  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const fetchGraphData = async () => {
    setLoading(true);
    setError(null);
    const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${apiBase}/api/graph`);
      if (!res.ok) {
        throw new Error('Failed to fetch fraud network graph data.');
      }
      const data = await res.json();
      setGraphData(data);
      if (data.clusters && data.clusters.length > 0) {
        setSelectedCluster(data.clusters[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to backend database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  useEffect(() => {
    if (!graphData || !containerRef.current) return;

    let visNetworkModule: any;
    let isCancelled = false;

    import('vis-network/standalone').then((vis) => {
      if (isCancelled || !containerRef.current) return;

      const nodesFiltered = activeFilter === 'all' 
        ? graphData.nodes 
        : graphData.nodes.filter((n: any) => n.group === activeFilter);

      const nodeIds = new Set(nodesFiltered.map((n: any) => n.id));

      const edgesFiltered = graphData.edges.filter(
        (e: any) => nodeIds.has(e.source) && nodeIds.has(e.target)
      );

      const visNodes = nodesFiltered.map((n: any) => ({
        id: n.id,
        label: `Inc #${n.id}`,
        title: `<b>${n.claimed_authority || 'Unknown Entity'}</b><br/>Score: ${n.risk_score}<br/>${n.snippet}`,
        color: {
          background: n.color,
          border: '#ffffff',
          highlight: { background: '#ffffff', border: n.color }
        },
        shape: 'dot',
        size: 16 + (n.risk_score / 10),
        font: { color: '#f8fafc', size: 12, strokeWidth: 3, strokeColor: '#0f172a' }
      }));

      const visEdges = edgesFiltered.map((e: any) => ({
        from: e.source,
        to: e.target,
        title: e.reason,
        color: { color: '#475569', highlight: '#38bdf8' },
        width: 2.5
      }));

      const options: any = {
        nodes: {
          borderWidth: 2,
          shadow: true
        },
        edges: {
          smooth: { enabled: true, type: 'continuous', roundness: 0.5 }
        },
        physics: {
          stabilization: true,
          barnesHut: {
            gravitationalConstant: -3000,
            springLength: 120,
            springConstant: 0.04
          }
        },
        interaction: {
          hover: true,
          tooltipDelay: 100
        }
      };

      if (networkRef.current) {
        networkRef.current.destroy();
      }

      const net = new vis.Network(
        containerRef.current, 
        { nodes: visNodes, edges: visEdges }, 
        options
      );

      net.on('click', (params: any) => {
        if (params.nodes.length > 0) {
          const nid = params.nodes[0];
          const nodeObj = graphData.nodes.find((n: any) => n.id === nid);
          setSelectedNode(nodeObj);
          
          if (nodeObj) {
            const parentCluster = graphData.clusters.find((c: any) => c.id === nodeObj.group);
            if (parentCluster) setSelectedCluster(parentCluster);
          }
        } else {
          setSelectedNode(null);
        }
      });

      networkRef.current = net;
    });

    return () => {
      isCancelled = true;
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [graphData, activeFilter]);

  const handleClusterSelect = (cluster: any) => {
    setSelectedCluster(cluster);
    setSelectedNode(null);
    setActiveFilter(cluster.id);
  };

  const handleResetFilter = () => {
    setActiveFilter('all');
    if (graphData?.clusters?.length > 0) {
      setSelectedCluster(graphData.clusters[0]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              RakshaGraph Fraud Network Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800/60">
              Investigator View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time clustering of isolated citizen complaints into organized digital arrest scam syndicates.
          </p>
        </div>

        <button
          onClick={fetchGraphData}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Intelligence</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Flagged Complaints</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {graphData?.nodes?.length || 0}
          </div>
          <div className="text-[11px] text-slate-400">Medium & High Risk</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Fraud Rings Clustered</span>
            <Network className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400 font-mono">
            {graphData?.clusters?.length || 0}
          </div>
          <div className="text-[11px] text-slate-400">Via NetworkX Graph</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Inter-Incident Edges</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {graphData?.edges?.length || 0}
          </div>
          <div className="text-[11px] text-slate-400">Shared Indicator Overlaps</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Surveillance Status</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ACTIVE
          </div>
          <div className="text-[11px] text-slate-400">Multi-Vector Analysis</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          Syndicate Filter:
        </span>
        <button
          onClick={handleResetFilter}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            activeFilter === 'all'
              ? 'bg-slate-200 text-slate-900 border-white shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          All Fraud Rings ({graphData?.nodes?.length || 0})
        </button>
        {graphData?.clusters?.map((c: any) => (
          <button
            key={c.id}
            onClick={() => handleClusterSelect(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-2 ${
              activeFilter === c.id
                ? 'bg-slate-800 text-white border-slate-600 shadow-md'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            <span>{c.name}</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded bg-slate-950 text-slate-300 font-mono">
              {c.incident_count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 glass-panel rounded-2xl p-4 border border-slate-800 relative min-h-[550px] flex flex-col">
          <div className="flex items-center justify-between px-2 pb-3 border-b border-slate-800/80 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Force-Directed Graph Topology</span>
            <span className="text-[11px] italic">Click any node to inspect incident details</span>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center space-y-3 flex-col">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
              <span className="text-xs text-slate-400 font-mono">Running NetworkX Clustering...</span>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-red-400 text-xs p-6 text-center">
              {error}
            </div>
          ) : (
            <div ref={containerRef} className="flex-1 w-full h-full min-h-[500px] rounded-xl bg-slate-950/60" />
          )}

          <div className="absolute bottom-6 left-6 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 space-y-1 pointer-events-none">
            <div className="font-semibold text-slate-300">Graph Legend</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span>Node = Flagged Scam Complaint</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-slate-500 inline-block" />
              <span>Edge = Shared Indicator (Phone / UPI / Script)</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          
          {selectedCluster && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0" 
                      style={{ backgroundColor: selectedCluster.color }} 
                    />
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {selectedCluster.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {selectedCluster.id} • {selectedCluster.incident_count} Linked Citizen Complaints
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                    <span>Shared Syndicate Phone Numbers</span>
                  </div>
                  {selectedCluster.shared_phones?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCluster.shared_phones.map((p: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 font-mono text-xs border border-blue-800/60 font-semibold">
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">None shared across ring</span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Shared Syndicate UPI Accounts</span>
                  </div>
                  {selectedCluster.shared_upis?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCluster.shared_upis.map((u: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 font-mono text-xs border border-amber-800/60 font-semibold">
                          {u}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">None shared across ring</span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Claimed Government Entities
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCluster.claimed_authorities?.map((auth: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                        {auth}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Key Operating Script Indicators
                  </div>
                  <div className="space-y-1.5">
                    {selectedCluster.key_indicators?.slice(0, 4).map((ind: string, idx: number) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedNode && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-bold text-red-300 uppercase tracking-wider">
                    <span>Inspecting Selected Node #{selectedNode.id}</span>
                    <span>Score: {selectedNode.risk_score}/100</span>
                  </div>
                  <div className="text-xs text-slate-200 font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    &quot;{selectedNode.snippet}&quot;
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
