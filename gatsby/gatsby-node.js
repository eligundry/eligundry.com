/* eslint "no-console": "off" */

const path = require('path')
const kebabCase = require('lodash/kebabCase')
const parseISO = require('date-fns/parseISO')
const isValidDate = require('date-fns/isValid')
const siteConfig = require('./data/SiteConfig')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  let slug
  if (node.internal.type === 'MarkdownRemark') {
    node.collection = getNode(node.parent).sourceInstanceName
    const fileNode = getNode(node.parent)
    const parsedFilePath = path.parse(fileNode.relativePath)
    if (
      Object.prototype.hasOwnProperty.call(node, 'frontmatter') &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, 'title')
    ) {
      slug = `${kebabCase(node.frontmatter.title)}`
    } else if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
      slug = `${parsedFilePath.dir}/${parsedFilePath.name}`
    } else if (parsedFilePath.dir === '') {
      slug = `${parsedFilePath.name}`
    } else {
      slug = `/{parsedFilePath.dir}`
    }

    if (Object.prototype.hasOwnProperty.call(node, 'frontmatter')) {
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, 'slug'))
        slug = `${kebabCase(node.frontmatter.slug)}`
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, 'date')) {
        const date = parseISO(node.frontmatter.date)

        if (!isValidDate(date)) {
          console.warn(`WARNING: Invalid date.`, node.frontmatter)
        }

        createNodeField({ node, name: 'date', value: date.toISOString() })
      }
    }
    createNodeField({ node, name: 'slug', value: slug })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const postPage = path.resolve('src/templates/post.jsx')
  const tagPage = path.resolve('src/templates/tag.jsx')
  const categoryPage = path.resolve('src/templates/category.jsx')
  const listingPage = path.resolve('./src/templates/listing.jsx')

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

  // Paging
  const { postsPerPage } = siteConfig
  const pageCount = Math.ceil(postsEdges.length / postsPerPage)

  ;[...Array(pageCount)].forEach((_val, pageNum) => {
    createPage({
      path: pageNum === 0 ? `/blog/` : `/blog/page/${pageNum + 1}/`,
      component: listingPage,
      context: {
        limit: postsPerPage,
        skip: pageNum * postsPerPage,
        pageCount,
        currentPageNum: pageNum + 1,
      },
    })
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
}
