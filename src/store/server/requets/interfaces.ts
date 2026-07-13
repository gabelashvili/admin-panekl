export interface RequestUser {
    id: string;
    name: string;
    phoneNumber: string;
    personalNumber: string;
    userType: 'Main' | 'Secondary';
    secondaryNumber: string | null;
    address?: string | null;
  }

interface RequestMemberModel {
    id: string;
    name: string;
    phoneNumber: string;
    secondaryNumber: string | null;
    personalNumber: string;
    longitude: string;
    latitude: string;
    address: string;
    userType: string;
    age: number;
}

 interface RequestModel {
    id: string;
    requestingUser: RequestMemberModel;
    circleMembers: Array<RequestMemberModel>;
    longitude: string;
    latitude: string;
    address: string;
    timestamp: string;
    parentRespondedTimestamp?: string | null;
    status: | "Pending"
    | "Rejected"
    | "Accepted"
    | "AutoAccepted"
    | "SecurityDispatched"
    | "RejectedByDispatcher"
    | "CancelledByDispatcher"
    | "CancelledByUser"
    | "Completed"
    | "Expired"
    | "Cancelled"
    | "CancelledByUser";
    updatedTimestamp: string;
    expirationDate: string;
    dispatcherRespondedTimestamp: string | null;
    completedTimestamp: string | null;
    document: {
        id: string;
        url: string;
        timestamp: string;
        documentType: "HelpRequestCompletion";
        adminUserId: string;
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
    hasActiveSubscription?: boolean | null;
}

export interface DeviceInfoModel {
    model: string;
    manufacturer: string;
    systemName: string;
    systemVersion: string;
    deviceId: string;
    apiLevel: number;
    isTablet: boolean;
    isEmulator: boolean;
    deviceType: string;
    screenWidth: number;
    screenHeight: number;
    pixelDensity: number;
    fontScale: number;
}

export interface UsersListUserModel {
    userId: string;
    name: string;
    isMinor: boolean;
    phoneNumber: string;
    parentPhoneNumber: string | null;
    personalNumber: string;
    email: string | null;
    birthdate: string;
    gender: 'Male' | 'Female' | null;
    subscriptionType: string;
    subscriptionStatus: string;
    completedHelpRequests: number;
    rejectedHelpRequests: number;
    freeHelpRequests: number;
    paidHelpRequests: number;
    deviceInfo: DeviceInfoModel | null;
    attribution: {
        trackerToken: string | null;
        trackerName: string;
        network: string;
        campaign: string;
        adgroup: string | null;
        creative: string | null;
        clickLabel: string | null;
    } | null;
    timeStamp: string;
    isDeleted: boolean;
    deletedTimestamp: string | null;
}

export interface UsersListResponseModel {
    "users": Array<UsersListUserModel>;
    "totalCount": number;
    "totalPages": number;
    "currentPage": number;
}


