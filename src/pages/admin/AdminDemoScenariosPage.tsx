import { motion } from 'framer-motion';
import {
  Sparkles,
  Scale,
  ShieldCheck,
  PieChart,
  TrendingUp,
  ArrowRight,
  Play,
  Star,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

// Demo scenarios data
const demoScenarios = [
  {
    id: '1',
    name: 'AI-Powered Oncology Appeal',
    description: 'High-dollar chemotherapy claim denied for medical necessity, successfully overturned with AI-generated appeal citing NCCN guidelines.',
    category: 'ai_appeal',
    isFeatured: true,
    icon: Sparkles,
    color: 'teal',
    metrics: [
      { label: 'Amount Recovered', value: '$36,100', highlight: true },
      { label: 'Appeal Success Rate', value: '73%', highlight: false },
      { label: 'Time to Resolution', value: '15 days', highlight: false },
    ],
    targetUrl: '/app/claims',
    narrativeIntro: 'Watch how ClarityClaim AI transforms a $47,500 oncology denial into a successful appeal.',
    tenant: 'Aegis Health System',
    claimType: 'Oncology/Chemotherapy',
  },
  {
    id: '2',
    name: 'Equity Analytics in Action',
    description: 'Preventive care denial in underserved ZIP code flagged by equity analytics, revealing systemic disparity patterns.',
    category: 'equity',
    isFeatured: true,
    icon: Scale,
    color: 'purple',
    metrics: [
      { label: 'Disparity Score', value: '38%', highlight: true },
      { label: 'ZIP Code', value: '48207', highlight: false },
      { label: 'Sample Size', value: '145 claims', highlight: false },
    ],
    targetUrl: '/app/analytics',
    narrativeIntro: 'See how ClarityClaim identifies and addresses healthcare disparities through AI-powered equity analytics.',
    tenant: 'Unity Community Care Network',
    claimType: 'Preventive Care',
  },
  {
    id: '3',
    name: 'Pre-Submission Prevention',
    description: 'AI flagged missing prior authorization before claim submission, enabling proactive resolution.',
    category: 'prevention',
    isFeatured: true,
    icon: ShieldCheck,
    color: 'green',
    metrics: [
      { label: 'Risk Score at Intake', value: '72%', highlight: true },
      { label: 'Denial Prevented', value: 'Yes', highlight: true },
      { label: 'Amount Saved', value: '$1,850', highlight: false },
    ],
    targetUrl: '/app/claims',
    narrativeIntro: 'Prevention is better than cure. See how AI catches issues before they become denials.',
    tenant: 'Aegis Health System',
    claimType: 'MRI Imaging',
  },
  {
    id: '4',
    name: 'Root Cause Analysis',
    description: 'Timely filing denial identified for root cause analysis - drives operational improvement.',
    category: 'workflow',
    isFeatured: false,
    icon: PieChart,
    color: 'orange',
    metrics: [
      { label: 'Days Past Deadline', value: '60 days', highlight: true },
      { label: 'Root Cause', value: 'Process Gap', highlight: false },
    ],
    targetUrl: '/app/analytics',
    narrativeIntro: 'Not every denial can be appealed, but every denial teaches us something.',
    tenant: 'Aegis Health System',
    claimType: 'ED Visit',
  },
  {
    id: '5',
    name: 'Multi-Level Appeal ROI',
    description: 'Total knee replacement claim requiring two appeal levels before full payment - demonstrates persistence and ROI tracking.',
    category: 'roi',
    isFeatured: true,
    icon: TrendingUp,
    color: 'blue',
    metrics: [
      { label: 'Total Recovered', value: '$28,000', highlight: true },
      { label: 'Appeal Levels', value: '2', highlight: false },
      { label: 'Time to Full Recovery', value: '90 days', highlight: false },
    ],
    targetUrl: '/app/claims',
    narrativeIntro: 'Sometimes success requires persistence. Track ROI across multiple appeal levels.',
    tenant: 'Aegis Health System',
    claimType: 'Orthopedic Surgery',
  },
];

const categoryLabels: Record<string, string> = {
  ai_appeal: 'AI Appeal',
  equity: 'Equity Analytics',
  prevention: 'Denial Prevention',
  workflow: 'Workflow',
  roi: 'ROI Tracking',
};

const AdminDemoScenariosPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      teal: {
        bg: isDark ? 'bg-teal-500/10' : 'bg-teal-50',
        text: isDark ? 'text-teal-400' : 'text-teal-600',
        border: isDark ? 'border-teal-500/30' : 'border-teal-200',
      },
      purple: {
        bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
        text: isDark ? 'text-purple-400' : 'text-purple-600',
        border: isDark ? 'border-purple-500/30' : 'border-purple-200',
      },
      green: {
        bg: isDark ? 'bg-green-500/10' : 'bg-green-50',
        text: isDark ? 'text-green-400' : 'text-green-600',
        border: isDark ? 'border-green-500/30' : 'border-green-200',
      },
      orange: {
        bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
        text: isDark ? 'text-orange-400' : 'text-orange-600',
        border: isDark ? 'border-orange-500/30' : 'border-orange-200',
      },
      blue: {
        bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
        text: isDark ? 'text-blue-400' : 'text-blue-600',
        border: isDark ? 'border-blue-500/30' : 'border-blue-200',
      },
    };
    return colors[color] || colors.teal;
  };

  const featuredScenarios = demoScenarios.filter(s => s.isFeatured);
  const otherScenarios = demoScenarios.filter(s => !s.isFeatured);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={cn(
              "text-2xl font-semibold tracking-tight",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              Demo Scenarios
            </h1>
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              Hand-crafted hero claims and scenarios for investor and customer demos
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-amber-500/10" : "bg-amber-50"
              )}>
                <Star className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {demoScenarios.length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Total Scenarios
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-green-500/10" : "bg-green-50"
              )}>
                <DollarSign className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  $65K+
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Demo Recovered
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-teal-500/10" : "bg-teal-50"
              )}>
                <Sparkles className={cn("h-5 w-5", isDark ? "text-teal-400" : "text-teal-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {demoScenarios.filter(s => s.category === 'ai_appeal').length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  AI Appeals
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-purple-500/10" : "bg-purple-50"
              )}>
                <Scale className={cn("h-5 w-5", isDark ? "text-purple-400" : "text-purple-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {demoScenarios.filter(s => s.category === 'equity').length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Equity Stories
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Featured Scenarios */}
        <div>
          <h2 className={cn(
            "font-semibold mb-4 flex items-center gap-2",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            <Star className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-500")} />
            Featured Scenarios
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-4">
            {featuredScenarios.map((scenario, index) => {
              const colorClasses = getColorClasses(scenario.color);
              const IconComponent = scenario.icon;
              
              return (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "p-0 overflow-hidden border-2 transition-all",
                    colorClasses.border,
                    "hover:shadow-lg"
                  )}>
                    {/* Header */}
                    <div className={cn("p-5", colorClasses.bg)}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            isDark ? "bg-white/10" : "bg-white/80"
                          )}>
                            <IconComponent className={cn("h-6 w-6", colorClasses.text)} />
                          </div>
                          <div>
                            <h3 className={cn(
                              "font-semibold",
                              isDark ? "text-white" : "text-neutral-900"
                            )}>
                              {scenario.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn(
                                "px-2 py-0.5 text-xs font-medium rounded-full",
                                colorClasses.bg,
                                colorClasses.text
                              )}>
                                {categoryLabels[scenario.category]}
                              </span>
                              <span className={cn(
                                "text-xs",
                                isDark ? "text-neutral-400" : "text-neutral-500"
                              )}>
                                {scenario.tenant}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className={cn(
                        "text-sm mt-3",
                        isDark ? "text-neutral-300" : "text-neutral-600"
                      )}>
                        {scenario.description}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="p-5 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="grid grid-cols-3 gap-4">
                        {scenario.metrics.map((metric) => (
                          <div key={metric.label}>
                            <p className={cn(
                              "text-xs uppercase tracking-wider",
                              isDark ? "text-neutral-500" : "text-neutral-500"
                            )}>
                              {metric.label}
                            </p>
                            <p className={cn(
                              "text-lg font-semibold mt-0.5",
                              metric.highlight
                                ? colorClasses.text
                                : isDark ? "text-white" : "text-neutral-900"
                            )}>
                              {metric.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Talking Points */}
                    <div className="px-5 pb-5">
                      <div className={cn(
                        "p-3 rounded-lg",
                        isDark ? "bg-neutral-800/50" : "bg-neutral-50"
                      )}>
                        <p className={cn(
                          "text-xs font-medium mb-1",
                          isDark ? "text-neutral-400" : "text-neutral-500"
                        )}>
                          Demo Intro:
                        </p>
                        <p className={cn(
                          "text-sm italic",
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        )}>
                          "{scenario.narrativeIntro}"
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-5 pb-5">
                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link to={scenario.targetUrl}>
                            <Play className="h-4 w-4 mr-2" />
                            Start Demo
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to={scenario.targetUrl}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Other Scenarios */}
        {otherScenarios.length > 0 && (
          <div>
            <h2 className={cn(
              "font-semibold mb-4",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              Additional Scenarios
            </h2>
            
            <div className="grid gap-4">
              {otherScenarios.map((scenario, index) => {
                const colorClasses = getColorClasses(scenario.color);
                const IconComponent = scenario.icon;
                
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            colorClasses.bg
                          )}>
                            <IconComponent className={cn("h-5 w-5", colorClasses.text)} />
                          </div>
                          <div>
                            <h3 className={cn(
                              "font-medium",
                              isDark ? "text-white" : "text-neutral-900"
                            )}>
                              {scenario.name}
                            </h3>
                            <p className={cn(
                              "text-sm",
                              isDark ? "text-neutral-400" : "text-neutral-500"
                            )}>
                              {scenario.description}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={scenario.targetUrl}>
                            View
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Demo Checklist */}
        <Card className="p-5">
          <h2 className={cn(
            "font-semibold mb-4",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            Pre-Demo Checklist
          </h2>
          <div className="space-y-3">
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              isDark ? "bg-green-500/10" : "bg-green-50"
            )}>
              <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")} />
              <span className={cn("text-sm", isDark ? "text-white" : "text-neutral-900")}>
                Demo data seeded and verified
              </span>
            </div>
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              isDark ? "bg-green-500/10" : "bg-green-50"
            )}>
              <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")} />
              <span className={cn("text-sm", isDark ? "text-white" : "text-neutral-900")}>
                All 3 demo tenants active (Aegis, Unity, Sunrise)
              </span>
            </div>
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              isDark ? "bg-green-500/10" : "bg-green-50"
            )}>
              <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")} />
              <span className={cn("text-sm", isDark ? "text-white" : "text-neutral-900")}>
                AI models active and responding
              </span>
            </div>
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              isDark ? "bg-green-500/10" : "bg-green-50"
            )}>
              <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")} />
              <span className={cn("text-sm", isDark ? "text-white" : "text-neutral-900")}>
                Hero claims accessible and displaying correctly
              </span>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDemoScenariosPage;
