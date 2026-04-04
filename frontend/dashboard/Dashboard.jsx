import React from 'react';
import LeadsTable from './LeadsTable';

export default function Dashboard() {
  return (
    <div style={{fontFamily:'sans-serif',background:'#f7f7f7',minHeight:'100vh'}}>
      <h1 style={{textAlign:'center',padding:24}}>Dubai Real Estate CRM Dashboard</h1>
      <LeadsTable />
    </div>
  );
}
