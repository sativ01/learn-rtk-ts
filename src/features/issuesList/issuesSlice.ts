import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Links } from 'parse-link-header';

import { Issue, IssuesResult, getIssue, getIssues } from '../../graphql';
import { AppThunk } from 'app/store';

interface IssuesState {
  issuesById: Record<string, Issue>
  currentPageIssues: Issue[]
  pageCount: number
  // pageLinks: Links | null
  isLoading: boolean
  error: string | null
}

const issuesInitialState: IssuesState = {
  issuesById: {},
  currentPageIssues: [],
  pageCount: 0,
  // pageLinks: {},
  isLoading: false,
  error: null
}

function startLoading(state: IssuesState) {
  state.isLoading = true
}

function loadingFailed(state: IssuesState, { payload }: PayloadAction<string>) {
  state.isLoading = false
  state.error = payload
}

const issues = createSlice({
  name: 'issues',
  initialState: issuesInitialState,
  reducers: {
    getIssueStart: startLoading,
    getIssuesStart: startLoading,
    getIssueSuccess(state, { payload }: PayloadAction<Issue>) {
      const { id } = payload
      state.issuesById[id] = payload
      state.isLoading = false
      state.error = null
    },
    getIssuesSuccess(state, { payload }: PayloadAction<IssuesResult>) {
      const { issues } = payload
      state.pageCount = Math.round(issues.totalCount / 25)
      state.isLoading = false
      state.error = null

      state.issuesById = issues.nodes.reduce((acc, issue) => ({ acc, ...{ [issue.id]: issue } }), {})
      state.currentPageIssues = issues.nodes
    },
    getIssueFailure: loadingFailed,
    getIssuesFailure: loadingFailed,
  }
})

export const {
  getIssueStart,
  getIssuesStart,
  getIssueSuccess,
  getIssuesSuccess,
  getIssueFailure,
  getIssuesFailure,
} = issues.actions

export default issues.reducer

export const fetchIssues = (org:string, repo:string, page?:number): AppThunk =>
  async dispatch => {
    try {
      dispatch(getIssuesStart())
      const issues = await getIssues(org, repo, page)
      dispatch(getIssuesSuccess(issues))
    } catch (err) {
      dispatch(getIssuesFailure(err.toString()))
    }
  }

export const fetchIssue = (id: string): AppThunk =>
  async dispatch => {
    try {
      dispatch(getIssueStart())
      const issue = await(getIssue(id))
      dispatch(getIssueSuccess(issue))
    } catch (err) {
      dispatch(getIssueFailure(err.toString()))
    }
  }