import { Command } from 'cmdk';
import { Search, FileText, Users, BarChart3, Settings } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-surface border-border max-w-2xl">
        <Command className="bg-transparent">
          <div className="flex items-center border-b border-border px-4">
            <Search className="w-5 h-5 text-text-tertiary mr-3" strokeWidth={1.5} />
            <Command.Input
              placeholder="Search projects, clients, tasks..."
              className="flex-1 bg-transparent border-0 py-4 text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          </div>
          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-text-tertiary text-sm">
              No results found.
            </Command.Empty>
            <Command.Group heading="Quick Actions" className="text-text-tertiary text-xs font-medium px-2 py-2">
              <Command.Item className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-text-primary hover:bg-muted transition-colors">
                <FileText className="w-4 h-4" strokeWidth={1.5} />
                <span>New Project</span>
              </Command.Item>
              <Command.Item className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-text-primary hover:bg-muted transition-colors">
                <Users className="w-4 h-4" strokeWidth={1.5} />
                <span>Add Client</span>
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Navigation" className="text-text-tertiary text-xs font-medium px-2 py-2 mt-2">
              <Command.Item className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-text-primary hover:bg-muted transition-colors">
                <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
                <span>Analytics</span>
              </Command.Item>
              <Command.Item className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-text-primary hover:bg-muted transition-colors">
                <Settings className="w-4 h-4" strokeWidth={1.5} />
                <span>Settings</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
