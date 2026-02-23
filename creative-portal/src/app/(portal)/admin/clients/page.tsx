'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Globe, Mail, ArrowRight, Trash2, RefreshCw } from 'lucide-react';
import { AddClientModal } from '@/components/admin/add-client-modal';
import { useToast } from '@/components/providers/toast-provider';
import { CopyId } from '@/components/shared/CopyId';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast("ERROR", "Failed to load client directory.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This will remove all associated projects and assessments.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/clients?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast("CLIENT REMOVED", "Client and all associated data purged.", "success");
        fetchClients();
      } else {
        throw new Error('Failed to delete client');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast("ERROR", "Failed to delete client record.", "error");
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 italic uppercase tracking-wider">Client Directory</h1>
          <p className="text-gray-400 font-inter">Access client intelligence, contact details, and project history.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            onClick={fetchClients} 
            disabled={isLoading}
            className="text-white/40 hover:text-white"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
          <AddClientModal onClientAdded={fetchClients} />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw size={32} className="animate-spin text-teal" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5 flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-6">No clients found in the directory.</p>
          {/* Task 2: Empty State Enhancement */}
          <AddClientModal 
            onClientAdded={fetchClients}
            trigger={
              <Button variant="outline" className="border-[#F96F6E] text-[#F96F6E] hover:bg-[#F96F6E] hover:text-[#050505] font-bold uppercase tracking-wider">
                Create your first client record
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="group bg-[#0A0A0A] border border-white/5 p-6 rounded-xl hover:border-[#F96F6E]/50 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-[#F96F6E]">
                    <Building2 size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{client.name}</h3>
                    <CopyId id={client.id} label="ID" truncate />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                    client.status === 'Active' ? 'border-teal-500/20 text-teal-400' : 'border-white/10 text-gray-500'
                  }`}>
                    {client.status}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 text-white/20 hover:text-coral hover:bg-coral/10"
                    onClick={() => handleDeleteClient(client.id, client.name)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">{client.company || 'No Company'}</p>
              
              <div className="space-y-3 border-t border-white/5 pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Mail size={14} /> {client.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Globe size={14} /> Intelligence Ready
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#F96F6E] hover:bg-[#F96F6E]/10 p-0 h-auto group-hover:gap-2 transition-all"
                  onClick={() => window.location.href = `/admin/clients/${client.id}`}
                >
                  View Intelligence <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
