import path from 'path'
import simpleGit from 'simple-git'
import { LogResult } from 'simple-git/typings/response'
import { CreateNodeArgs } from 'gatsby'
import dateCompareDesc from 'date-fns/compareDesc'
import util from 'util'

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
      var fileNode = getNode(node.parent)
      var log = await git.log({
        // @ts-ignore
        file: (node.internal?.fileAbsolutePath ??
          fileNode.absolutePath) as string,
      })
      addCommitFieldsToNode(log.latest)
      return
    }

    if (node.internal.type === 'SitePage') {
      if (
        node.path?.startsWith?.('/blog/') ||
        node.path?.startsWith?.('/talk/')
      ) {
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

      var logs = await Promise.all(paths.map((file) => git.log({ file })))
      const latestCommit = logs
        .map((log) => log.latest)
        .filter((commit) => !!commit)
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

    console.error(
      'could not attach modified data from git for node',
      util.inspect(
        {
          e,
          node,
          log,
          fileNode,
        },
        { showHidden: false, depth: null }
      )
    )
    throw e
  }
}

export default addGitLastModifiedToNode
