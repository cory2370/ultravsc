import React from 'react';
import Post from './Post';

const PostList = ({
  posts,
  onLike,
  onReport,
  onEdit,
  onDelete,
  onAddComment,
  onDeleteComment,
  onEditComment,
}) => {
  return (
    <div className="posts" id="postsContainer">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onLike={onLike}
          onReport={onReport}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          onEditComment={onEditComment}
        />
      ))}
    </div>
  );
};

export default PostList;

