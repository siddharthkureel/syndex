import React, { useState } from 'react';
import Modal from 'react-awesome-modal';
import { useRouter } from "blitz"
import { Form, FORM_ERROR } from "app/components/Form"
import { LabelledTextField } from "app/components/LabelledTextField"
import * as z from "zod"
import apply from "app/issues/queries/apply";

const ApplicationFormInput = z.object({
  name: z.string(),
  email: z.string().email(),
  issueId: z.number()
})
type ApplicationFormInputType = z.infer<typeof ApplicationFormInput>

type Props = {
   issueId: number;
   verified: boolean | undefined;
}

const ApplicationForm = ({ issueId, verified }: Props) => {
    const [visible, setVisible] = useState<boolean>(false)
    const router = useRouter()

    return (
        <>
            <button className="btn-purple mt-4" onClick={() => setVisible(true)} >apply</button>
                <Modal 
                      visible={visible}
                      width="400"
                      height="400"
                      effect="fadeInUp"
                      onClickAway={() => setVisible(false)}
                  >
                      <div className="height-100">
                          <button onClick={() => setVisible(false)}>Close</button>
                          <div className="center" >
                                <Form<ApplicationFormInputType>
                                    submitText=""
                                    schema={ApplicationFormInput}
                                    initialValues={{ name: "", email: "", issueId }}
                                    onSubmit={async (values) => {
                                    try {
                                        await apply(values)
                                        setVisible(false)
                                    } catch (error) {
                                        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                                        // This error comes from Prisma
                                        return { email: "This email is applied" }
                                        } else {
                                        return { [FORM_ERROR]: error.toString() }
                                        }
                                    }
                                    }}
                                >
                                    <LabelledTextField name="name" label="Name" placeholder="Name" />
                                    <LabelledTextField name="email" label="Email" placeholder="Email" />
                                    <button type="submit" className="btn-purple" >submit</button>
                                    <button onClick={() => setVisible(false)} className="btn-clear" >cancel</button>
                                </Form>
                            </div>
                      </div>
                </Modal>
        </>
    );
}

export default ApplicationForm;
