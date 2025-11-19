import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  Image as ImageIcon,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  Trash2,
  Filter,
  Search,
} from 'lucide-react';

interface Generation {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result_url: string | null;
  thumbnail_url: string | null;
  error_message: string | null;
  tokens_used: number;
  created_at: string;
  completed_at: string | null;
}

type FilterType = 'all' | 'image' | 'video';
type FilterStatus = 'all' | 'completed' | 'pending' | 'failed';

export function Gallery() {
  const { profile } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);

  useEffect(() => {
    if (profile) {
      fetchGenerations();
    }
  }, [profile, filterType, filterStatus]);

  const fetchGenerations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('generations')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setGenerations(data || []);
    } catch (error) {
      console.error('Error fetching generations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this generation?')) return;

    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', id)
        .eq('user_id', profile!.id);

      if (error) {
        console.error('Delete error:', error);
        alert('Failed to delete generation. Please try again.');
        return;
      }

      setGenerations(generations.filter((g) => g.id !== id));
      setSelectedGeneration(null);
    } catch (error) {
      console.error('Error deleting generation:', error);
      alert('Failed to delete generation. Please try again.');
    }
  };

  const filteredGenerations = generations.filter((gen) =>
    gen.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Generation['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'processing':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h1>
          <p className="text-gray-600">View and manage all your AI generations</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading generations...</p>
          </div>
        ) : filteredGenerations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No generations found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Start creating amazing AI content'}
            </p>
            <a
              href="/dashboard/generate"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Generation
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGenerations.map((gen) => (
              <div
                key={gen.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedGeneration(gen)}
              >
                <div className="aspect-square bg-gray-100 relative">
                  {gen.status === 'completed' && gen.result_url ? (
                    gen.type === 'video' ? (
                      <div className="w-full h-full relative">
                        <video
                          src={gen.result_url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="bg-white/90 rounded-full p-3">
                            <Video className="w-8 h-8 text-gray-700" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={gen.thumbnail_url || gen.result_url || ''}
                        alt={gen.prompt}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {gen.type === 'image' ? (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      ) : (
                        <Video className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(gen.status)}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {gen.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Video className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(gen.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-2 mb-2">{gen.prompt}</p>
                  <div className="text-xs text-gray-500">{gen.tokens_used} tokens used</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedGeneration && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedGeneration(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {selectedGeneration.type === 'image' ? (
                      <ImageIcon className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Video className="w-6 h-6 text-purple-600" />
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Generation Details</h2>
                      <p className="text-sm text-gray-500">
                        {new Date(selectedGeneration.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedGeneration.status === 'completed' && selectedGeneration.result_url && (
                      <a
                        href={selectedGeneration.result_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(selectedGeneration.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {selectedGeneration.status === 'completed' && selectedGeneration.result_url ? (
                  <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                    {selectedGeneration.type === 'image' ? (
                      <img
                        src={selectedGeneration.result_url}
                        alt={selectedGeneration.prompt}
                        className="w-full h-auto max-h-[60vh] object-contain"
                      />
                    ) : (
                      <video
                        src={selectedGeneration.result_url}
                        controls
                        className="w-full h-auto max-h-[60vh]"
                        controlsList="nodownload"
                      />
                    )}
                  </div>
                ) : (
                  <div className="mb-4 aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                    {getStatusBadge(selectedGeneration.status)}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Prompt</h3>
                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedGeneration.prompt}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-1">Type</h3>
                      <p className="text-gray-900 capitalize">{selectedGeneration.type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-1">Tokens Used</h3>
                      <p className="text-gray-900">{selectedGeneration.tokens_used}</p>
                    </div>
                  </div>

                  {selectedGeneration.error_message && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-1">Error</h3>
                      <p className="text-sm">{selectedGeneration.error_message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
