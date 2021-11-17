import { ERC20 } from "../generated/templates/ERC20/ERC20";
import {ERC20Token} from '../generated/schema'
import { Bytes,log, Address, BigInt } from '@graphprotocol/graph-ts'
import { CreditFilterTokenLiquidityMap } from "../generated/schema"
// Update liquidity of liquidity provider and pool
//NOTE: Byte to Address as function arg, will problem with ERC20.bind(BYtes)
//NOTE: return type Byte when assigned to variable is fine
export function saveToken(addr: Address): void {
    let t = ERC20Token.load(addr.toHexString());
    if (t == null) {
        t = new ERC20Token(addr.toHexString());
        let erc20 = ERC20.bind(addr)
        t.symbol = erc20.symbol()
        t.decimal = erc20.decimals()
        t.save()
    }
}

// allowed token
export function createAllowedTokenAndGetID(cfAddr: string, token: string, liquidityLimit: BigInt | null): string {
    // tokenLiqMap 
    let tokenLiqMapId = `${cfAddr}_${token}`;
    let tokenLiqMap = new CreditFilterTokenLiquidityMap(tokenLiqMapId);
    tokenLiqMap.token = token;
    saveToken(Address.fromString(token));
    tokenLiqMap.liquidityLimit = liquidityLimit;
    tokenLiqMap.save()
    return tokenLiqMapId
  }