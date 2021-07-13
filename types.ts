export interface SearchSettings {
  siteUrl: string;
  maxDepth: number;
  username?: string;
  password?: string;
}

export interface SearchPages {
  errors: Set<string>;
  queue: Set<string>;
  found: Set<string>;
}

export interface Pages {
  pages: string[];
  errors: string[];
}
