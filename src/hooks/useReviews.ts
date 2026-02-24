import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: string;
  user_id: string;
  product_handle: string;
  product_title: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  image_url: string | null;
  created_at: string;
}

export function useProductReviews(productHandle: string | undefined) {
  return useQuery({
    queryKey: ['reviews', productHandle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_handle', productHandle!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
    enabled: !!productHandle,
  });
}

export function useAllReviews(limit = 20) {
  return useQuery({
    queryKey: ['reviews', 'all', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Review[];
    },
  });
}

export function useReviewCounts() {
  return useQuery({
    queryKey: ['review-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('product_handle, rating');
      if (error) throw error;
      const counts: Record<string, { count: number; avgRating: number }> = {};
      (data as { product_handle: string; rating: number }[]).forEach(r => {
        if (!counts[r.product_handle]) counts[r.product_handle] = { count: 0, avgRating: 0 };
        counts[r.product_handle].count++;
        counts[r.product_handle].avgRating += r.rating;
      });
      Object.keys(counts).forEach(k => {
        counts[k].avgRating = counts[k].avgRating / counts[k].count;
      });
      return counts;
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: {
      product_handle: string;
      product_title: string;
      reviewer_name: string;
      rating: number;
      review_text: string;
      image_url?: string | null;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');
      const { data, error } = await supabase
        .from('reviews')
        .insert({ ...review, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_handle] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['review-counts'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-counts'] });
    },
  });
}

export async function uploadReviewImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('review-images').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('review-images').getPublicUrl(path);
  return data.publicUrl;
}
