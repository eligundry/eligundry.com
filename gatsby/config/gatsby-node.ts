/* eslint "no-console": "off" */
import { ITSConfigFn } from 'gatsby-plugin-ts-config'
import { createRemoteFileNode } from 'gatsby-source-filesystem'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { SourceNodesArgs } from 'gatsby'
import path from 'path'
import trim from 'lodash/trim'
import kebabCase from 'lodash/kebabCase'
import dateCompareDesc from 'date-fns/compareDesc'
import parseISO from 'date-fns/parseISO'
import isValidDate from 'date-fns/isValid'

import siteConfig from '../data/SiteConfig'

const gatsbyNode: ITSConfigFn<'node'> = () => ({
  onCreateNode: async ({
    node,
    actions,
    getNode,
    createNodeId,
    store,
    cache,
  }) => {
    const { createNodeField, createNode } = actions

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

          createNodeField({ node, name: 'date', value: date.toISOString() })
        }
      }
      createNodeField({ node, name: 'slug', value: slug })
    }

    if (node.internal.type === 'GoodreadsBook' && node.cover) {
      const imageNode = await createRemoteFileNode({
        url: node.cover,
        parentNodeId: node.id,
        createNode,
        createNodeId,
        cache,
        store,
      })

      if (imageNode) {
        node.coverImage___NODE = imageNode.id
      }
    }
  },
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

    const tagSet = new Set<string>()
    const categorySet = new Set<string>()

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

    //  Create tag pages
    tagSet.forEach(tag => {
      createPage({
        path: `/blog/tags/${kebabCase(tag)}`,
        component: tagPage,
        context: { tag },
      })
    })

    // Create category pages
    categorySet.forEach(category => {
      createPage({
        path: `/blog/categories/${kebabCase(category)}`,
        component: categoryPage,
        context: { category },
      })
    })
  },
  sourceNodes: async (args: SourceNodesArgs) => {
    const { createNodeId, createContentDigest } = args
    const { createNode } = args.actions

    try {
      var goodreadsHTML = await axios.get<string>(
        `https://www.goodreads.com/review/list/${siteConfig.goodreads.userID}?ref=nav_mybooks&shelf=currently-reading`
      )
    } catch (e) {
      console.error('could not fetch Goodreads shelf', e)

      const books = [
        {
          isbn: '1',
          title: 'Error',
          author: 'Error',
          cover: 'https://http.cat/500',
          url: 'https://http.cat/500',
        },
        {
          isbn: '2',
          title: 'Error',
          author: 'Error',
          cover: 'https://http.cat/500',
          url: 'https://http.cat/500',
        },
      ]

      books.forEach(book =>
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
      )

      return
    }
    const { document: goodreadsDocument } = new JSDOM(goodreadsHTML.data).window
    const trimChars = '\n *'

    Array.from(
      goodreadsDocument.querySelectorAll('#booksBody .bookalike')
    ).forEach(async row => {
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
