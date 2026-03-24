"use client";

import { useState, useEffect } from "react";
import { Plus, Package as PackageIcon, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

type Product = {
  _id: string;
  name: string;
  price: string;
  stock: string;
  status: string;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductsPage() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/products?clerkId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!user || !newProductName || !newProductPrice || !newProductStock) return;
    setAddingProduct(true);
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          name: newProductName,
          price: newProductPrice,
          stock: newProductStock
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        setNewProductName("");
        setNewProductPrice("");
        setNewProductStock("");
        fetchProducts(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}?clerkId=${user.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Products Catalog</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage the real products that your AI agent will reference.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden shadow-xl min-h-[400px]">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-zinc-400">
            <PackageIcon className="w-16 h-16 opacity-30 mb-4" />
            <p className="text-lg text-white mb-2">No products found</p>
            <p className="text-sm">Click "Add Product" to create your first item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-black/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Product Name</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date Added</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-md flex items-center justify-center text-zinc-400 shadow-inner">
                          <PackageIcon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <span className="font-medium text-zinc-100">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-emerald-300 font-mono">{product.price}</td>
                    <td className="px-6 py-4 text-zinc-300">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{new Date(product.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-md transition-all">
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Basic Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white mb-4">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Product Name</label>
                <input 
                  type="text" 
                  value={newProductName} 
                  onChange={e => setNewProductName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Premium Leather Shoes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Price</label>
                  <input 
                    type="text" 
                    value={newProductPrice} 
                    onChange={e => setNewProductPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. ₹2999"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Stock Info</label>
                  <input 
                    type="text" 
                    value={newProductStock} 
                    onChange={e => setNewProductStock(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 15 items"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateProduct} disabled={addingProduct} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                {addingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
