import { BigInt } from "@graphprotocol/graph-ts"
import {
  NewCreditAccount,
} from "../generated/AccountFactory/accountFactory"
import { CreditAccountDetails} from '../generated/schema'

export function newCreditAccountContract(event: NewCreditAccount): void {
    let ca = new CreditAccountDetails(event.params.account.toString());
    ca.index = new BigInt(0) ;
    ca.save()
}
