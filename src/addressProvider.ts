import { BigInt } from "@graphprotocol/graph-ts"
import {
  SetAccountFactoryCall,
  SetContractsRegisterCall
} from "../generated/AddressProvider/AddressProvider"
import { AccountFactory, ContractsRegister } from '../generated/templates'
import { AccountFactory as AF, ContractsRegister as CR} from '../generated/schema'

export function setAccountFactory(call: SetAccountFactoryCall): void {
  AccountFactory.create(call.inputs._address)
  let af = new AF(call.inputs._address.toHexString())
  af.save()
}

export function setContractsRegister(call: SetContractsRegisterCall): void {
  ContractsRegister.create(call.inputs._address)
  let cr = new CR(call.inputs._address.toHexString())
  cr.save()
}

