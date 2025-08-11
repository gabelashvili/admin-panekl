export interface RequestUser {
    id: string;
    name: string;
    phoneNumber: string;
    personalNumber: string;
    userType: 'Main' | 'Secondary';
  }


export interface RequestModel {
    id: string;
    secondaryUser: RequestUser;
    parentUser: RequestUser;
    longitude: string;
    latitude: string;
    timestamp: string; // ISO date string
    parentRespondedTimestamp: string;
    status: | "Pending"
    | "Rejected"
    | "Accepted"
    | "AutoAccepted"
    | "SecurityDispatched"
    | "RejectedByDispatcher"
    | "Completed"
    | "Expired"
    | "Cancelled";
    updatedTimestamp: string;
    expirationDate: string;
}

export interface RequestResponseModel {
    "helpRequests": Array<RequestModel>;
    "totalCount": number;
    "totalPages": number;
    "currentPage": number;
}


export interface RequestsFiltersModel {
    fromDate?: string | null;
    toDate?: string | null;
    page: number | null;
    pageSize: number | null;
}