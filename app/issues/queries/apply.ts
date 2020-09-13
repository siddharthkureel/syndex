import { SessionContext } from "blitz"
import db from "db"
import * as z from "zod"

const ApplicationFormInput = z.object({
  name: z.string(),
  email: z.string().email(),
  issueId: z.number()
})
type ApplicationFormInputType = z.infer<typeof ApplicationFormInput>


export default async function apply(
  input: ApplicationFormInputType,
  ctx: { session?: SessionContext } = {}
) { 
  const { name, email, issueId } = ApplicationFormInput.parse(input)
  const session = ctx.session!

  session.authorize()

  const application = await db.application.create({
    data: {
      name,
      email,
      issue: { connect: { id: issueId } }
    },
  })

  return application
}