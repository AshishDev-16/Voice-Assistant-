import { Plus, Package as PackageIcon, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockProducts = [
  { id: "P1", name: "Pro Plan Subscription", price: "₹49.00", stock: "Unlimited", status: "Active", added: "Oct 12, 2023" },
  { id: "P2", name: "Starter Plan", price: "₹0.00", stock: "Unlimited", status: "Active", added: "Oct 12, 2023" },
  { id: "P3", name: "Enterprise Custom Setup", price: "₹999.00", stock: "5 slots", status: "Draft", added: "Nov 01, 2023" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Products Catalog</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage the products that the AI can sell.</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden shadow-xl">
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
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-md flex items-center justify-center text-zinc-400 shadow-inner">
                        <PackageIcon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-zinc-100">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{product.price}</td>
                  <td className="px-6 py-4 text-zinc-400">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      product.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{product.added}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
