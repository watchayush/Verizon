import find from 'lodash/find';
import get from 'lodash/get';
import { createSelector } from 'reselect';

export const selectModal = () =>
  createSelector(
    (state) => state.modal.data,
    (modalData) => {
      const _modalIds = [];
      modalData.forEach((item) => {
        const _id = get(item, 'id', '');
        if (_id) {
          _modalIds.push(item);
        }
      });
      return _modalIds;
    },
  );

export const selectModalData = () =>
  createSelector(
    (state, id) => find(state.modal.data, { id }),
    (modelData) => modelData || {},
  );
