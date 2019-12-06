import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Comment, getComments } from 'api/githubAPI';
import { AppThunk } from 'app/store';

interface CommentsState {
  comments: Comment[] | undefined
  isLoading: boolean
  error: string | null
}

const initialState: CommentsState = {
  comments: [],
  isLoading: false,
  error: null
}

function startLoading(state: CommentsState) {
  state.isLoading = true
}

function loadingFailed(state: CommentsState, { payload }: PayloadAction<string>) {
  state.isLoading = false
  state.error = payload
}

const comments = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    getCommentsStart: startLoading,
    getCommentsSuccess(state, { payload }: PayloadAction<Comment[]>) {
      state.comments = payload
      state.isLoading = false
      state.error = null
    },
    getCommentsFailure: loadingFailed,
  }
})

export const {
  getCommentsStart,
  getCommentsSuccess,
  getCommentsFailure,
} = comments.actions

export default comments.reducer

export const fetchComments = (url:string): AppThunk =>
  async dispatch => {
    try {
      dispatch(getCommentsStart())
      const comments = await getComments(url)
      dispatch(getCommentsSuccess(comments))
    } catch (err) {
      dispatch(getCommentsFailure(err.toString()))
    }
  }
