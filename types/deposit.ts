export type DepositMethod = 'CRYPTO' | 'GIFTCARD' | 'ZELLE' | 'PAYPAL';

export interface DepositState {
  selectedMethod: DepositMethod | null;
  amount: number;
  transactionRef: string;
  proofFile: File | null;
  setMethod: (method: DepositMethod | null) => void;
  setAmount: (amount: number) => void;
  setTransactionRef: (ref: string) => void;
  setProofFile: (file: File | null) => void;
  resetDeposit: () => void;
}