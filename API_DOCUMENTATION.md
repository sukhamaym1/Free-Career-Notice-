# API Documentation

## Storage Layer Services

### ContentService
Located at `src/lib/storage/contentService.ts`.

- `getPosts(): Promise<Post[]>`: Retrieves all posts.
- `getPost(id: string): Promise<Post | null>`: Retrieves a single post.
- `savePost(post: Post, isEdit: boolean): Promise<void>`: Creates or updates a post.
- `deletePost(id: string): Promise<void>`: Deletes a post.
- `getCategories(): Promise<Category[]>`: Retrieves all categories.
- `saveCategories(categories: Category[]): Promise<void>`: Bulk saves the categories array.
- `getTags(): Promise<Tag[]>`: Retrieves all tags.
- `saveTags(tags: Tag[]): Promise<void>`: Bulk saves the tags array.
- `getSettings(): Promise<SiteSettings>`: Retrieves global site settings.
- `saveSettings(settings: SiteSettings): Promise<void>`: Saves global site settings.

### MediaService
Located at `src/lib/storage/mediaService.ts`.

- `listImages(): Promise<MediaFile[]>`: Retrieves a list of all uploaded images.
- `uploadImage(file: File, fileName: string): Promise<void>`: Uploads a new image.
- `deleteImage(path: string): Promise<void>`: Deletes an image given its path.
- `renameImage(oldPath: string, newPath: string): Promise<void>`: Renames/moves an image.

### StorageProvider (Interface)
Located at `src/lib/storage/types.ts`. All future providers must implement this interface to be compatible with the Admin Panel.
