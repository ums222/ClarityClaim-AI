import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Book,
  FileText,
  Video,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap,
  Shield,
  CreditCard,
  Users,
  Settings,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import AppLayout from '../../components/app/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "upload-claims",
    question: "How do I upload claims to the system?",
    answer: "You can upload claims by clicking the 'Upload Claims' button on the Dashboard or Claims page. We support CSV, EDI 837, and direct EHR integration formats. Simply drag and drop your files or click to browse.",
    category: "Claims"
  },
  {
    id: "denial-prediction",
    question: "How accurate is the denial prediction?",
    answer: "Our AI models achieve 94% accuracy in predicting claim denials. The system analyzes over 200 data points including diagnosis codes, procedure codes, payer rules, and historical patterns to make predictions.",
    category: "AI & Analytics"
  },
  {
    id: "generate-appeal",
    question: "How do I generate an appeal letter?",
    answer: "Navigate to the Appeals page and click 'New Appeal'. Select the denied claim, and our AI will analyze the denial reason and generate a customized appeal letter. You can edit the letter before sending.",
    category: "Appeals"
  },
  {
    id: "integrations",
    question: "What EHR systems do you integrate with?",
    answer: "We integrate with all major EHR systems including Epic, Cerner, Meditech, Allscripts, and athenahealth. Go to Settings > Integrations to configure your connections.",
    category: "Integrations"
  },
  {
    id: "team-members",
    question: "How do I add team members?",
    answer: "Go to Settings > Team to invite team members. You can assign different roles (Admin, Editor, Viewer) to control access levels. Team members will receive an email invitation to join.",
    category: "Account"
  },
  {
    id: "billing",
    question: "How do I update my billing information?",
    answer: "Navigate to Settings > Billing to update your payment method, view invoices, or change your subscription plan. You can also download past invoices for your records.",
    category: "Billing"
  },
  {
    id: "data-security",
    question: "How is my data protected?",
    answer: "ClarityClaim AI is SOC 2 Type II certified, HIPAA compliant, and HITRUST certified. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We maintain strict access controls and audit logs.",
    category: "Security"
  },
  {
    id: "export-data",
    question: "Can I export my data?",
    answer: "Yes! You can export claims, appeals, and analytics data in CSV or Excel format. Use the 'Export' button on any page, or go to Settings > API Keys to access our API for programmatic exports.",
    category: "Data"
  }
];

const quickLinks = [
  { title: "Getting Started Guide", icon: Book, href: "#" },
  { title: "API Documentation", icon: FileText, href: "/api-docs" },
  { title: "Video Tutorials", icon: Video, href: "#" },
  { title: "Release Notes", icon: Zap, href: "#" },
];

const categories = [
  { name: "Claims", icon: FileText },
  { name: "Appeals", icon: HelpCircle },
  { name: "AI & Analytics", icon: Zap },
  { name: "Integrations", icon: Settings },
  { name: "Account", icon: Users },
  { name: "Billing", icon: CreditCard },
  { name: "Security", icon: Shield },
  { name: "Data", icon: FileText },
];

export default function AppHelpPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className={cn(
            "text-2xl font-semibold tracking-tight",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            Help Center
          </h1>
          <p className={cn(
            "text-sm mt-2",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Find answers, guides, and get support
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5",
            isDark ? "text-neutral-500" : "text-neutral-400"
          )} />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-xl border text-sm",
              isDark 
                ? "bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500" 
                : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400",
              "focus:outline-none focus:ring-2 focus:ring-teal-500"
            )}
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              to={link.href}
              className={cn(
                "p-4 rounded-xl border transition-all hover:shadow-md",
                isDark 
                  ? "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700" 
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              )}
            >
              <link.icon className={cn(
                "h-6 w-6 mb-2",
                isDark ? "text-teal-400" : "text-teal-600"
              )} />
              <span className={cn(
                "text-sm font-medium",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                {link.title}
              </span>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Categories */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className={cn(
                "font-medium mb-3",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors",
                    !selectedCategory
                      ? isDark
                        ? "bg-teal-500/20 text-teal-400"
                        : "bg-teal-50 text-teal-700"
                      : isDark
                        ? "text-neutral-400 hover:bg-neutral-800"
                        : "text-neutral-600 hover:bg-neutral-100"
                  )}
                >
                  <HelpCircle className="h-4 w-4" />
                  All Topics
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors",
                      selectedCategory === cat.name
                        ? isDark
                          ? "bg-teal-500/20 text-teal-400"
                          : "bg-teal-50 text-teal-700"
                        : isDark
                          ? "text-neutral-400 hover:bg-neutral-800"
                          : "text-neutral-600 hover:bg-neutral-100"
                    )}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* FAQs */}
          <div className="lg:col-span-3 space-y-3">
            {filteredFAQs.length === 0 ? (
              <Card className="p-8 text-center">
                <HelpCircle className={cn(
                  "h-12 w-12 mx-auto mb-4",
                  isDark ? "text-neutral-600" : "text-neutral-400"
                )} />
                <p className={cn(
                  "font-medium",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  No results found
                </p>
                <p className={cn(
                  "text-sm mt-1",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}>
                  Try a different search term or category
                </p>
              </Card>
            ) : (
              filteredFAQs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <div className="flex-1 pr-4">
                        <span className={cn(
                          "font-medium",
                          isDark ? "text-white" : "text-neutral-900"
                        )}>
                          {faq.question}
                        </span>
                        <span className={cn(
                          "ml-2 text-xs px-2 py-0.5 rounded",
                          isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600"
                        )}>
                          {faq.category}
                        </span>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className={cn("h-5 w-5", isDark ? "text-neutral-400" : "text-neutral-600")} />
                      ) : (
                        <ChevronDown className={cn("h-5 w-5", isDark ? "text-neutral-400" : "text-neutral-600")} />
                      )}
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <div className={cn(
                        "px-4 pb-4 border-t",
                        isDark ? "border-neutral-800" : "border-neutral-200"
                      )}>
                        <p className={cn(
                          "pt-4 text-sm leading-relaxed",
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        )}>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Contact Support */}
        <Card className={cn(
          "p-6",
          isDark ? "bg-teal-500/5 border-teal-500/20" : "bg-teal-50 border-teal-200"
        )}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                isDark ? "bg-teal-500/20" : "bg-teal-100"
              )}>
                <MessageCircle className={cn(
                  "h-6 w-6",
                  isDark ? "text-teal-400" : "text-teal-600"
                )} />
              </div>
              <div>
                <h3 className={cn(
                  "font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Need More Help?
                </h3>
                <p className={cn(
                  "text-sm",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}>
                  Our support team is available 24/7
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:support@clarityclaim.ai">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </a>
              <a href="tel:+15551234567">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </Button>
              </a>
              <Link to="/help">
                <Button size="sm">
                  Visit Help Center
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
