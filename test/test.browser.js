/* eslint-env mocha */
/* global ReadableStream */

import { Blob } from '@web-std/blob'
import { File } from '@web-std/file'

import { Web3File } from '../src/index.js'
import {
  validateBlobData,
  validateContentData,
  validateRequiredContent
} from './utils.js'

describe('web3File in the browser', () => {
  [validateBlobData, validateContentData].map((validator) => { // eslint-disable-line
    describe(`with ${validator.name}`, () => {
      it('can create a Web3File from Blob', async () => {
        const data = 'web3file'
        const filename = 'file.txt'
        const bytes = new TextEncoder().encode(data)

        const file = Web3File.fromBlob(filename, new Blob([bytes]))

        validateRequiredContent(file, filename)
        await validator(file, bytes)
      })

      it('can create a Web3File from File', async () => {
        const data = 'web3file'
        const filename = 'file.txt'
        const bytes = new TextEncoder().encode(data)

        const file = Web3File.fromFile(new File([bytes], filename))

        validateRequiredContent(file, filename)
        await validator(file, bytes)
      })

      it('can create a Web3File from Readable Stream', async () => {
        const data = 'web3file'
        const filename = 'file.txt'
        const bytes = new TextEncoder().encode(data)
        const readableStream = iteratorToStream(new Set([bytes]).values())

        const file = Web3File.fromReadableStream(filename, readableStream)

        validateRequiredContent(file, filename)
        await validator(file, bytes)
      })
    })
  })
})

const iteratorToStream = (iterator) => {
  return new ReadableStream({
    async pull (controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    }
  })
}
