/* eslint-env mocha */
import { expect } from 'chai'

import { CID } from 'multiformats/cid'
import { Web3File } from '../src/index.js'
import { validateAllData, validateRequiredContent } from './utils.js'

describe('web3File', () => {
  it('can create a simple Web3File with constructor', async () => {
    const data = 'web3file'
    const filename = 'file.txt'
    const bytes = new TextEncoder().encode(data)

    const file = new Web3File([bytes], filename)

    validateRequiredContent(file, filename)
    expect(file.path).to.eql('')
    await validateAllData(file, bytes)
  })

  it('can create a simple Web3File with constructor and options', async () => {
    const data = 'web3file'
    const filename = 'file.txt'
    const path = '/dir/file.txt'
    const lastModified = Date.now()
    const cid = CID.parse('bafybeidkrxayalfawjfb46ndi45yy6o5r4b6u5qzlim3mjahfse3a33syi')
    const bytes = new TextEncoder().encode(data)

    const file = new Web3File([bytes], filename, {
      path,
      lastModified,
      cid
    })

    validateRequiredContent(file, filename)

    expect(file.path).to.eql(path)
    expect(file.lastModified).to.eql(lastModified)
    expect(cid.equals(file.cid)).to.eql(true)
    await validateAllData(file, bytes)
  })

  it('can create a Web3File from bytes', async () => {
    const data = 'web3file'
    const filename = 'file.txt'
    const bytes = new TextEncoder().encode(data)

    const file = Web3File.fromBytes(bytes, filename)

    validateRequiredContent(file, filename)
    await validateAllData(file, bytes)
  })

  it('can create a Web3File from text', async () => {
    const data = 'web3file'
    const filename = 'file.txt'
    const bytes = new TextEncoder().encode(data)

    const file = Web3File.fromText(data, filename)

    validateRequiredContent(file, filename)
    await validateAllData(file, bytes)
  })
})
