import { BigInt } from "@graphprotocol/graph-ts"
import {
    ContractAllowed,
    ContractForbidden,
    TokenAllowed,
    NewFastCheckParameters
} from "../generated/templates/CreditFilter/CreditFilter"
import { CreditFilter } from "../generated/schema"
import {createAllowedTokenAndGetID} from './utils'

export function contractAllowed(event: ContractAllowed): void {
    let id = event.address.toHexString();
    let cf = CreditFilter.load(id)!;
    let allowedContracts = cf.allowedContracts;
    allowedContracts.push(event.params.protocol);
    cf.allowedContracts = allowedContracts;
    cf.save();
}
export function contractForbidden(event: ContractForbidden): void {
}
export function faskCheckParameters(event: NewFastCheckParameters): void {
    let id = event.address.toHexString();
    let cf = CreditFilter.load(id)!;
    cf.fastCheckDelay = event.params.fastCheckDelay;
    cf.chiThreshold = event.params.chiThreshold;
    cf.save()
}
export function tokenAllowed(event: TokenAllowed): void {
    let cfAddr = event.address.toHexString();
    let token = event.params.token.toHexString();
    let liquidity = event.params.liquidityThreshold;;
    addAllowedToken(cfAddr, token, liquidity)
}



function addAllowedToken(cfAddr: string, token: string, liquidity: BigInt | null): void {
    let cf = CreditFilter.load(cfAddr)!;
    // tokenLiqMap 
    let tokenLiqMapId = createAllowedTokenAndGetID(cfAddr, token, liquidity);
    // add allowed token with liquidity
    let allowedTokens = cf.allowedTokens;
    allowedTokens.push(tokenLiqMapId);
    cf.allowedTokens = allowedTokens;
    
    cf.save();
}