import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
import { Employee } from "./EmployeeDialog";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignee: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (ticket: Ticket) => void;
  employees?: Employee[];
}

const statusColors: Record<Ticket['status'], string> = {
  "Open": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Resolved": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Closed": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const priorityColors: Record<Ticket['priority'], string> = {
  "Low": "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
  "Medium": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "High": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Urgent": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function TicketDialog({ ticket, open, onOpenChange, onUpdate, employees = [] }: TicketDialogProps) {
  const [editedTicket, setEditedTicket] = useState<Ticket | null>(ticket);

  useEffect(() => {
    if (ticket) {
      setEditedTicket(ticket);
    }
  }, [ticket]);

  if (!ticket || !editedTicket) return null;

  const activeEmployees = employees.filter(e => e.status === "Active");

  const handleSave = () => {
    if (onUpdate && editedTicket) {
      onUpdate(editedTicket);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ticket.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={editedTicket.status} 
                onValueChange={(value) => setEditedTicket({ ...editedTicket, status: value as Ticket['status'] })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={editedTicket.priority} 
                onValueChange={(value) => setEditedTicket({ ...editedTicket, priority: value as Ticket['priority'] })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={editedTicket.description}
              onChange={(e) => setEditedTicket({ ...editedTicket, description: e.target.value })}
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select 
                value={editedTicket.assignee} 
                onValueChange={(value) => setEditedTicket({ ...editedTicket, assignee: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                  {activeEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Reporter</Label>
              <div className="px-3 py-2 bg-muted rounded-md">{ticket.reporter}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Created</Label>
              <div className="px-3 py-2 bg-muted rounded-md">{ticket.createdAt}</div>
            </div>
            
            <div className="space-y-2">
              <Label>Last Updated</Label>
              <div className="px-3 py-2 bg-muted rounded-md">{ticket.updatedAt}</div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
