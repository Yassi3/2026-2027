import React, { useState, useEffect, useRef } from 'react';
import { Product, PlatformType, DeliveryType } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Save,
  Plus,
  Trash2,
  KeyRound,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

/**
 * Compresses and scales an image file to prevent overflowing localStorage quotas.
 * Resizes to max 1000x1000 maintaining aspect ratio, JPEG/WebP quality 0.85.
 */
const optimizeImageFile = (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP)'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier image'));
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Échec du traitement de l’image'));
        return;
      }

      // If SVG, return directly as data URL
      if (file.type.includes('svg')) {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Échec du chargement de l’image pour optimisation'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
};

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
  
  // Image states
  const [image, setImage] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setImage(productToEdit.image || '');
      setImageMode(productToEdit.image?.startsWith('http') ? 'url' : 'upload');
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
      setImage('');
      setImageMode('upload');
      setFeatures(['Official Retail Key', 'Instant Automated Dispatch']);
      setInstructions('Activate in your launcher account settings.');
      setSampleKeys([]);
      setWarranty('Lifetime Key Guarantee');
    }
    setImageError(null);
    setIsProcessingImage(false);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    setImageError(null);
    setIsProcessingImage(true);
    try {
      const optimizedDataUrl = await optimizeImageFile(file);
      setImage(optimizedDataUrl);
      setImageMode('upload');
    } catch (err: any) {
      setImageError(err?.message || 'Erreur lors du traitement de l’image');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // reset input so same file can be picked again if needed
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    setImageError(null);
  };

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
    
    // Default fallback image if none provided
    const finalImage =
      image.trim() ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80';

    const payload = {
      title,
      shortDescription: shortDescription.trim() || title,
      description: description.trim() || shortDescription.trim() || title,
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
      image: finalImage,
      features: features.length > 0 ? features : ['100% Genuine Activation Key', 'Worldwide Global Region'],
      instructions: instructions || 'Activate according to provider instructions.',
      sampleKeys: sampleKeys.length > 0 ? sampleKeys : [`KEY-${Date.now().toString().slice(-6)}`],
      warranty: warranty || 'Lifetime Key Guarantee'
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
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <ImageIcon className="w-4 h-4" />
              </span>
              <span>{productToEdit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Téléchargez votre propre image depuis votre appareil ou insérez un lien
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300">Titre du produit / Product Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Windows 11 Pro Retail License, GTA V Premium..."
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300">Catégorie / Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="software">💻 OS & Logiciels (Windows, Office, Adobe, Canva...)</option>
                <option value="streaming">📺 Streaming & Musique (Apple Music, Spotify, Netflix, YouTube...)</option>
                <option value="gaming">🎮 Jeux & Clés (Steam, Xbox, PlayStation, EA...)</option>
                <option value="giftcards">💳 Cartes Cadeaux & Robux (Steam, PSN, Robux...)</option>
                <option value="vpn">🛡️ VPN & Antivirus (NordVPN, Kaspersky...)</option>
                <option value="ai-dev">⚡ IA & Développeurs (ChatGPT Plus, Copilot...)</option>
                {categories
                  .filter((c) => !['all', 'software', 'streaming', 'gaming', 'giftcards', 'vpn', 'ai-dev'].includes(c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Plateforme / Platform *</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PlatformType)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
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
              <label className="text-xs font-bold text-slate-300">Prix ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Prix d'origine (Optionnel)</label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Ex: 49.99"
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Quantité en stock *</label>
              <input
                type="number"
                required
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>صورة المنتج / Product Image</span>
              </label>

              {/* Mode switch tabs */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                    imageMode === 'upload'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>من جهازي (Upload)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                    imageMode === 'url'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>رابط (Link)</span>
                </button>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* MODE 1: Upload from Device */}
            {imageMode === 'upload' && (
              <div className="space-y-3">
                {image ? (
                  // Preview card when an image is selected
                  <div className="flex items-center gap-4 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl relative overflow-hidden group">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                      <img
                        src={image}
                        alt="Aperçu produit"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        <span>تم تجهيز الصورة بنجاح</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {image.startsWith('data:image')
                          ? 'صورة محملة من جهازك (جاهزة ومضغوطة تلقائياً)'
                          : 'صورة جاهزة للمنتج'}
                      </p>

                      <div className="flex items-center gap-2 pt-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isProcessingImage}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium transition cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>تغيير الصورة</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-medium transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Drag and Drop dropzone
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                      isDragging
                        ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                        : 'border-slate-800 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/80'
                    }`}
                  >
                    {isProcessingImage ? (
                      <div className="py-4 flex flex-col items-center gap-2 text-indigo-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-xs font-bold">جاري معالجة وضغط الصورة...</span>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white">
                            انقر لاختيار صورة من هاتفك أو حاسوبك
                          </p>
                          <p className="text-[11px] text-slate-400">
                            أو اسحب الصورة وأفلتها هنا (Drag & Drop)
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          PNG, JPG, WEBP, GIF • معالجة وتحسين تلقائي للحجم
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: External Image URL */}
            {imageMode === 'url' && (
              <div className="space-y-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... ou lien direct .jpg, .png"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
                {image && image.startsWith('http') && (
                  <div className="flex items-center gap-3 p-2 bg-slate-900 border border-slate-800 rounded-xl">
                    <img
                      src={image}
                      alt="URL Preview"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0"
                      onError={() => setImageError('Le lien de l’image semble inaccessible ou invalide')}
                    />
                    <div className="flex-1 text-[11px] text-slate-300 truncate">
                      {image}
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {imageError && (
              <div className="flex items-center gap-1.5 p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Description courte / Short Summary</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ex: Clé d'activation officielle globale et garantie à vie"
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Description complète / Full Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails du produit, fonctionnalités, compatibilité..."
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Key Pool Section */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Clés d'activation ({sampleKeys.length})</span>
              </span>
              <span className="text-[10px] text-slate-400">Distribué automatiquement à la commande</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={sampleKeyInput}
                onChange={(e) => setSampleKeyInput(e.target.value)}
                placeholder="Ex: XXXXX-XXXXX-XXXXX-XXXXX"
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddKey}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition cursor-pointer"
              >
                Ajouter clé
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
                    className="text-slate-500 hover:text-rose-400 transition"
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
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isProcessingImage}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{productToEdit ? 'Enregistrer les modifications' : 'Publier le produit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

