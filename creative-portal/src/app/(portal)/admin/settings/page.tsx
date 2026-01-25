'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-[1000px] mx-auto text-white">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-2">System Configuration</h1>
        <p className="text-gray-400">Manage your admin credentials and ecosystem preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Card */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#F96F6E]">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Admin Profile</h3>
              <p className="text-sm text-gray-500">Public identity within the ecosystem</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-400">Full Name</Label>
              <Input defaultValue="Luis Gilberto" className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Email Address</Label>
              <Input defaultValue="admin@luis-gilberto.com" disabled className="bg-white/5 border-white/10 text-gray-500 cursor-not-allowed" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
             <Button variant="outline" className="border-white/10 hover:bg-white/5 text-gray-300">Save Changes</Button>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-teal-400">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Security</h3>
              <p className="text-sm text-gray-500">Password and authentication settings</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 justify-start gap-3">
              <Lock size={16} /> Change Master Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
