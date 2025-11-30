import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

const mockPatients = [
  {
    id: "PAT-001",
    name: "John Smith",
    dob: "1985-03-15",
    mrn: "MRN-78432",
    insurance: "Anthem Blue Cross",
    claims: 12,
    denials: 2,
    appeals: 1,
    status: "active",
  },
  {
    id: "PAT-002",
    name: "Sarah Johnson",
    dob: "1972-08-22",
    mrn: "MRN-78433",
    insurance: "United Healthcare",
    claims: 8,
    denials: 1,
    appeals: 1,
    status: "active",
  },
  {
    id: "PAT-003",
    name: "Michael Brown",
    dob: "1990-11-30",
    mrn: "MRN-78434",
    insurance: "Aetna",
    claims: 5,
    denials: 3,
    appeals: 2,
    status: "inactive",
  },
  {
    id: "PAT-004",
    name: "Emily Davis",
    dob: "1968-05-12",
    mrn: "MRN-78435",
    insurance: "Cigna",
    claims: 15,
    denials: 4,
    appeals: 3,
    status: "active",
  },
  {
    id: "PAT-005",
    name: "Robert Wilson",
    dob: "1955-01-28",
    mrn: "MRN-78436",
    insurance: "Medicare",
    claims: 22,
    denials: 5,
    appeals: 4,
    status: "active",
  },
  {
    id: "PAT-006",
    name: "Lisa Anderson",
    dob: "1982-07-14",
    mrn: "MRN-78437",
    insurance: "Blue Shield",
    claims: 9,
    denials: 0,
    appeals: 0,
    status: "active",
  },
];

const PatientsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
            Patients
          </h1>
          <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Manage patient records and claims history
          </p>
        </div>
        <Button onClick={() => toast.info("Add patient modal would open here")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Patients", value: "12,847", icon: Users },
          { label: "Active Cases", value: "8,234", icon: FileText },
          { label: "Avg Claims/Patient", value: "4.2", icon: FileText },
          { label: "Denial Rate", value: "8.2%", icon: FileText },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  isDark ? "bg-neutral-800" : "bg-neutral-100"
                )}>
                  <stat.icon className={cn("h-5 w-5", isDark ? "text-neutral-400" : "text-neutral-600")} />
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

      {/* Search and filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                isDark ? "text-neutral-500" : "text-neutral-400"
              )} />
              <Input
                placeholder="Search by name, MRN, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn(
                  "border-b",
                  isDark ? "border-neutral-800" : "border-neutral-200"
                )}>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Patient
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    MRN
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Insurance
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Claims
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Denials
                  </th>
                  <th className={cn("p-4 text-left text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Status
                  </th>
                  <th className={cn("p-4 text-right text-xs font-medium uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className={cn(
                      "border-b transition-colors",
                      isDark ? "border-neutral-800 hover:bg-neutral-800/50" : "border-neutral-200 hover:bg-neutral-50"
                    )}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium",
                          isDark ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-700"
                        )}>
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                            {patient.name}
                          </p>
                          <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                            DOB: {patient.dob}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={cn("p-4 text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      {patient.mrn}
                    </td>
                    <td className={cn("p-4 text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      {patient.insurance}
                    </td>
                    <td className={cn("p-4 text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                      {patient.claims}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "text-sm font-medium",
                        patient.denials > 3 ? "text-red-500" : patient.denials > 0 ? "text-amber-500" : "text-emerald-500"
                      )}>
                        {patient.denials}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                        {patient.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"
                          )}
                          onClick={() => toast.info("View patient details")}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"
                          )}
                          onClick={() => toast.info("View claims")}
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={cn(
            "flex items-center justify-between p-4 border-t",
            isDark ? "border-neutral-800" : "border-neutral-200"
          )}>
            <p className={cn("text-sm", isDark ? "text-neutral-500" : "text-neutral-500")}>
              Showing {filteredPatients.length} of {mockPatients.length} patients
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className={cn("text-sm px-2", isDark ? "text-neutral-300" : "text-neutral-700")}>
                Page {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsPage;
