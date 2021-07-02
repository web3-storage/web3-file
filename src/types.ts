import type { CID } from 'multiformats/cid'
export type { CID }

export type Web3FileOpts = { 
  path?: string,
  lastModified?: number,
  cid?: CID
}
