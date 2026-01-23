export interface RequestUser {
    id: string;
    name: string;
    phoneNumber: string;
    personalNumber: string;
    userType: 'Main' | 'Secondary';
    secondaryNumber: string | null;
    address?: string | null;
  }


 interface RequestModel {
    "id": string,
    "child": {
        "id": string,
        "name": string,
        "phoneNumber": string,
        "secondaryNumber": string,
        "personalNumber": string,
        "longitude": string,
        "latitude": "",
        "address": string,
        "userType": string,
        "age": number
    },
    "responderParentUser": {
        "id": string,
        "name": string,
        "phoneNumber": string,
        "secondaryNumber": string,
        "personalNumber": string,
        "longitude": string,
        "latitude": string,
        "address": string,
        "userType": string,
        "age": number
    },
    "longitude": string,
    "latitude": string,
    "address": string,
    "timestamp": string,
    "parentRespondedTimestamp": string | null,
    status: | "Pending"
    | "Rejected"
    | "Accepted"
    | "AutoAccepted"
    | "SecurityDispatched"
    | "RejectedByDispatcher"
    | "Completed"
    | "Expired"
    | "Cancelled";
    "updatedTimestamp": "2025-12-31T09:05:15.140949Z",
    "expirationDate": string,
    "dispatcherRespondedTimestamp": string,
    "completedTimestamp": string | null,
    "document": {
        "id": string;
        "url": string,
        "timestamp": string,
        "documentType": "HelpRequestCompletion",
        "adminUserId": string
    },
    parents?: Array<{
        "id": string,
        "name": string,
        "phoneNumber": string,
        "secondaryNumber": string | null,
        "personalNumber": string,
        "longitude": string,
        "latitude": string,
        "address": string,
        "userType": string,
        "age": number
    }>
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
    children: Array<{
        "id": string,
        "name": string,
        "phoneNumber": string,
        "personalNumber": string,
        "birthdate": string,
        "gender": "Male" | "Female",
        "numberOfSosRequestsSent": number,
        "numberOfSosRequestsReceived": number,
        "timeStamp": string
    }>;
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


