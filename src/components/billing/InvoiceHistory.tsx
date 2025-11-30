import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  Receipt,
  Calendar,
} from 'lucide-react';
import { Card } from '../ui/card';
import {
  getInvoices,
  formatPriceDetailed,
  formatDate,
  getStatusColor,
  Invoice,
} from '../../lib/billing';

export function InvoiceHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'open' | 'failed'>('all');

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    setLoading(true);
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'open':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'draft':
        return <FileText className="w-4 h-4 text-neutral-400" />;
      case 'void':
      case 'uncollectible':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    const colorClasses: Record<string, string> = {
      green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      yellow: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      gray: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          colorClasses[color] || colorClasses.gray
        }`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (filter === 'all') return true;
    if (filter === 'failed') return inv.status === 'void' || inv.status === 'uncollectible';
    return inv.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Invoice History
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            View and download your billing history
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'paid', 'open', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <Card className="p-8 text-center">
          <Receipt className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
          <h4 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            {filter === 'all' ? 'No invoices yet' : `No ${filter} invoices`}
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {filter === 'all'
              ? 'Invoices will appear here once you subscribe to a paid plan'
              : 'Try selecting a different filter'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Invoice Info */}
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      <FileText className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {invoice.invoice_number || `INV-${invoice.id.slice(0, 8).toUpperCase()}`}
                        </p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(invoice.invoice_date)}
                        </span>
                        {invoice.period_start && invoice.period_end && (
                          <span>
                            {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {formatPriceDetailed(invoice.total, invoice.currency)}
                      </p>
                      {invoice.status === 'paid' && invoice.paid_at && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          Paid {formatDate(invoice.paid_at)}
                        </p>
                      )}
                      {invoice.status === 'open' && invoice.due_date && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Due {formatDate(invoice.due_date)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {invoice.invoice_pdf_url && (
                        <a
                          href={invoice.invoice_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download PDF"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <Download className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </a>
                      )}
                      {invoice.hosted_invoice_url && (
                        <a
                          href={invoice.hosted_invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Invoice"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </a>
                      )}
                      {invoice.status === 'open' && invoice.hosted_invoice_url && (
                        <a
                          href={invoice.hosted_invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-8 px-3 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Pay Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Line Items (expandable) */}
                {invoice.line_items && invoice.line_items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                      Items
                    </p>
                    <div className="space-y-1">
                      {invoice.line_items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {item.description}
                            {item.quantity > 1 && ` × ${item.quantity}`}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {formatPriceDetailed(item.amount, item.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {invoices.length > 0 && (
        <Card className="p-4 bg-neutral-50 dark:bg-neutral-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {invoices.length}
              </p>
              <p className="text-xs text-neutral-500">Total Invoices</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {formatPriceDetailed(
                  invoices
                    .filter((i) => i.status === 'paid')
                    .reduce((sum, i) => sum + i.amount_paid, 0),
                  'usd'
                )}
              </p>
              <p className="text-xs text-neutral-500">Total Paid</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {invoices.filter((i) => i.status === 'open').length}
              </p>
              <p className="text-xs text-neutral-500">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-600">
                {formatPriceDetailed(
                  invoices
                    .filter((i) => i.status === 'open')
                    .reduce((sum, i) => sum + i.amount_due, 0),
                  'usd'
                )}
              </p>
              <p className="text-xs text-neutral-500">Outstanding</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default InvoiceHistory;
