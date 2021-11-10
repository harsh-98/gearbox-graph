import { BigInt } from "@graphprotocol/graph-ts"
import {
    AddLiquidity,
    RemoveLiquidity,
    Borrow, Repay, 
    NewExpectedLiquidityLimit,
    BorrowForbidden
} from "../generated/templates/PoolService/PoolService"
import {Pool} from '../generated/schema'
import { Bytes } from '@graphprotocol/graph-ts'

// Update liquidity of liquidity provider and pool
export function addLiquidity(event: AddLiquidity): void {
    let poolId = event.address.toHexString();
    let pool = Pool.load(poolId);
    if(pool == null) {
        pool = new Pool(poolId);
        pool.liquidity = new BigInt(0);
    }
    pool.liquidity = pool.liquidity!.plus(event.params.amount);
    pool.save()
}

export function removeLiquidity(event: RemoveLiquidity): void {
    let poolId = event.address.toHexString();
    let pool = Pool.load(poolId);
    if(pool == null) {
        return
    }
    pool.liquidity = pool.liquidity!.minus(event.params.amount);
    pool.save()
}


export function borrow(event: Borrow): void {
    // let cm = event.params.creditManager.toHexString();
    // let ca = event.params.creditAccount.toHexString();
    // let id = `${cm}_${ca}`;
    // let borrow = new CreditAccountAndManagerBorrow(id);
    // if (borrow == null) {
    //     borrow = new CreditAccountAndManagerBorrow(id);
    //     borrow.creditManager = cm;
    //     borrow.creditAccount = ca;
    // }
    // borrow.borrowedAmount = borrow.borrowedAmount!.plus(event.params.amount);
    // borrow.save()
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