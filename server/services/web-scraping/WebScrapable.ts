export interface WebSellableItem {
  price: string | null | undefined;
  currency: string | null | undefined;
  name: string | null | undefined;
  description: string | null | undefined;
  type: string | null | undefined;
  imageUrl: string | null | undefined;
  link: string | null | undefined;
}

export interface WebQuery {
  // price: {
  //   min: number;
  //   max: number;
  // };
  price_min?: number;
  price_max?: number;
  currency?: string;
  type?: string;
}

export interface WebScrapable {
  searchWeb(query: WebQuery): Promise<WebSellableItem[]>;
  //   makeRequest(query: WebQuery): Promise<void>;
}
