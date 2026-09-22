/** A single blog post entry */
export interface BlogPost {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  /** Full article content — optional on list pages, required on detail pages */
  content?: string;
}