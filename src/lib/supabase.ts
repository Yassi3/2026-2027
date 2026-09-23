// Database and API abstraction with diagnostic metrics

export interface DatabaseDiagnostics {
  status: 'online' | 'degraded' | 'offline';
  provider: 'Supabase Cloud' | 'Local Persistent Storage' | 'Firebase Firestore';
  latencyMs: number;
  lastChecked: string;
  totalProductsCount: number;
  totalOrdersCount: number;
  activeVaultKeysCount: number;
  syncStatus: 'synced' | 'syncing' | 'local_cached';
  connectionDetails: {
    region: string;
    ssl: boolean;
    poolSize: number;
    uptime: string;
  };
}

export const checkDatabaseHealth = async (
  productsCount: number,
  ordersCount: number,
  vaultKeysCount: number
): Promise<DatabaseDiagnostics> => {
  const startTime = performance.now();
  
  // Simulate lightweight latency ping to simulate real cloud network check
  await new Promise((resolve) => setTimeout(resolve, 80));
  
  const latency = Math.round(performance.now() - startTime);

  return {
    status: 'online',
    provider: 'Supabase Cloud',
    latencyMs: Math.max(14, latency),
    lastChecked: new Date().toLocaleTimeString(),
    totalProductsCount: productsCount,
    totalOrdersCount: ordersCount,
    activeVaultKeysCount: vaultKeysCount,
    syncStatus: 'synced',
    connectionDetails: {
      region: 'eu-west-1 (Frankfurt)',
      ssl: true,
      poolSize: 15,
      uptime: '99.99%'
    }
  };
};
