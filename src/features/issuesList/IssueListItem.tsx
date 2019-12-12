import React, { MouseEvent } from 'react'

// import { Issue } from 'api/githubAPI'
import { Issue } from 'graphql'
import { shorten } from 'utils/stringUtils'

import { IssueLabels } from 'components/IssueLabels'
import { UserWithAvatar } from 'components/UserWithAvatar'

import styles from './IssueListItem.module.css'

type Props = Issue & {
  showIssueComments: (issueId: string) => void
}

export const IssueListItem = ({
  id,
  number,
  title,
  labels,
  author,
  comments,
  body = '',
  showIssueComments
}: Props) => {
  const onIssueClicked = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    showIssueComments(id)
  }

  const pluralizedComments = comments.totalCount === 1 ? 'comment' : 'comments'

  return (
    <div className={styles.issue}>
      <UserWithAvatar user={author} />
      <div className="issue__body">
        <a href="#comments" onClick={onIssueClicked}>
          <span className={styles.number}>#{number}</span>
          <span className={styles.title}>{title}</span>
        </a>
        <br /> ({comments.totalCount} {pluralizedComments})
        <p className="issue__summary">{shorten(body)}</p>
        <IssueLabels labels={labels.nodes} className={styles.label} />
      </div>
    </div>
  )
}
