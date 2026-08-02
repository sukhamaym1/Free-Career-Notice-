import { useState, useEffect } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const item = window.localStorage.getItem('bookmarkedPosts');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarks));
    } catch (error) {
      console.error(error);
    }
  }, [bookmarks]);

  const toggleBookmark = (postId: string) => {
    setBookmarks((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const isBookmarked = (postId: string) => {
    return bookmarks.includes(postId);
  };

  return { bookmarks, toggleBookmark, isBookmarked };
}
