function resolveQueryPath(
  prefix: string,
  queryName: string
): Promise<typeof import('*.graphql')> {
  const path = getPath(prefix)
  return import(`@/queries/${path}${queryName}.graphql`)
}

function getPath(prefix: string) {
  switch (prefix) {
    case 'rmrk':
      return ''
    case 'bsx':
    case 'movr':
    case 'glmr':
    case 'snek':
    case 'subsquid':
    case 'ksm':
      return 'subsquid/general/'
    case 'stmn':
    case 'westmint':
      return 'unique/'
    case 'chain-bsx':
      return 'subsquid/bsx/'
    case 'chain-rmrk':
      return 'subsquid/rmrk/'
    case 'chain-ksm':
      return 'subsquid/ksm/'
    default:
      return ''
  }
}

// const queryPaths: Record<string, { subsquid: string, subquery: string | undefined }> = {
//   'rmrk': {
//     subsquid: 'subsquid/general/',
//     subquery: '',
//   },
//   'bsx': {
//     subsquid: 'subsquid/general/',
//     subquery: undefined,
//   }

// }

export default resolveQueryPath
