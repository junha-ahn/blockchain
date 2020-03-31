export interface Result {
  httpCode: number,
  message?: string,
  data?: any,
}

export interface TransactionData {
  amount: number;
  sender: string;
  recipient: string;
}
