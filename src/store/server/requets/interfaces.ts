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
    secondaryUser: RequestUser & { age: number };
    parentUser: RequestUser;
    longitude: string;
    latitude: string;
    address?: string;
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
    document: {
        "id": "cfa6408d-2268-4460-b0b2-25a2e93de27c",
        "url": "https://lumex.fra1.cdn.digitaloceanspaces.com/lumex-dev/documents/1fbe75a8-0483-4046-9f2e-761f03a0d0f2.pdf",
        "timestamp": "2025-12-08T11:24:47.892924Z",
        "documentType": "HelpRequestCompletion",
        "adminUserId": "650bde53-75eb-47db-ac6e-f987bc82692a"
    } | null;
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
    gender: 'Male' | 'Female';
    timeStamp: Date;
    birthdate: string;
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
    email: string | null;
    kids: ChildModel[];
    timeStamp: Date;
    attribution: {
        trackerToken: string | null;
        trackerName: string;
        network: string;
        campaign: string;
        adgroup: string | null;
        creative: string | null;
        clickLabel: string | null;
    } | null;
    "deviceInfo": {
        "model": string,
        "manufacturer": "string",
        "systemName": string,
        "systemVersion": string,
        "deviceId": string,
        "apiLevel": number,
        "isTablet": boolean,
        "isEmulator": boolean,
        "deviceType": string,
        "screenWidth": number,
        "screenHeight": number,
        "pixelDensity": number,
        "fontScale": number
    } | null;
}

export interface UsersListResponseModel {
    "users": Array<UsersListResponseModel>;
    "totalCount": number;
    "totalPages": number;
    "currentPage": number;
}
