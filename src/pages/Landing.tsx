import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Image,
  Video,
  Zap,
  ShieldCheck,
  TrendingUp,
  Layers,
  ArrowRight,
  Quote,
  Star,
  Check,
  Flame,
  Play,
} from 'lucide-react';

const heroStats = [
  { label: 'Dakikada üretilen Reels', value: '470+', detail: '24/7 AI stüdyosu' },
  { label: 'Kullanıcı', value: '52K', detail: 'influencer & mağaza' },
  { label: 'Süre', value: '32 sn', detail: 'prompt → video' },
];

const logos = ['TrendMag', 'ShopWave', 'CreatorHub', 'Lume', 'Parlak', 'NeoReels'];

const features = [
  {
    icon: Image,
    title: 'Hazır yüz + sahne',
    description: 'Hazır UGC yüzleri veya ürün sahnelerini seç, tek cümleyle hikâyeyi yaz, AI sahneyi kurgulasın.',
  },
  {
    icon: Video,
    title: 'Platform presetleri',
    description: 'TikTok, Reels, Shorts ölçüleri otomatik ayarlanır; CTA ve çıkartmalar hazır gelir.',
  },
  {
    icon: Zap,
    title: 'Viral motion',
    description: 'Sarsıntılı kamera, neon geçişler, zoom ve text pop animasyonlarını tek tuşla ekle.',
  },
  {
    icon: TrendingUp,
    title: 'Trend Boost',
    description: 'Trend hashtag + sesleri otomatik çek, videoyu paylaşmadan önce optimize et.',
  },
  {
    icon: Layers,
    title: 'Script sihirbazı',
    description: 'Metnini Türkçe yaz, AI senaryoyu çevrilsin ve voiceover eklesin.',
  },
  {
    icon: ShieldCheck,
    title: 'Güvenli saklama',
    description: 'Videoların güvenli kasada saklanır; ister indir ister paylaşılabilir bağlantı gönder.',
  },
];

const heroCategories = [
  {
    label: 'Ürün patlat',
    highlight: '1.8M izlenme',
    caption: 'Telefon tutacağı 7 saniyede satıldı',
  },
  {
    label: 'Cilt parlat',
    highlight: '940K izlenme',
    caption: '3 adımda parlak cilt routini',
  },
  {
    label: 'Butik hype',
    highlight: '1.3M izlenme',
    caption: 'Yeni koleksiyon Reels patlaması',
  },
  {
    label: 'Yemeğe sıra',
    highlight: '670K izlenme',
    caption: 'Kıtır waffle 12 saat içinde bitti',
  },
];

const videoShowcases = [
  {
    title: '“Bu blender 7 saniyede smoothie yapıyor!”',
    description: 'Ürün etrafında neon yazılar, 3 farklı kamera hareketi, kapanış CTA’sı.',
    duration: '18 sn',
    views: '1.2M',
    preset: 'Enerjik zoom + neon CTA',
    color: 'from-rose-500/30 to-orange-500/30',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-blending-a-juice-34459-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: '“3 adımda porselen cilt”',
    description: 'Beauty vlogger yüzü, text overlay ve hızlı zoom ile story formatı.',
    duration: '24 sn',
    views: '980K',
    preset: 'Beauty influencer + voiceover',
    color: 'from-violet-500/30 to-indigo-500/30',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-skin-cream-in-front-of-the-mirror-1588-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: '“Bugün nereye gidelim?”',
    description: 'Travel vlog timelapse + harita animasyonu ile merak uyandıran başlık.',
    duration: '32 sn',
    views: '760K',
    preset: 'Travel B-roll x harita sticker',
    color: 'from-emerald-500/30 to-cyan-500/30',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-a-road-in-the-mountains-1285-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: '“%70 indirim sadece bu hafta”',
    description: 'Carousel ürün geçişleri, count-down sticker ve güçlü bass beat.',
    duration: '15 sn',
    views: '1.5M',
    preset: 'Flash sale + countdown timer',
    color: 'from-yellow-500/30 to-pink-500/30',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-in-a-clothing-store-39904-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&q=80',
  },
];

const trendingPrompts = [
  { emoji: '🔥', text: '“Bu powerbank telefonu 5 dk’da %100’e çıkarıyor”', result: '1.4M görüntülenme' },
  { emoji: '💅', text: '“Güneş lekelerini 1 haftada uçuruyor”', result: '820K görüntülenme' },
  { emoji: '🍔', text: '“Menüde gizlenen burger hack’i”', result: '640K görüntülenme' },
  { emoji: '🛍️', text: '“Sepeti bugün doldur, kargo bedava”', result: '980K görüntülenme' },
];

const creatorStories = [
  {
    name: 'Eylül / @mimidrops',
    category: 'Instagram butik',
    result: '+420% satış',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    quote: 'Aynı gün 12 video atabildim. AI Studio emoji & sticker kombinasyonunu otomatik ayarlıyor.',
  },
  {
    name: 'Arman / @fitlab',
    category: 'Fitness creator',
    result: '+1.1M izlenme',
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
    quote: '“Bio’daki linke tıkla” CTA’sını 5 varyasyonda test ettim. Hangisi tuttuysa otomasyon otomatik gönderdi.”',
  },
  {
    name: 'Zey / @neondecor',
    category: 'Etsy mağazası',
    result: 'Stoklar bitti',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    quote: 'Video kasamda tüm versiyonlar hazır. Sipariş gelince aynı metinle yeni renkleri üretiyorum.',
  },
];

const testimonials = [
  {
    quote: '“Hiç kamera açmadan 4 günde 28 ürün videosu paylaştım. Hepsi AI Studio’nun viral presetleriyle.”',
    name: 'Damla K.',
    role: 'Instagram mağazası sahibi',
    company: '@glowynailbar',
    highlight: '28 video',
  },
  {
    quote: '“Drop shipping mağazamızda stok değiştikçe AI Studio otomatik video güncelliyor, manken aramıyoruz.”',
    name: 'Murat Ş.',
    role: 'Shopify satıcısı',
    company: 'DailyDeal',
    highlight: '0 çekim',
  },
  {
    quote: '“Her sabah trend ses + başlık önerisi geliyor, promptu yapıştırıyorum, AI geri kalanını hallediyor.”',
    name: 'Lina V.',
    role: 'TikTok içerik üreticisi',
    company: '@linapicks',
    highlight: '+1.2M izlenme',
  },
];

type BillingInterval = 'monthly' | 'yearly';

const pricingTiers = [
  {
    name: 'Starter',
    subtitle: 'Freelance kreatifler için',
    priceMonthly: 19,
    priceYearly: 15,
    tokens: '250 video',
    activeUsers: 2340,
    features: ['Aylık 250 video', 'Hazır yüz + sahne', 'Platform presetleri', 'E-posta destek'],
  },
  {
    name: 'Studio',
    subtitle: 'Ajans & ekipler için',
    priceMonthly: 59,
    priceYearly: 49,
    tokens: '900 video',
    activeUsers: 870,
    features: ['Aylık 900 video', 'Çoklu kullanıcı & roller', 'Öncelikli üretim', 'Özel preset kütüphanesi'],
    popular: true,
  },
  {
    name: 'Enterprise',
    subtitle: 'Özel SLA + API',
    priceLabel: 'Özel teklif',
    tokens: 'Sınırsız blueprint',
    activeUsers: 96,
    features: [
      'Sınırsız video havuzu',
      'Dedicated account team',
      'SSO + denetim logları',
      'Özel entegrasyonlar',
      'Özel otomasyon kurulumu',
      '24/7 üretim desteği',
    ],
  },
];

const planComparisons = [
  {
    metric: 'Video hakları',
    starter: '250 sabit',
    studio: '900 sabit',
    usage: '—',
    enterprise: 'Sınırsız',
  },
  {
    metric: 'Kullanıcı / Rol',
    starter: '1 kullanıcı',
    studio: '10 kullanıcı',
    usage: '5 kullanıcı',
    enterprise: 'Sınırsız + SSO',
  },
  {
    metric: 'Otomasyonlar',
    starter: 'Temel webhook',
    studio: 'Otomasyon şablonları',
    usage: 'Webhook + metered API',
    enterprise: 'Özel workflow & QA',
  },
  {
    metric: 'Destek',
    starter: 'E-posta 48s',
    studio: 'Slack 4saat',
    usage: 'Slack 2saat',
    enterprise: '24/7 SLA + CSM',
  },
];


export function Landing() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const liveUpdatedAt = useMemo(
    () => new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
    [],
  );
  const [heroCategory, setHeroCategory] = useState(heroCategories[0].label);
  const activeHeroCategory = heroCategories.find((cat) => cat.label === heroCategory) || heroCategories[0];

  const formatPrice = (tier: (typeof pricingTiers)[number]) => {
    if (tier.priceLabel) return tier.priceLabel;
    if (typeof tier.priceMonthly === 'number') {
      const price = billingInterval === 'monthly' ? tier.priceMonthly : tier.priceYearly;
      return `$${price}`;
    }
    return '—';
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Sparkles className="h-6 w-6 text-pink-500" />
              <span>AI Studio</span>
            </Link>
            <div className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
              <a href="#features" className="hover:text-slate-900">
                Özellikler
              </a>
              <a href="#workflow" className="hover:text-slate-900">
                Süreç
              </a>
              <a href="#pricing" className="hover:text-slate-900">
                Paketler
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/signin"
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:text-slate-900"
              >
                Giriş yap
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ücretsiz başla
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </nav>
        <section className="relative px-6 pb-16 pt-20 sm:pb-24 sm:pt-28" id="hero">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                <Sparkles className="h-3 w-3" />
                Tek cümle ile viral video
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Metnini yaz,
                <span className="mx-2 inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                  30 saniyede
                </span>
                izlenen videoya sahip ol.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-500">
                AI Studio, UGC videoya ihtiyacı olan mağazalar ve içerik üreticileri için tasarlandı. Metnini yaz, şablonunu
                seç, geri kalanını platform tamamlasın.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {heroCategories.map((category) => (
                  <button
                    key={category.label}
                    type="button"
                    onClick={() => setHeroCategory(category.label)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    heroCategory === category.label
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                  }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-4 py-1.5 text-sm font-medium text-slate-600">
                <Flame className="h-4 w-4 text-pink-500" />
                {activeHeroCategory.caption} • {activeHeroCategory.highlight}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-800/30 transition hover:-translate-y-0.5"
                >
                  İlk videomu üret
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  Trend videoları izle
                </a>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm"
                  >
                    <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                    <div className="text-xs text-slate-400">{stat.detail}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 -translate-y-2 translate-x-4 rounded-[28px] bg-slate-200/60 blur-xl" />
              <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-xl">
                <video
                  className="h-72 w-full object-cover"
                  src="https://storage.googleapis.com/coverr-main/mp4/Coding.mp4"
                  poster="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow">
                  <Play className="h-4 w-4 text-pink-500" />
                  Gerçek AI video
                </div>
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-white via-white/90 to-transparent p-5 text-slate-800">
                  <p className="text-sm">{activeHeroCategory.caption}</p>
                  <div className="text-2xl font-semibold text-slate-900">{activeHeroCategory.highlight}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Anlık trendler</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">AI tarafından üretilen en viral videolar</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Gerçek kullanıcıların dakikalar önce yayınladığı videolar. Prompt + preset kombinasyonunu kopyalayıp
                  kendi ürününüzle tekrar oluşturun.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {trendingPrompts.map((prompt) => (
                    <div
                      key={prompt.text}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600"
                    >
                      <span>{prompt.emoji}</span>
                      <span className="font-semibold">{prompt.text}</span>
                      <span className="text-slate-400">{prompt.result}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Prompt kütüphanesini aç
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {videoShowcases.map((video) => (
                <div
                  key={video.title}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400">AI Video</div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{video.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{video.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">{video.preset}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{video.duration}</span>
                    <span>{video.views} izlenme</span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-black/40">
                    <video
                      className="h-36 w-full object-cover"
                      src={video.videoUrl}
                      poster={video.posterUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-white px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs uppercase tracking-[0.3em] text-slate-400">
              Her gün AI Studio ile viral olan markalar
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-base font-semibold text-slate-500">
              {logos.map((logo) => (
                <span key={logo} className="tracking-wide">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <main>
        <section id="features" className="bg-white px-6 py-16 text-slate-900">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Viral içerik gücü</p>
              <h2 className="mt-4 text-4xl font-semibold text-slate-900">Dakikalar içinde çekici videolar</h2>
              <p className="mt-4 text-lg text-slate-600">
                AI Studio, e-ticaret satıcısı ya da içerik üreticisinin vakit kaybetmeden video çıkarması için tasarlandı.
                Preset’ler, trend ses paketleri ve otomatik altyazılarla “swipe-up” oranını yükselt.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-sm text-slate-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 text-slate-900">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">Creator Stories</p>
              <h2 className="mt-4 text-4xl font-semibold text-slate-900">
                İçerik üreticileri nasıl patlama yaşıyor?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                AI Studio her sabah trend sesleri ve hazır promptları gönderir. Kopyala-yapıştır, videonu 30 saniyede yayınla.
              </p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {creatorStories.map((story) => (
                <div
                  key={story.name}
                  className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="relative h-36 overflow-hidden rounded-2xl">
                    <img src={story.image} alt={story.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-4 text-xs uppercase tracking-[0.3em] text-pink-500">{story.name}</div>
                  <p className="text-sm text-slate-600">{story.quote}</p>
                  <div className="mt-3 text-xs font-semibold text-slate-500">{story.category}</div>
                  <div className="text-sm font-semibold text-slate-900">{story.result}</div>
                </div>
              ))}
            </div>
          </div>
        </section>



        <section className="bg-white px-6 py-24 text-slate-900">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Referanslar</p>
              <h2 className="mt-4 text-4xl font-semibold">Takımlar ne söylüyor?</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.quote}
                  className="rounded-3xl border border-slate-100 p-6 shadow-lg shadow-slate-100/60"
                >
                  <Quote className="h-8 w-8 text-blue-500" />
                  <p className="mt-4 text-sm text-slate-600">{testimonial.quote}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                    <div className="flex flex-col items-end text-right text-xs font-semibold text-blue-500">
                      {testimonial.highlight}
                      <div className="mt-1 flex gap-1 text-blue-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-white px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Paketler</p>
              <h2 className="mt-4 text-4xl font-semibold text-slate-900">Şeffaf video paketleri</h2>
              <p className="mt-4 text-lg text-slate-600">
                İster tek kreatif olun ister onlarca kişilik ekip. Token havuzları, roller ve API limitleri ekip
                ihtiyaçlarınıza göre şekillenir.
              </p>
            </div>
            <div className="mt-10 flex items-center justify-center gap-3 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setBillingInterval('monthly')}
                className={`rounded-full px-6 py-2 transition ${
                  billingInterval === 'monthly'
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 text-slate-600'
                }`}
              >
                Aylık
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval('yearly')}
                className={`rounded-full px-6 py-2 transition ${
                  billingInterval === 'yearly'
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 text-slate-600'
                }`}
              >
                Yıllık <span className="ml-1 text-xs font-normal text-emerald-500">2 ay hediye</span>
              </button>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-[32px] border p-8 ${
                    tier.popular
                      ? 'border-blue-200 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-200/30'
                      : 'border-slate-100 bg-white shadow-lg shadow-slate-100/60'
                  }`}
                >
                  {tier.popular && (
                    <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                      En popüler
                    </span>
                  )}
                  <h3 className="mt-4 text-2xl font-semibold">{tier.name}</h3>
                  <p className={`text-sm ${tier.popular ? 'text-blue-100' : 'text-slate-500'}`}>{tier.subtitle}</p>
                  <div className="mt-6">
                    <span className="text-4xl font-semibold">{formatPrice(tier)}</span>
                    {!tier.priceLabel && (
                      <span className={`ml-2 text-sm ${tier.popular ? 'text-blue-100' : 'text-slate-500'}`}>
                        {billingInterval === 'monthly' ? '/ay' : '/ay (yıllık)'}
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-sm ${tier.popular ? 'text-blue-100' : 'text-slate-500'}`}>{tier.tokens}</p>
                  <div
                    className={`mt-4 flex items-center justify-between rounded-2xl border px-4 py-2 text-xs ${
                      tier.popular ? 'border-white/30 text-white' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>
                      {new Intl.NumberFormat('tr-TR').format(tier.activeUsers)}
                      + ekip
                    </span>
                    <span>Aktif • {liveUpdatedAt}</span>
                  </div>
                  <ul className={`mt-8 space-y-3 text-sm ${tier.popular ? 'text-blue-50' : 'text-slate-600'}`}>
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className={`h-4 w-4 ${tier.popular ? 'text-white' : 'text-blue-600'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`mt-8 block rounded-2xl px-6 py-3 text-center text-sm font-semibold transition ${
                      tier.popular
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {tier.priceLabel === 'Özel teklif' ? 'Satışla görüş' : 'Planı seç'}
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100/60">
              <h3 className="text-lg font-semibold">Plan karşılaştırması</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="py-3 pr-4 font-medium">Özellik</th>
                      <th className="py-3 pr-4 font-medium">Starter</th>
                      <th className="py-3 pr-4 font-medium">Studio</th>
                      <th className="py-3 pr-4 font-medium">Enterprise</th>
                      <th className="py-3 font-medium">Enterprise+</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planComparisons.map((row) => (
                      <tr key={row.metric} className="border-t border-slate-100 text-slate-700">
                        <td className="py-3 pr-4 font-medium">{row.metric}</td>
                        <td className="py-3 pr-4">{row.starter}</td>
                        <td className="py-3 pr-4">{row.studio}</td>
                        <td className="py-3 pr-4">{row.enterprise}</td>
                        <td className="py-3">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-r from-white to-pink-50 p-10 text-center shadow-lg">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">30 sn challenge</p>
            <h2 className="mt-4 text-4xl font-semibold text-slate-900">
              Promptunu yaz, 30 saniyede yayınlanmaya hazır AI videoya sahip ol.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              10 ücretsiz video hakkı hediye. Hiç kamera açmadan viral videolar üret, AI Studio ile yarışa katıl.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
              >
                Bedava başla
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Videolarımı gör
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-12 text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <div className="flex items-center gap-2 text-slate-900">
            <Sparkles className="h-5 w-5 text-pink-500" />
            <span className="font-semibold">AI Studio</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#features" className="hover:text-slate-900">
              Ürün
            </a>
            <a href="#workflow" className="hover:text-slate-900">
              Süreç
            </a>
            <a href="#pricing" className="hover:text-slate-900">
              Paketler
            </a>
          </div>
          <p className="text-slate-400">© {new Date().getFullYear()} AI Studio. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
