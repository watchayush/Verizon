import { createSlice } from '@reduxjs/toolkit';
import uniqueId from 'lodash/uniqueId';

const initialState = { data: [] };
const modelPrefix = 'modal_';

/*
 {
    id: ""
    title: "", Model Header 
    body: "" or [{type: "", value: ''}], Model Content 
    onModelClose: fn(), Callback fn when call onClose of Model 
    actions: [], object of array which will contain button action details
}
*/

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    addModal: (state, action) => {
      const _id = uniqueId(modelPrefix);
      state.data.push({ ...action.payload, id: _id });
    },
    removeModal: (state, action) => {
      const _id = action.payload.id;
      state.data = state.data.filter((i) => i.id !== _id);
    },
    removeAllModal: (state, action) => {
      const subType = action.payload;
      state.data = state.data.filter((i) => i.subType !== subType);
    },
  },
});

export const { addModal, removeModal, removeAllModal } = modalSlice.actions;

export default modalSlice.reducer;