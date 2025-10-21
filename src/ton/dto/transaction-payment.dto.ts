export class TransactionPaymentDto {
  account_id: string;
  lt:number;
  tx_hash: string;
}

export class TonTransaction {
  in_msg?: {
    value?: string;
    source?: string;
  };
}