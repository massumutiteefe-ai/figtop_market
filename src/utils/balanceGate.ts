/**
 * Verification engine ensuring that a client's requested transaction volume
 * does not exceed their currently aggregated compounding wallet portfolio balance.
 */
export function verifyAvailableLiquidity(requestedAmount: string | number): boolean {
  const amountToVerify = Number(requestedAmount);
  
  if (isNaN(amountToVerify) || amountToVerify <= 0) {
    alert("Please enter a valid allocation amount.");
    return false;
  }

  // Extract the absolute live running wallet total exposed by the balance card metrics
  const totalAvailableCash = (window as any).currentClientWalletBalance || 0;

  if (amountToVerify > totalAvailableCash) {
    alert("Execution Failed: Insufficient Funds. Please deposit liquidity into your account wallet balance to proceed.");
    return false;
  }

  return true; // Verification passed successfully
}