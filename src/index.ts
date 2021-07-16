import { useEffect, useCallback, useReducer, MutableRefObject } from "react";

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

const DEFAULT_ACCEPTED_FILES = ["image/gif", "image/png", "image/jpeg", "image/bmp"];

const _transformImageDataToURL = (
  data: DataTransfer,
  acceptedFiles: string[] = DEFAULT_ACCEPTED_FILES
): string | undefined => {
  const isValidFormat = (fileType: string): boolean => acceptedFiles.includes(fileType);
  // NOTE: This needs to be a for loop, it's a list like object
  for (let i = 0; i < data.items.length; i++) {
    if (!isValidFormat(data.items[i].type)) {
      throw new Error(`Sorry, that's not a format we support ${data.items[i].type}`);
    }
    let blob: BlobLikeFile = data.items[i].getAsFile();

    if (blob) {
      // We shouldn't fire the callback if we can't create `new Blob()`
      let file = window.URL.createObjectURL(blob);

      return file;
    }
  }
};

type BlobLikeFile = File | null;

export interface GlueJarOptions<T extends HTMLElement> {
  acceptedFiles: string[];
  ref?: MutableRefObject<T>;
}

export interface IGlueJarState {
  pasted: string[];
  error: string | null;
}

export enum GlueActions {
  SET_FILE = "SET_FILES",
  SET_ERROR = "SET_ERROR",
}

type GlueJarActions =
  | {
      type: GlueActions.SET_FILE;
      file: string;
    }
  | { type: GlueActions.SET_ERROR; error: string };

type GlueJarReducer = React.Reducer<IGlueJarState, GlueJarActions>;

const reducer: GlueJarReducer = (state, action) => {
  switch (action.type) {
    case GlueActions.SET_FILE:
      return { ...state, pasted: [action.file, ...state.pasted], error: null };
    case GlueActions.SET_ERROR:
      return { ...state, error: action.error };
    default:
      throw new Error("Must specify action type");
  }
};

const useGlueJarReducer = () =>
  useReducer<GlueJarReducer>(reducer, {
    pasted: [],
    error: null,
  });

export function usePasteHandler(acceptedFiles: string[] = DEFAULT_ACCEPTED_FILES) {
  const [state, dispatch] = useGlueJarReducer();

  const transformImageDataToURL = useCallback(
    (data: DataTransfer): void => {
      try {
        const file = _transformImageDataToURL(data, acceptedFiles);
        dispatch(
          file
            ? { type: GlueActions.SET_FILE, file }
            : {
                type: GlueActions.SET_ERROR,
                error: "Something went wrong",
              }
        );
      } catch (error) {
        dispatch({ type: GlueActions.SET_ERROR, error: error.message });
      }
    },
    [dispatch, acceptedFiles]
  );

  const pasteHandler = useCallback(
    ({ clipboardData }: ClipboardEvent): void => {
      if (clipboardData && clipboardData.items.length > 0) {
        transformImageDataToURL(clipboardData);
      } else {
        dispatch({
          type: GlueActions.SET_ERROR,
          error: `Sorry, to bother you but there was no image pasted.`,
        });
      }
    },
    [dispatch, transformImageDataToURL]
  );

  return [state, pasteHandler] as const;
}

/**
 * useGlueJar
 * if you don't pass a `ref` to the options it will default to use the document
 * to add an event listener
 * @param options
 * @returns `IGlueJarState`
 */
export function useGlueJar<T extends HTMLElement>(
  { ref, ...options }: Partial<GlueJarOptions<T>> = {
    acceptedFiles: DEFAULT_ACCEPTED_FILES,
  }
) {
  const [state, pasteHandler] = usePasteHandler(options.acceptedFiles);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.addEventListener("paste", pasteHandler);
    } else {
      document.addEventListener("paste", pasteHandler);
    }

    return () => {
      if (ref && ref.current) {
        ref.current.removeEventListener("paste", pasteHandler);
      } else {
        document.removeEventListener("paste", pasteHandler);
      }
    };
  }, [ref, options]);

  return state;
}
