import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { Check, Sparkles, AlertCircle } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Basic',
    price: '9',
    tokens: '100',
    tier: 'basic',
    features: [
      '100 tokens per month',
      'Text to image generation',
      'Basic quality outputs',
      'Generation history',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '29',
    tokens: '500',
    tier: 'pro',
    features: [
      '500 tokens per month',
      'Text to image generation',
      'Text to video generation',
      'High quality outputs',
      'Priority processing',
      'Advanced analytics',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: '79',
    tokens: '2000',
    tier: 'premium',
    features: [
      '2000 tokens per month',
      'Unlimited image generation',
      'Unlimited video generation',
      'Ultra HD outputs',
      'Fastest processing',
      'Advanced analytics',
      'Dedicated support',
      'API access',
    ],
  },
];

export function Subscription() {
  const { profile } = useAuth();

  const handleSubscribe = (tier: string) => {
    alert(`Stripe integration coming soon! Selected plan: ${tier}`);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
          <p className="text-gray-600">Choose the perfect plan for your creative needs</p>
        </div>

        {profile?.subscription_tier && profile.subscription_tier !== 'free' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900">Current Plan: {profile.subscription_tier.toUpperCase()}</div>
              <div className="text-sm text-blue-700">
                You have {profile.token_balance} tokens remaining
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 ${
                tier.popular
                  ? 'bg-blue-600 text-white ring-4 ring-blue-200 scale-105 shadow-xl'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="text-sm font-semibold mb-4 text-blue-100">MOST POPULAR</div>
              )}
              <h3
                className={`text-2xl font-bold mb-2 ${
                  tier.popular ? 'text-white' : 'text-gray-900'
                }`}
              >
                {tier.name}
              </h3>
              <div className="mb-6">
                <span
                  className={`text-5xl font-bold ${
                    tier.popular ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  ${tier.price}
                </span>
                <span className={tier.popular ? 'text-blue-100' : 'text-gray-500'}>
                  /month
                </span>
              </div>
              <div
                className={`text-sm font-medium mb-6 ${
                  tier.popular ? 'text-blue-100' : 'text-gray-600'
                }`}
              >
                {tier.tokens} tokens per month
              </div>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${
                        tier.popular ? 'text-blue-200' : 'text-blue-600'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        tier.popular ? 'text-blue-50' : 'text-gray-600'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(tier.tier)}
                disabled={profile?.subscription_tier === tier.tier}
                className={`block w-full py-3 px-4 rounded-lg font-semibold text-center transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  tier.popular
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {profile?.subscription_tier === tier.tier ? 'Current Plan' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Need Stripe Integration?</h2>
          </div>
          <p className="text-gray-300 mb-6 max-w-2xl">
            To enable payments and subscriptions, you'll need to integrate Stripe. This requires setting up
            your Stripe account and configuring webhook endpoints.
          </p>
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <h3 className="font-semibold mb-2">Setup Instructions:</h3>
            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
              <li>Create a Stripe account at stripe.com</li>
              <li>Get your API keys from the Stripe Dashboard</li>
              <li>Configure webhook endpoints for subscription events</li>
              <li>Add Stripe keys to your environment variables</li>
            </ol>
          </div>
          <a
            href="https://bolt.new/setup/stripe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
