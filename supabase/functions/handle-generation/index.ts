import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface WebhookPayload {
  job_id: string;
  status: 'processing' | 'completed' | 'failed';
  video_url?: string;
  error_message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: WebhookPayload = await req.json();

    const { job_id, status, video_url, error_message } = payload;

    if (!job_id || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: job_id and status' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    let result_url = video_url || null;

    if (status === 'completed' && !result_url) {
      const { data: files } = await supabase.storage
        .from('videos')
        .list('', {
          search: job_id,
        });

      if (files && files.length > 0) {
        const videoFile = files[0];
        const { data: publicData } = supabase.storage
          .from('videos')
          .getPublicUrl(videoFile.name);

        result_url = publicData.publicUrl;
      }
    }

    const updateData: any = {
      status,
      completed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null,
    };

    if (result_url) updateData.result_url = result_url;
    if (error_message) updateData.error_message = error_message;

    const { error: updateError } = await supabase
      .from('generations')
      .update(updateData)
      .eq('job_id', job_id);

    if (updateError) {
      throw new Error(`Database update failed: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Generation updated successfully',
        job_id,
        result_url,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});