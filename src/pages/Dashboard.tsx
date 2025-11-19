import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Sparkles, Image, Video, TrendingUp, Clock, ArrowRight } from 'lucide-react';

interface Generation {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  result_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

interface Stats {
  totalGenerations: number;
  imageGenerations: number;
  videoGenerations: number;
  tokensUsed: number;
}

export function Dashboard() {
  const { profile } = useAuth();
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalGenerations: 0,
    imageGenerations: 0,
    videoGenerations: 0,
    tokensUsed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      const { data: generations, error: genError } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (genError) throw genError;

      const { count: totalCount } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile!.id);

      const { count: imageCount } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile!.id)
        .eq('type', 'image');

      const { count: videoCount } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile!.id)
        .eq('type', 'video');

      setRecentGenerations(generations || []);
      setStats({
        totalGenerations: totalCount || 0,
        imageGenerations: imageCount || 0,
        videoGenerations: videoCount || 0,
        tokensUsed: profile!.total_tokens_used,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {profile?.full_name || 'Creator'}!
            </h1>
            {profile?.is_admin && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-gray-600">
            {profile?.is_admin ? (
              <>Admin Dashboard - Unlimited Access</>
            ) : (
              <>Here's an overview of your AI creation activity</>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalGenerations}
            </div>
            <div className="text-sm text-gray-600">Total Generations</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Image className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.imageGenerations}
            </div>
            <div className="text-sm text-gray-600">Images Created</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.videoGenerations}
            </div>
            <div className="text-sm text-gray-600">Videos Created</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.tokensUsed}
            </div>
            <div className="text-sm text-gray-600">Tokens Used</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Start Creating</h2>
              <p className="text-blue-100 mb-4">
                Transform your ideas into stunning visuals with AI
              </p>
              <Link
                to="/dashboard/generate"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Generate Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <Sparkles className="w-32 h-32 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Generations</h2>
            <Link
              to="/dashboard/gallery"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading...
            </div>
          ) : recentGenerations.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No generations yet</p>
              <Link
                to="/dashboard/generate"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first generation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentGenerations.map((gen) => (
                <Link
                  key={gen.id}
                  to={`/dashboard/gallery`}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:border-blue-300 transition"
                >
                  {gen.result_url ? (
                    gen.type === 'video' ? (
                      <div className="w-full h-full relative">
                        <video
                          src={gen.result_url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="bg-white/90 rounded-full p-2">
                            <Video className="w-6 h-6 text-gray-700" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={gen.thumbnail_url || gen.result_url || ''}
                        alt={gen.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {gen.type === 'image' ? (
                        <Image className="w-8 h-8 text-gray-400" />
                      ) : (
                        <Video className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                    <p className="text-white text-xs line-clamp-2">{gen.prompt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
