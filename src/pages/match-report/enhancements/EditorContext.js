import { createContext } from 'react';

const EditorContext = createContext({
  fixInEditor: null,
  fixingDetailId: null,
  editor: null,
});

export default EditorContext;
