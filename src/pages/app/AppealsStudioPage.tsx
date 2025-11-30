import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

// Mock data for appeals
const mockAppeals = [
  {
    id: "APL-2024-001",
    claimId: "CLM-78432",
    patient: "John Smith",
    payer: "Anthem Blue Cross",
    denialReason: "Medical Necessity",
    amount: "$12,450",
    status: "draft",
    createdAt: "2024-01-15",
    dueDate: "2024-02-15",
  },
  {
    id: "APL-2024-002",
    claimId: "CLM-78433",
    patient: "Sarah Johnson",
    payer: "United Healthcare",
    denialReason: "Prior Authorization",
    amount: "$8,320",
    status: "submitted",
    createdAt: "2024-01-14",
    dueDate: "2024-02-14",
  },
  {
    id: "APL-2024-003",
    claimId: "CLM-78434",
    patient: "Michael Brown",
    payer: "Aetna",
    denialReason: "Coding Error",
    amount: "$5,680",
    status: "in_review",
    createdAt: "2024-01-14",
    dueDate: "2024-02-14",
  },
  {
    id: "APL-2024-004",
    claimId: "CLM-78435",
    patient: "Emily Davis",
    payer: "Cigna",
    denialReason: "Timely Filing",
    amount: "$3,200",
    status: "won",
    createdAt: "2024-01-13",
    dueDate: "2024-02-13",
  },
  {
    id: "APL-2024-005",
    claimId: "CLM-78436",
    patient: "Robert Wilson",
    payer: "Medicare",
    denialReason: "Medical Necessity",
    amount: "$15,800",
    status: "lost",
    createdAt: "2024-01-12",
    dueDate: "2024-02-12",
  },
];

const statusConfig = {
  draft: { label: "Draft", icon: FileText, color: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400" },
  submitted: { label: "Submitted", icon: Send, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  in_review: { label: "In Review", icon: Clock, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  won: { label: "Won", icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  lost: { label: "Lost", icon: XCircle, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

const AppealsStudioPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedAppeals, setSelectedAppeals] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredAppeals = mockAppeals.filter((appeal) => {
    const matchesSearch =
      appeal.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.claimId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || appeal.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateAppeal = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Appeal generated successfully!", {
        description: "Your appeal letter has been created and saved as a draft.",
      });
    } catch (error) {
      toast.error("Failed to generate appeal", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedAppeals.length === 0) {
      toast.error("No appeals selected", {
        description: "Please select at least one appeal to perform this action.",
      });
      return;
    }
    toast.success(`${action} ${selectedAppeals.length} appeal(s)`, {
      description: "Action completed successfully.",
    });
    setSelectedAppeals([]);
  };

  const toggleSelectAll = () => {
    if (selectedAppeals.length === filteredAppeals.length) {
      setSelectedAppeals([]);
    } else {
      setSelectedAppeals(filteredAppeals.map((a) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedAppeals((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
            Appeals Studio
          </h1>
          <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Create, manage, and track your appeal letters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleBulkAction("Export")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleGenerateAppeal} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Appeal
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Appeals", value: "156", icon: FileText },
          { label: "Drafts", value: "12", icon: FileText },
          { label: "Submitted", value: "45", icon: Send },
          { label: "Won", value: "89", icon: CheckCircle2 },
          { label: "Win Rate", value: "87%", icon: AlertTriangle },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  isDark ? "bg-neutral-800" : "bg-neutral-100"
                )}>
                  <stat.icon className={cn("h-4 w-4", isDark ? "text-neutral-400" : "text-neutral-600")} />
                </div>
                <div>
                  <p className={cn("text-xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
                    {stat.value}
                  </p>
                  <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    {stat.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                isDark ? "text-neutral-500" : "text-neutral-400"
              )} />
              <Input
                placeholder="Search appeals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                Status:
              </span>
              <button
                onClick={() => setSelectedStatus(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  !selectedStatus
                    ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                    : isDark
                    ? "bg-neutral-800 text-neutral-400 hover:text-white"
                    : "bg-neutral-100 text-neutral-600 hover:text-neutral-900"
                )}
              >
                All
              </button>
              {Object.entries(statusConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    selectedStatus === key
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                      : isDark
                      ? "bg-neutral-800 text-neutral-400 hover:text-white"
                      : "bg-neutral-100 text-neutral-600 hover:text-neutral-900"
                  )}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appeals table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn(
                  "border-b",
                  isDark ? "border-neutral-800" : "border-neutral-200"
                )}>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAppeals.length === filteredAppeals.length && filteredAppeals.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-neutral-300 dark:border-neutral-700"
                    />
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Appeal ID
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Patient
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Payer
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Denial Reason
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Amount
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Status
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Due Date
                  </th>
                  <th className={cn("p-4 text-right text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppeals.map((appeal) => {
                  const status = statusConfig[appeal.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  return (
                    <tr
                      key={appeal.id}
                      className={cn(
                        "border-b transition-colors",
                        isDark ? "border-neutral-800 hover:bg-neutral-800/50" : "border-neutral-200 hover:bg-neutral-50"
                      )}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedAppeals.includes(appeal.id)}
                          onChange={() => toggleSelect(appeal.id)}
                          className="rounded border-neutral-300 dark:border-neutral-700"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                            {appeal.id}
                          </p>
                          <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                            {appeal.claimId}
                          </p>
                        </div>
                      </td>
                      <td className={cn("p-4 text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>
                        {appeal.patient}
                      </td>
                      <td className={cn("p-4 text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>
                        {appeal.payer}
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{appeal.denialReason}</Badge>
                      </td>
                      <td className={cn("p-4 text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                        {appeal.amount}
                      </td>
                      <td className="p-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", status.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className={cn("p-4 text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                        {appeal.dueDate}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"
                            )}
                            onClick={() => toast.info("View appeal", { description: `Viewing ${appeal.id}` })}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"
                            )}
                            onClick={() => toast.info("Edit appeal", { description: `Editing ${appeal.id}` })}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className={cn(
                              "p-2 rounded-lg transition-colors text-red-500",
                              isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"
                            )}
                            onClick={() => toast.error("Delete appeal", { description: `Deleting ${appeal.id}` })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAppeals.length === 0 && (
            <div className="p-8 text-center">
              <FileText className={cn("h-12 w-12 mx-auto mb-4", isDark ? "text-neutral-700" : "text-neutral-300")} />
              <p className={cn("text-lg font-medium mb-2", isDark ? "text-white" : "text-neutral-900")}>
                No appeals found
              </p>
              <p className={cn("text-sm mb-4", isDark ? "text-neutral-500" : "text-neutral-500")}>
                Try adjusting your search or filters
              </p>
              <Button onClick={handleGenerateAppeal}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Appeal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppealsStudioPage;
