import React from "react"
import { Layout } from "../../components/layout"
import { graphql, PageProps } from "gatsby"
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
          <a href={page.fields.slug}>{page.frontmatter.title}</a>
        </div>
      ))}
    </Layout>
  )
}

export default NewsOverview
