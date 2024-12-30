import { Layout } from "../components/layout"
import React from "react"
import { graphql, PageProps } from "gatsby"
import { SingleMarkdownPage } from "../queries"

function PageTemplate({ data }: PageProps<SingleMarkdownPage>) {
  const {
    html,
    frontmatter: { title },
    fields: { date },
  } = data.markdownRemark
  return (
    <Layout>
      <article>
        <header>
          <h1>{title}</h1>
          <strong>
            <time dateTime={date}>{date}</time>
          </strong>
        </header>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
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
