import { Users, Ticket, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Employee } from "../EmployeeDialog";
import { Ticket as TicketType } from "../TicketDialog";

interface RealDashboardPageProps {
  tickets: TicketType[];
  employees: Employee[];
}

export function RealDashboardPage({ tickets, employees }: RealDashboardPageProps) {
  const totalTickets = tickets.length;
  const pendingTickets = tickets.filter(t => t.status === "Open").length;
  const inProgressTickets = tickets.filter(t => t.status === "In Progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length;

  const recentActivity = [
    ...tickets.slice(0, 5).map(t => ({
      id: t.id,
      type: "ticket",
      title: `Ticket ${t.id} created`,
      description: t.title,
      time: t.createdAt,
      status: t.status,
    })),
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-white dark:bg-gray-950">
      {/* Header */}
      <div>
        <h1 className="mb-1 text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your ticket management system</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-gray-900 dark:border-l-white border border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">Total Tickets</p>
              <h2 className="mb-0 text-gray-900 dark:text-white">{totalTickets}</h2>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Ticket className="h-6 w-6 text-gray-900 dark:text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-gray-700 dark:border-l-gray-300 border border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">Open Tickets</p>
              <h2 className="mb-0 text-gray-900 dark:text-white">{pendingTickets}</h2>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-gray-600 dark:border-l-gray-400 border border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">In Progress</p>
              <h2 className="mb-0 text-gray-900 dark:text-white">{inProgressTickets}</h2>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-gray-800 dark:border-l-gray-200 border border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">Resolved</p>
              <h2 className="mb-0 text-gray-900 dark:text-white">{resolvedTickets}</h2>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            </div>
          </div>
        </Card>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="mb-4 text-gray-900 dark:text-white">System Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                  <Users className="h-5 w-5 text-white dark:text-gray-900" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Total Employees</p>
                  <h4 className="mb-0 text-gray-900 dark:text-white">{employees.length}</h4>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-600 dark:bg-gray-400 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white dark:text-gray-900" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Urgent Tickets</p>
                  <h4 className="mb-0 text-gray-900 dark:text-white">{tickets.filter(t => t.priority === "Urgent").length}</h4>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <h4 className="mb-1 text-gray-900 dark:text-white">Create New Ticket</h4>
              <p className="text-gray-600 dark:text-gray-400">Submit a new support request</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <h4 className="mb-1 text-gray-900 dark:text-white">Add Employee</h4>
              <p className="text-gray-600 dark:text-gray-400">Register a new team member</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="mb-4 text-gray-900 dark:text-white">Recent Tickets</h3>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors border border-gray-200 dark:border-gray-800">
                <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                  <Ticket className="h-5 w-5 text-white dark:text-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="mb-0 text-gray-900 dark:text-white">{activity.title}</h4>
                    {activity.status && (
                      <Badge 
                        variant="outline" 
                        className={
                          activity.status === "Open" ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700" :
                          activity.status === "In Progress" ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600" :
                          "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 border-gray-900 dark:border-gray-300"
                        }
                      >
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 truncate">{activity.description}</p>
                </div>
                <span className="text-gray-500 dark:text-gray-500 whitespace-nowrap text-sm">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
