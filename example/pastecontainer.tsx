import * as React from 'react'
import { render } from 'react-dom'
import { Gluejar } from '../src'
import { Header } from './header'

const styles: React.CSSProperties = {
  maxWidth: 600,
  margin: `1rem auto`,
  textAlign: 'center'
}

const imageStyle = {
  maxWidth: `100%`,
  display: 'inline-block',
  verticalAlign: 'middle',
  fontStyle: 'italic',
  marginBottom: 8
}

const Instructions = () => (
  <h2 style={{ fontWeight: 300, marginBottom: 24 }}>
    Copy an image from your file system and paste it here
  </h2>
)

const Sorry = ({ error, onClose }) => (
  <div>
    <h3>
      {error} <button onClick={onClose}>&times;</button>
    </h3>
  </div>
)

class App extends React.Component<any, any> {
  onError = err => console.error(err)

  render() {
    return (
      <div style={styles}>
        <Header />
        <Instructions />
        <Gluejar onPaste={files => console.log(files)} onError={this.onError}>
          {({ images }) =>
            images.length > 0 &&
            images.map(image => (
              <img src={image} key={image} alt={`Pasted: ${image}`} style={imageStyle} />
            ))
          }
        </Gluejar>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
