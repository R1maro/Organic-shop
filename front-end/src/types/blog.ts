export interface Category {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
}

export interface MetaData {
    title?: string;
    description?: string;
    keywords?: string[];
}

export interface BlogFormData {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featured_image?: string;
    status?: 'draft' | 'published' | 'archived';
    published_at?: string;
    meta?: MetaData;
    categories?: Category[];
    tags?: Tag[];
}

export interface BlogFormProps {
    categories: Category[];
    tags: Tag[];
    initialData?: BlogFormData;
}

export interface BlogApiData {
    title: string;
    content: string;
    excerpt?: string;
    featured_image?: File;
    status: string;
    published_at?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
    categories?: number[];
    tags?: number[];
}