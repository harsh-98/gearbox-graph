import { BigInt } from "@graphprotocol/graph-ts"
import {
  OpenCreditAccount,
  CloseCreditAccount,
  LiquidateCreditAccount,
  CreditManager as CreditManagerContract,
  NewParameters,
  IncreaseBorrowedAmount,
  TransferAccount1,
  TransferAccount,
  AddCollateral,
  RepayCreditAccount
} from "../generated/templates/CreditManager/CreditManager"
import {CreditAccount,CreditManager,  CreditAccountMap, CreditAccountIndex} from '../generated/schema'

import { Address ,store,log, Bytes} from '@graphprotocol/graph-ts'

//
function getCreditAccountID(addr: string): string {
    let caDetails = CreditAccountIndex.load(addr);
    if (caDetails == null){
        log.error('Credit account deatils does not exist for {}',[addr])
    }
    return `${addr}_${caDetails!.index}`
}
function incrementCreditAccountIndex(addr: string): string {
    let caDetails = CreditAccountIndex.load(addr);
    if (caDetails == null ){
        caDetails = new CreditAccountIndex(addr)
        // caDetails.index = new BigInt(0)
    } 
    caDetails.index = caDetails.index.plus(BigInt.fromI32(1));
    caDetails.save()
    return `${addr}_${caDetails.index}`
}

//
function setCreditAccountAddr(cm: Address, borrower: Address,ca: Bytes): void {
    let id = `${cm.toHexString()}_${borrower.toHexString()}`
    let caMap = CreditAccountMap.load(id);
    if( caMap == null) {
        caMap = new CreditAccountMap(id);
    }
    caMap.creditAccount =  ca
    caMap.save()
}
function getCreditAccountAddr(cm: Address, borrower: Address): Bytes {
    let id = `${cm.toHexString()}_${borrower.toHexString()}`
    let caMap = CreditAccountMap.load(id);
    if(caMap == null) {
        log.error('No credit Account for id: {} ', [id]);
    }
    return caMap!.creditAccount
}

export function openCreditAccount(event: OpenCreditAccount): void {
    let caAddr = event.params.creditAccount;
    // creditaccount to latest used index of creditaccount
    let id = incrementCreditAccountIndex(caAddr.toHexString())
    // set mapping from creditmanager_user to creditaccount
    setCreditAccountAddr(event.address, event.params.onBehalfOf, caAddr);
    let ca = new CreditAccount(id)
    // set properties
    ca.owner = event.params.onBehalfOf;
    ca.account = caAddr
    ca.openBlock = event.block.number
    ca.openHash = event.transaction.hash
    ca.creditManager = event.address.toHexString();
    ca.borrowAmount = event.params.borrowAmount;
    ca.collateral = event.params.amount;
    ca.save()
}

export function closeCreditAccount(event: CloseCreditAccount): void {
    // get creditAccount
    let caAddrStr = getCreditAccountAddr(event.address, event.params.owner).toHexString();
    let id = getCreditAccountID(caAddrStr).toString();
    let ca = CreditAccount.load(id)
    if (ca == null ){
        log.critical('credit account not opened {}',[id])
        return
    }
    // set properties
    ca.closeBlock = event.block.number
    ca.closeHash = event.transaction.hash
    ca.save()
    // remove mapping
    store.remove('CreditAccountMap', `${event.address.toHexString()}_${event.params.owner.toHexString()}`);
}

export function liquidateCreditAccount(event: LiquidateCreditAccount): void {
    // get creditAccount
    let caAddrStr = getCreditAccountAddr(event.address, event.params.owner).toHexString()
    let creditAccountId =  getCreditAccountID(caAddrStr);
    let ca = CreditAccount.load(creditAccountId)!;
    // set properties
    ca.collateral = new BigInt(0);
    ca.borrowAmount = new BigInt(0);
    ca.closeBlock = event.block.number;
    ca.closeHash = event.transaction.hash;
    // set liquidation properties
    ca.remainingFund = event.params.remainingFunds;
    ca.liquidator = event.params.liquidator;
    ca.withDrawnTo = event.params.owner;
    ca.save()
    // remove mapping
    store.remove('CreditAccountMap', `${event.address.toHexString()}_${event.params.owner.toHexString()}`);
}


export function setParameters(event: NewParameters): void {
    let id = event.address.toHexString();
    let cm = CreditManager.load(id);
    if (cm == null) {
        cm = new CreditManager(id);
    }
    cm.minAmount = event.params.minAmount;
    cm.maxAmount = event.params.maxAmount;
    cm.maxLeverage = event.params.maxLeverage;
    // cm.feeSuccess = event.params.feeSuccess;
    cm.feeInterest = event.params.feeInterest;
    cm.feeLiquidation = event.params.feeLiquidation;
    cm.liquidationDiscount = event.params.liquidationDiscount;
    cm.save()
}
export function increaseBorrowedAmount(event: IncreaseBorrowedAmount): void {
    // get creditAccount
    let caAddrStr = getCreditAccountAddr(event.address, event.params.borrower).toHexString();
    let id = getCreditAccountID(caAddrStr);
    let ca = CreditAccount.load(id)!;
    // set properties
    ca.borrowAmount = ca.borrowAmount!.plus(event.params.amount);
    ca.save()
}
export function addCollateral(event: AddCollateral): void {
    // let caAddrStr = getCreditAccount(event.address, event.params.onBehalfOf).toHexString();
    // let ca = CreditAccount.load(caAddrStr)!;
    // ca.collateral = ca.collateral.plus(event.params.value); //FIXME
    // ca.save()
    //SUGGESTION: if user can directly send funds to creditAccount , this value is not corrected
}
export function transferAccount(event: TransferAccount): void {
    let caAddr = getCreditAccountAddr(event.address, event.params.oldOwner);
    // remove mapping
    store.remove('CreditAccountMap', `${event.address.toHexString()}_${event.params.oldOwner.toHexString()}`);
    // mapping from creditmanager_user to creditaccount
    setCreditAccountAddr(event.address, event.params.newOwner, caAddr);
    // set owner in creditAccount
    let id = getCreditAccountID(caAddr.toHexString());
    let ca = CreditAccount.load(id)!;
    ca.owner = event.params.newOwner;
    ca.save()
}
export function transferAccount1(event: TransferAccount1): void {
    let caAddr = getCreditAccountAddr(event.address, event.params.oldOwner);
    // remove mapping
    store.remove('CreditAccountMap', `${event.address.toHexString()}_${event.params.oldOwner.toHexString()}`);
    // mapping from creditmanager_user to creditaccount
    setCreditAccountAddr(event.address, event.params.newOwner, caAddr);
    // set owner in creditAccount
    let id = getCreditAccountID(caAddr.toHexString());
    let ca = CreditAccount.load(id)!;
    ca.owner = event.params.newOwner;
    ca.save()
}

export function repayCreditAccount(event: RepayCreditAccount): void {
    // get creditAccount
    let caAddrStr = getCreditAccountAddr(event.address, event.params.owner).toHexString();
    let id = getCreditAccountID(caAddrStr);
    let ca = CreditAccount.load(id)!;
    // set properties
    ca.withDrawnTo = event.params.to;
    ca.closeBlock = event.block.number;
    ca.closeHash = event.transaction.hash;
    ca.borrowAmount =  new BigInt(0);
    ca.collateral = new BigInt(0);
    ca.save()
}