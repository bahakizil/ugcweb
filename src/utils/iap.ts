import { Purchases, LOG_LEVEL, PurchasesOffering } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../lib/supabase';

export interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: string;
  description: string;
  productId?: string; // Apple Product ID
}

// Token packages - bu ID'ler App Store Connect'te tanımlanacak
export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: 'tokens_100',
    name: 'Starter Pack',
    tokens: 100,
    price: '$4.99',
    description: '5 video generation',
    productId: 'com.aistudio.app.tokens.100'
  },
  {
    id: 'tokens_500',
    name: 'Basic Pack',
    tokens: 500,
    price: '$19.99',
    description: '25 video generations',
    productId: 'com.aistudio.app.tokens.500'
  },
  {
    id: 'tokens_1000',
    name: 'Pro Pack',
    tokens: 1000,
    price: '$34.99',
    description: '50 video generations',
    productId: 'com.aistudio.app.tokens.1000'
  },
  {
    id: 'tokens_5000',
    name: 'Premium Pack',
    tokens: 5000,
    price: '$149.99',
    description: '250 video generations',
    productId: 'com.aistudio.app.tokens.5000'
  }
];

let isInitialized = false;

export const initializeIAP = async (userId: string): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('IAP: Not a native platform, skipping initialization');
    return false;
  }

  if (isInitialized) {
    console.log('IAP: Already initialized');
    return true;
  }

  try {
    // RevenueCat API key - .env dosyasından alınacak
    const apiKey = import.meta.env.VITE_REVENUECAT_IOS_API_KEY;

    if (!apiKey) {
      console.warn('IAP: RevenueCat API key not found');
      return false;
    }

    await Purchases.configure({
      apiKey,
      appUserID: userId,
    });

    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

    isInitialized = true;
    console.log('IAP: Initialized successfully');
    return true;
  } catch (error) {
    console.error('IAP: Initialization failed', error);
    return false;
  }
};

export const getAvailablePackages = async (): Promise<PurchasesOffering | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current;
    }
    return null;
  } catch (error) {
    console.error('IAP: Failed to get offerings', error);
    return null;
  }
};

export const purchaseTokenPackage = async (
  packageId: string,
  userId: string
): Promise<{ success: boolean; tokens?: number; error?: string }> => {
  try {
    const offerings = await Purchases.getOfferings();
    if (!offerings.current) {
      return { success: false, error: 'No offerings available' };
    }

    // Find the package
    const availablePackages = offerings.current.availablePackages;
    const packageToPurchase = availablePackages.find(
      (pkg) => pkg.identifier === packageId
    );

    if (!packageToPurchase) {
      return { success: false, error: 'Package not found' };
    }

    // Make the purchase
    const purchaseResult = await Purchases.purchasePackage({
      aPackage: packageToPurchase,
    });

    if (purchaseResult.customerInfo) {
      // Get token amount from our mapping
      const tokenPackage = TOKEN_PACKAGES.find((p) => p.id === packageId);
      const tokenAmount = tokenPackage?.tokens || 0;

      // Update user's token balance in Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('token_balance')
        .eq('id', userId)
        .single();

      const newBalance = (profile?.token_balance || 0) + tokenAmount;

      await supabase
        .from('profiles')
        .update({
          token_balance: newBalance,
        })
        .eq('id', userId);

      // Record transaction
      await supabase.from('token_transactions').insert({
        user_id: userId,
        type: 'purchase',
        amount: tokenAmount,
        balance_after: newBalance,
        description: `Purchased ${tokenPackage?.name}`,
      });

      // Record payment
      await supabase.from('payments').insert({
        user_id: userId,
        amount: parseFloat(tokenPackage?.price.replace('$', '') || '0'),
        currency: 'USD',
        status: 'completed',
        provider: 'apple_iap',
        provider_transaction_id: purchaseResult.customerInfo.originalAppUserId,
        metadata: {
          package_id: packageId,
          tokens_purchased: tokenAmount,
        },
      });

      return { success: true, tokens: tokenAmount };
    }

    return { success: false, error: 'Purchase failed' };
  } catch (error: any) {
    console.error('IAP: Purchase failed', error);

    if (error.code === '1' || error.userCancelled) {
      return { success: false, error: 'Purchase cancelled' };
    }

    return { success: false, error: error.message || 'Purchase failed' };
  }
};

export const restorePurchases = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const customerInfo = await Purchases.restorePurchases();

    // Here you would sync the restored purchases with your Supabase database
    console.log('IAP: Purchases restored', customerInfo);

    return { success: true };
  } catch (error: any) {
    console.error('IAP: Restore failed', error);
    return { success: false, error: error.message };
  }
};

export const isNativeIAP = (): boolean => {
  return Capacitor.isNativePlatform();
};
