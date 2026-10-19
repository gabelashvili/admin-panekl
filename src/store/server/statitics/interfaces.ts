export interface DailyStat {
  date: string;
  registrations: number;
  subscriptions: number;
  conversionRate: number;
}

export interface StatisticsResponse {
  totalRegisteredUsers: number;
  activeSubscriptions: number;
  activeSubscriptionsWithCoveragesCount: number;
  conversionRate: number;
  dailyStats: DailyStat[];
  totalDailyStats: number;
  currentPage: number;
  totalPages: number;
}
