import { BigInt } from "@graphprotocol/graph-ts"
import {
  NewCreditManagerAdded,
  NewPoolAdded
} from "../generated/ContractsRegister/ContractsRegister"
import {CreditManager, Pool} from '../generated/schema'
import { log } from '@graphprotocol/graph-ts'

import { Address } from '@graphprotocol/graph-ts'


export function newPool(event: NewPoolAdded): void {
    let id = event.params.pool.toString();
    let cm = new Pool(id);
    cm.save()
}

export function newCreditManager(event: NewCreditManagerAdded): void {
    let id = event.params.creditManager.toString();
    let cm = new CreditManager(id);
    cm.save()
}

