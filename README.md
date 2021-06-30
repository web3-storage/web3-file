# web3-file

The [Web File](https://developer.mozilla.org/en-US/docs/Web/API/File) implementation for Web3.

## Table of Contents

* [Motivation](#motivation)
* [Install](#install)
* [API](#api)
  + [class Web3File](#class-web3file)
  + [`Web3File#name`](#web3file%23name)
  + [`Web3File#path`](#web3file%23path)
  + [`Web3File#lastModified`](#web3file%23lastmodified)
  + [`Web3File#content`](#web3file%23content)
  + [`Web3File#iterator()`](#web3file%23iterator)
  + [`Web3File#blob()`](#web3file%23blob)
  + [`Web3File.fromBytes`](#web3filefrombytes)
  + [`Web3File.fromString`](#web3filefromstring)
  + [`Web3File.fromReadableStream`](#web3filefromreadablestream)
  + [`Web3File.fromBlob`](#web3filefromblob)
  + [`Web3File.fromFile`](#web3filefromfile)%

## Motivation

The [Web File](https://developer.mozilla.org/en-US/docs/Web/API/File) implementation and standard are still on their beginning.

The current implementation has a non standard [**File.webkitRelativePath**](https://developer.mozilla.org/en-US/docs/Web/API/File/webkitRelativePath) `read-only` property that we cannot use outside the `webkitdirectory` context. As a result, we cannot set a File path programatically in the Browser, nor in Node.js [@web-std/file](https://github.com/web-std/io/tree/main/file).

`Web3File` bridges this gap by adding a path property and other extras, while being a close implementation of Web File. This allows 
files to be transformed into their [UnixFs](https://github.com/ipfs/specs/blob/master/UNIXFS.md) representation and back into the original structure, and leverage the IPFS Content Routing primitives.

## Install

```sh
# install it as a dependency
$ npm i web3-file
```

## API

To create your `Web3File` with an async iterable content, you can simply create an instance of Web3File. Otherwise, you can leverage one of the static functions provided to create a `Web3File` from another data type.

Please note that the same options of the constructor can be provided in the static functions.

### class Web3File

| Name | Type | Description |
|------|------|-------------|
| content | `AsyncIterable<Uint8Array>` | File content to be read |
| filename | `string` | filename |
| [options] | `object` | Web3File options |
| [options.path] | `string` | File Path |
| [options.lastModified] | `number` | Last modified timestamp |

```js
import { Web3File } from 'web3-file'

const file = new Web3File(
  fs.createReadStream('path/to/file.zip'),
  'file.zip',
  {
    path: 'path/to/file.zip',
    lastModified: Date.now()
  }
)
```

### `Web3File#name`

- Returns `string`

Get file name.

### `Web3File#path`

- Returns `string`

Get file path.

### `Web3File#lastModified`

- Returns `number`

Get file last modified timestamp.

### `Web3File#content`

- Returns `AsyncIterable<Uint8Array>`

Get file content readable source.

### `Web3File#iterator()`

- Returns `AsyncIterable<Uint8Array>`

Get file content readable source iterator.

### `Web3File#blob()`

- Returns `Promise<Blob>`

Get file content as a Blob.

### `Web3File.fromBytes`

Takes [Uint8Array bytes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) to create a Web3File.

```js
import Web3File from 'web3-file'

const file = Web3File.fromBytes(new Uint8Array([2, 44, 1]), 'file.zip')
```

### `Web3File.fromString`

Takes a string content to create a Web3File.

```js
import { Web3File } from 'web3-file'

const file = Web3File.fromString('web3file', 'file.txt')
```

### `Web3File.fromReadableStream`

Takes a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) content to create a Web3File.

```js
import { Web3File } from 'web3-file'

const response = await fetch('https://example.org/image.png')
const file = Web3File.fromReadableStream(response.body, 'image.png')
```

### `Web3File.fromBlob`

Takes a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) content to create a Web3File.

```js
import { Web3File } from 'web3-file'

const response = await fetch('https://example.org/image.png')
const blob = await response.blob()
const file = Web3File.fromBlob(blob, 'image.png')
```

### `Web3File.fromFile`

Takes a [File](https://developer.mozilla.org/en-US/docs/Web/API/File) content to create a Web3File.

```js
import { Web3File } from 'web3-file'

const image = new File([bytes], 'image.png')
const file = Web3File.fromFile(webFile)
```
