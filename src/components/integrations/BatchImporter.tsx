import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  Check,
  X,
  Loader2,
  Trash2,
  AlertCircle,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import {
  getBatchImports,
  createBatchImport,
  processBatchImport,
  cancelBatchImport,
  deleteBatchImport,
  IMPORT_TYPES,
  FILE_TYPES,
  type BatchImport,
} from '../../lib/integrations';

export function BatchImporter() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [imports, setImports] = useState<BatchImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState<BatchImport | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    import_type: 'claims' as BatchImport['import_type'],
    file: null as File | null,
  });

  useEffect(() => {
    loadImports();
  }, []);

  const loadImports = async () => {
    try {
      const { imports: data } = await getBatchImports();
      setImports(data);
    } catch (error) {
      console.error('Failed to load imports:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      import_type: 'claims',
      file: null,
    });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFormData(f => ({ ...f, file, name: f.name || file.name.replace(/\.[^/.]+$/, '') }));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(f => ({ ...f, file, name: f.name || file.name.replace(/\.[^/.]+$/, '') }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }
    
    setUploading(true);
    setMessage(null);
    
    try {
      const importRecord = await createBatchImport(
        formData.file,
        formData.import_type,
        formData.name || formData.file.name
      );
      
      setMessage({ type: 'success', text: 'File uploaded successfully. Processing...' });
      setUploadModalOpen(false);
      resetForm();
      loadImports();
      
      // Auto-start processing
      setProcessingId(importRecord.id);
      await processBatchImport(importRecord.id);
      setMessage({ type: 'success', text: 'Import completed successfully' });
      loadImports();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Upload failed' });
    } finally {
      setUploading(false);
      setProcessingId(null);
    }
  };

  const handleProcess = async (importId: string) => {
    setProcessingId(importId);
    try {
      await processBatchImport(importId);
      setMessage({ type: 'success', text: 'Import processed successfully' });
      loadImports();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Processing failed' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (importId: string) => {
    try {
      await cancelBatchImport(importId);
      setMessage({ type: 'success', text: 'Import cancelled' });
      loadImports();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to cancel' });
    }
  };

  const handleDelete = async (importId: string) => {
    if (!window.confirm('Are you sure you want to delete this import?')) return;
    
    try {
      await deleteBatchImport(importId);
      setMessage({ type: 'success', text: 'Import deleted' });
      loadImports();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to delete' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600';
      case 'failed':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      case 'processing':
      case 'validating':
        return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600';
      case 'cancelled':
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
      default:
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-600';
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'csv':
      case 'xlsx':
        return FileSpreadsheet;
      case 'edi_837p':
      case 'edi_837i':
        return FileText;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className={cn("h-8 w-8 animate-spin", isDark ? "text-teal-400" : "text-teal-600")} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>
            Batch Import
          </h3>
          <p className={cn("text-sm mt-0.5", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Upload CSV, Excel, or EDI 837 files for bulk claim processing
          </p>
        </div>
        <Button onClick={() => { resetForm(); setUploadModalOpen(true); }}>
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
      </div>

      {message && (
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-lg text-sm",
          message.type === 'success'
            ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-50 text-green-600"
            : isDark ? "bg-red-500/20 text-red-400" : "bg-red-50 text-red-600"
        )}>
          {message.type === 'success' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Supported Formats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FILE_TYPES.map((type) => {
          const Icon = getFileIcon(type.value);
          return (
            <Card key={type.value} className={cn("p-4", isDark ? "bg-neutral-800/50" : "bg-neutral-50")}>
              <div className="flex items-center gap-3">
                <Icon className={cn("h-8 w-8", isDark ? "text-teal-400" : "text-teal-600")} />
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>{type.label}</p>
                  <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>{type.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Imports */}
      {imports.length > 0 ? (
        <div className="space-y-4">
          <h4 className={cn("text-sm font-medium", isDark ? "text-neutral-300" : "text-neutral-700")}>
            Recent Imports
          </h4>
          
          {imports.map((imp, index) => {
            const FileIcon = getFileIcon(imp.file_type);
            const isProcessing = processingId === imp.id || imp.status === 'processing' || imp.status === 'validating';
            
            return (
              <motion.div
                key={imp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={cn("p-3 rounded-xl", isDark ? "bg-neutral-800" : "bg-neutral-100")}>
                        <FileIcon className={cn("h-6 w-6", isDark ? "text-teal-400" : "text-teal-600")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={cn("font-semibold truncate", isDark ? "text-white" : "text-neutral-900")}>
                            {imp.name}
                          </h4>
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(imp.status))}>
                            {isProcessing && <Loader2 className="h-3 w-3 animate-spin inline mr-1" />}
                            {imp.status}
                          </span>
                        </div>
                        <p className={cn("text-sm mt-0.5", isDark ? "text-neutral-400" : "text-neutral-600")}>
                          {imp.file_name} • {formatFileSize(imp.file_size)} • {imp.import_type}
                        </p>
                        
                        {/* Progress Bar */}
                        {isProcessing && (
                          <div className="mt-3">
                            <div className={cn("h-2 rounded-full overflow-hidden", isDark ? "bg-neutral-800" : "bg-neutral-200")}>
                              <motion.div
                                className="h-full bg-teal-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${imp.progress}%` }}
                              />
                            </div>
                            <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                              {imp.progress}% complete • {imp.processed_records} of {imp.total_records} records
                            </p>
                          </div>
                        )}
                        
                        {/* Results */}
                        {imp.status === 'completed' && (
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className={cn("text-sm", isDark ? "text-green-400" : "text-green-600")}>
                                {imp.successful_records} successful
                              </span>
                            </div>
                            {imp.failed_records > 0 && (
                              <div className="flex items-center gap-1">
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className={cn("text-sm", isDark ? "text-red-400" : "text-red-600")}>
                                  {imp.failed_records} failed
                                </span>
                              </div>
                            )}
                            {imp.skipped_records > 0 && (
                              <div className="flex items-center gap-1">
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                <span className={cn("text-sm", isDark ? "text-yellow-400" : "text-yellow-600")}>
                                  {imp.skipped_records} skipped
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Timestamp */}
                        <p className={cn("text-xs mt-2 flex items-center gap-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                          <Clock className="h-3 w-3" />
                          {imp.completed_at 
                            ? `Completed ${new Date(imp.completed_at).toLocaleString()}`
                            : `Created ${new Date(imp.created_at).toLocaleString()}`
                          }
                          {imp.creator && ` by ${imp.creator.full_name}`}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {imp.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleProcess(imp.id)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                          Process
                        </Button>
                      )}
                      
                      {isProcessing && imp.status !== 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(imp.id)}
                        >
                          <Pause className="h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                      
                      {imp.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedImport(imp); setDetailsModalOpen(true); }}
                        >
                          <Eye className="h-4 w-4" />
                          Details
                        </Button>
                      )}
                      
                      {(imp.status === 'completed' || imp.status === 'failed' || imp.status === 'cancelled') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(imp.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Upload className={cn("h-12 w-12 mx-auto mb-4", isDark ? "text-neutral-600" : "text-neutral-400")} />
          <h4 className={cn("font-medium mb-2", isDark ? "text-white" : "text-neutral-900")}>
            No imports yet
          </h4>
          <p className={cn("text-sm mb-4", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Upload a file to get started with batch importing
          </p>
          <Button onClick={() => { resetForm(); setUploadModalOpen(true); }}>
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </Card>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50" onClick={() => { setUploadModalOpen(false); resetForm(); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn("fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-xl shadow-xl p-6", isDark ? "bg-neutral-900" : "bg-white")}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  Upload File
                </h3>
                <button onClick={() => { setUploadModalOpen(false); resetForm(); }} className={cn("p-1 rounded-lg transition-colors", isDark ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600")}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Drag & Drop Area */}
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                    dragActive
                      ? "border-teal-500 bg-teal-500/10"
                      : isDark ? "border-neutral-700 hover:border-neutral-600" : "border-neutral-300 hover:border-neutral-400"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {formData.file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileSpreadsheet className={cn("h-10 w-10", isDark ? "text-teal-400" : "text-teal-600")} />
                      <div className="text-left">
                        <p className={cn("font-medium", isDark ? "text-white" : "text-neutral-900")}>
                          {formData.file.name}
                        </p>
                        <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                          {formatFileSize(formData.file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(f => ({ ...f, file: null }))}
                        className={cn("p-1 rounded-lg", isDark ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-200 text-neutral-600")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className={cn("h-10 w-10 mx-auto mb-3", isDark ? "text-neutral-600" : "text-neutral-400")} />
                      <p className={cn("text-sm mb-1", isDark ? "text-neutral-300" : "text-neutral-700")}>
                        Drag and drop your file here, or
                      </p>
                      <label className={cn("text-sm font-medium cursor-pointer", isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700")}>
                        browse
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv,.xlsx,.json"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className={cn("text-xs mt-2", isDark ? "text-neutral-500" : "text-neutral-500")}>
                        CSV, Excel, JSON, or EDI 837 files up to 10MB
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Import Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Q4 2024 Claims"
                  />
                </div>

                <div>
                  <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                    Import Type
                  </label>
                  <Select
                    value={formData.import_type}
                    onChange={(e) => setFormData({ ...formData, import_type: e.target.value as any })}
                  >
                    {IMPORT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label} - {type.description}</option>
                    ))}
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setUploadModalOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.file || uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload & Process
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {detailsModalOpen && selectedImport && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50" onClick={() => setDetailsModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn("fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6", isDark ? "bg-neutral-900" : "bg-white")}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  Import Details
                </h3>
                <button onClick={() => setDetailsModalOpen(false)} className={cn("p-1 rounded-lg transition-colors", isDark ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-neutral-100 text-neutral-600")}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className={cn("p-4 rounded-lg", isDark ? "bg-neutral-800" : "bg-neutral-50")}>
                  <p className={cn("text-sm font-medium mb-3", isDark ? "text-white" : "text-neutral-900")}>
                    {selectedImport.name}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>File</p>
                      <p className={cn(isDark ? "text-white" : "text-neutral-900")}>{selectedImport.file_name}</p>
                    </div>
                    <div>
                      <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>Size</p>
                      <p className={cn(isDark ? "text-white" : "text-neutral-900")}>{formatFileSize(selectedImport.file_size)}</p>
                    </div>
                    <div>
                      <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>Type</p>
                      <p className={cn("capitalize", isDark ? "text-white" : "text-neutral-900")}>{selectedImport.import_type}</p>
                    </div>
                    <div>
                      <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>Format</p>
                      <p className={cn("uppercase", isDark ? "text-white" : "text-neutral-900")}>{selectedImport.file_type}</p>
                    </div>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="grid grid-cols-4 gap-3">
                  <div className={cn("p-3 rounded-lg text-center", isDark ? "bg-neutral-800" : "bg-neutral-50")}>
                    <p className={cn("text-xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                      {selectedImport.total_records}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>Total</p>
                  </div>
                  <div className={cn("p-3 rounded-lg text-center", isDark ? "bg-green-500/10" : "bg-green-50")}>
                    <p className="text-xl font-semibold text-green-500">
                      {selectedImport.successful_records}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-green-400" : "text-green-600")}>Success</p>
                  </div>
                  <div className={cn("p-3 rounded-lg text-center", isDark ? "bg-red-500/10" : "bg-red-50")}>
                    <p className="text-xl font-semibold text-red-500">
                      {selectedImport.failed_records}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-red-400" : "text-red-600")}>Failed</p>
                  </div>
                  <div className={cn("p-3 rounded-lg text-center", isDark ? "bg-yellow-500/10" : "bg-yellow-50")}>
                    <p className="text-xl font-semibold text-yellow-500">
                      {selectedImport.skipped_records}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-yellow-400" : "text-yellow-600")}>Skipped</p>
                  </div>
                </div>

                {/* Errors */}
                {selectedImport.errors && selectedImport.errors.length > 0 && (
                  <div>
                    <p className={cn("text-sm font-medium mb-2", isDark ? "text-neutral-300" : "text-neutral-700")}>
                      Errors ({selectedImport.errors.length})
                    </p>
                    <div className={cn("max-h-48 overflow-y-auto rounded-lg", isDark ? "bg-red-500/10" : "bg-red-50")}>
                      {selectedImport.errors.slice(0, 10).map((error, i) => (
                        <div key={i} className={cn("px-3 py-2 text-xs border-b last:border-b-0", isDark ? "border-red-500/20 text-red-400" : "border-red-200 text-red-600")}>
                          Row {error.row}: {error.field} - {error.error}
                        </div>
                      ))}
                      {selectedImport.errors.length > 10 && (
                        <p className={cn("px-3 py-2 text-xs", isDark ? "text-red-400" : "text-red-600")}>
                          +{selectedImport.errors.length - 10} more errors
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Timing */}
                <div className={cn("p-3 rounded-lg text-xs", isDark ? "bg-neutral-800" : "bg-neutral-50")}>
                  <div className="flex justify-between">
                    <span className={cn(isDark ? "text-neutral-400" : "text-neutral-600")}>Started</span>
                    <span className={cn(isDark ? "text-white" : "text-neutral-900")}>
                      {selectedImport.started_at ? new Date(selectedImport.started_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className={cn(isDark ? "text-neutral-400" : "text-neutral-600")}>Completed</span>
                    <span className={cn(isDark ? "text-white" : "text-neutral-900")}>
                      {selectedImport.completed_at ? new Date(selectedImport.completed_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BatchImporter;
