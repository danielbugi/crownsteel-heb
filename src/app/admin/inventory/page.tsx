// src/app/admin/inventory/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  FileDown,
  Bell,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  inventory: number;
  lowStockThreshold: number;
  reservedQuantity: number;
  availableQuantity: number;
  category: { name: string };
  inventoryAlerts: any[];
}

interface InventoryStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  activeAlerts: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [adjustingProduct, setAdjustingProduct] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/inventory?filter=${filter}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
        setStats(data.stats);
      } else {
        toast.error('Failed to fetch inventory');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustInventory = async (
    productId: string,
    quantity: number,
    type: string
  ) => {
    try {
      setAdjustingProduct(productId);
      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity,
          type,
          reason: 'Manual adjustment',
        }),
      });

      if (response.ok) {
        toast.success('Inventory updated');
        fetchInventory();
      } else {
        toast.error('Failed to update inventory');
      }
    } catch (error) {
      toast.error('Error updating inventory');
    } finally {
      setAdjustingProduct(null);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.inventory === 0) {
      return { label: 'Out of Stock', color: 'bg-red-500' };
    } else if (product.inventory <= product.lowStockThreshold) {
      return { label: 'Low Stock', color: 'bg-yellow-500' };
    }
    return { label: 'In Stock', color: 'bg-green-500' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage product stock levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchInventory}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/admin/inventory/alerts">
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
              {stats && stats.activeAlerts > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {stats.activeAlerts}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/admin/inventory/logs">
            <Button variant="outline">
              <FileDown className="h-4 w-4 mr-2" />
              Logs
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.lowStockProducts}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Out of Stock
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.outOfStockProducts}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Alerts
              </CardTitle>
              <Bell className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.activeAlerts}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter:</label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Product</th>
                    <th className="text-left p-4">SKU</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-center p-4">Stock</th>
                    <th className="text-center p-4">Reserved</th>
                    <th className="text-center p-4">Available</th>
                    <th className="text-center p-4">Status</th>
                    <th className="text-center p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const status = getStockStatus(product);
                    return (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              {product.inventoryAlerts.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-yellow-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  {product.inventoryAlerts.length} alert(s)
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {product.sku || 'N/A'}
                        </td>
                        <td className="p-4 text-sm">{product.category.name}</td>
                        <td className="p-4 text-center">
                          <span className="font-bold">{product.inventory}</span>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                          {product.reservedQuantity}
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-semibold text-green-600">
                            {product.availableQuantity}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <Badge className={status.color}>{status.label}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleAdjustInventory(product.id, 10, 'RESTOCK')
                              }
                              disabled={adjustingProduct === product.id}
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              +10
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleAdjustInventory(
                                  product.id,
                                  -10,
                                  'ADJUSTMENT'
                                )
                              }
                              disabled={
                                adjustingProduct === product.id ||
                                product.availableQuantity < 10
                              }
                            >
                              <TrendingDown className="h-3 w-3 mr-1" />
                              -10
                            </Button>
                            <Link href={`/admin/products/${product.id}`}>
                              <Button size="sm" variant="ghost">
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
