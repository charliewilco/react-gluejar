import * as React from 'react'

type BlobLikeFile = File | null

export interface GlueJarOptions {
  acceptedFiles: string[]
}

interface IGlueJarState {
  pasted: string[]
  error?: string
}

export enum GlueActions {
  SET_FILE = 'SET_FILES',
  SET_ERROR = 'SET_ERROR'
}

interface IAction {
  type: GlueActions
  payload: string
}

function reducer(state: IGlueJarState, action: IAction): IGlueJarState {
  switch (action.type) {
    case GlueActions.SET_FILE:
      return { ...state, pasted: [action.payload, ...state.pasted], error: '' }
    case GlueActions.SET_ERROR:
      return { ...state, error: action.payload }
    default:
      throw new Error('Must specify action type')
  }
}

export default function useGlueJar(
  ref: React.MutableRefObject<HTMLElement>,
  options: Partial<GlueJarOptions> = {
    acceptedFiles: ['image/gif', 'image/png', 'image/jpeg', 'image/bmp']
  }
) {
  const [state, dispatch] = React.useReducer(reducer, {
    pasted: [],
    error: ''
  })

  const isValidFormat = (fileType: string): boolean =>
    options.acceptedFiles!.includes(fileType)
  const transformImages = (data: DataTransfer): void => {
    // NOTE: This needs to be a for loop, it's a list like object
    for (let i = 0; i < data.items.length; i++) {
      if (isValidFormat(data.items[i].type) !== false) {
        let blob: BlobLikeFile = data.items[i].getAsFile()
        let URL = window.URL

        if (blob) {
          // We shouldn't fire the callback if we can't create `new Blob()`
          let src = URL.createObjectURL(blob)

          dispatch({ type: GlueActions.SET_FILE, payload: src })
        }
      } else {
        dispatch({
          type: GlueActions.SET_ERROR,
          payload: `Sorry, that's not a format we support`
        })
      }
    }
  }

  const pasteHandler = (e: ClipboardEvent): void => {
    e.clipboardData && e.clipboardData.items.length > 0
      ? transformImages(e.clipboardData)
      : dispatch({
          type: GlueActions.SET_ERROR,
          payload: `Sorry, to bother you but there was no image pasted.`
        })
  }

  React.useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('paste', pasteHandler)
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('paste', pasteHandler)
      }
    }
  }, [ref.current])

  return state
}
