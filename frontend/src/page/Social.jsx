import React, { useState, useEffect } from 'react';
import axios from 'axios';

const shimmer = "bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite] bg-[length:200%_100%]";

const Social = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
        <div className="w-full max-w-xl mx-auto p-6">
          <div className={`h-6 w-40 rounded-full mb-6 bg-zinc-800 relative overflow-hidden ${shimmer}`}></div>
          <div className="space-y-4">
            <div className={`h-28 rounded-2xl bg-zinc-800 relative overflow-hidden ${shimmer}`}></div>
            <div className={`h-28 rounded-2xl bg-zinc-800 relative overflow-hidden ${shimmer}`}></div>
            <div className={`h-28 rounded-2xl bg-zinc-800 relative overflow-hidden ${shimmer}`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-red-200 shadow-lg shadow-red-900/20">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-100">
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(16,185,129,0.15),transparent)]"/>
      </div>

      <div className="mx-auto max-w-3xl px-4 md:px-6 pt-20 pb-24">
        <header className="sticky top-0 z-10 -mx-4 md:-mx-6 mb-6 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/70 bg-zinc-950/50 border-b border-white/10">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <div className="flex items-center justify-between py-4">
              <h2 className="text-lg md:text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-emerald-300 to-zinc-100">
                Community Feed
              </h2>
              <div className="inline-flex items-center rounded-full border border-white/10 bg-zinc-900/50 p-1 shadow-sm">
                <button
                  className={`px-4 py-1.5 text-sm rounded-full transition ${activeTab === 'feed' ? 'bg-emerald-500 text-zinc-900 shadow-sm' : 'text-zinc-300 hover:text-white'}`}
                  onClick={() => setActiveTab('feed')}
                >
                  Feed
                </button>
                <button
                  className={`px-4 py-1.5 text-sm rounded-full transition ${activeTab === 'my-posts' ? 'bg-emerald-500 text-zinc-900 shadow-sm' : 'text-zinc-300 hover:text-white'}`}
                  onClick={() => setActiveTab('my-posts')}
                >
                  My Posts
                </button>
              </div>
            </div>
          </div>
        </header>

        <PublishPost onPostCreated={fetchPosts} />

        <div className="mt-8 space-y-6">
          {posts
            .filter(p => (activeTab === 'my-posts' ? String(p.user_id) === localStorage.getItem('user_id') : true))
            .map(post => (
              <Post key={post.id} post={post} onUpdate={fetchPosts} />
            ))}
        </div>
      </div>
    </div>
  );
};

const PublishPost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);

      await axios.post('http://localhost:8000/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setContent('');
      setTitle('');
      setImage(null);
      onPostCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 p-4 md:p-6 shadow-xl shadow-black/30">
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
      <h3 className="text-base font-medium text-zinc-200 mb-4">Create a Post</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition"
        />

        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition"
        />

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <label htmlFor="post-image" className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white cursor-pointer">
            <span className="i-lucide-image w-4 h-4" />
            <span>Add Image (optional)</span>
            <input id="post-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {image && <span className="text-xs text-zinc-400 truncate max-w-[50%]">{image.name}</span>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-emerald-900/30 transition"
          >
            {isSubmitting ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Post = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isReacting, setIsReacting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const handleReaction = async (type) => {
    setIsReacting(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`http://localhost:8000/api/posts/${post.id}/react`, { type }, { headers: { Authorization: `Bearer ${token}` } });
      onUpdate();
    } catch (err) {
      console.error('Reaction failed:', err);
    } finally {
      setIsReacting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsCommenting(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`http://localhost:8000/api/posts/${post.id}/comments`, { content: commentText }, { headers: { Authorization: `Bearer ${token}` } });
      setCommentText('');
      onUpdate();
    } catch (err) {
      console.error('Comment failed:', err);
    } finally {
      setIsCommenting(false);
    }
  };

  const userReaction = post.reactions?.find(r => r.user_id === parseInt(localStorage.getItem('user_id')));

  return (
    <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 p-4 md:p-6 shadow-xl shadow-black/30">
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />

      <div className="flex items-start gap-3">
        <img
          src={post.user?.profile?.avatar || '/default-avatar.png'}
          alt={post.user?.name}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-zinc-100">{post.user?.name}</h4>
              <span className="text-xs text-zinc-500">{new Date(post.created_at).toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">{post.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{post.content}</p>
            {post.image && (
              <img
                src={`http://localhost:8000/storage/${post.image}`}
                alt="Post"
                className="mt-4 w-full overflow-hidden rounded-xl border border-white/10 object-cover"
              />
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
            <div className="inline-flex items-center gap-1.5">
              {post.reactions?.length > 0 && (
                <>
                  <span>👍</span>
                  <span className="tabular-nums">{post.reactions.length}</span>
                </>
              )}
            </div>
            <button onClick={() => setShowComments(!showComments)} className="hover:text-zinc-200">
              {post.comments?.length || 0} comments
            </button>
          </div>

          <div className="mt-3 border-t border-white/10 pt-3 flex items-center gap-2">
            <button
              onClick={() => handleReaction('like')}
              disabled={isReacting}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition border border-white/10 ${userReaction?.type === 'like' ? 'bg-emerald-500 text-zinc-900 hover:bg-emerald-400' : 'text-zinc-300 hover:text-white hover:bg-white/5'}`}
            >
              👍 Like
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition text-zinc-300 hover:text-white hover:bg-white/5 border border-white/10"
            >
              💬 Comment
            </button>
          </div>

          {showComments && (
            <div className="mt-4">
              <form onSubmit={handleCommentSubmit} className="flex items-start gap-2">
                <textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50"
                />
                <button
                  type="submit"
                  disabled={isCommenting}
                  className="self-stretch rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-emerald-900/30 transition"
                >
                  {isCommenting ? 'Posting…' : 'Post'}
                </button>
              </form>

              <div className="mt-4 space-y-3">
                {post.comments?.map(comment => (
                  <div key={comment.id} className="flex items-start gap-2">
                    <img
                      src={comment.user?.profile?.avatar || '/default-avatar.png'}
                      alt={comment.user?.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-medium text-zinc-100">{comment.user?.name}</h5>
                        <span className="text-[10px] text-zinc-500">{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-200">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Social;