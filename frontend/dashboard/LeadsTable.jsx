import React, { useEffect, useState } from 'react';

function getBadge(score) {
  if (score >= 6) return <span style={{color:'white',background:'red',padding:'2px 8px',borderRadius:4}}>HOT</span>;
  if (score >= 3) return <span style={{color:'white',background:'orange',padding:'2px 8px',borderRadius:4}}>WARM</span>;
  return <span style={{color:'white',background:'gray',padding:'2px 8px',borderRadius:4}}>COLD</span>;
}

export default function LeadsTable() {
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/leads`)
      .then(res => res.json())
      .then(data => setLeads(data.leads || []));
  }, []);

  return (
    <div style={{padding:32}}>
      <h2>Leads</h2>
      <table border="1" cellPadding="8" style={{width:'100%',marginBottom:24}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Budget</th>
            <th>Location</th>
            <th>Lead Score</th>
            <th>Agent</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.budget}</td>
              <td>{lead.location}</td>
              <td>{lead.lead_score}</td>
              <td>{lead.assigned_agent}</td>
              <td>{getBadge(lead.lead_score)}</td>
              <td><button onClick={()=>setSelected(lead)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && <LeadDetail lead={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}

function LeadDetail({lead, onClose}) {
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/match-properties`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(lead)
    })
      .then(res => res.json())
      .then(data => setMatches(data.matches || []));
  }, [lead]);
  return (
    <div style={{background:'#fff',border:'1px solid #ccc',padding:24,marginTop:16}}>
      <h3>Lead Details</h3>
      <pre>{JSON.stringify(lead,null,2)}</pre>
      <h4>Matched Properties</h4>
      <div style={{display:'flex',gap:16}}>
        {matches.map(p => (
          <div key={p.property_id} style={{border:'1px solid #eee',padding:12,borderRadius:8,minWidth:220}}>
            <b>{p.title}</b><br/>
            {p.bedrooms}BR | {p.area_sqft} sqft<br/>
            <b>{p.price_aed} AED</b><br/>
            <span>{p.features.join(', ')}</span><br/>
            <span>Agent: {p.agent_name}</span>
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{marginTop:16}}>Close</button>
    </div>
  );
}
