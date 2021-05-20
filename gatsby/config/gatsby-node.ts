/* eslint "no-console": "off" */
import { ITSConfigFn } from 'gatsby-plugin-ts-config'
import { createRemoteFileNode } from 'gatsby-source-filesystem'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { SourceNodesArgs } from 'gatsby'
import path from 'path'
import trim from 'lodash/trim'
import kebabCase from 'lodash/kebabCase'
import parseISO from 'date-fns/parseISO'
import isValidDate from 'date-fns/isValid'

import siteConfig from '../data/SiteConfig'
import loadImage from './utils/loadImage'
import sourceGoodreadsNodes from './utils/sourceGoodreadsNodes'

const gatsbyNode: ITSConfigFn<'node'> = () => ({
  onCreateNode: async ({
    node,
    actions,
    getNode,
    createNodeId,
    store,
    cache,
  }) => {
    const { createNodeField, createNode, touchNode } = actions

    if (node.internal.type === 'MarkdownRemark') {
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

    if (node.internal.type === 'GoodreadsBook' && node.cover) {
      await loadImage({
        cacheKey: `local-goodreads-cover-${node.isbn}`,
        node,
        createRemoteFileNode,
        targetNodeKey: 'coverImage',
        url: node.cover,
        parentNodeId: node.id,
        createNode,
        createNodeId,
        cache,
        store,
      })
    }
  },
  createPages: async ({ graphql, actions }) => {
    const { createPage } = actions
    const postPage = path.resolve('src/templates/post.tsx')
    const listingPage = path.resolve('src/templates/listing.tsx')
    const talkPage = path.resolve('src/templates/talk.tsx')
    const talkListingPage = path.resolve('src/templates/talkListing.tsx')

    interface MarkdownQuery {
      allMarkdownRemark: {
        edges: {
          node: {
            collection: 'talks' | 'posts'
            fields: {
              slug: string
            }
            frontmatter: {
              title: string
              date: string
              category: string | null
              tags: string[] | null
            }
          }
        }[]
      }
    }

    // Get a full list of markdown posts
    const markdownQueryResult = await graphql<MarkdownQuery>(`
      {
        allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
          edges {
            node {
              collection
              fields {
                slug
              }
              frontmatter {
                title
                tags
                category
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

    const postsEdges = markdownQueryResult.data.allMarkdownRemark.edges

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
    postsEdges.forEach((edge, index) => {
      if (edge.node.collection === 'posts') {
        // Create post pages
        const nextID = index + 1 < postsEdges.length ? index + 1 : 0
        const prevID = index - 1 >= 0 ? index - 1 : postsEdges.length - 1
        const nextEdge = postsEdges[nextID]
        const prevEdge = postsEdges[prevID]

        createPage({
          path: `/blog/${edge.node.fields.slug}`,
          component: postPage,
          context: {
            slug: edge.node.fields.slug,
            nexttitle: nextEdge.node.frontmatter.title,
            nextslug: nextEdge.node.fields.slug,
            prevtitle: prevEdge.node.frontmatter.title,
            prevslug: prevEdge.node.fields.slug,
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
  sourceNodes: async (args: SourceNodesArgs) => {
    await sourceGoodreadsNodes(args, {
      userID: siteConfig.goodreads.userID,
      shelf: 'currently-reading',
    })
  },
})

export default gatsbyNode
