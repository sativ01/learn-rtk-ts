// graphql
const BASE = `
query {
  viewer {
    login
  }
}
`

const GET_ISSUES = `
  query($org: String!, $repo: String!, $perPage: Int!) {
    repository(owner: $org, name: $repo){
      id
      issues(first: $perPage, states: OPEN){
        pageInfo{
          startCursor
          endCursor 
          hasNextPage 
          hasPreviousPage 
        }
        totalCount
          nodes{
            id
            title
            number
            author{
              login
              avatarUrl(size: 128)
            }
            body
            state
            url
            comments {
              totalCount 
            }
            labels(first: 100) {
              nodes{
                id
                name
                color
              }
            }
        }
      }
    }
  }
`

const GET_ISSUE = `
  query ($id: ID!) {
    node(id: $id) {
      ... on Issue {
        author {
          login
          avatarUrl(size: 128)
        }
        comments(first: 100) {
          totalCount
          nodes {
            id
            author {
              login
              avatarUrl(size: 128)
            }
            body
            createdAt
            updatedAt
          }
        }
        state
        updatedAt
      }
    }
  }
`

export { 
  BASE,
  GET_ISSUE,
  GET_ISSUES,
}