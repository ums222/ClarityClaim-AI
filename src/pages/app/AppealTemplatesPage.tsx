import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '../../components/app/AppLayout';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Copy,
  Star,
  TrendingUp,
  Tag,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { 
  AppealTemplate, 
  getAppealTemplates, 
  createAppealTemplate,
  updateAppealTemplate,
  TEMPLATE_CATEGORIES,
} from '../../lib/appeals';

// Template Card Component
function TemplateCard({ 
  template, 
  onEdit, 
  onDuplicate,
}: { 
  template: AppealTemplate; 
  onEdit: () => void;
  onDuplicate: () => void;
}) {
  const category = TEMPLATE_CATEGORIES.find(c => c.value === template.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden group"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              template.is_system
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                : 'bg-gray-100'
            }`}>
              <FileText className={`w-5 h-5 ${template.is_system ? 'text-white' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {template.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {category?.label || template.category}
                </span>
                {template.is_system && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    System
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {template.description || 'No description provided'}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
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
          {template.denial_codes && template.denial_codes.length > 0 && (
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {template.denial_codes.length} codes
            </span>
          )}
        </div>
      </div>

      {/* Preview snippet */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500 font-mono line-clamp-2">
          {template.letter_template.substring(0, 150)}...
        </p>
      </div>
    </motion.div>
  );
}

// Template Editor Modal
function TemplateEditorModal({
  isOpen,
  onClose,
  template,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  template?: AppealTemplate | null;
  onSave: (data: Partial<AppealTemplate>) => void;
}) {
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [category, setCategory] = useState(template?.category || 'custom');
  const [subjectLine, setSubjectLine] = useState(template?.subject_line || '');
  const [letterTemplate, setLetterTemplate] = useState(template?.letter_template || '');
  const [denialCodes, setDenialCodes] = useState<string[]>(template?.denial_codes || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name || '');
      setDescription(template.description || '');
      setCategory(template.category || 'custom');
      setSubjectLine(template.subject_line || '');
      setLetterTemplate(template.letter_template || '');
      setDenialCodes(template.denial_codes || []);
    } else {
      setName('');
      setDescription('');
      setCategory('custom');
      setSubjectLine('');
      setLetterTemplate('');
      setDenialCodes([]);
    }
  }, [template]);

  const handleSubmit = async () => {
    if (!name || !letterTemplate) return;
    
    setSaving(true);
    await onSave({
      name,
      description,
      category,
      subject_line: subjectLine,
      letter_template: letterTemplate,
      denial_codes: denialCodes,
    });
    setSaving(false);
    onClose();
  };

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {template ? 'Edit Template' : 'Create New Template'}
                </h2>
                <p className="text-sm text-gray-500">
                  {template ? 'Modify your appeal template' : 'Create a reusable appeal template'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Medical Necessity Appeal"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TEMPLATE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of when to use this template"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Subject Line
              </label>
              <input
                type="text"
                value={subjectLine}
                onChange={(e) => setSubjectLine(e.target.value)}
                placeholder="Appeal Subject Line (use {{placeholders}})"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Letter Template *
                </label>
                <span className="text-xs text-gray-400">
                  Use {"{{placeholder}}"} for dynamic content
                </span>
              </div>
              <textarea
                value={letterTemplate}
                onChange={(e) => setLetterTemplate(e.target.value)}
                placeholder="Enter your appeal letter template..."
                rows={15}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              />
            </div>

            {/* Placeholder Guide */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Available Placeholders</h4>
              <div className="grid grid-cols-3 gap-2 text-xs text-blue-700">
                <code>{"{{current_date}}"}</code>
                <code>{"{{claim_number}}"}</code>
                <code>{"{{patient_name}}"}</code>
                <code>{"{{patient_id}}"}</code>
                <code>{"{{service_date}}"}</code>
                <code>{"{{payer_name}}"}</code>
                <code>{"{{denial_date}}"}</code>
                <code>{"{{procedure_codes}}"}</code>
                <code>{"{{diagnosis_codes}}"}</code>
                <code>{"{{provider_name}}"}</code>
                <code>{"{{provider_npi}}"}</code>
                <code>{"{{facility_name}}"}</code>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !name || !letterTemplate}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {template ? 'Update Template' : 'Create Template'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AppealTemplatesPage() {
  const [templates, setTemplates] = useState<AppealTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AppealTemplate | null>(null);

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

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleEditTemplate = (template: AppealTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleDuplicateTemplate = (template: AppealTemplate) => {
    setEditingTemplate({
      ...template,
      id: '',
      name: `${template.name} (Copy)`,
      is_system: false,
      usage_count: 0,
    });
    setShowEditor(true);
  };

  const handleSaveTemplate = async (data: Partial<AppealTemplate>) => {
    try {
      if (editingTemplate?.id) {
        await updateAppealTemplate(editingTemplate.id, data);
      } else {
        await createAppealTemplate(data);
      }
      fetchTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const systemTemplates = filteredTemplates.filter(t => t.is_system);
  const customTemplates = filteredTemplates.filter(t => !t.is_system);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              Appeal Templates
            </h1>
            <p className="text-gray-500 mt-1">
              Pre-built templates to streamline your appeal process
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateTemplate}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Template
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  !selectedCategory
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {TEMPLATE_CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading templates...</p>
          </div>
        ) : (
          <>
            {/* System Templates */}
            {systemTemplates.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  System Templates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemTemplates.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onEdit={() => handleEditTemplate(template)}
                      onDuplicate={() => handleDuplicateTemplate(template)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Custom Templates */}
            {customTemplates.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Custom Templates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customTemplates.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onEdit={() => handleEditTemplate(template)}
                      onDuplicate={() => handleDuplicateTemplate(template)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
              <div className="py-20 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No templates found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || selectedCategory
                    ? 'Try adjusting your search or filters'
                    : 'Create your first custom template to get started'
                  }
                </p>
                <button
                  onClick={handleCreateTemplate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Template
                </button>
              </div>
            )}
          </>
        )}

        {/* Template Editor Modal */}
        <TemplateEditorModal
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setEditingTemplate(null);
          }}
          template={editingTemplate}
          onSave={handleSaveTemplate}
        />
      </div>
    </AppLayout>
  );
}
