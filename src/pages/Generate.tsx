import { useState, FormEvent, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Sparkles, AlertCircle, Loader2, CheckCircle, Upload, X, Zap, Star, Smartphone, Package, Wand2 } from 'lucide-react';

const TOKEN_COST = 20;

type VideoType = 'performance' | 'premium' | 'ugc' | 'product' | 'dynamic';

function generateJobId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

const VIDEO_TYPES: { id: VideoType; label: string; subtitle: string; icon: typeof Zap }[] = [
  { id: 'performance', label: 'Performance', subtitle: 'Reklam', icon: Zap },
  { id: 'premium', label: 'Premium', subtitle: 'Marka', icon: Star },
  { id: 'ugc', label: 'UGC', subtitle: 'Organik', icon: Smartphone },
  { id: 'product', label: 'Ürün', subtitle: 'Showcase', icon: Package },
  { id: 'dynamic', label: 'Dinamik', subtitle: 'Hareketli', icon: Wand2 },
];

export function Generate() {
  const { profile, refreshProfile } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<VideoType>('performance');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasEnoughTokens = (profile?.token_balance || 0) >= TOKEN_COST;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImageToN8nBucket = async (file: File, jobId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${jobId}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!hasEnoughTokens) {
      setError(`Insufficient tokens. You need ${TOKEN_COST} tokens for video generation.`);
      return;
    }

    if (!imageFile) {
      setError('Please upload an image');
      return;
    }

    if (prompt.trim().length < 3) {
      setError('Please enter a more detailed prompt (at least 3 characters)');
      return;
    }

    setLoading(true);

    try {
      const jobId = generateJobId();
      const newBalance = (profile?.token_balance || 0) - TOKEN_COST;

      const imageUrl = await uploadImageToN8nBucket(imageFile, jobId);

      const { data: generation, error: genError } = await supabase
        .from('generations')
        .insert({
          user_id: profile!.id,
          type: 'video',
          prompt: prompt.trim(),
          tokens_used: TOKEN_COST,
          status: 'pending',
          job_id: jobId,
          source_image_url: imageUrl,
          video_type: videoType,
          notes: notes.trim() || null,
          metadata: {
            model: 'default',
            quality: 'standard',
          },
        })
        .select()
        .single();

      if (genError) throw genError;

      const { error: tokenError } = await supabase
        .from('token_transactions')
        .insert({
          user_id: profile!.id,
          type: 'usage',
          amount: -TOKEN_COST,
          balance_after: newBalance,
          description: 'Image-to-Video generation',
          generation_id: generation.id,
        });

      if (tokenError) throw tokenError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          token_balance: newBalance,
          total_tokens_used: (profile?.total_tokens_used || 0) + TOKEN_COST,
        })
        .eq('id', profile!.id);

      if (profileError) throw profileError;

      await refreshProfile();

      const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

      if (n8nWebhookUrl) {
        try {
          await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              job_id: jobId,
              image_url: imageUrl,
              prompt: prompt.trim(),
              video_type: videoType,
              notes: notes.trim() || null,
              user_id: profile!.id,
            }),
          });
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
        }
      }

      setSuccess(true);
      setPrompt('');
      setNotes('');
      setVideoType('performance');
      removeImage();

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to create generation');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Video</h1>
          <p className="text-gray-600">
            Upload an image and describe how you want it to animate
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image <span className="text-red-500">*</span>
              </label>
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-700 mb-2 font-medium">Click to upload an image</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WEBP, GIF up to 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    required
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-80 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Video Tipi Seçin <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {VIDEO_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setVideoType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        videoType === type.id
                          ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${
                        videoType === type.id ? 'text-white' : 'text-blue-600'
                      }`} />
                      <div className="font-semibold text-sm">{type.label}</div>
                      <div className={`text-xs mt-1 ${
                        videoType === type.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>{type.subtitle}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Animation Prompt <span className="text-red-500">*</span>
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                placeholder="Describe the motion: camera slowly zooms in, gentle wind blowing through hair, cinematic motion, smooth camera movement..."
                required
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-500">
                  Be specific about camera movement and animation
                </p>
                <p className="text-sm text-gray-500">
                  {prompt.length} characters
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Ek Notlar (Opsiyonel)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                placeholder="Örnek: Ürünün öne çıkan özelliği kablosuz şarj özelliği. Teknoloji meraklıları hedef kitle."
              />
              <p className="text-xs text-gray-500 mt-2">
                Ürün özellikleri, hedef kitle veya özel taleplerinizi buraya yazabilirsiniz
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold">Video generation started!</div>
                  <div>Your video is being created. Check the gallery in a few moments.</div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Cost per generation</div>
                  <div className="text-3xl font-bold text-gray-900">{TOKEN_COST} tokens</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Your balance</div>
                  <div className={`text-3xl font-bold ${hasEnoughTokens ? 'text-green-600' : 'text-red-600'}`}>
                    {profile?.token_balance || 0}
                  </div>
                  <div className="text-xs text-gray-500">tokens</div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !hasEnoughTokens || !imageFile || !prompt}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating your video...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Video
                </>
              )}
            </button>
          </form>

          {!hasEnoughTokens && (
            <div className="mt-4 text-center">
              <a
                href="/dashboard/subscription"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Get more tokens →
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            How It Works
          </h3>
          <ol className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">1.</span>
              <span>Upload your source image (portrait, landscape, object, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">2.</span>
              <span>Describe the motion and camera movement you want</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">3.</span>
              <span>AI processes your image and creates cinematic video</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">4.</span>
              <span>Video appears in your gallery when ready</span>
            </li>
          </ol>
        </div>

        <div className="mt-6 bg-amber-50 rounded-xl p-6 border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-3">Tips for Best Results</h3>
          <ul className="text-sm text-amber-800 space-y-2">
            <li>• Use high-quality, well-lit images</li>
            <li>• Be specific about camera movements (zoom, pan, tilt)</li>
            <li>• Describe the mood and atmosphere (cinematic, dramatic, peaceful)</li>
            <li>• Mention speed (slow, gentle, quick, dramatic)</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
