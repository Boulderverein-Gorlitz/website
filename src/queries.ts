import { graphql } from "gatsby"

export type FrontMatter = {
  title: string
}

export type Fields = {
  slug: string
  date?: string
}

export type MarkdownPage = {
  frontmatter: FrontMatter
  fields: Fields
  html: string
}

export const markdownPageFragment = graphql`
  fragment MarkdownPageFragment on MarkdownRemark {
    frontmatter {
      title
    }
    fields {
      slug
      date
    }
    html
  }
`

export type SingleMarkdownPage = {
  markdownRemark: MarkdownPage
}

export const singleMarkdownPageFragment = graphql`
  fragment SingleMarkdownPage on Query {
    markdownRemark(id: { eq: $id }) {
      ...MarkdownPageFragment
    }
  }
`

export const multiMarkdownPageFragment = graphql`
  fragment MultiMarkdownPage on Query {
    allMarkdownRemark(filter: { fields: { sourceInstanceName: { eq: $sourceInstanceName } } }) {
      edges {
        node {
          ...MarkdownPageFragment
        }
      }
    }
  }
`

export type MultiMarkdownPage = {
  allMarkdownRemark: {
    edges: Array<{
      node: MarkdownPage
    }>
  }
}
