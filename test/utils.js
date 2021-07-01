import { expect } from 'chai'
import { equals, concat, toString } from 'uint8arrays'

import { Blob } from '@web-std/blob'

/**
 * @param {import('../src/index').Web3File} file
 * @param {string} name
 */
export function validateRequiredContent (file, name) {
  expect(file.name).to.eql(name)
  expect(file.lastModified).to.exist // eslint-disable-line
}

/**
 * @param {import('../src/index').Web3File} file
 * @param {Uint8Array} bytes
 */
export async function validateAllData (file, bytes) {
  await validateBlobData(file, bytes)
  await validateContentData(file, bytes)
  await validateTextData(file, bytes)
}

/**
 * @param {import('../src/index').Web3File} file
 * @param {Uint8Array} bytes
 */
export async function validateTextData (file, bytes) {
  const text = await file.text()
  expect(text).to.eql(toString(bytes))
}

/**
 * @param {import('../src/index').Web3File} file
 * @param {Uint8Array} bytes
 */
export async function validateBlobData (file, bytes) {
  const blob = await file.blob()
  expect(blob instanceof Blob).to.eql(true)

  const blobBytes = new Uint8Array(await blob.arrayBuffer())
  expect(equals(blobBytes, bytes)).to.eql(true)
}

/**
 * @param {import('../src/index').Web3File} file
 * @param {Uint8Array} bytes
 */
export async function validateContentData (file, bytes) {
  let contentBytes = new Uint8Array([])
  for await (const part of file.content) {
    contentBytes = concat(contentBytes, part)
  }

  expect(equals(contentBytes, bytes)).to.eql(true)
}
