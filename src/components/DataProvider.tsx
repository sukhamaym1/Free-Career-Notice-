import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createStorageProvider, ContentService } from '../lib/storage';
import { Post, SiteSettings } from '../lib/storage/types';
import { STUDY_MATERIALS as fallbackStudyMaterials } from '../data/studyMaterials';

// Fallback data
import fallbackSettings from '../../content/settings.json';

const postsModules = import.meta.glob('../../content/posts/*.json', { eager: true });
const fallbackRawPosts = Object.values(postsModules).map((mod: any) => mod.default || mod);

const pagesModules = import.meta.glob('../../content/pages/*.json', { eager: true });
const fallbackPages: Record<string, string> = {};
for (const path in pagesModules) {
  const mod: any = pagesModules[path];
  const pageId = path.split('/').pop()?.replace('.json', '');
  if (pageId) {
    fallbackPages[pageId] = (mod.default || mod).content || '';
  }
}

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
  STATIC_PAGES: Record<string, string>;
  STUDY_MATERIALS: any[];
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
    COLOR_BLOCKS: (() => {
      let blocks = publishedPosts
        .filter(p => p.categorySlug === 'highlight-updates')
        .map(p => ({ title: p.title, bgClass: p.bgClass, id: p.id }));
      
      // If no highlight updates, show the 6 most recent posts from any category
      if (blocks.length === 0) {
        blocks = publishedPosts.slice(0, 6).map(p => ({
          title: p.title,
          bgClass: p.bgClass,
          id: p.id
        }));
      }
      return blocks;
    })(),
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
      .filter(p => p.categorySlug === 'admit-card' || p.categorySlug === 'admit-card')
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

function GlobalSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      {/* Header Skeleton */}
      <div className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center px-4 md:px-8 justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-200 dark:bg-slate-800 rounded animate-pulse hidden sm:block"></div>
        </div>
        <div className="hidden md:flex gap-6">
          {[1,2,3,4,5].map(i => <div key={i} className="w-20 h-4 bg-gray-200 dark:bg-slate-800 rounded animate-pulse"></div>)}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-full animate-pulse md:hidden"></div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-8 mt-4">
        {/* Top Blocks Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Search/Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
               <div className="flex-1 h-12 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
               <div className="w-full sm:w-32 h-12 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse flex flex-col p-5 gap-4">
                  <div className="w-24 h-6 bg-gray-300 dark:bg-slate-700 rounded-md"></div>
                  <div className="flex-1"></div>
                  <div className="w-full h-4 bg-gray-300 dark:bg-slate-700 rounded-md"></div>
                  <div className="w-2/3 h-4 bg-gray-300 dark:bg-slate-700 rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="h-96 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            <div className="h-64 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Omit<DataContextType, 'loading' | 'error'>>(() => {
    // Initialize with fallback
    const processed = processPosts(fallbackRawPosts as Post[]);
    return { ...processed, SITE_SETTINGS: fallbackSettings as SiteSettings, STATIC_PAGES: fallbackPages, STUDY_MATERIALS: fallbackStudyMaterials };
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        let pat = '';
        try {
          const savedSession = sessionStorage.getItem('github_cms_session');
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            pat = parsed.pat || '';
          }
        } catch (e) {
          // Ignore
        }
        
        const storageProvider = createStorageProvider(pat);
        const contentService = new ContentService(storageProvider);
        
        const [posts, settings, pages, studyMaterials] = await Promise.all([
          contentService.getPosts(),
          contentService.getSettings(),
          contentService.getPages ? contentService.getPages() : Promise.resolve({}),
          contentService.getStudyMaterials ? contentService.getStudyMaterials() : Promise.resolve([])
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
          
          // Merge fallback study materials
          const smMap = new Map();
          fallbackStudyMaterials.forEach(sm => smMap.set(sm.id, sm));

          // Apply local cache first (helpful during GitHub Pages CDN delays)
          let cachedMaterials = null;
          let useRemote = true;
          try {
            const cachedSm = localStorage.getItem('cached_study_materials');
            const cachedTimestampStr = localStorage.getItem('cached_study_materials_timestamp');
            
            if (cachedSm) {
              cachedMaterials = JSON.parse(cachedSm);
              if (Array.isArray(cachedMaterials)) {
                // Clear the map first so we only have cached materials
                smMap.clear();
                cachedMaterials.forEach(sm => smMap.set(sm.id, sm));
              }
              
              if (cachedTimestampStr) {
                const ts = parseInt(cachedTimestampStr, 10);
                // Trust local cache completely for 5 minutes after a local edit to overcome GitHub Pages CDN caching
                if (Date.now() - ts < 5 * 60 * 1000) {
                  useRemote = false;
                }
              }
            }
          } catch(e) {}

          if (useRemote && studyMaterials && Array.isArray(studyMaterials)) {
            // We trust the remote data now
            smMap.clear(); 
            // Optional: fallbackStudyMaterials could be merged again if needed, but usually remote has everything
            studyMaterials.forEach(sm => smMap.set(sm.id, sm));
            
            try {
              localStorage.setItem('cached_study_materials', JSON.stringify(Array.from(smMap.values())));
            } catch(e) {}
          }
          const mergedStudyMaterials = Array.from(smMap.values());

          setData({ 
            ...processed, 
            SITE_SETTINGS: { ...(fallbackSettings as SiteSettings), ...(settings || {}) }, 
            STATIC_PAGES: { ...fallbackPages, ...(pages || {}) },
            STUDY_MATERIALS: mergedStudyMaterials
          });
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
      {loading ? <GlobalSkeleton /> : children}
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
