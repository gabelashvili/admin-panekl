export interface RequestUser {
    id: string;
    name: string;
    phoneNumber: string;
    personalNumber: string;
    userType: 'Main' | 'Secondary';
    secondaryNumber: string | null;
    address?: string | null;
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
    secondaryNumber: string | null;
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


export interface UsersListFiltersModel {
    Page: number | null;
    PageSize: number | null;
    SearchTerm: string | null;
}

export interface ChildModel {
    kidId: string;
    kidName: string;
    kidPhoneNumber: string;
    kidPersonalNumber: string;
    kidNumberOfSosRequestsSent: number;
}

export interface UsersListResponseModel {
    userId: string;
    parentName: string;
    personalNumber: string;
    parentNumber: string;
    secondaryNumber: string;
    howManyKids: number;
    subscriptionType: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
    rejectedSosRequests: number;
    acceptedSosRequestsByParent: number;
    acceptedSosRequestsByOperator: number;
    kids: ChildModel[];
}

export interface UsersListResponseModel {
    "users": Array<UsersListResponseModel>;
    "totalCount": number;
    "totalPages": number;
    "currentPage": number;
}
