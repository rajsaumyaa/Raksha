import networkx as nx
from typing import List, Dict, Any

CLUSTER_COLORS = [
    "#ef4444",
    "#f97316",
    "#a855f7",
    "#06b6d4",
    "#10b981",
    "#6366f1",
    "#ec4899",
    "#84cc16"
]

def build_fraud_graph(incidents: List[Any]) -> Dict[str, Any]:
    G = nx.Graph()
    
    inc_map = {}
    for inc in incidents:
        inc_id = inc.id
        inc_map[inc_id] = inc
        G.add_node(
            inc_id,
            id=inc_id,
            risk_score=inc.risk_score,
            risk_level=inc.risk_level,
            claimed_authority=inc.claimed_authority or "Unknown",
            phone_numbers=inc.phone_numbers or [],
            upi_ids=inc.upi_ids or [],
            indicators=inc.indicators or [],
            snippet=inc.transcript[:80] + "..." if len(inc.transcript) > 80 else inc.transcript
        )

    inc_list = list(incidents)
    edges_data = []

    for i in range(len(inc_list)):
        for j in range(i + 1, len(inc_list)):
            a = inc_list[i]
            b = inc_list[j]
            
            reasons = []
            
            a_phones = set(a.phone_numbers or [])
            b_phones = set(b.phone_numbers or [])
            shared_p = a_phones.intersection(b_phones)
            if shared_p:
                reasons.append(f"Phone: {', '.join(shared_p)}")
                
            a_upis = set(a.upi_ids or [])
            b_upis = set(b.upi_ids or [])
            shared_u = a_upis.intersection(b_upis)
            if shared_u:
                reasons.append(f"UPI: {', '.join(shared_u)}")
                
            if a.claimed_authority and b.claimed_authority:
                if a.claimed_authority.strip().lower() == b.claimed_authority.strip().lower() and a.claimed_authority.strip().lower() not in ["unknown", "none"]:
                    reasons.append(f"Authority: {a.claimed_authority}")
                    
            a_ind = set(a.indicators or [])
            b_ind = set(b.indicators or [])
            shared_ind = a_ind.intersection(b_ind)
            if len(shared_ind) >= 2:
                reasons.append(f"Indicators ({len(shared_ind)} matched)")
                
            if reasons:
                reason_str = " | ".join(reasons)
                G.add_edge(a.id, b.id, reason=reason_str)
                edges_data.append({
                    "source": a.id,
                    "target": b.id,
                    "reason": reason_str
                })

    components = sorted(list(nx.connected_components(G)), key=len, reverse=True)
    
    node_cluster_map = {}
    clusters_data = []

    for idx, comp in enumerate(components):
        cluster_id = f"ring_{idx + 1}"
        color = CLUSTER_COLORS[idx % len(CLUSTER_COLORS)]
        
        comp_incidents = [inc_map[nid] for nid in comp]
        
        all_phones = set()
        all_upis = set()
        all_auths = set()
        all_inds = set()
        
        for inc in comp_incidents:
            node_cluster_map[inc.id] = {
                "group": cluster_id,
                "color": color
            }
            if inc.phone_numbers:
                all_phones.update(inc.phone_numbers)
            if inc.upi_ids:
                all_upis.update(inc.upi_ids)
            if inc.claimed_authority:
                all_auths.add(inc.claimed_authority)
            if inc.indicators:
                all_inds.update(inc.indicators)
                
        primary_auth = list(all_auths)[0] if all_auths else "Scam Operation"
        cluster_name = f"Fraud Ring {idx + 1} ({primary_auth} Syndicate)"
        
        clusters_data.append({
            "id": cluster_id,
            "name": cluster_name,
            "color": color,
            "incident_count": len(comp),
            "shared_phones": list(all_phones),
            "shared_upis": list(all_upis),
            "claimed_authorities": list(all_auths),
            "key_indicators": list(all_inds),
            "incidents": list(comp)
        })

    nodes_data = []
    for nid, d in G.nodes(data=True):
        c_info = node_cluster_map.get(nid, {"group": "ring_0", "color": "#94a3b8"})
        nodes_data.append({
            "id": d["id"],
            "label": f"Inc #{d['id']}",
            "group": c_info["group"],
            "color": c_info["color"],
            "risk_score": d["risk_score"],
            "risk_level": d["risk_level"],
            "claimed_authority": d["claimed_authority"],
            "phone_numbers": d["phone_numbers"],
            "upi_ids": d["upi_ids"],
            "indicators": d["indicators"],
            "snippet": d["snippet"]
        })

    return {
        "nodes": nodes_data,
        "edges": edges_data,
        "clusters": clusters_data
    }
