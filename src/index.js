import { Blob } from '@web-std/blob'
import toIterable from 'browser-readablestream-to-it'

/**
 * Web3 File class
 * @class
 */
export class Web3File {
  /**
   * @param {AsyncIterable<Uint8Array>|Iterable<Uint8Array>} content
   * @param {string} filename
   * @param {Web3FileOpts} [options]
   */
  constructor (content, filename, options = {}) {
    this._content = content
    this._filename = filename
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

  async text () {
    const blob = await this.blob()

    return blob.text()
  }

  /**
   * @param {Uint8Array} data
   * @param {string} filename
   * @param {Web3FileOpts} options
   */
  static fromBytes (data, filename, options) {
    return new Web3File([data], filename, options)
  }

  /**
   * @param {string} data
   * @param {string} filename
   * @param {Web3FileOpts} options
   */
  static fromText (data, filename, options) {
    const bytes = new TextEncoder().encode(data)

    return this.fromBytes(bytes, filename, options)
  }

  /**
   * @param {ReadableStream} readableStream
   * @param {string} filename
   * @param {Web3FileOpts} options
   */
  static fromReadableStream (readableStream, filename, options) {
    return new Web3File(toIterable(readableStream), filename, options)
  }

  /**
   * @param {Blob} blob
   * @param {string} filename
   * @param {Web3FileOpts} options
   */
  static fromBlob (blob, filename, options) {
    return this.fromReadableStream(blob.stream(), filename, options)
  }

  /**
   * @param {File} file
   * @param {Web3FileOpts} options
   */
  static fromFile (file, options) {
    return this.fromReadableStream(file.stream(), file.name, {
      lastModified: file.lastModified,
      ...options
    })
  }
}

/**
 * @typedef {import('./types').Web3FileOpts} Web3FileOpts
 * @typedef {import('@web-std/file').File} File
 */
