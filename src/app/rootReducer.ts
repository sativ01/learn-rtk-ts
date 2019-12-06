import {combineReducers} from '@reduxjs/toolkit'
import issuesDisplaySlice from 'features/issuesDisplay/issuesDisplaySlice';
import repoDetailsSlice from 'features/repoSearch/repoDetailsSlice';
import issuesSlice from 'features/issuesList/issuesSlice';
import commentsSlice from 'features/issueDetails/commentsSlice';

const rootReducer = combineReducers({
  issueDisplay: issuesDisplaySlice,
  repoDetails: repoDetailsSlice,
  issues: issuesSlice,
  comments: commentsSlice,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer