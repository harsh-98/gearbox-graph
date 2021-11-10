import { BigInt } from "@graphprotocol/graph-ts"
import {
    AddLiquidity,
    RemoveLiquidity,
    Borrow, Repay, 
    NewExpectedLiquidityLimit,
    BorrowForbidden
} from "../generated/templates/PoolService/PoolService"
import {Pool, CreditManager,ERC20Token} from '../generated/schema'
import { Bytes,log, Address } from '@graphprotocol/graph-ts'
import { PoolService } from "../generated/templates/PoolService/PoolService";
import { ERC20 } from "../generated/templates/ERC20/ERC20";

// Update liquidity of liquidity provider and pool
//NOTE: Byte to Address as function arg, will problem with ERC20.bind(BYtes)
//NOTE: return type Byte when assigned to variable is fine
function saveToken(addr: Address): void {
    let t = new ERC20Token(addr.toHexString());
    let erc20 = ERC20.bind(addr)
    t.symbol = erc20.symbol()
    t.decimal = erc20.decimals()
    t.save()
}
export function addLiquidity(event: AddLiquidity): void {
    let poolId = event.address.toHexString();
    let pool = Pool.load(poolId);
    if(pool == null) {
        pool = new Pool(poolId);
    }
    let ps = PoolService.bind(event.address)
    if(pool.underlyingToken === null) {
        // dieselToken
        let dieselToken = ps.dieselToken();
        saveToken(dieselToken)
        pool.dieselToken  = dieselToken.toHexString();
        // underlyingToken
        let underlyingToken = ps.underlyingToken();
        saveToken(underlyingToken)
        pool.underlyingToken  = underlyingToken.toHexString()
        
    }
    pool.availableLiquidity = ps.availableLiquidity();
    pool.expectedLiquidity = ps.expectedLiquidity();
    pool.save()
}

export function removeLiquidity(event: RemoveLiquidity): void {
    let poolId = event.address.toHexString();
    let pool = Pool.load(poolId);
    if(pool == null) {
        return
    }
    let ps = PoolService.bind(event.address)
    pool.availableLiquidity = ps.availableLiquidity();
    pool.expectedLiquidity = ps.expectedLiquidity();
    pool.save()
}


export function borrow(event: Borrow): void {
    let cm = CreditManager.load(event.params.creditManager.toHexString())!;
    if(cm.pool === null) {
        cm.pool = event.address.toHexString();
        cm.save()
    }
}

export function repay(event: Repay): void {
    // let cm = event.params.creditManager.toHexString();
    // let ca = event.params.creditAccount.toHexString();
    // let id = `${cm}_${ca}`;
    // let borrow = new CreditAccountAndManagerBorrow(id);
    // borrow.borrowedAmount = borrow.borrowedAmount!.minus(event.params.borrowedAmount);
    // borrow.profit = borrow.profit!.minus(event.params.profit);
    // borrow.loss = borrow.loss!.minus(event.params.loss);
    // borrow.save()
}

export function newExpectedLiqidityLimit(event: NewExpectedLiquidityLimit): void {
    let poolId = event.address.toHexString();
    let pool = Pool.load(poolId)!;
    pool.expectedLiquidityLimit = event.params.newLimit;
    pool.save()
}
export function borrowForbidden(event: BorrowForbidden): void {
    let poolId = event.address.toHexString();
    let pool = Pool.load(poolId)!;
    let _borrowForibidden:Bytes[] = (pool.borrowForbidden == null) ? [] : pool.borrowForbidden!;
    _borrowForibidden.push(event.params.creditManager);
    pool.borrowForbidden =  _borrowForibidden;
    pool.save()
}