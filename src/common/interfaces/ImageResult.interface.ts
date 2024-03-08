export interface ImageResult {
  position: number;
  thumbnail: string;
  related_content_id: string;
  serpapi_related_content_link: string;
  source: string;
  source_logo: string;
  title: string;
  link: string;
  original: string;
  original_width: number;
  original_height: number;
  is_product: boolean;
}

export interface RelatedImage {
  title: string;
  url_image: string;
  url_link: string;
};