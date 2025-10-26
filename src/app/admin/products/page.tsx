// import { prisma } from "@/lib/prisma";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { formatPrice } from "@/lib/utils";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { DeleteProductButton } from "@/components/admin/delete-product-button";

// async function getProducts() {
//   const products = await prisma.product.findMany({
//     include: {
//       category: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return products.map((product) => ({
//     ...product,
//     price: product.price.toNumber(),
//     comparePrice: product.comparePrice?.toNumber() || null,
//   }));
// }

// export default async function ProductsPage() {
//   const products = await getProducts();

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Products</h1>
//           <p className="text-muted-foreground">Manage your product catalog</p>
//         </div>
//         <Button asChild>
//           <Link href="/admin/products/new">
//             <Plus className="h-4 w-4 mr-2" />
//             Add Product
//           </Link>
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All Products ({products.length})</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Inventory</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {products.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center py-8">
//                     No products found. Add your first product.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 products.map((product) => (
//                   <TableRow key={product.id}>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={product.image}
//                           alt={product.name}
//                           className="w-12 h-12 rounded object-cover"
//                         />
//                         <div>
//                           <p className="font-medium">{product.name}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {product.slug}
//                           </p>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>{product.category.name}</TableCell>
//                     <TableCell>
//                       <div>
//                         <p className="font-medium">
//                           {formatPrice(product.price)}
//                         </p>
//                         {product.comparePrice && (
//                           <p className="text-sm text-muted-foreground line-through">
//                             {formatPrice(product.comparePrice)}
//                           </p>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <span
//                         className={
//                           product.inventory < 5
//                             ? "text-destructive font-medium"
//                             : ""
//                         }
//                       >
//                         {product.inventory}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       {product.inStock ? (
//                         <Badge variant="default">In Stock</Badge>
//                       ) : (
//                         <Badge variant="secondary">Out of Stock</Badge>
//                       )}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button variant="ghost" size="icon" asChild>
//                           <Link href={`/admin/products/${product.id}/edit`}>
//                             <Pencil className="h-4 w-4" />
//                           </Link>
//                         </Button>
//                         <DeleteProductButton productId={product.id} />
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DeleteProductButton } from '@/components/admin/delete-product-button';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  inventory: number;
  inStock: boolean;
  category: {
    id: string;
    name: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on search
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Products ({pagination.total})</CardTitle>
            <div className="w-64">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No products found. Add your first product.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {formatPrice(product.price)}
                        </p>
                        {product.comparePrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.comparePrice)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.inventory < 5
                            ? 'text-destructive font-medium'
                            : ''
                        }
                      >
                        {product.inventory}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <Badge variant="default">In Stock</Badge>
                      ) : (
                        <Badge variant="secondary">Out of Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages} ({pagination.total}{' '}
                total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
