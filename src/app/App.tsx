import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './rootReducer';

import './App.css'

import { RepoSearchForm } from 'features/repoSearch/RepoSearchForm'
import { IssuesListPage } from 'features/issuesList/IssuesListPage'
import { IssueDetailsPage } from 'features/issueDetails/IssueDetailsPage'

import { displayRepo, setCurrentDisplayType, setCurrentPage } from 'features/issuesDisplay/issuesDisplaySlice';

const App: React.FC = () => {
  const dispatch = useDispatch()
  const { org, repo, displayType, page, issueId } = useSelector(
    (state: RootState) => state.issueDisplay
  )

  const setOrgAndRepo = (org: string, repo: string) => {
    dispatch(displayRepo({ org, repo }))
  }

  const setJumpToPage = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const showIssuesList = () => {
    dispatch(setCurrentDisplayType({ displayType: 'issues', issueId: '' }))
  }

  const showIssueComments = (issueId: string) => {
    dispatch(setCurrentDisplayType({ displayType: 'comments', issueId }))
  }

  let content

  if (displayType === 'issues') {
    content = (
      <React.Fragment>
        <RepoSearchForm
          org={org}
          repo={repo}
          setOrgAndRepo={setOrgAndRepo}
          setJumpToPage={setJumpToPage}
        />
        <IssuesListPage
          org={org}
          repo={repo}
          page={page}
          setJumpToPage={setJumpToPage}
          showIssueComments={showIssueComments}
        />
      </React.Fragment>
    )
  } else {
    const key = `${org}/${repo}/${issueId}`
    content = (
      <IssueDetailsPage
        key={key}
        issueId={issueId}
        showIssuesList={showIssuesList}
      />
    )
  }

  return <div className="App">{content}</div>
}

export default App
