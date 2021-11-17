import { BigInt } from "@graphprotocol/graph-ts"
import { Address } from '@graphprotocol/graph-ts'
import {
  NewCreditManagerAdded,
  NewPoolAdded,
} from "../generated/templates/ContractsRegister/ContractsRegister"
import {CreditManager, PoolService, CreditFilter} from "../generated/templates"
import {CreditManager as CreditManagerContract} from "../generated/templates/CreditManager/CreditManager"
import {CreditFilter as CreditFilterContract} from "../generated/templates/CreditFilter/CreditFilter"
import {CreditManager as CreditManagerObj,
  CreditFilter as CreditFilterObj, Pool as PoolServiceObj} from "../generated/schema"

import {createAllowedTokenAndGetID} from './utils'

export function newPool(event: NewPoolAdded): void {
    PoolService.create(event.params.pool); 
    // https://thegraph.com/docs/developer/create-subgraph-hosted#instantiating-a-data-source-template
    // only indexes from the block in which create is called

    let id = event.params.pool.toHexString();
    let ps = new PoolServiceObj(id)
    ps.save()
}



// starts crediFilter indexer and creates creditManager entity
function addCreditFilter(cmAddr: Address): string {
  // start indexing
  let cmContract = CreditManagerContract.bind(cmAddr);
  let cfAddr = cmContract.creditFilter();
  CreditFilter.create(cfAddr);
  // create creditfilter graph obj
  let cf = new CreditFilterObj(cfAddr.toHexString());
  // add allowed tokens for creditfilter
  let cfContract = CreditFilterContract.bind(cfAddr);
  let allowedTokens = cf.allowedTokens;
  for(let i=0; i< cfContract.allowedTokensCount().toI32(); i++) {
    let token = cfContract.allowedTokens(new BigInt(i));
    let tokenLiqMapId = createAllowedTokenAndGetID(cfAddr.toHexString(), token.toHexString(), null);
    allowedTokens.push(tokenLiqMapId);
  }
  cf.save()
  return cfAddr.toHexString()
}
// starts crediManager indexer and creates creditManager entity
export function newCreditManager(event: NewCreditManagerAdded): void {
    // start indexing
    CreditManager.create(event.params.creditManager);
    // create creditmanager graph obj
    let id = event.params.creditManager.toHexString();
    let cm = new CreditManagerObj(id)
    cm.creditFilter = addCreditFilter(event.params.creditManager);
    cm.save()
}

