import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Generate source maps for production debugging
    sourcemap: false,
    // Increase chunk size warning limit (we're code-splitting anyway)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching
        manualChunks: {
          // React core - rarely changes, cache long-term
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // Animation library - separate chunk
          'vendor-motion': ['framer-motion'],
          
          // Icons - large library, separate chunk
          'vendor-icons': ['lucide-react'],
          
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
          
          // Landing page components - loaded on marketing site
          'landing': [
            './src/components/landing/HeroSection.tsx',
            './src/components/landing/NavBar.tsx',
            './src/components/landing/Footer.tsx',
            './src/components/landing/PricingSection.tsx',
            './src/components/landing/HowItWorksSection.tsx',
          ],
          
          // App layout and shared components
          'app-core': [
            './src/components/app/AppLayout.tsx',
            './src/components/auth/ProtectedRoute.tsx',
            './src/contexts/AuthContext.tsx',
          ],
          
          // Claims module
          'app-claims': [
            './src/pages/app/ClaimsPage.tsx',
            './src/pages/app/ClaimDetailPage.tsx',
            './src/components/claims/ClaimUploadModal.tsx',
            './src/components/claims/StatusBadge.tsx',
          ],
          
          // Appeals module
          'app-appeals': [
            './src/pages/app/AppealsPage.tsx',
            './src/pages/app/AppealDetailPage.tsx',
            './src/pages/app/AppealTemplatesPage.tsx',
            './src/components/appeals/CreateAppealModal.tsx',
          ],
          
          // Settings & billing module
          'app-settings': [
            './src/pages/app/SettingsPage.tsx',
            './src/pages/app/BillingPage.tsx',
            './src/components/settings/ProfileSettings.tsx',
            './src/components/billing/SubscriptionPlans.tsx',
          ],
          
          // Integrations module
          'app-integrations': [
            './src/pages/app/IntegrationsPage.tsx',
            './src/components/integrations/EHRConnectors.tsx',
            './src/components/integrations/PayerConnections.tsx',
          ],
          
          // Security module
          'app-security': [
            './src/pages/app/SecurityPage.tsx',
            './src/components/security/TwoFactorAuth.tsx',
            './src/components/security/AuditLogs.tsx',
          ],
        },
        // Consistent chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId || '';
          if (facadeModuleId.includes('pages/app/')) {
            return 'assets/app/[name]-[hash].js';
          }
          if (facadeModuleId.includes('pages/auth/')) {
            return 'assets/auth/[name]-[hash].js';
          }
          if (facadeModuleId.includes('pages/')) {
            return 'assets/pages/[name]-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      '@supabase/supabase-js',
    ],
  },
  // Server config for development
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to Express server in development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
