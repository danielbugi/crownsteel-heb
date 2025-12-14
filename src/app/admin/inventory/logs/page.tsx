// src/app/admin/inventory/logs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Package,
  RefreshCw,
  FileDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface InventoryLog {
  id: string;
  type: string;
  quantity: number;
  reason: string | null;
  reference: string | null;
  previousQty: number;
  newQty: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sku: string | null;
    image: string;
  };
}

export default function InventoryLogsPage() {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchLogs();
  }, [filter, page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });

      if (filter !== 'all') {
        params.append('type', filter);
      }

      const response = await fetch(`/api/admin/inventory/logs?${params}`);
      const data = await response.json();

      if (response.ok) {
        setLogs(data.logs);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching logs');
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (type: string) => {
    if (type === 'SALE' || type === 'DAMAGE' || type === 'LOSS') {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else if (type === 'RESTOCK' || type === 'RETURN') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    return <Package className="h-4 w-4 text-blue-500" />;
  };

  const getLogColor = (type: string) => {
    if (type === 'SALE' || type === 'DAMAGE' || type === 'LOSS') {
      return 'text-red-600';
    } else if (type === 'RESTOCK' || type === 'RETURN') {
      return 'text-green-600';
    }
    return 'text-blue-600';
  };

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('type', filter);
      }

      // In a real implementation, this would download a CSV
      toast.success('Export functionality coming soon!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/inventory">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Inventory Logs</h1>
            <p className="text-muted-foreground">
              View complete history of inventory changes
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by Type:</label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="SALE">Sales</SelectItem>
                <SelectItem value="RESTOCK">Restocks</SelectItem>
                <SelectItem value="RETURN">Returns</SelectItem>
                <SelectItem value="ADJUSTMENT">Adjustments</SelectItem>
                <SelectItem value="DAMAGE">Damaged</SelectItem>
                <SelectItem value="LOSS">Lost/Stolen</SelectItem>
                <SelectItem value="RESERVATION">Reservations</SelectItem>
                <SelectItem value="RELEASE">Released</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-sm text-muted-foreground">
              Showing {logs.length} of {pagination.total} logs
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Change History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No logs found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Date & Time</th>
                      <th className="text-left p-4">Product</th>
                      <th className="text-left p-4">Type</th>
                      <th className="text-center p-4">Change</th>
                      <th className="text-center p-4">Previous</th>
                      <th className="text-center p-4">New</th>
                      <th className="text-left p-4">Reason</th>
                      <th className="text-left p-4">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 text-sm">
                          <div>
                            {format(new Date(log.createdAt), 'MMM d, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(log.createdAt), 'h:mm a')}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 overflow-hidden">
                              <Image
                                src={log.product.image}
                                alt={log.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="text-sm">
                              <div className="font-medium">
                                {log.product.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                SKU: {log.product.sku || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getLogIcon(log.type)}
                            <Badge variant="outline">
                              {log.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`font-bold ${getLogColor(log.type)}`}
                          >
                            {log.quantity > 0 ? '+' : ''}
                            {log.quantity}
                          </span>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                          {log.previousQty}
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-semibold">{log.newQty}</span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {log.reason || '-'}
                        </td>
                        <td className="p-4 text-sm">
                          {log.reference ? (
                            <Link
                              href={`/admin/orders/${log.reference}`}
                              className="text-blue-600 hover:underline"
                            >
                              {log.reference.slice(0, 8)}...
                            </Link>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {pagination.pages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(pagination.pages, p + 1))
                    }
                    disabled={page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
