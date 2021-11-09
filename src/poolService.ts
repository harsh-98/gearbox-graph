import { BigInt } from "@graphprotocol/graph-ts"
import {
    AddLiquidity,
    RemoveLiquidity,
    Borrow, Repay, 
    NewExpectedLiquidityLimit,
    BorrowForbidden
} from "../generated/PoolService/PoolService"
import {Pool, CreditManager, CreditAccount,  CreditAccountAndManagerBorrow} from '../generated/schema'
import { Address,Bytes } from '@graphprotocol/graph-ts'

// Update liquidity of liquidity provider and pool
export function addLiquidity(event: AddLiquidity): void {
    let poolId = event.address.toString();
    let pool = Pool.load(poolId);
    // let userAddr = event.params.onBehalfOf;
    // let id = `${poolId.toString()}_${userAddr.toString()}`
    // let userPoolAction = UserPoolAction.load(id);
    // if (userPoolAction == null) {
    //     userPoolAction = new UserPoolAction(userAddr.toString());
    //     userPoolAction.user = userAddr;
        
    //     userPoolAction.pool = pool;
    // }
    // userPoolAction.liquidity = userPoolAction.liquidity.plus(event.params.amount);
    if(pool == null) {
        pool = new Pool(poolId);
        pool.liquidity = new BigInt(0);
    }
    pool.liquidity = pool.liquidity!.plus(event.params.amount);
    pool.save()
    // userPoolAction.save()
}

export function removeLiquidity(event: RemoveLiquidity): void {
    let poolId = event.address.toString();
    let pool = Pool.load(poolId);
    // let userAddr = event.params.to;
    if(pool == null) {
        return
    }
    pool.liquidity = pool.liquidity!.minus(event.params.amount);
    pool.save()
}


export function borrow(event: Borrow): void {
    let cm = event.params.creditManager;
    let ca = event.params.creditAccount;
    let id = `${cm.toString()}_${ca.toString()}`;
    let borrow = new CreditAccountAndManagerBorrow(id);
    if (borrow == null) {
        borrow = new CreditAccountAndManagerBorrow(id);
        borrow.creditManager = cm.toString();
        borrow.creditAccount = ca.toString();
    }
    borrow.borrowedAmount = borrow.borrowedAmount!.plus(event.params.amount);
    borrow.save()
}

export function repay(event: Repay): void {
    // let cm = event.params.creditManager;
    // let ca = event.params.creditAccount;
    // let id = `${cm.toString()}_${ca.toString()}`;
    // let borrow = new CreditAccountAndManagerBorrow(id);
    // borrow.borrowedAmount = borrow.borrowedAmount!.minus(event.params.borrowedAmount);
    // borrow.profit = borrow.profit!.minus(event.params.profit);
    // borrow.loss = borrow.loss!.minus(event.params.loss);
    // borrow.save()
}

export function newExpectedLiqidityLimit(event: NewExpectedLiquidityLimit): void {
    let poolId = event.address.toString();
    let pool = Pool.load(poolId)!;
    pool.expectedLiquidityLimit = event.params.newLimit;
    pool.save()
}
export function borrowForbidden(event: BorrowForbidden): void {
    let poolId = event.address.toString();
    let pool = Pool.load(poolId)!;
    let _borrowForibidden:Bytes[] = (pool.borrowForbidden == null) ? [] : pool.borrowForbidden!;
    _borrowForibidden.push(event.params.creditManager);
    pool.borrowForbidden =  _borrowForibidden;
    pool.save()
}