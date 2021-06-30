/* eslint-env mocha */
import { expect } from 'chai'

import { Web3File } from '../src/index.js'
import { validateAllData, validateRequiredContent } from './utils.js'

describe('web3File', () => {
  it('can create a simple Web3File with constructor', async () => {
    const data = 'web3file'
    const filename = 'file.txt'
    const bytes = new TextEncoder().encode(data)

    const file = new Web3File(filename, [bytes])

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

    const file = new Web3File(filename, [bytes], {
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

    const file = Web3File.fromBytes(filename, bytes)

    validateRequiredContent(file, filename)
    await validateAllData(file, bytes)
  })

  it('can create a Web3File from string', async () => {
    const data = 'web3file'
    const filename = 'file.txt'
    const bytes = new TextEncoder().encode(data)

    const file = Web3File.fromString(filename, data)

    validateRequiredContent(file, filename)
    await validateAllData(file, bytes)
  })
})
