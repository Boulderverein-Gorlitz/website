import React from "react"
import { Layout } from "../../components/layout"
import { graphql, Link, PageProps } from "gatsby"
import { MultiMarkdownPage } from "../../queries"

export const query = graphql`
  query ($sourceInstanceName: String = "news") {
    ...MultiMarkdownPage
  }
`

function NewsOverview({ data }: PageProps<MultiMarkdownPage>) {
  const pages = data.allMarkdownRemark.edges.map((edge) => edge.node)

  return (
    <Layout className="news-overview">
      <ul>
        {pages.map((page) => (
          <li key={page.fields.slug}>
            <article>
              <header>
                <Link to={page.fields.slug}>
                  <h2>{page.frontmatter.title}</h2>
                </Link>
              </header>
              <div dangerouslySetInnerHTML={{ __html: page.excerpt }} />
            </article>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default NewsOverview
