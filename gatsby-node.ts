import type { CreateNodeArgs, GatsbyNode, Node } from "gatsby"
import { createFilePath } from "gatsby-source-filesystem"

function createSlug({
  node,
  getNode,
  actions,
  basePath,
  prefix,
}: Pick<CreateNodeArgs, "node" | "getNode" | "actions"> & {
  basePath: string
  prefix?: string
}) {
  const { createNodeField } = actions
  const path = createFilePath({ node, getNode, basePath })

  const slug = prefix ? `/${prefix}${path}` : path

  createNodeField({
    node,
    name: "slug",
    value: slug,
  })
}

export const onCreateNode: GatsbyNode["onCreateNode"] = (params) => {
  const { node, getNode, actions } = params

  const { createNodeField } = actions

  if (node.internal.type === "MarkdownRemark") {
    if (node.parent) {
      const fileNode = getNode(node.parent)
      if (fileNode) {
        const { sourceInstanceName, name } = fileNode

        if (sourceInstanceName) {
          createNodeField({
            node,
            name: "sourceInstanceName",
            value: sourceInstanceName,
          })
        }

        if (sourceInstanceName === "news" && typeof name === "string") {
          const date = name.substring(0, 10)

          createNodeField({
            node,
            name: "date",
            value: date,
          })

          createSlug({ node, getNode, actions, basePath: "content/news", prefix: "news" })
        }

        if (sourceInstanceName === "pages") {
          createSlug({ node, getNode, actions, basePath: "content/pages" })
        }
      }
    }
  }
}
