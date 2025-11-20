import React, { useState, useMemo } from 'react';
import Header from './Header';
import CategoryFilter from './CategoryFilter';
import PostList from './PostList';
import CreatePostModal from './CreatePostModal';
import EditPostModal from './EditPostModal';
import { useAuth } from '../context/AuthContext';
import { initialPosts } from '../data/posts';

const MainApp = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);

  const filteredPosts = useMemo(() => {
    if (currentFilter === 'all') {
      return posts;
    }
    return posts.filter((post) => post.category === currentFilter);
  }, [posts, currentFilter]);

  const handleLike = (postId, newLikedState) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const wasLiked = post.liked;
          const newLikes = newLikedState 
            ? (wasLiked ? post.likes : post.likes + 1)  // If becoming liked and wasn't before, add 1
            : (wasLiked ? post.likes - 1 : post.likes); // If becoming unliked and was liked, subtract 1
          
          return {
            ...post,
            liked: newLikedState,
            likes: Math.max(0, newLikes), // Ensure likes never go below 0
          };
        }
        return post;
      })
    );
  };

  const handleReport = (postId) => {
    // Report functionality
    console.log('Reported post:', postId);
  };

  const handleCreatePost = (formData) => {
    if (!currentUser) return;
    
    // Generate initials from name
    const getInitials = (name) => {
      if (!name || name.trim() === '') return 'U';
      const parts = name.trim().split(' ').filter(n => n.length > 0);
      if (parts.length === 0) return 'U';
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
    };

    const newPost = {
      id: Date.now(), // Use timestamp for unique ID
      authorId: currentUser.id,
      category: formData.category,
      author: {
        name: currentUser.name,
        initials: getInitials(currentUser.name),
      },
      time: 'Vừa xong',
      title: formData.title,
      content: formData.content,
      likes: 0,
      liked: false,
      comments: [],
      ...(formData.file && {
        attachment: {
          name: formData.file.name,
          size: `${(formData.file.size / 1024 / 1024).toFixed(2)} MB`,
        },
      }),
    };
    setPosts([newPost, ...posts]);
    alert('Bài viết đã được tạo!');
  };

  const handleEditPost = (post) => {
    setPostToEdit(post);
    setIsEditModalOpen(true);
  };

  const handleUpdatePost = (postId, formData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedPost = {
            ...post,
            category: formData.category,
            title: formData.title,
            content: formData.content,
          };
          
          // If a new file is selected, update attachment
          // Otherwise, preserve existing attachment
          if (formData.file) {
            updatedPost.attachment = {
              name: formData.file.name,
              size: `${(formData.file.size / 1024 / 1024).toFixed(2)} MB`,
            };
          }
          // If no file and no existing attachment, attachment stays undefined
          
          return updatedPost;
        }
        return post;
      })
    );
    alert('Bài viết đã được cập nhật!');
  };

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    alert('Bài viết đã được xóa!');
  };

  return (
    <div id="mainApp">
      <Header />
      <div className="container">
        <CategoryFilter
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />
        <div className="create-post-section">
          <div
            className="create-post-input"
            onClick={() => setIsModalOpen(true)}
          >
            Đăng một bài thread
          </div>
        </div>
        <PostList
          posts={filteredPosts}
          onLike={handleLike}
          onReport={handleReport}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />
      </div>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePost={handleCreatePost}
      />
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setPostToEdit(null);
        }}
        post={postToEdit}
        onUpdatePost={handleUpdatePost}
      />
    </div>
  );
};

export default MainApp;

