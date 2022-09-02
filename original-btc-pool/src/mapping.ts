import { Transfer } from "../generated/Shell/Shell"
import {
  createUser,
  createTransfer,
  createWithdrawal, 
  createDeposit,
  convertTokenToDecimal,  
  BI_18,
  mintAndBurnAddresses
} from "../src/helpers"

export function handleTransfer(event: Transfer): void {

  // in all transfers that don't have a 0x0 address involved, get the shells transfers

  let from = event.params.from
  let fromUser = createUser(from)
  let to = event.params.to
  let toUser = createUser(to)

  let functionId = event.transaction.hash.toHexString() + '-' + event.logIndex.toString()

  //log.warning('check1: {}, {}, {}', [from.toHexString(), zeroAddress.toHexString(),(zeroAddress.toHexString() === from.toHexString()).toString()])
  //log.warning('check: {}, {}, {}', [to.toHexString(), from.toHexString(), (from.toHexString() !== zeroAddress.toHexString() && to.toHexString() !== zeroAddress.toHexString()).toString()])

  if (!mintAndBurnAddresses.includes(from.toHexString())  && !mintAndBurnAddresses.includes(to.toHexString())) {

    let shellTransfer = createTransfer(functionId)
    shellTransfer.timestamp = event.block.timestamp
    shellTransfer.block = event.block.number
    shellTransfer.shellsTransfered = convertTokenToDecimal(event.params.value, BI_18)
    shellTransfer.from = from.toHexString()
    shellTransfer.to = to.toHexString()
    

    let fromUserTransfers = fromUser.shellTransfers
    fromUserTransfers.push(functionId)
    fromUser.shellTransfers = fromUserTransfers
    
    let toUserTransfers = toUser.shellTransfers
    toUserTransfers.push(functionId)
    toUser.shellTransfers = toUserTransfers

    shellTransfer.save()
    fromUser.save()
    toUser.save()
  }
  else if (mintAndBurnAddresses.includes(from.toHexString())) {
    
    let userDeposit = createDeposit(functionId)
    userDeposit.timestamp = event.block.timestamp
    userDeposit.block = event.block.number
    userDeposit.shellsMinted = convertTokenToDecimal(event.params.value, BI_18)
    userDeposit.user = to.toHexString()

    let toUserDeposits = toUser.deposits
    toUserDeposits.push(functionId)
    toUser.deposits = toUserDeposits

    toUser.save()
    userDeposit.save()
  }
  else if (mintAndBurnAddresses.includes(to.toHexString())) {
    
    let userWithdrawal = createWithdrawal(functionId)
    userWithdrawal.timestamp = event.block.timestamp
    userWithdrawal.block = event.block.number
    userWithdrawal.shellsBurnt = convertTokenToDecimal(event.params.value, BI_18)
    userWithdrawal.user = from.toHexString()

    let fromUserWithdrawals = fromUser.withdrawals
    fromUserWithdrawals.push(functionId)
    fromUser.withdrawals = fromUserWithdrawals

    fromUser.save()
    userWithdrawal.save()
  }
    
}