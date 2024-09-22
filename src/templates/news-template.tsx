import { graphql, PageProps } from "gatsby"
import { SingleMarkdownPage } from "../queries"
import { Layout } from "../components/layout"
import React from "react"

function NewsPage({ data }: PageProps<SingleMarkdownPage>) {
  const {
    markdownRemark: {
      frontmatter: { title },
      fields: { slug, date },
      html,
    },
  } = data

  console.log("time", date)
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

export default NewsPage

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
      fields {
        slug
        date
      }
      html
    }
  }
`
