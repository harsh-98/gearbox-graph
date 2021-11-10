import { BigInt } from "@graphprotocol/graph-ts"
import {
  NewCreditManagerAdded,
  NewPoolAdded
} from "../generated/templates/ContractsRegister/ContractsRegister"
import {CreditManager, PoolService} from "../generated/templates"
import {CreditManager as CreditManagerObj, Pool as PoolServiceObj} from "../generated/schema"

export function newPool(event: NewPoolAdded): void {
    PoolService.create(event.params.pool); 
    // https://thegraph.com/docs/developer/create-subgraph-hosted#instantiating-a-data-source-template
    // only indexes from the block in which create is called

    let id = event.params.pool.toHexString();
    let ps = new PoolServiceObj(id)
    ps.save()
}

export function newCreditManager(event: NewCreditManagerAdded): void {
    CreditManager.create(event.params.creditManager);
    let id = event.params.creditManager.toHexString();
    let cm = new CreditManagerObj(id)
    cm.save()
}

