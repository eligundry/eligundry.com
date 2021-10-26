/* eslint "no-console": "off" */
import { ITSConfigFn } from 'gatsby-plugin-ts-config'
import { SourceNodesArgs } from 'gatsby'
import path from 'path'
import kebabCase from 'lodash/kebabCase'
import parseISO from 'date-fns/parseISO'
import isValidDate from 'date-fns/isValid'

import siteConfig from '../data/SiteConfig'
import sourceGoodreadsNodes from './utils/sourceGoodreadsNodes'
import sourceSingleImage from './utils/sourceSingleImage'
import addGitLastModifiedToNode from './utils/addGitLastmodifiedToNode'

const gatsbyNode: ITSConfigFn<'node'> = () => ({
  onCreateNode: async args => {
    const { node, actions, getNode } = args
    const { createNodeField } = actions

    if (node.internal.type === 'Mdx') {
      let slug
      node.collection = getNode(node.parent).sourceInstanceName
      const fileNode = getNode(node.parent)
      const parsedFilePath = path.parse(fileNode.relativePath)

      if (node?.frontmatter?.title) {
        slug = `${kebabCase(node.frontmatter.title)}`
      } else if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
        slug = `${parsedFilePath.dir}/${parsedFilePath.name}`
      } else if (parsedFilePath.dir === '') {
        slug = `${parsedFilePath.name}`
      } else {
        slug = `/{parsedFilePath.dir}`
      }

      if (node?.frontmatter) {
        if (node.frontmatter?.slug) {
          slug = `${kebabCase(node.frontmatter.slug)}`
        }

        if (node.frontmatter?.date) {
          const date = parseISO(node.frontmatter.date)

          if (!isValidDate(date)) {
            console.warn(`WARNING: Invalid date.`, node.frontmatter)
          }

          createNodeField({
            node,
            name: 'date',
            value: date.toISOString(),
          })
        }
      }

      createNodeField({
        node,
        name: 'slug',
        value: slug,
      })
    }

    await addGitLastModifiedToNode(args)
  },
  createPages: async ({ graphql, actions }) => {
    const { createPage } = actions
    const postPage = path.resolve('src/templates/post.tsx')
    const listingPage = path.resolve('src/templates/listing.tsx')
    const talkPage = path.resolve('src/templates/talk.tsx')
    const talkListingPage = path.resolve('src/templates/talkListing.tsx')

    interface MarkdownQuery {
      allMdx: {
        edges: {
          node: {
            collection: 'talks' | 'posts'
            fields: {
              slug: string
            }
            frontmatter: {
              title: string
              date: string
              tags: string[] | null
            }
          }
        }[]
      }
    }

    // Get a full list of markdown posts
    const markdownQueryResult = await graphql<MarkdownQuery>(`
      {
        allMdx(sort: { fields: frontmatter___date, order: DESC }) {
          edges {
            node {
              collection
              fields {
                slug
              }
              frontmatter {
                title
                tags
                date
              }
            }
          }
        }
      }
    `)

    if (markdownQueryResult.errors) {
      console.error(markdownQueryResult.errors)
      throw markdownQueryResult.errors
    }

    const postsEdges = markdownQueryResult.data.allMdx.edges

    // Blog post listing
    createPage({
      path: '/blog',
      component: listingPage,
      context: {},
    })

    // Talk post listing
    createPage({
      path: '/talks',
      component: talkListingPage,
      context: {},
    })

    // Post and talk page creation
    postsEdges.forEach(edge => {
      if (edge.node.collection === 'posts') {
        createPage({
          path: `/blog/${edge.node.fields.slug}`,
          component: postPage,
          context: {
            slug: edge.node.fields.slug,
          },
        })
      } else if (edge.node.collection === 'talks') {
        createPage({
          path: `/talks/${edge.node.fields.slug}`,
          component: talkPage,
          context: {
            slug: edge.node.fields.slug,
          },
        })
      }
    })
  },
  createSchemaCustomization: ({ actions }) => {
    actions.createTypes([
      `
      type GoodreadsBook implements Node {
        title: String!
        author: String!
        isbn: String!
        isbn13: String!
        asin: String!
        pages: Int!
        published: Date
        started: Date
        finished: Date
        conver: String!
        coverImage: File @link
        url: String!
        shelf: String!
      }
      `,
      `
      type DownloadedImage implements Node {
        url: String!
        name: String!
        image: File @link
      }
      `,
    ])
  },
  sourceNodes: async (args: SourceNodesArgs) => {
    await sourceGoodreadsNodes(args, {
      userID: siteConfig.goodreads.userID,
      shelves: ['currently-reading', 'read'],
    })
    await sourceSingleImage(
      args,
      // ts is to cache bust as it should be downloaded for each build
      `https://lastfm-collage.herokuapp.com/collage?username=eli_pwnd&method=album&period=7day&column=3&row=3&caption=false&scrobble=false&ts=${new Date().toISOString()}`,
      'last-fm-cover.jpg'
    )
  },
})

export default gatsbyNode
