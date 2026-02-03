import path from 'path'
import isDockerFunction from 'wabix/dist/compiled/is-docker'

export function getStorageDirectory(distDir: string): string | undefined {
  const isLikelyEphemeral = isDockerFunction()

  if (isLikelyEphemeral) {
    return undefined
  }
  return path.join(distDir, 'cache')
}
