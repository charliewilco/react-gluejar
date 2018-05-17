import React, { Component } from 'react'
import { render } from 'react-dom'
import PasteContainer from '../src/'

const styles = {
  fontFamily: 'sans-serif',
  maxWidth: 528,
  margin: `1rem auto`
}

const imageStyle = {
  maxWidth: `100%`,
  display: 'inline-block',
  verticalAlign: 'middle',
  fontStyle: 'italic'
}

const Instructions = () => <h2>Copy an image from your file system and paste it here</h2>

const Sorry = ({ error, onClose }) => (
  <div>
    <h3>
      {error} <button onClick={onClose}>&times;</button>
    </h3>
  </div>
)

class App extends Component {
  render() {
    return (
      <div style={styles}>
        <Instructions />
        <PasteContainer
          onPaste={files => console.log(files)}
          errorHandler={err => console.error(err)}>
          {images =>
            images.length > 0 &&
            images.map(image => (
              <img src={image} key={image} alt={`Pasted: ${image}`} style={imageStyle} />
            ))
          }
        </PasteContainer>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
