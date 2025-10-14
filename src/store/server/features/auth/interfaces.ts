export interface SignInRequest {
    username: string;
    password: string;
}
export interface SignInResponse {
    authorizationToken: string;
}

export interface AuthedUserQueryResponse {
    "id": string;
    "userName": string;
    "userType": "Dispatcher" | "Admin";
    "timeStamp": Date
}