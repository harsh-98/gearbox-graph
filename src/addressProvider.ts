import { BigInt } from "@graphprotocol/graph-ts"
import {
  SetAccountFactoryCall,
  SetContractsRegisterCall
} from "../generated/AddressProvider/AddressProvider"
import { AccountFactory, ContractsRegister } from '../generated/schema'

export function setAccountFactory(call: SetAccountFactoryCall): void {
  let id = call.transaction.hash.toHex()
  let af = new AccountFactory(id)
  af.address = call.inputs._address
  af.save()
}

export function setContractsRegister(call: SetContractsRegisterCall): void {
  let id = call.transaction.hash.toHex()
  let cr = new ContractsRegister(id)
  cr.address = call.inputs._address
  cr.save()
}

