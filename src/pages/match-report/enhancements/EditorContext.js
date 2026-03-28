import { createContext } from 'react';

const EditorContext = createContext({
  fixInEditor: null,
  fixingDetailId: null,
});

export default EditorContext;
