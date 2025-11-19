import { Link } from 'react-router-dom';
import { Sparkles, Image, Video, Zap, Shield, TrendingUp, Check, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Image,
    title: 'Text to Image',
    description: 'Transform your ideas into stunning visuals with AI-powered image generation',
  },
  {
    icon: Video,
    title: 'Text to Video',
    description: 'Create engaging video content from simple text descriptions',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get your AI-generated content in seconds, not hours',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data and creations are protected with enterprise-grade security',
  },
  {
    icon: TrendingUp,
    title: 'Usage Analytics',
    description: 'Track your token usage and generation history with detailed analytics',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'High-resolution outputs optimized for professional use',
  },
];

const pricingTiers = [
  {
    name: 'Basic',
    price: '9',
    tokens: '100',
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

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <Sparkles className="w-7 h-7" />
              <span>AI Studio</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/signin"
                className="text-gray-700 hover:text-gray-900 font-medium transition"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Create Amazing AI Content
            <br />
            <span className="text-blue-600">In Seconds</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into stunning images and videos with our powerful AI generation platform.
            Simple, fast, and affordable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Start creating free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="#pricing"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-gray-200"
            >
              View pricing
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Start with 10 free tokens. No credit card required.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to bring your creative vision to life
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your creative needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  tier.popular
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200 scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="text-sm font-semibold mb-4 text-blue-100">
                    MOST POPULAR
                  </div>
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
                  <span
                    className={tier.popular ? 'text-blue-100' : 'text-gray-500'}
                  >
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
                <Link
                  to="/signup"
                  className={`block w-full py-3 px-4 rounded-lg font-semibold text-center transition ${
                    tier.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xl font-bold mb-4">
            <Sparkles className="w-6 h-6" />
            <span>AI Studio</span>
          </div>
          <p className="text-gray-400 mb-8">
            Create amazing AI-powered content in seconds
          </p>
          <div className="text-sm text-gray-500">
            © 2024 AI Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
