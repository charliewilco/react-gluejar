// @flow

import { Component } from 'react'

/* <PasteContainer
  onPaste={files => files.length > 0 && this.props.onFileAccepted(files[0], files[0])}
/> */

// NOTE: `onPaste` should return an array of files that were acceptedFiles
//
// const Image = ({ src }) => <img src={image} alt={`Pasted: ${image}`} />
//
// <PasteContainer
//    onPaste={files => this.method(files)}
//    onError={err => console.error(err)}
// >
//   {({images}) => images.map((image, i) => <Image src={image} key={i} />)}
// </PasteContainer>

type Props = {
  children?: Function,
  container: Element,
  onPaste: Function,
  onError: Function,
  acceptedFiles: Array<string>
}

type State = {
  items: Array<*>
}

export default class Gluejar extends Component<Props, State> {
  static displayName = 'Gluejar'

  static defaultProps = {
    onPaste: () => null,
    errorHandler: () => null,
    acceptedFiles: ['image/gif', 'image/png', 'image/jpeg', 'image/bmp']
  }

  state = {
    items: []
  }

  getContainer = (): Element => this.props.container || window

  isValidFormat = (fileType: string) => this.props.acceptedFiles.includes(fileType)

  pasteHandler = (e: ClipboardEvent) => this.checkPasted(e, this.pushImage)

  transformImages = (data: DataTransfer, cb: Function) => {
    // NOTE: This needs to be a for loop, it's a list like object
    if (window.Clipboard || window.ClipboardEvent) {
      for (let i = 0; i < data.items.length; i++) {
        if (this.isValidFormat(data.items[i].type) !== false) {
          // NOTE: returns a Blob instance
          let blob = data.items[i].getAsFile()

          // NOTE: This could probably call `new URL()`
          let URL = window.URL || window.webkitURL

          if (blob) {
            // We shouldn't fire the callback if we can't create `new Blob()`
            let src = URL.createObjectURL(blob)

            cb(src)
          }
        } else {
          this.props.onError(`Sorry, that's not a format we support`)
        }
      }
    }
  }

  checkPasted = (e: ClipboardEvent, cb: Function) => {
    e.clipboardData && e.clipboardData.items.length > 0
      ? this.transformImages(e.clipboardData, cb)
      : this.props.onError(`Sorry, to bother you but there was no image pasted.`)
  }

  pushImage = (source: string) => this.setState(({ items }) => ({ items: [...items, source] }))

  componentDidMount() {
    const elm: Element = this.getContainer()
    elm.addEventListener('paste', this.pasteHandler)
  }

  componentDidUpdate() {
    this.props.onPaste(this.state.items)
  }

  componentWillUnmount() {
    const elm: Element = this.getContainer()
    elm.removeEventListener('paste', this.pasteHandler)
  }
  render() {
    const { items } = this.state
    const { children } = this.props
    return children ? children({ images: items }) : null
  }
}
