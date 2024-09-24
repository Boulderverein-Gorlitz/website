import { Layout } from "../components/layout"
import React from "react"
import { graphql, PageProps } from "gatsby"
import { SingleMarkdownPage, singleMarkdownPageFragment } from "../queries"

function PageTemplate({ data }: PageProps<SingleMarkdownPage>) {
  const { html } = data.markdownRemark
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}

export const query = graphql`
  query ($id: String) {
    ...SingleMarkdownPage
  }
`

export function Head({ data }: PageProps<SingleMarkdownPage>) {
  return <title>{data.markdownRemark.frontmatter.title}</title>
}

export default PageTemplate
