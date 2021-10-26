import path from 'path'
import simpleGit from 'simple-git'
import { LogResult } from 'simple-git/typings/response'
import { CreateNodeArgs } from 'gatsby'
import dateCompareDesc from 'date-fns/compareDesc'

const git = simpleGit()

const addGitLastModifiedToNode = async (args: CreateNodeArgs) => {
  const {
    node,
    getNode,
    actions: { createNodeField },
  } = args

  const addCommitFieldsToNode = (commit: LogResult['latest']) => {
    createNodeField({
      node,
      name: 'latestCommitDate',
      value: commit.date,
    })

    createNodeField({
      node,
      name: 'latestCommitMessage',
      value: commit.message,
    })

    createNodeField({
      node,
      name: 'latestCommit',
      value: commit.hash,
    })
  }

  try {
    if (node.internal.type === 'Mdx') {
      const fileNode = getNode(node.parent)
      const log = await git.log({
        file: fileNode.absolutePath as string,
      })
      addCommitFieldsToNode(log.latest)
      return
    }

    if (node.internal.type === 'SitePage') {
      if (node.path.startsWith('/blog/') || node.path.startsWith('/talk/')) {
        return
      }

      const paths: string[] = [node.component as string]

      switch (node.path) {
        case '/':
          paths.push(
            path.join('src', 'components', 'Home'),
            path.join('src', 'components', 'Listening')
          )
          break

        case '/feelings':
          paths.push(path.join('src', 'components', 'Daylio'))
          break

        case '/resume':
          paths.push(path.join('src', 'components', 'Resume'))
          break
      }

      const latestCommit = (
        await Promise.all(paths.map(file => git.log({ file })))
      )
        .map(log => log.latest)
        .filter(commit => !!commit)
        .sort((a, b) =>
          dateCompareDesc(new Date(a.date), new Date(b.date))
        )?.[0]

      if (latestCommit) {
        addCommitFieldsToNode(latestCommit)
      }

      return
    }
  } catch (e) {
    if (node.internal.type === 'SitePage') {
      createNodeField({
        node,
        name: 'latestCommitDate',
        value: null,
      })

      createNodeField({
        node,
        name: 'latestCommitMessage',
        value: null,
      })

      createNodeField({
        node,
        name: 'latestCommit',
        value: null,
      })
    }

    console.error('could not attach modified data from git for node', node)
    throw e
  }
}

export default addGitLastModifiedToNode
