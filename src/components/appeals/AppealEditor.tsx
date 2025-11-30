import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Download,
  Sparkles,
  RefreshCw,
  Save,
  Maximize2,
  Minimize2,
  FileText,
  Check,
} from 'lucide-react';
import axios from 'axios';

interface AppealEditorProps {
  appealId: string;
  initialContent?: string;
  denialReason?: string;
  denialCode?: string;
  onSave?: (content: string) => void;
  readOnly?: boolean;
}

export function AppealEditor({
  appealId,
  initialContent = '',
  denialReason: _denialReason,
  denialCode: _denialCode,
  onSave,
  readOnly = false,
}: AppealEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generationType, setGenerationType] = useState<'ai' | 'template' | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`/api/appeals/${appealId}/generate-letter`, {
        additional_context: '',
      });
      
      if (response.data.success) {
        setContent(response.data.letter);
        setGenerationType(response.data.type);
      }
    } catch (error) {
      console.error('Failed to generate letter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(content);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appeal-letter-${appealId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const insertText = (before: string, after: string = '') => {
    if (!editorRef.current || readOnly) return;
    
    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    
    setContent(newContent);
    
    // Restore focus
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length
        );
      }
    }, 0);
  };

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-white'
    : 'rounded-xl border border-neutral-200 bg-white';

  return (
    <div className={containerClasses}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-neutral-50 rounded-t-xl">
        <div className="flex items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-0.5 mr-2">
            <button
              onClick={() => insertText('**', '**')}
              disabled={readOnly}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded disabled:opacity-50"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertText('_', '_')}
              disabled={readOnly}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded disabled:opacity-50"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertText('<u>', '</u>')}
              disabled={readOnly}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded disabled:opacity-50"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-0.5 mr-2 pl-2 border-l border-neutral-300">
            <button
              onClick={() => insertText('• ')}
              disabled={readOnly}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded disabled:opacity-50"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertText('1. ')}
              disabled={readOnly}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded disabled:opacity-50"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-0.5 pl-2 border-l border-neutral-300">
            <button
              disabled={readOnly}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded disabled:opacity-50"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              disabled={readOnly}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded disabled:opacity-50"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              disabled={readOnly}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded disabled:opacity-50"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Generate */}
          {!readOnly && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </>
              )}
            </motion.button>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 pl-2 border-l border-neutral-300">
            <button
              onClick={handleCopy}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded relative"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded"
              title="Download as text file"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Save */}
          {onSave && !readOnly && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* AI Generated Badge */}
      {generationType && (
        <div className="px-4 py-2 bg-purple-50 border-b border-purple-100">
          <div className="flex items-center gap-2 text-sm text-purple-700">
            {generationType === 'ai' ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>AI-generated letter (Gemini 2.0 Flash)</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generated from template</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Editor */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-100px)]' : 'h-96'}`}>
        <textarea
          ref={editorRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          readOnly={readOnly}
          placeholder={readOnly ? 'No appeal letter content yet...' : 'Start typing your appeal letter here, or use AI to generate one...'}
          className={`w-full h-full px-6 py-4 text-neutral-800 leading-relaxed resize-none focus:outline-none font-mono text-sm ${
            readOnly ? 'bg-neutral-50 cursor-default' : 'bg-white'
          }`}
          style={{ fontFamily: 'Georgia, serif', fontSize: '14px', lineHeight: '1.8' }}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-neutral-200 bg-neutral-50 rounded-b-xl flex items-center justify-between text-xs text-neutral-500">
        <span>{content.length.toLocaleString()} characters</span>
        <span>{content.split(/\s+/).filter(Boolean).length.toLocaleString()} words</span>
      </div>
    </div>
  );
}
