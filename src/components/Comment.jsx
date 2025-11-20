import React from 'react';

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <div className="comment-avatar">{comment.author.initials}</div>
      <div className="comment-content">
        <div className="comment-author">{comment.author.name}</div>
        <div className="comment-text">{comment.text}</div>
      </div>
    </div>
  );
};

export default Comment;

