import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Search,
  Check,
  Sparkles,
  TrendingUp,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { 
  AppealTemplate, 
  getAppealTemplates, 
  incrementTemplateUsage,
  applyTemplate,
  getDefaultTemplateData,
  TEMPLATE_CATEGORIES,
} from '../../lib/appeals';

interface AppealTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (letter: string, template: AppealTemplate) => void;
  claimData?: any;
}

export function AppealTemplateSelector({
  isOpen,
  onClose,
  onSelect,
  claimData,
}: AppealTemplateSelectorProps) {
  const [templates, setTemplates] = useState<AppealTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AppealTemplate | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>>({});
  const [previewLetter, setPreviewLetter] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (claimData) {
      setPreviewData(getDefaultTemplateData(claimData));
    }
  }, [claimData]);

  useEffect(() => {
    if (selectedTemplate) {
      const letter = applyTemplate(selectedTemplate, previewData);
      setPreviewLetter(letter);
    }
  }, [selectedTemplate, previewData]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await getAppealTemplates(undefined, true);
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = async () => {
    if (!selectedTemplate) return;

    // Increment usage count
    await incrementTemplateUsage(selectedTemplate.id);

    // Apply template with data
    const letter = applyTemplate(selectedTemplate, previewData);
    onSelect(letter, selectedTemplate);
    onClose();
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Template List */}
          <div className="w-1/2 border-r border-neutral-200 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Appeal Templates</h2>
                    <p className="text-sm text-neutral-500">Choose a pre-built template</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    !selectedCategory
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  All
                </button>
                {TEMPLATE_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      selectedCategory === cat.value
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="py-12 text-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-neutral-500">Loading templates...</p>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500">No templates found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full p-4 border rounded-xl text-left transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-neutral-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-neutral-900">{template.name}</h3>
                            {template.is_system && (
                              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs rounded">
                                System
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {TEMPLATE_CATEGORIES.find(c => c.value === template.category)?.label || template.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Used {template.usage_count} times
                            </span>
                            {template.success_rate && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Sparkles className="w-3 h-3" />
                                {template.success_rate}% success
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="w-1/2 flex flex-col bg-neutral-50">
            <div className="px-6 py-4 border-b border-neutral-200 bg-white">
              <h3 className="font-medium text-neutral-900">Template Preview</h3>
              <p className="text-sm text-neutral-500">
                {selectedTemplate
                  ? 'Preview with your claim data'
                  : 'Select a template to preview'
                }
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedTemplate ? (
                <div className="bg-white rounded-xl border border-neutral-200 p-6 min-h-[400px]">
                  <pre className="whitespace-pre-wrap text-sm text-neutral-700 font-serif leading-relaxed">
                    {previewLetter}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500">Select a template to see preview</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-white">
              <button
                onClick={handleSelectTemplate}
                disabled={!selectedTemplate}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Use This Template
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
