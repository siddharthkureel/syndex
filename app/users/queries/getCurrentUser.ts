import db from "db"
import { SessionContext } from "blitz"

export default async function getCurrentUser(_ = null, ctx: { session?: SessionContext } = {}) {
  if (!ctx.session?.userId) return null

  const user = await db.user.findOne({
    where: { id: ctx.session!.userId },
    select: { id: true, name: true, email: true, role: true, accountId: true },
  })

  let status: { verified: boolean } | null = { verified: false }

  const primaryAccountId = await db.relationship.findOne({
    where: { secondaryAccountId: user?.accountId },
    select: { primaryAccountId: true },
  }) 
  // with unverified account, relationship table will not contain primaryAccountId
  if(primaryAccountId){
      status  = await db.account.findOne({
      where: { id: primaryAccountId?.primaryAccountId },
      select: { verified: true }
    })
  }
  return {
    ...user,
    status
  }
}
