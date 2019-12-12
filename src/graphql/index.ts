import { ApolloClient, ApolloQueryResult } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { gql } from 'apollo-boost'
// import { Links, Link } from 'parse-link-header';

import * as q from './githubQueries'

export interface User {
  login: string
  avatarUrl: string
}

export interface Label {
  id: number
  name: string
  color: string
}

export interface RepoDetails {
  repository: {
    id: number
    name: string
    nameWithOwner: string
    issues:{
      totalCount: number
    }
  }
}

export interface IssuesResult {
  id: string
  issues: {
    pageInfo: {
      startCursor: string
      endCursor: string
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
    totalCount: number
    nodes: Issue[]
  }
  comments: {
    totalCount: number
    nodes: Comment[]
  }
}

export interface Issue {
  id: string
  title: string
  number: number
  author: User
  body: string
  state: 'open' | 'closed'
  url: string
  comments: {
    totalCount: number
    nodes: Comment[]
  }
  labels: {
    nodes: Label[]
  }
}

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token') || 'f3f9a245b0b57263e0265a9988887c2863a864af';
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export async function query(gqlString: string, variables: Object = {}): Promise<ApolloQueryResult<any>> {
  return await client
    .query({
      query: gql`${gqlString}`, variables: variables
    })
}

export async function getIssues(org: string, repo: string, page = 1): Promise<IssuesResult> {
  const perPage = 25
  const {data, errors} = await query(q.GET_ISSUES, { org, repo, perPage })

  if (errors) throw new Error(errors.toString())

  return data.repository
}


export interface Comment {
  id: string
  body: string
  user: User
  createdAt: Date
  updatedAt: Date
}

export async function getIssue(id: string): Promise<Issue> {
  const {data} = await query(q.GET_ISSUE, { id })
  return data.node
}

export async function getComments(issueId: string): Promise<Comment[]>{
  const {data} = await query(q.GET_ISSUE_COMMENTS, { id: issueId })
  return data.node.comments
}

export async function getRepoDetails(org: string, repo: string): Promise<RepoDetails> {
  const {data}: ApolloQueryResult<RepoDetails> = await query(q.GET_REPO_DETAILS, { org, repo})
  return data
}

