export interface FeedbackSummaryFilters {
  FromDate?: string | null;
  ToDate?: string | null;
  Rating?: number | null;
  ParentName?: string | null;
}

export interface FeedbackSummaryResponse {
  averageRating: number;
  totalFeedbacks: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
}

export interface FeedbacksFilters extends FeedbackSummaryFilters {
  SortDescending?: boolean | null;
  Page: number | null;
  PageSize: number | null;
}

export interface FeedbackModel {
  id: number;
  rating: number;
  comment: string;
  timestamp: string;
  helpRequestId: string;
  parentName: string;
  parentPhoneNumber: string;
}

export interface FeedbacksResponse {
  feedbacks: FeedbackModel[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
