import React, { useState, useEffect } from 'react';
import { Product, PlatformType, DeliveryType } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Save, Plus, Trash2, KeyRound } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit
}) => {
  const { categories, addProduct, updateProduct } = useStore();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('19.99');
  const [originalPrice, setOriginalPrice] = useState('49.99');
  const [category, setCategory] = useState('gaming');
  const [subcategory, setSubcategory] = useState('Keys');
  const [platform, setPlatform] = useState<PlatformType>('Steam');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('instant_key');
  const [deliveryTime, setDeliveryTime] = useState('Instant (< 5s)');
  const [stockCount, setStockCount] = useState('50');
  const [image, setImage] = useState('');
  const [features, setFeatures] = useState<string[]>(['100% Genuine Activation Key', 'Worldwide Global Region']);
  const [featureInput, setFeatureInput] = useState('');
  const [instructions, setInstructions] = useState('');
  const [sampleKeys, setSampleKeys] = useState<string[]>([]);
  const [sampleKeyInput, setSampleKeyInput] = useState('');
  const [warranty, setWarranty] = useState('Lifetime Replacement Guarantee');

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setShortDescription(productToEdit.shortDescription);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price.toString());
      setOriginalPrice(productToEdit.originalPrice ? productToEdit.originalPrice.toString() : '');
      setCategory(productToEdit.category);
      setSubcategory(productToEdit.subcategory || '');
      setPlatform(productToEdit.platform);
      setDeliveryType(productToEdit.deliveryType);
      setDeliveryTime(productToEdit.deliveryTime);
      setStockCount(productToEdit.stockCount.toString());
      setImage(productToEdit.image);
      setFeatures(productToEdit.features || []);
      setInstructions(productToEdit.instructions || '');
      setSampleKeys(productToEdit.sampleKeys || []);
      setWarranty(productToEdit.warranty || 'Lifetime Guarantee');
    } else {
      setTitle('');
      setShortDescription('');
      setDescription('');
      setPrice('14.99');
      setOriginalPrice('49.99');
      setCategory('gaming');
      setSubcategory('Keys');
      setPlatform('Steam');
      setDeliveryType('instant_key');
      setDeliveryTime('Instant (< 5s)');
      setStockCount('50');
      setImage('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80');
      setFeatures(['Official Retail Key', 'Instant Automated Dispatch']);
      setInstructions('Activate in your launcher account settings.');
      setSampleKeys(['BHSS-DEMO-KEY-8821-4412']);
      setWarranty('Lifetime Key Guarantee');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput.trim()]);
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddKey = () => {
    if (!sampleKeyInput.trim()) return;
    setSampleKeys([...sampleKeys, sampleKeyInput.trim()]);
    setSampleKeyInput('');
  };

  const handleRemoveKey = (idx: number) => {
    setSampleKeys(sampleKeys.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price) || 0;
    const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    const parsedStock = parseInt(stockCount, 10) || 0;

    const payload = {
      title,
      shortDescription,
      description,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      category,
      subcategory,
      platform,
      deliveryType,
      deliveryTime,
      inStock: parsedStock > 0,
      stockCount: parsedStock,
      rating: productToEdit ? productToEdit.rating : 5.0,
      reviewsCount: productToEdit ? productToEdit.reviewsCount : 1,
      image,
      features,
      instructions,
      sampleKeys,
      warranty
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <h2 className="text-lg font-black text-white">
            {productToEdit ? 'Edit Digital Product' : 'Add New Digital Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300">Product Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Windows 11 Pro Retail License"
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                {categories.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Platform *</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PlatformType)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="Steam">Steam</option>
                <option value="Windows">Windows</option>
                <option value="Xbox">Xbox</option>
                <option value="PlayStation">PlayStation</option>
                <option value="EA App">EA App</option>
                <option value="Multiplatform">Multiplatform</option>
                <option value="Web/Cloud">Web / Cloud</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300">Price (USD) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Original Price</label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Initial Stock *</label>
              <input
                type="number"
                required
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Image URL</label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Short Summary</label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Full Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          {/* Key Pool Section */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pre-loaded Key Pool ({sampleKeys.length})</span>
              </span>
              <span className="text-[10px] text-slate-400">Randomly assigned at checkout</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={sampleKeyInput}
                onChange={(e) => setSampleKeyInput(e.target.value)}
                placeholder="Paste key: XXXXX-XXXXX-XXXXX-XXXXX"
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300"
              />
              <button
                type="button"
                onClick={handleAddKey}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white"
              >
                Add Key
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
              {sampleKeys.map((k, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300"
                >
                  <span>{k}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKey(idx)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
            >
              <Save className="w-4 h-4" />
              <span>{productToEdit ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
