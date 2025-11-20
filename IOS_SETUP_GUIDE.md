# iOS Setup Guide - AI Studio

Bu guide, AI Studio web uygulamasının iOS uygulamasına dönüştürülmesi sürecini açıklar.

## ✅ Tamamlanan Adımlar

### 1. Capacitor Kurulumu
- ✅ Capacitor paketleri yüklendi
- ✅ iOS platformu eklendi
- ✅ Capacitor config dosyası oluşturuldu
- ✅ Build scriptleri package.json'a eklendi

### 2. Native Özellikler
- ✅ **Kamera Entegrasyonu**: Native kamera ve galeri seçici eklendi
- ✅ **Safe Area Padding**: iPhone notch/Dynamic Island desteği
- ✅ **iOS Permissions**: Info.plist'e kamera, galeri, notification izinleri eklendi
- ✅ **Push Notifications**: Capacitor Push Notifications entegrasyonu
- ✅ **In-App Purchase**: RevenueCat entegrasyonu

### 3. Build Scriptleri
```bash
npm run build:ios    # Web uygulamasını build edip iOS'a sync eder
npm run sync:ios     # Sadece iOS'a sync eder
npm run open:ios     # Xcode'da projeyi açar
```

---

## 📋 Yapılması Gerekenler

### 1. Xcode ve CocoaPods Kurulumu

iOS geliştirme için Xcode ve CocoaPods yüklü olmalı:

```bash
# Xcode'u App Store'dan yükleyin
# Xcode Command Line Tools'u yükleyin
xcode-select --install

# CocoaPods yükleyin
sudo gem install cocoapods

# iOS klasöründe pod install çalıştırın
cd ios/App
pod install
cd ../..
```

### 2. App Icon ve Splash Screen Asset'leri

#### App Icon (1024x1024 PNG)
Aşağıdaki boyutlarda app icon'lar oluşturun:

**Manuel Yöntem:**
1. 1024x1024 PNG dosya hazırlayın
2. Xcode'da `ios/App/App/Assets.xcassets/AppIcon.appiconset` klasörüne ekleyin
3. Veya online araç kullanın: https://appicon.co

**Gerekli Boyutlar:**
- 20x20 (2x, 3x)
- 29x29 (2x, 3x)
- 40x40 (2x, 3x)
- 60x60 (2x, 3x)
- 1024x1024 (App Store)

#### Splash Screen
Splash screen için Capacitor otomatik bir LaunchScreen oluşturur, ancak özelleştirmek isterseniz:

1. Xcode'da `ios/App/App/Assets.xcassets` klasörüne yeni image set ekleyin
2. LaunchScreen.storyboard dosyasını Xcode'da düzenleyin

### 3. Environment Variables

`.env` dosyasına aşağıdaki değişkenleri ekleyin:

```env
# Supabase (Mevcut)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# n8n Webhook (Mevcut)
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url

# RevenueCat (IAP için)
VITE_REVENUECAT_IOS_API_KEY=your_revenuecat_ios_api_key

# Apple Push Notifications (Backend için)
APPLE_APN_KEY=path_to_your_p8_key_file
APPLE_APN_KEY_ID=your_key_id
APPLE_TEAM_ID=your_team_id
```

### 4. Apple Developer Setup

#### a. Apple Developer Account
- https://developer.apple.com adresinden hesap açın ($99/yıl)
- Apple Developer Program'a kayıt olun

#### b. Bundle ID Oluştur
1. Apple Developer Console → Certificates, Identifiers & Profiles
2. Identifiers → (+) butonuna tıkla
3. App IDs seç
4. Bundle ID: `com.aistudio.app`
5. Capabilities ekle:
   - Push Notifications ✓
   - In-App Purchase ✓

#### c. App Store Connect'te Uygulama Oluştur
1. https://appstoreconnect.apple.com
2. My Apps → (+) → New App
3. Platform: iOS
4. Name: AI Studio
5. Bundle ID: `com.aistudio.app`
6. SKU: `ai-studio-001`
7. User Access: Full Access

### 5. RevenueCat Kurulumu (In-App Purchase)

1. https://app.revenuecat.com hesap açın
2. Yeni proje oluşturun: "AI Studio"
3. iOS app ekleyin, Bundle ID: `com.aistudio.app`
4. Apple App Store Connect API Key ekleyin
5. Products oluşturun (src/utils/iap.ts dosyasındaki ID'lerle eşleşmeli):
   - `com.aistudio.app.tokens.100` - $4.99
   - `com.aistudio.app.tokens.500` - $19.99
   - `com.aistudio.app.tokens.1000` - $34.99
   - `com.aistudio.app.tokens.5000` - $149.99

6. App Store Connect'te In-App Purchases oluşturun:
   - Consumable type (token paketleri tüketilebilir)
   - Product ID'leri yukarıdaki ile aynı olmalı
   - Fiyatları belirleyin

### 6. Push Notifications Backend Setup

Video tamamlandığında push notification göndermek için n8n workflow'unuza ekleyin:

```javascript
// n8n HTTP Request Node
const userId = '{{$json["user_id"]}}';
const jobId = '{{$json["job_id"]}}';

// 1. Kullanıcının push token'ını Supabase'den al
const profileResponse = await fetch('{{$env["SUPABASE_URL"]}}/rest/v1/profiles?id=eq.' + userId, {
  headers: {
    'apikey': '{{$env["SUPABASE_ANON_KEY"]}}',
    'Authorization': 'Bearer {{$env["SUPABASE_SERVICE_KEY"]}}'
  }
});

const profile = await profileResponse.json();
const pushToken = profile[0]?.push_token;

if (pushToken) {
  // 2. Apple Push Notification gönder
  // Bunu bir Supabase Edge Function veya ayrı bir servis ile yapabilirsiniz
  // Örnek: src/utils/pushNotifications.ts dosyasındaki reference implementasyona bakın
}
```

**Alternatif:** Firebase Cloud Messaging kullanabilirsiniz (daha kolay kurulum).

### 7. Supabase Schema Güncellemeleri

Profiles tablosuna yeni alanlar ekleyin:

```sql
-- Push token için
ALTER TABLE profiles ADD COLUMN push_token TEXT;
ALTER TABLE profiles ADD COLUMN push_token_updated_at TIMESTAMPTZ;

-- IAP için (opsiyonel, mevcut varsa atlayın)
ALTER TABLE payments ADD COLUMN provider_transaction_id TEXT;
```

### 8. Build ve Test

```bash
# 1. Web uygulamasını build et
npm run build

# 2. iOS'a sync et
npm run sync:ios

# 3. Xcode'da aç
npm run open:ios

# 4. Simulator seç (örn: iPhone 15 Pro)
# 5. Run butonuna bas (Cmd+R)
```

### 9. Physical Device Test

1. Xcode'da Signing & Capabilities sekmesine git
2. Team'i seç (Apple Developer hesabınız)
3. iPhone'u USB ile bağla
4. Xcode'da cihazı seç
5. Run butonuna bas

**Not:** Physical device'da test ederken:
- Push notifications test edin (simulator'da çalışmaz)
- In-App Purchase test edin (sandbox mode)
- Kamera özelliğini test edin

### 10. App Store Submission

#### a. App Store Connect Hazırlık
1. **App Information:**
   - Name: AI Studio
   - Subtitle: AI-Powered Video Generation
   - Category: Photo & Video
   - Content Rights: Your Info

2. **Pricing:**
   - Price: Free (IAP ile monetize)
   - Availability: Tüm ülkeler

3. **App Privacy:**
   - Privacy Policy URL hazırlayın
   - Data collection detayları:
     - Email, Name (Account oluşturma)
     - Photos (Video generation)
     - Purchase History (IAP)

4. **Screenshots:**
   Gerekli ekran boyutları:
   - 6.7" (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796
   - 6.5" (iPhone 11 Pro Max, XS Max): 1242 x 2688
   - 5.5" (iPhone 8 Plus): 1242 x 2208

   En az 3, en fazla 10 screenshot gerekli.

   **Önerilen sayfalar:**
   1. Landing/Login ekranı
   2. Dashboard
   3. Generate video sayfası
   4. Gallery
   5. Token paketi satın alma

#### b. Build Archive

```bash
# 1. Release config ile build et
# Xcode → Product → Scheme → Edit Scheme → Run → Release

# 2. Archive oluştur
# Xcode → Product → Archive

# 3. Organizer açılır
# Window → Organizer

# 4. Archive seç → Distribute App
# 5. App Store Connect seç
# 6. Upload

# 7. App Store Connect'te TestFlight ile test et
# 8. Submit for Review
```

#### c. App Review Information

Apple'a şunları sağlamalısınız:
- Test account credentials (demo hesabı)
- Demo video (opsiyonel ama önerilir)
- Notes: n8n webhook URL'nin çalışması gerektiğini belirtin

**Review süresi:** Genellikle 24-48 saat

---

## 🔧 Troubleshooting

### CocoaPods Hatası
```bash
cd ios/App
pod deintegrate
pod install
```

### Build Hatası: "No signing certificate"
1. Xcode → Preferences → Accounts
2. Apple ID ekleyin
3. Manage Certificates → (+) → Apple Development

### Push Notifications Çalışmıyor
- Physical device'da test edin (simulator desteklemez)
- Info.plist'te permission olduğunu kontrol edin
- Apple Developer Console'da Push Notification capability aktif mi?

### In-App Purchase Test Edilemiyor
1. App Store Connect → Users and Access → Sandbox Testers
2. Test kullanıcısı oluşturun
3. Device'da Settings → App Store → Sandbox Account ile login olun

---

## 📱 Next Steps

1. **Xcode ve CocoaPods yükleyin**
2. **App icon hazırlayın (1024x1024)**
3. **RevenueCat setup yapın**
4. **Build edip simulator'da test edin**
5. **Physical device'da test edin**
6. **App Store'a submit edin**

---

## 📞 Support

Sorularınız için:
- Capacitor Docs: https://capacitorjs.com/docs
- RevenueCat Docs: https://www.revenuecat.com/docs
- Apple Developer: https://developer.apple.com/support

---

**Estimated Timeline:**
- Setup & Testing: 1-2 hafta
- App Store Review: 2-5 gün
- **Total: ~3 hafta**

İyi şanslar! 🚀
