import path from 'path'
import simpleGit from 'simple-git'
import { LogResult } from 'simple-git/typings/response'
import { CreateNodeArgs } from 'gatsby'
import dateCompareDesc from 'date-fns/compareDesc'

const git = simpleGit()
const blacklistedTypes = ['memes', 'feelings', 'File', 'Directory']

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

  if (node.internal.type === 'Mdx') {
    console.log('boom, mdx!')
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

      case '/memes':
        paths.push(path.join('src', 'components', 'Memes'))
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
      .sort((a, b) => dateCompareDesc(new Date(a.date), new Date(b.date)))?.[0]

    if (latestCommit) {
      addCommitFieldsToNode(latestCommit)
    }

    return
  }
}

export default addGitLastModifiedToNode
