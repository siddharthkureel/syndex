import { SessionContext } from "blitz"
import db, { FindManyIssueArgs } from "db"

type GetIssuesInput = {
  where?: FindManyIssueArgs["where"]
}

export default async function getIssues(
  { where }: GetIssuesInput,
  ctx: { session?: SessionContext } = {}
) {
  const verify = await db.issue.findMany({
    where,
  })

  return verify
}
