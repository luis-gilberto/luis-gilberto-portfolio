'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Mock Data (Placeholder for database)
const documents = [
  { id: 1, name: 'MSA_Signed_v2.pdf', type: 'Contract', date: 'Oct 24, 2023', size: '2.4 MB' },
  { id: 2, name: 'Invoice_#1024_Deposit.pdf', type: 'Invoice', date: 'Oct 24, 2023', size: '145 KB' },
  { id: 3, name: 'Brand_Strategy_Deck_vF.pdf', type: 'Deliverable', date: 'Nov 12, 2023', size: '12.8 MB' },
  { id: 4, name: 'Q4_Campaign_Assets.zip', type: 'Asset', date: 'Nov 15, 2023', size: '156 MB' },
  { id: 5, name: 'ScopeIQ_Results.pdf', type: 'Report', date: 'Nov 20, 2023', size: '1.2 MB' },
]

export default function DocumentsPage() {
  const { data: session } = useSession()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[var(--coral)] uppercase mb-2 block">
            Asset Library
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] font-big-shoulders uppercase">
            Documents
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 max-w-2xl">
            Securely access your contracts, invoices, and final deliverables.
          </p>
        </div>
        
        <Button className="bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--coral)] hover:text-white transition-all font-bold uppercase tracking-wide px-8 rounded-full h-12 shadow-lg">
          Upload New File
        </Button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div 
            key={doc.id} 
            className="group p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] hover:border-[var(--coral)] hover:-translate-y-1 transition-all duration-300 flex flex-col" 
          > 
            <div className="flex justify-between items-start mb-4"> 
              <div className="w-12 h-12 rounded-lg bg-[var(--bg-alt)] border border-[var(--border-strong)] flex items-center justify-center text-2xl shadow-inner"> 
                {doc.type === 'Invoice' ? '💰' : doc.type === 'Contract' ? '📜' : doc.type === 'Asset' ? '📦' : '📄'} 
              </div> 
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[var(--bg-alt)] text-[var(--text-secondary)] border border-[var(--border-subtle)] uppercase tracking-wider"> 
                {doc.type} 
              </span> 
            </div> 
            
            <h3 className="text-lg font-bold text-[var(--text-primary)] font-inter mb-1 truncate" title={doc.name}> 
              {doc.name} 
            </h3> 
            
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-auto pt-4 border-t border-[var(--border-subtle)]"> 
              <span>{doc.date}</span> 
              <span>{doc.size}</span> 
            </div> 
            
            <div className="mt-4 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"> 
               <Button variant="outline" size="sm" className="w-full text-xs border-[var(--border-strong)] hover:border-[var(--coral)] hover:text-[var(--coral)] bg-transparent"> 
                 Preview 
               </Button> 
               <Button size="sm" className="w-full text-xs bg-[var(--coral)] hover:bg-[#e55a5a] text-white border-0"> 
                 Download 
               </Button> 
            </div> 
          </div> 
        ))} 
        
        {/* Add New Placeholder Card */} 
        <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-center min-h-[240px] hover:border-[var(--coral)] hover:bg-[var(--bg-alt)] transition-all cursor-pointer group"> 
            <div className="w-12 h-12 rounded-full bg-[var(--bg-alt)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"> 
                <span className="text-2xl text-[var(--text-muted)] group-hover:text-[var(--coral)]">+</span> 
            </div> 
            <p className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Request New Asset</p> 
        </div> 
      </div> 
    </div> 
  ) 
}
