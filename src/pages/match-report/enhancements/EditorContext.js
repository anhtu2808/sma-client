import { createContext } from 'react';

const EditorContext = createContext({
  fixInEditor: null,
  fixingDetailId: null,
  editor: null,
  pushFixUndo: null,
});

export default EditorContext;
