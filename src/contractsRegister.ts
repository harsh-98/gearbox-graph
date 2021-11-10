import { BigInt } from "@graphprotocol/graph-ts"
import {
  NewCreditManagerAdded,
  NewPoolAdded
} from "../generated/templates/ContractsRegister/ContractsRegister"
import {PoolService} from "../generated/templates"
import {CreditManager} from "../generated/templates"


export function newPool(event: NewPoolAdded): void {
    PoolService.create(event.params.pool); 
    // https://thegraph.com/docs/developer/create-subgraph-hosted#instantiating-a-data-source-template
    // only indexes from the block in which create is called
}

export function newCreditManager(event: NewCreditManagerAdded): void {
    CreditManager.create(event.params.creditManager);
}

