export interface PaymentModel  {
    "userId": string;
    "name": string;
    "subscription": {
        "subscriptionId": string;
        "status": "Active" | "Inactive";
        "startDate": Date;
        "endDate": Date;
        "plan": {
            "subscriptionPlanId": number;
            "name": string;
            "type": "Monthly" | "Yearly";
        },
        "card": {
            "cardId": string;
            "cardType": "VISA" | "Mastercard" | "American Express" | "Discover";
        }
    },
    "lastPayment": {
        "transactionId": string;
        "amount": number;
        "status": "SUCCESS" | "FAILED" | "PENDING";
        "timestamp": Date;
        "description": string;
        "card": {
            "cardId": string;
            "cardType": "VISA" | "Mastercard" | "American Express" | "Discover";
        } | null;
    },
    "hasPaymentRequired": false,
    "paymentRequiredTransactions": Array<{
        "transactionId": string;
        "amount": number;
        "status": "SUCCESS" | "FAILED" | "PENDING";
        "timestamp": Date;
        "description": string;
        "card": {
            "cardId": string;
            "cardType": "VISA" | "Mastercard" | "American Express" | "Discover";
        } | null;
    }>,
    "totalOwed": number;
}

export interface PaymentResponseModel {
    "users": Array<PaymentModel>;
    "page": number;
    "pageSize": number;
    "totalPages": number;
}

export interface TransactionsResponseModel {
    "transactions": Array<{
        "transactionId": string,
        "amount": number,
        "status": "string",
        "timestamp": Date,
        "description": "string",
        gracePeriodEndDate: Date,
        "card": {
          "cardId": string,
          "cardType": "string"
        }
    }>;
    "page": number;
    "pageSize": number;
    "totalPages": number;
}

