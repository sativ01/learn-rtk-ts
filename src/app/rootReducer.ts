import {combineReducers} from '@reduxjs/toolkit'
import issuesDisplaySlice from 'features/issuesDisplay/issuesDisplaySlice';
import repoDetailsSlice from 'features/repoSearch/repoDetailsSlice';
import issuesSlice from 'features/issuesList/issuesSlice';

const rootReducer = combineReducers({
  issueDisplay: issuesDisplaySlice,
  repoDetails: repoDetailsSlice,
  issues: issuesSlice,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer