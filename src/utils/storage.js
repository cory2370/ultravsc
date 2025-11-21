// Storage utility for persisting posts data

const STORAGE_KEY = 'ultravsc_posts';

/**
 * Load posts from localStorage
 * @param {Array} defaultPosts - Default posts to use if storage is empty
 * @returns {Array} Posts array
 */
export const loadPosts = (defaultPosts = []) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure we have valid posts array
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading posts from storage:', error);
  }
  // Return default posts if storage is empty or invalid
  return defaultPosts;
};

/**
 * Save posts to localStorage
 * @param {Array} posts - Posts array to save
 */
export const savePosts = (posts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts to storage:', error);
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      alert('Không đủ dung lượng lưu trữ. Vui lòng xóa một số bài viết cũ.');
    }
  }
};

/**
 * Clear all posts from storage
 */
export const clearPosts = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing posts from storage:', error);
  }
};
