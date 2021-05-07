/* eslint "no-console": "off" */
import { ITSConfigFn } from 'gatsby-plugin-ts-config'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { SourceNodesArgs } from 'gatsby'
import path from 'path'
import trim from 'lodash/trim'
import kebabCase from 'lodash/kebabCase'
import parseISO from 'date-fns/parseISO'
import isValidDate from 'date-fns/isValidDate'

import siteConfig from '../data/SiteConfig'

const gatsbyNode: ITSConfigFn<'node'> = () => ({
  createPages: async ({ graphql, actions }) => {
    const { createPage } = actions
    const postPage = path.resolve('src/templates/post.tsx')
    const tagPage = path.resolve('src/templates/tag.tsx')
    const categoryPage = path.resolve('src/templates/category.tsx')
    const listingPage = path.resolve('src/templates/listing.tsx')
    const talkPage = path.resolve('src/templates/talk.tsx')
    const talkListingPage = path.resolve('src/templates/talkListing.tsx')

    // Get a full list of markdown posts
    const markdownQueryResult = await graphql(`
      {
        allMarkdownRemark(filter: { collection: { eq: "posts" } }) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
                category
                date
              }
              htmlAst
            }
          }
        }
      }
    `)

    if (markdownQueryResult.errors) {
      console.error(markdownQueryResult.errors)
      throw markdownQueryResult.errors
    }

    const tagSet = new Set()
    const categorySet = new Set()

    const postsEdges = markdownQueryResult.data.allMarkdownRemark.edges

    // Sort posts
    postsEdges.sort((postA, postB) => {
      const dateA = new Date(postA.node.frontmatter.date)
      const dateB = new Date(postB.node.frontmatter.date)

      if (dateA < dateB) return 1
      if (dateB < dateA) return -1

      return 0
    })

    // Blog post listing
    createPage({
      path: '/blog',
      component: listingPage,
      context: {},
    })

    // Post page creating
    postsEdges.forEach((edge, index) => {
      // Generate a list of tags
      if (edge.node.frontmatter.tags) {
        edge.node.frontmatter.tags.forEach(tag => {
          tagSet.add(tag)
        })
      }

      // Generate a list of categories
      if (edge.node.frontmatter.category) {
        categorySet.add(edge.node.frontmatter.category)
      }

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
    })

    //  Create tag pages
    tagSet.forEach(tag => {
      createPage({
        path: `/blog/tags/${kebabCase(tag)}/`,
        component: tagPage,
        context: { tag },
      })
    })

    // Create category pages
    categorySet.forEach(category => {
      createPage({
        path: `/blog/categories/${kebabCase(category)}/`,
        component: categoryPage,
        context: { category },
      })
    })

    // Create talk pages
    const talkQueryResult = await graphql(`
      {
        allMarkdownRemark(filter: { collection: { eq: "talks" } }) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
                category
                date
              }
              htmlAst
            }
          }
        }
      }
    `)

    if (talkQueryResult.errors) {
      console.error(talkQueryResult.errors)
      throw talkQueryResult.errors
    }

    const talkEdges = talkQueryResult.data.allMarkdownRemark.edges

    createPage({
      path: '/talks',
      component: talkListingPage,
    })

    talkEdges.forEach(edge => {
      createPage({
        path: `/talks/${edge.node.fields.slug}`,
        component: talkPage,
        context: {
          slug: edge.node.fields.slug,
        },
      })
    })
  },
  sourceNodes: async (args: SourceNodesArgs) => {
    const { createNodeId, createContentDigest } = args
    const { createNode } = args.actions

    const goodreadsHTML = await axios.get<string>(
      `https://www.goodreads.com/review/list/${siteConfig.goodreads.userID}?ref=nav_mybooks&shelf=currently-reading`
    )
    const { document: goodreadsDocument } = new JSDOM(goodreadsHTML.data).window
    const trimChars = '\n *'

    Array.from(
      goodreadsDocument.querySelectorAll('#booksBody .bookalike')
    ).forEach(row => {
      const book = {
        isbn: trim(
          row.querySelector('td.field.isbn .value').textContent,
          trimChars
        ),
        title: trim(
          row.querySelector('td.field.title a').getAttribute('title'),
          trimChars
        ),
        author: trim(
          row.querySelector('td.field.author .value').textContent,
          trimChars
        ),
        cover: row
          .querySelector('td.field.cover img')
          .getAttribute('src')
          // Get the full sized thumbnail
          .replace(/\._\w+\d+_/, ''),
        url: `https://www.goodreads.com/${row
          .querySelector('td.field.cover a')
          .getAttribute('href')}`,
      }

      createNode({
        id: createNodeId(`goodreads-book-${book.isbn}`),
        parent: null,
        children: [],
        internal: {
          type: 'GoodreadsBook',
          content: JSON.stringify(book),
          contentDigest: createContentDigest(book),
        },
        ...book,
      })
    })
  },
})

export default gatsbyNode
