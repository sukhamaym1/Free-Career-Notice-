import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createStorageProvider, ContentService } from '../lib/storage';
import { Post, SiteSettings } from '../lib/storage/types';

// Fallback data
import fallbackSettings from '../../content/settings.json';

const postsModules = import.meta.glob('../../content/posts/*.json', { eager: true });
const fallbackRawPosts = Object.values(postsModules).map((mod: any) => mod.default || mod);

interface DataContextType {
  loading: boolean;
  error: Error | null;
  ALL_POSTS: Post[];
  PUBLISHED_POSTS: Post[];
  JOB_NOTIFICATIONS: any[];
  ADMIT_CARDS: any[];
  RESULTS: any[];
  COLOR_BLOCKS: any[];
  SITE_SETTINGS: SiteSettings;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function processPosts(rawPosts: Post[]) {
  const publishedPosts = rawPosts.filter((p: any) => {
    if (p.status === 'draft') return false;
    if (p.date) {
      const d = new Date(p.date);
      if (!isNaN(d.getTime()) && d > new Date()) {
        return false;
      }
    }
    return true;
  });

  return {
    ALL_POSTS: rawPosts,
    PUBLISHED_POSTS: publishedPosts,
    COLOR_BLOCKS: publishedPosts
      .filter(p => p.categorySlug === 'highlight-updates')
      .map(p => ({ title: p.title, bgClass: p.bgClass, id: p.id })),
    JOB_NOTIFICATIONS: publishedPosts
      .filter(p => p.categorySlug === 'job-notifications')
      .map(p => ({
        id: p.id,
        title: p.title,
        author: p.author,
        date: p.date,
        tag: p.tags?.[0] || '', tags: p.tags || [],
        tagColor: p.tagColor,
        imgGradient: p.imgGradient,
        salary: p.salary,
        jobType: p.jobType,
        location: p.location,
      })),
    ADMIT_CARDS: publishedPosts
      .filter(p => p.categorySlug === 'admit-cards')
      .map(p => ({
        id: p.id,
        title: p.title,
        author: p.author,
        date: p.date,
        tag: p.tags?.[0] || '', tags: p.tags || [],
        tagColor: p.tagColor,
        imgGradient: p.imgGradient,
      })),
    RESULTS: publishedPosts
      .filter(p => p.categorySlug === 'results')
      .map(p => ({
        id: p.id,
        title: p.title,
        author: p.author,
        date: p.date,
        tag: p.tags?.[0] || '', tags: p.tags || [],
        tagColor: p.tagColor,
        imgGradient: p.imgGradient,
      }))
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Omit<DataContextType, 'loading' | 'error'>>(() => {
    // Initialize with fallback
    const processed = processPosts(fallbackRawPosts as Post[]);
    return { ...processed, SITE_SETTINGS: fallbackSettings as SiteSettings };
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const storageProvider = createStorageProvider(''); // No PAT for public fetch
        const contentService = new ContentService(storageProvider);
        
        const [posts, settings] = await Promise.all([
          contentService.getPosts(),
          contentService.getSettings()
        ]);

        if (mounted) {
          // Merge fallback data with remote data to prevent an empty site when the remote repo is new
          const postsMap = new Map();
          (fallbackRawPosts as Post[]).forEach(p => postsMap.set(p.id, p));
          if (posts && Array.isArray(posts)) {
            posts.forEach(p => postsMap.set(p.id, p));
          }
          
          const mergedPosts = Array.from(postsMap.values());
          const processed = processPosts(mergedPosts);
          
          setData({ ...processed, SITE_SETTINGS: { ...(fallbackSettings as SiteSettings), ...(settings || {}) } });
        }
      } catch (err) {
        console.error("Failed to load CMS data from remote, falling back to local bundle.", err);
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    loadData();
    return () => { mounted = false; };
  }, []);

  return (
    <DataContext.Provider value={{ ...data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
