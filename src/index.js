import { Blob } from '@web-std/blob'
// @ts-ignore stream-to-it has no exported types
import toIterable from 'stream-to-it'

/**
 * Web3 File class
 * @class
 */
export class Web3File {
  /**
   * @param {string} filename
   * @param {AsyncIterable<Uint8Array>|Iterable<Uint8Array>} content
   * @param {Web3FileOpts} [options]
   */
  constructor (filename, content, options = {}) {
    this._filename = filename
    this._content = content
    this._lastModified = options.lastModified || Date.now()
    this._path = options.path
  }

  /**
   * Get file name for compatibility with Web File
   */
  get name () {
    return this._filename
  }

  /**
   * Get pathname for compatibility with UnixFs
   * @returns {string}
   */
  get path () {
    return this._path || ''
  }

  get lastModified () {
    return this._lastModified
  }

  get content () {
    return this.iterator()
  }

  iterator () {
    return this._content
  }

  [Symbol.asyncIterator] () {
    return this.content
  }

  async blob () {
    const blobParts = []

    for await (const part of this._content) {
      blobParts.push(part)
    }
    return new Blob(blobParts)
  }

  /**
   * @param {string} filename
   * @param {Uint8Array} data
   * @param {Web3FileOpts} options
   */
  static fromBytes (filename, data, options) {
    return new Web3File(filename, [data], options)
  }

  /**
   * @param {string} filename
   * @param {string} data
   * @param {Web3FileOpts} options
   */
  static fromString (filename, data, options) {
    const bytes = new TextEncoder().encode(data)

    return this.fromBytes(filename, bytes, options)
  }

  /**
   * @param {string} filename
   * @param {ReadableStream} readableStream
   * @param {Web3FileOpts} options
   */
  static fromReadableStream (filename, readableStream, options) {
    return new Web3File(filename, toIterable.source(readableStream), options)
  }

  /**
   * @param {string} filename
   * @param {Blob} blob
   * @param {Web3FileOpts} options
   */
  static fromBlob (filename, blob, options) {
    return this.fromReadableStream(filename, blob.stream(), options)
  }

  /**
   * @param {File} file
   * @param {Web3FileOpts} options
   */
  static fromFile (file, options) {
    return this.fromReadableStream(file.name, file.stream(), {
      lastModified: file.lastModified,
      ...options
    })
  }
}

/**
 * @typedef {import('./types').Web3FileOpts} Web3FileOpts
 * @typedef {import('@web-std/file').File} File
 */
