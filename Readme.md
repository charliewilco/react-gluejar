# React Gluejar

// Explanation

## Installation

```sh
yarn add react-gluejar
```

## Example

```js
import React, { Component } from 'react'
import Gluejar from 'react-gluejar'

class App extends Component {
  render() {
    return (
      <Gluejar onPaste={files => console.log(files)} errorHandler={err => console.error(err)}>
        {images =>
          images.length > 0 &&
          images.map(image => <img src={image} key={image} alt={`Pasted: ${image}`} />)
        }
      </Gluejar>
    )
  }
}
```

Run this example locally by [cloning the repo](https://help.github.com/articles/cloning-a-repository/) and running `yarn example` in the root directory.

## Usage

* Available Props
* API spec
* Working with blobs
