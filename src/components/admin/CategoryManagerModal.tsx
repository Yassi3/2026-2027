import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Plus, Trash2, FolderPlus } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Sparkles');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({
      name: name.trim(),
      slug: slug.trim().toLowerCase() || name.trim().toLowerCase().replace(/\s+/g, '-'),
      description: description.trim() || 'Browse digital items',
      icon
    });

    setName('');
    setSlug('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-white">Manage Store Categories</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Categories */}
        <div className="space-y-2 max-h-52 overflow-y-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white">{cat.name}</span>
                <span className="text-slate-500 font-mono ml-2">({cat.slug})</span>
              </div>

              {cat.id !== 'all' && (
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Category Form */}
        <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-200">Add New Category</div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (e.g. Cloud Hosting)"
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
            />
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Slug (optional)"
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
