import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <h3 className="text-lg font-medium text-white mb-4">WhatsApp Integration</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Phone Number ID</label>
              <input 
                type="text" 
                defaultValue="112233445566778"
                className="h-10 w-full rounded-md border border-white/10 bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:bg-black/30 focus:outline-none shadow-inner"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">WhatsApp Business Account ID</label>
              <input 
                type="text" 
                defaultValue="100000000000000"
                className="h-10 w-full rounded-md border border-white/10 bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:bg-black/30 focus:outline-none shadow-inner"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Permanent Access Token</label>
              <input 
                type="password" 
                defaultValue="EAALxxxxxxxxxxxxxxxx"
                className="h-10 w-full rounded-md border border-white/10 bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:bg-black/30 focus:outline-none shadow-inner"
              />
            </div>
            <Button className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">Save Changes</Button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <h3 className="text-lg font-medium text-white mb-4">AI Assistant Persona</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Prompt Instructions</label>
              <textarea 
                rows={4}
                defaultValue="You are a helpful sales assistant. Reply concisely. Always push the customer to buy the Pro plan politely."
                className="w-full rounded-md border border-white/10 bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:bg-black/30 focus:outline-none resize-none shadow-inner"
              />
            </div>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">Update AI Persona</Button>
          </div>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-950/20 backdrop-blur-2xl p-6 shadow-xl">
          <h3 className="text-lg font-medium text-red-500 mb-2">Danger Zone</h3>
          <p className="text-sm text-zinc-400 mb-4">Once you delete your organization, there is no going back. Please be certain.</p>
          <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400">
            Delete Organization
          </Button>
        </div>
      </div>
    </div>
  );
}
