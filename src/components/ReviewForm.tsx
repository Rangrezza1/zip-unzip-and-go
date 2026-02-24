import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateReview, uploadReviewImage } from '@/hooks/useReviews';
import ReviewStars from './ReviewStars';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewFormProps {
  productHandle: string;
  productTitle: string;
  onSuccess?: () => void;
}

const ReviewForm = ({ productHandle, productTitle, onSuccess }: ReviewFormProps) => {
  const { user, signIn, signUp, signOut } = useAuth();
  const createReview = useCreateReview();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a rating'); return; }
    if (!reviewerName.trim()) { toast.error('Please enter your name'); return; }

    setUploading(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadReviewImage(imageFile);
      }
      await createReview.mutateAsync({
        product_handle: productHandle,
        product_title: productTitle,
        reviewer_name: reviewerName.trim(),
        rating,
        review_text: reviewText.trim(),
        image_url: imageUrl,
      });
      toast.success('Review submitted!');
      setRating(0);
      setReviewText('');
      setReviewerName('');
      setImageFile(null);
      setImagePreview('');
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setUploading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Signed in!');
      } else {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast.success('Check your email to confirm your account');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="border rounded-lg p-4 md:p-6 bg-card">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
          {authMode === 'login' ? 'Sign In to Write a Review' : 'Create Account to Write a Review'}
        </h3>
        <form onSubmit={handleAuth} className="space-y-3">
          {authMode === 'signup' && (
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required className="w-full text-xs bg-secondary border rounded px-3 py-2.5" />
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full text-xs bg-secondary border rounded px-3 py-2.5" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6} className="w-full text-xs bg-secondary border rounded px-3 py-2.5" />
          <button type="submit" disabled={authLoading} className="cta-button w-full flex items-center justify-center gap-2 py-2.5">
            {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-primary font-semibold">
            {authMode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 md:p-6 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider">Write a Review</h3>
        <button onClick={signOut} className="text-xs text-muted-foreground hover:text-foreground">Sign Out</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium block mb-1.5">Rating *</label>
          <ReviewStars rating={rating} size={24} interactive onRate={setRating} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1.5">Your Name *</label>
          <input type="text" value={reviewerName} onChange={e => setReviewerName(e.target.value)} required className="w-full text-xs bg-secondary border rounded px-3 py-2.5" placeholder="Your name" />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1.5">Your Review</label>
          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3} className="w-full text-xs bg-secondary border rounded px-3 py-2.5 resize-none" placeholder="Share your experience..." />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1.5">Photo (optional)</label>
          {imagePreview ? (
            <div className="relative w-20 h-20">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded border" />
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 text-xs text-muted-foreground border border-dashed rounded px-3 py-3 cursor-pointer hover:bg-secondary transition-colors">
              <Upload className="w-4 h-4" /> Upload photo
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
        <button type="submit" disabled={uploading} className="cta-button w-full flex items-center justify-center gap-2 py-2.5">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
