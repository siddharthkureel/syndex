import React, { Suspense, useState } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import getIssues from "app/issues/queries/getIssues"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import ApplicationForm from "app/components/ApplicationForm"

const ITEMS_PER_PAGE = 100
const parseDate = (date: string) => {
  const string = date.split('GMT');
  return string[0]
}
export const IssuesList = ({ currentUser }) => {
  const router = useRouter()
  
  const page = Number(router.query.page) || 0
  const [{ issues, hasMore }] = usePaginatedQuery(getIssues, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })
  return (
    <div>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            <div className="shadow padding-10 space-between" >
              <p className="margin-auto">
                <span className="issue-name">{issue.name}</span>
                | last updated at {parseDate(issue.updatedAt.toString())}
              </p>
              <div>
                {currentUser &&
                <>
                  <Link href="/issues/[issueId]" as={`/issues/${issue.id}`}>
                    <a className="btn-clear">details</a>
                  </Link> 
                  <ApplicationForm issueId={issue.id} verified={currentUser.status?.verified} />
                </>}
              </div>
            </div>
            <br/>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage} className="btn-clear mt-4">
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage} className="btn-clear ml-4 mt-4">
        Next
      </button>
    </div>
  )
}

const IssuesPage: BlitzPage = () => {
  const currentUser = useCurrentUser()
  return (
    <div>
      <Head>
        <title>Issues</title>
      </Head>
      <main>
        <h1 className="text-4xl margin-bottom-20">Issues</h1>
        <hr/><br/>
        {
          currentUser &&
          <div className="my-6">
            <Link href="/issues/new">
              <a className="btn-purple">Create Issue</a>
            </Link>
          </div>
        }

          <IssuesList currentUser={currentUser} />
      </main>
    </div>
  )
}

IssuesPage.getLayout = (page) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Layout title={"Issues"}>{page}</Layout>
  </Suspense>
)

export default IssuesPage
