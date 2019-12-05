import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { fetchIssuesCount } from 'features/repoSearch/repoDetailsSlice';
import { fetchIssues } from './issuesSlice';

import { RootState } from 'app/rootReducer'

import { IssuesPageHeader } from './IssuesPageHeader'
import { IssuesList } from './IssuesList'
import { IssuePagination, OnPageChangeCallback } from './IssuePagination'

interface ILProps {
  org: string
  repo: string
  page: number
  setJumpToPage: (page: number) => void
  showIssueComments: (issueId: number) => void
}

export const IssuesListPage = ({
  org,
  repo,
  page = 1,
  setJumpToPage,
  showIssueComments
}: ILProps) => {

  const dispatch = useDispatch()
  const openIssuesCount = useSelector(
    (state: RootState) => state.repoDetails.openIssuesCount
  )

  const {
    currentPageIssues,
    pageCount,
    error
  } = useSelector((state: RootState) => state.issues)

  useEffect(() => {
    dispatch(fetchIssues(org, repo, page))
    dispatch(fetchIssuesCount(org, repo))
  }, [org, repo, page, dispatch])

  if (error) {
    return (
      <div>
        <h1>Something went wrong...</h1>
        <div>{error}</div>
      </div>
    )
  }

  const currentPage = Math.min(pageCount, Math.max(page, 1)) - 1
  // const issues = currentPageIssues.map(issueNumber => issuesByNumber[issueNumber])

  let renderedList =
    <IssuesList issues={currentPageIssues} showIssueComments={showIssueComments} />

  const onPageChanged: OnPageChangeCallback = selectedItem => {
    const newPage = selectedItem.selected + 1
    setJumpToPage(newPage)
  }

  return (
    <div id="issue-list-page">
      <IssuesPageHeader openIssuesCount={openIssuesCount} org={org} repo={repo} />
      {renderedList}
      <IssuePagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={onPageChanged}
      />
    </div>
  )
}
