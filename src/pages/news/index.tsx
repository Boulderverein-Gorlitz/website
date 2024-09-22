import React from "react"
import { Layout } from "../../components/layout"
import { graphql, Link, PageProps } from "gatsby"
import { MultiMarkdownPage, multiMarkdownPageFragment } from "../../queries"

export const query = graphql`
  query ($sourceInstanceName: String = "news") {
    ...MultiMarkdownPage
  }
`

function NewsOverview({ data }: PageProps<MultiMarkdownPage>) {
  const pages = data.allMarkdownRemark.edges.map((edge) => edge.node)

  return (
    <Layout>
      {pages.map((page, index) => (
        <div key={page.fields.slug}>
          <Link to={page.fields.slug}>{page.frontmatter.title}</Link>
        </div>
      ))}
    </Layout>
  )
}

export default NewsOverview
