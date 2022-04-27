import { log, BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

import {User, ShellTransfer, Withdrawal, Deposit} from '../generated/schema'
import { Transfer } from '../generated/Shell/Shell'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export const zeroAddress = Address.zero()
// '0x0000000000000000000000000000000000000000'

export const SHELL: string = "0x8f26D7bAB7a73309141A291525C965EcdEa7Bf42"

export function createUser(address: Address): User {
  let user = User.load(address.toHexString())
  if (user === null) {
    user = new User(address.toHexString())
    user.usdSwapped = ZERO_BD
    user.withdrawals = new Array<string>();
    user.deposits = new Array<string>();
    user.shellTransfers = new Array<string>();
    user.save()
  }
  return user as User
}

export function createTransfer(id: string): ShellTransfer {
  let transfer = ShellTransfer.load(id)
  if (transfer === null) {
    transfer = new ShellTransfer(id)
    transfer.save()
  }
  return transfer as ShellTransfer
}

export function createWithdrawal(id: string): Withdrawal {
  let withdrawal = Withdrawal.load(id)
  if (withdrawal === null) {
    withdrawal = new Withdrawal(id)
    withdrawal.save()
  }
  return withdrawal as Withdrawal
}

export function createDeposit(id: string): Deposit {
  let deposit = Deposit.load(id)
  if (deposit === null) {
    deposit = new Deposit(id)
    deposit.save()
  }
  return deposit as Deposit
}

export function decimalize ( int_amount: BigInt, decimals: i32) : BigDecimal {
  let scaled_decimal = BigInt.fromI32(10).pow( u8(decimals) ).toBigDecimal()
  let val = int_amount.toBigDecimal()
  return val.div(scaled_decimal)
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}