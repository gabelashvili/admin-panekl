export interface CommentModel {
    "id": string;
    "adminUserId": string;
    "comment": string;
    "timeStamp": Date;
}

export interface CommentResponseModel {
    "comments": Array<CommentModel>;
    "page": number;
    "pageSize": number;
}

export interface CreateCommentModel {
    "userId": string;
    "comment": string;
}