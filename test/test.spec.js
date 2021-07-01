/* eslint-env mocha */
import { expect } from 'chai'

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
    const bytes = new TextEncoder().encode(data)

    const file = new Web3File([bytes], filename, {
      path,
      lastModified
    })

    validateRequiredContent(file, filename)

    expect(file.path).to.eql(path)
    expect(file.lastModified).to.eql(lastModified)
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
