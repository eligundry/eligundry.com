/* eslint "no-console": "off" */
import { GatsbyNode } from 'gatsby'
import path from 'path'
import kebabCase from 'lodash/kebabCase'
import parseISO from 'date-fns/parseISO'
import isValidDate from 'date-fns/isValid'

import sourceSingleImage from './config/utils/sourceSingleImage'
import addGitLastModifiedToNode from './config/utils/addGitLastmodifiedToNode'
import loadFeelings from './config/utils/loadFeelings'

export const sourceNodes: GatsbyNode['sourceNodes'] = async (args, options) => {
  await Promise.all([
    sourceSingleImage(
      args,
      // ts is to cache bust as it should be downloaded for each build
      `https://lastfm-collage.herokuapp.com/collage?username=eli_pwnd&method=album&period=7day&column=3&row=3&caption=false&scrobble=false&ts=${new Date().toISOString()}`,
      'last-fm-cover.jpg'
    ),
    loadFeelings(args, options, () => {}),
  ])
}

export const createPages: GatsbyNode['createPages'] = async ({
  graphql,
  actions: { createPage },
}) => {
  const collectionTemplate = {
    posts: path.resolve('src/templates/post.tsx'),
    talks: path.resolve('src/templates/talk.tsx'),
  }

  interface MarkdownQuery {
    allMdx: {
      nodes: {
        collection: 'talks' | 'posts'
        slug: string
      }[]
    }
  }

  // Get a full list of markdown posts
  const markdownQueryResult = await graphql<MarkdownQuery>(`
    {
      allMdx(sort: { fields: frontmatter___date, order: DESC }) {
        nodes {
          collection
          slug
        }
      }
    }
  `)

  if (markdownQueryResult.errors) {
    console.error(markdownQueryResult.errors)
    throw markdownQueryResult.errors
  }

  // Post and talk page creation
  markdownQueryResult?.data?.allMdx?.nodes.forEach(({ collection, slug }) =>
    createPage({
      path: `/${collection === 'posts' ? 'blog' : collection}/${slug}`,
      component: collectionTemplate[collection],
      context: {
        slug,
      },
    })
  )
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async (args) => {
  const { node, getNode } = args

  if (node.internal.type === 'Mdx') {
    node.collection = getNode(node.parent).sourceInstanceName
  }

  await addGitLastModifiedToNode(args)
}

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] =
  ({ actions }) => {
    actions.createTypes([
      `
      type DownloadedImage implements Node {
        url: String!
        name: String!
        image: File @link
      }
      `,
      `
      type GitCommit {
        date: Date
        message: String
        hash: String
      }
      `,
      `
      type SitePageFields {
        latestCommit: GitCommit
      }
      `,
      `
      type SitePage implements Node @dontInfer { 
        path: String! 
        component: String! 
        internalComponentName: String! 
        componentChunkName: String! 
        matchPath: String 
        pageContext: JSON @proxy(from: "context") 
        pluginCreator: SitePlugin @link(from: "pluginCreatorId") 
        fields: SitePageFields
      }
      `,
      `
      type File implements Node @infer {
        sourceInstanceName: String!
        absolutePath: String!
        relativePath: String!
        extension: String!
        size: Int!
        prettySize: String!
        modifiedTime: Date! @dateformat
        accessTime: Date! @dateformat
        changeTime: Date! @dateformat
        birthTime: Date! @dateformat
        root: String!
        dir: String!
        base: String!
        ext: String!
        name: String!
        relativeDirectory: String!
        dev: Int!
        mode: Int!
        nlink: Int!
        uid: Int!
        gid: Int!
        rdev: Int!
        ino: Float!
        atimeMs: Float!
        mtimeMs: Float!
        ctimeMs: Float!
        atime: Date! @dateformat
        mtime: Date! @dateformat
        ctime: Date! @dateformat
        birthtime: Date @deprecated(reason: "Use \`birthTime\` instead")
        birthtimeMs: Float @deprecated(reason: "Use \`birthTime\` instead")
        fields: SitePageFields
      }
      `,
      `
      type Feeling implements Node @dontInfer {
        time: Date!
        mood: String!
        activities: [String]
        notes: [String!]
      }
      `,
    ])
  }
