// src/app/admin/inventory/alerts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  id: string;
  type: string;
  message: string;
  threshold?: number;
  acknowledged: boolean;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
    image: string;
    inventory: number;
  };
}

export default function InventoryAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [showAcknowledged]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/inventory/alerts?acknowledged=${showAcknowledged}`
      );
      const data = await response.json();

      if (response.ok) {
        setAlerts(data.alerts);
      } else {
        toast.error('Failed to fetch alerts');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertIds: string[]) => {
    try {
      const response = await fetch('/api/admin/inventory/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertIds }),
      });

      if (response.ok) {
        toast.success('Alerts acknowledged');
        setSelectedAlerts([]);
        fetchAlerts();
      } else {
        toast.error('Failed to acknowledge alerts');
      }
    } catch (error) {
      toast.error('Error acknowledging alerts');
    }
  };

  const toggleSelectAlert = (alertId: string) => {
    setSelectedAlerts((prev) =>
      prev.includes(alertId)
        ? prev.filter((id) => id !== alertId)
        : [...prev, alertId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAlerts.length === alerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(alerts.map((a) => a.id));
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'OUT_OF_STOCK':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'LOW_STOCK':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'OUT_OF_STOCK':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'LOW_STOCK':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50';
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
            <h1 className="text-3xl font-bold">Inventory Alerts</h1>
            <p className="text-muted-foreground">
              Manage low stock and out of stock alerts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAcknowledged(!showAcknowledged)}
          >
            {showAcknowledged ? 'Show Active' : 'Show Acknowledged'}
          </Button>
          {selectedAlerts.length > 0 && !showAcknowledged && (
            <Button onClick={() => handleAcknowledge(selectedAlerts)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Acknowledge ({selectedAlerts.length})
            </Button>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {showAcknowledged ? 'Acknowledged Alerts' : 'Active Alerts'}
            </CardTitle>
            {alerts.length > 0 && !showAcknowledged && (
              <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
                {selectedAlerts.length === alerts.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {showAcknowledged ? 'No Acknowledged Alerts' : 'All Clear!'}
              </h3>
              <p className="text-muted-foreground">
                {showAcknowledged
                  ? 'No alerts have been acknowledged yet'
                  : 'No active inventory alerts at the moment'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start gap-4">
                    {!showAcknowledged && (
                      <Checkbox
                        checked={selectedAlerts.includes(alert.id)}
                        onCheckedChange={() => toggleSelectAlert(alert.id)}
                      />
                    )}
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            alert.type === 'OUT_OF_STOCK'
                              ? 'destructive'
                              : 'default'
                          }
                        >
                          {alert.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(alert.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="font-medium mb-2">{alert.message}</p>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded overflow-hidden">
                          <Image
                            src={alert.product.image}
                            alt={alert.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">
                            {alert.product.name}
                          </div>
                          <div className="text-muted-foreground">
                            SKU: {alert.product.sku || 'N/A'} | Current Stock:{' '}
                            {alert.product.inventory}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Link href={`/admin/products/${alert.product.id}`}>
                        <Button size="sm" variant="outline">
                          View Product
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
