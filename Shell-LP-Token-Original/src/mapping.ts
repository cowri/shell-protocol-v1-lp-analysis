import { 
  BigInt,
  log
} from "@graphprotocol/graph-ts"
import { ShellTransfer, User} from "../generated/schema"
import {
  Shell,
  Approval,
  AssetIncluded,
  AssimilatorIncluded,
  FrozenSet,
  OwnershipTransfered,
  ParametersSet,
  PartitionRedeemed,
  PoolPartitioned,
  Trade,
  Transfer,
  ProportionalDepositCall,
  ProportionalWithdrawCall,
  SelectiveDepositCall,
  SelectiveWithdrawCall,
  SelectiveDepositCall__Inputs
} from "../generated/Shell/Shell"
import {
  createUser,
  createTransfer,
  createWithdrawal, 
  createDeposit,
  zeroAddress, 
  SHELL, 
  convertTokenToDecimal,  
  BI_18,
} from "../src/helpers"

export function handleAssetIncluded(event: AssetIncluded): void {}

export function handleAssimilatorIncluded(event: AssimilatorIncluded): void {}

export function handleFrozenSet(event: FrozenSet): void {}

export function handleOwnershipTransfered(event: OwnershipTransfered): void {}

export function handleParametersSet(event: ParametersSet): void {}

export function handlePartitionRedeemed(event: PartitionRedeemed): void {}

export function handlePoolPartitioned(event: PoolPartitioned): void {}

export function handleTrade(event: Trade): void {}

export function handleTransfer(event: Transfer): void {

  // in all transfers that don't have a 0x0 address involved, get the shells transfers

  let from = event.params.from
  let fromUser = createUser(from)
  let to = event.params.to
  let toUser = createUser(to)

  let transferID = event.transaction.hash.toHexString()

  //log.warning('check1: {}, {}, {}', [from.toHexString(), zeroAddress.toHexString(),(zeroAddress.toHexString() === from.toHexString()).toString()])
  //log.warning('check: {}, {}, {}', [to.toHexString(), from.toHexString(), (from.toHexString() !== zeroAddress.toHexString() && to.toHexString() !== zeroAddress.toHexString()).toString()])

  if (from.toHexString() != zeroAddress.toHexString() && to.toHexString() != zeroAddress.toHexString()) {
    
    let shellTransfer = createTransfer(event.transaction.hash.toHexString())
    shellTransfer.timestamp = event.block.timestamp
    shellTransfer.block = event.block.number
    shellTransfer.shellsTransfered = convertTokenToDecimal(event.params.value, BI_18)
    shellTransfer.from = from.toHexString()
    shellTransfer.to = to.toHexString()
    
    let fromUserTransfers = fromUser.shellTransfers
    fromUserTransfers.push(transferID)
    fromUser.shellTransfers = fromUserTransfers

    let toUserTransfers = toUser.shellTransfers
    toUserTransfers.push(transferID)
    toUser.shellTransfers = toUserTransfers

    shellTransfer.save()
    fromUser.save()
    toUser.save()
  }
    
}

export function handleProportionalDepositCall (call: ProportionalDepositCall) : void {
  
  let depositID = call.transaction.hash.toHexString()
  let userDeposit = createDeposit(depositID)
  let fromUser = createUser(call.from)
  userDeposit.timestamp = call.block.timestamp
  userDeposit.block = call.block.number
  userDeposit.shellsMinted = convertTokenToDecimal(call.outputs.shellsMinted_, BI_18)
  userDeposit.user = call.from.toHexString()

  let fromUserDeposits = fromUser.deposits
  fromUserDeposits.push(depositID)
  fromUser.deposits = fromUserDeposits

  fromUser.save()
  userDeposit.save()
}

export function handleProportionalWithdrawCall (call: ProportionalWithdrawCall) : void {
  
  let withdrawalID = call.transaction.hash.toHexString()
  let userWithdrawal = createWithdrawal(withdrawalID)
  let fromUser = createUser(call.from)
  userWithdrawal.timestamp = call.block.timestamp
  userWithdrawal.block = call.block.number
  userWithdrawal.shellsBurnt = convertTokenToDecimal(call.inputs._shellsToBurn, BI_18)
  userWithdrawal.user = call.from.toHexString()

  let fromUserWithdrawals = fromUser.withdrawals
  fromUserWithdrawals.push(withdrawalID)
  fromUser.withdrawals = fromUserWithdrawals

  fromUser.save()
  userWithdrawal.save()
}

export function handleSelectiveDepositCall (call: SelectiveDepositCall) : void {
  let depositID = call.transaction.hash.toHexString()
  let userDeposit = createDeposit(depositID)
  let fromUser = createUser(call.from)
  userDeposit.timestamp = call.block.timestamp
  userDeposit.block = call.block.number
  userDeposit.shellsMinted = convertTokenToDecimal(call.outputs.shellsMinted_, BI_18)
  
  userDeposit.user = call.from.toHexString()

  let fromUserDeposits = fromUser.deposits
  fromUserDeposits.push(depositID)
  fromUser.deposits = fromUserDeposits

  fromUser.save()
  userDeposit.save()
}

export function handleSelectiveWithdrawCall (call: SelectiveWithdrawCall) : void {
  
  let withdrawalID = call.transaction.hash.toHexString()
  let userWithdrawal = createWithdrawal(withdrawalID)
  let fromUser = createUser(call.from)
  userWithdrawal.timestamp = call.block.timestamp
  userWithdrawal.block = call.block.number
  userWithdrawal.shellsBurnt = convertTokenToDecimal(call.outputs.shellsBurned_, BI_18)
  userWithdrawal.user = call.from.toHexString()

  let fromUserWithdrawals = fromUser.withdrawals
  fromUserWithdrawals.push(withdrawalID)
  fromUser.withdrawals = fromUserWithdrawals

  fromUser.save()
  userWithdrawal.save()
}