import { BigInt } from "@graphprotocol/graph-ts"
import {
  OpenCreditAccount,
  CloseCreditAccount,
  LiquidateCreditAccount,
  CreditManager as CreditManagerContract
} from "../generated/CreditManager/CreditManager"
import {CreditAccount,CreditManager,  CreditAccountDetails} from '../generated/schema'
import { log } from '@graphprotocol/graph-ts'

import { Address } from '@graphprotocol/graph-ts'

function loadCreditAccountIndex(addr: string): BigInt {
    let caDetails = CreditAccountDetails.load(addr);
    if (caDetails == null){
        log.critical('Credit account deatils does not exist for {}',[addr])
        return new BigInt(0)
    }
    return caDetails.index
}
function incrementCreditAccountIndex(addr: string): BigInt {
    let caDetails = CreditAccountDetails.load(addr);
    if (caDetails == null ){
        caDetails = new CreditAccountDetails(addr.toString())
    } 
    caDetails.index = caDetails.index.plus(new BigInt(1));
    caDetails.save()
    return caDetails.index
}

export function openCreditAccount(event: OpenCreditAccount): void {
    let caAddr = event.params.creditAccount;
    let caIndex = incrementCreditAccountIndex(caAddr.toString()).toString()
    let ca = new CreditAccount(`${caAddr.toString()}_${caIndex}`)
    ca.owner = event.params.onBehalfOf;
    ca.account = caAddr
    ca.takeBlock = event.block.number
    ca.creditManager = event.address.toString();
    ca.save()
}

export function closeCreditAccount(event: CloseCreditAccount): void {
    let cmContract = CreditManagerContract.bind(event.address);
    let caAddrStr = cmContract.getCreditAccountOrRevert(event.params.owner).toString();
    let caIndex = loadCreditAccountIndex(caAddrStr).toString();
    let id = `${caAddrStr}_${caIndex}`
    let ca = CreditAccount.load(id)
    if (ca == null ){
        log.critical('credit account not opened {}',[id])
        return
    }
    ca.returnBlock = event.block.number
    ca.save()
}

export function liquidateCreditAccount(event: LiquidateCreditAccount): void {

}

