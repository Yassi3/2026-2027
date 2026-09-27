import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to safely read JSON file
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

// Helper to safely write JSON file
function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initialize files if not existing
if (!fs.existsSync(PRODUCTS_FILE)) {
  writeJsonFile(PRODUCTS_FILE, []);
}
if (!fs.existsSync(ORDERS_FILE)) {
  writeJsonFile(ORDERS_FILE, []);
}

async function startServer() {
  const app = express();

  // Allow larger payload for images (base64 uploads)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // --- PRODUCTS ---
  app.get('/api/products', (req: Request, res: Response) => {
    const products = readJsonFile(PRODUCTS_FILE, []);
    res.json({ success: true, count: products.length, products });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const newProductData = req.body;
      if (!newProductData.title) {
        return res.status(400).json({ success: false, error: 'Product title is required' });
      }

      const products: any[] = readJsonFile(PRODUCTS_FILE, []);
      
      const newProduct = {
        ...newProductData,
        id: newProductData.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: newProductData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Check if product with this ID already exists, update or append
      const existingIdx = products.findIndex((p: any) => p.id === newProduct.id);
      if (existingIdx >= 0) {
        products[existingIdx] = newProduct;
      } else {
        products.unshift(newProduct);
      }

      writeJsonFile(PRODUCTS_FILE, products);
      console.log(`[API] Saved product: ${newProduct.title} (Total: ${products.length})`);
      res.json({ success: true, product: newProduct });
    } catch (err: any) {
      console.error('[API] Error saving product:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const products: any[] = readJsonFile(PRODUCTS_FILE, []);
      const idx = products.findIndex((p: any) => p.id === id);

      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      products[idx] = {
        ...products[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      writeJsonFile(PRODUCTS_FILE, products);
      res.json({ success: true, product: products[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let products: any[] = readJsonFile(PRODUCTS_FILE, []);
      const beforeCount = products.length;
      products = products.filter((p: any) => p.id !== id);

      writeJsonFile(PRODUCTS_FILE, products);
      res.json({ success: true, deleted: beforeCount !== products.length });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Batch sync products (e.g. from local storage initial import)
  app.post('/api/products/batch-sync', (req: Request, res: Response) => {
    try {
      const { products: incomingProducts } = req.body;
      if (!Array.isArray(incomingProducts)) {
        return res.status(400).json({ success: false, error: 'Invalid products array' });
      }

      const existing: any[] = readJsonFile(PRODUCTS_FILE, []);
      const existingMap = new Map(existing.map((p: any) => [p.id, p]));

      // Merge incoming without duplicating
      for (const prod of incomingProducts) {
        if (!existingMap.has(prod.id)) {
          existing.push(prod);
          existingMap.set(prod.id, prod);
        }
      }

      writeJsonFile(PRODUCTS_FILE, existing);
      res.json({ success: true, count: existing.length, products: existing });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- ORDERS ---
  app.get('/api/orders', (req: Request, res: Response) => {
    const orders = readJsonFile(ORDERS_FILE, []);
    res.json({ success: true, count: orders.length, orders });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const newOrder = req.body;
      const orders: any[] = readJsonFile(ORDERS_FILE, []);
      orders.unshift(newOrder);
      writeJsonFile(ORDERS_FILE, orders);
      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/orders/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const orders: any[] = readJsonFile(ORDERS_FILE, []);
      const idx = orders.findIndex((o: any) => o.id === id || o.orderNumber === id);

      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      orders[idx] = { ...orders[idx], ...updates };
      writeJsonFile(ORDERS_FILE, orders);
      res.json({ success: true, order: orders[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    const products = readJsonFile(PRODUCTS_FILE, []);
    const orders = readJsonFile(ORDERS_FILE, []);
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      productsCount: products.length,
      ordersCount: orders.length,
      time: new Date().toISOString()
    });
  });

  // ==========================================
  // FRONTEND / VITE INTEGRATION
  // ==========================================
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(process.cwd(), 'dist');

  if (isProduction && fs.existsSync(distPath)) {
    console.log('[Server] Serving static production build from /dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log('[Server] Starting Vite in middleware mode (development)');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BHSS Shop Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
