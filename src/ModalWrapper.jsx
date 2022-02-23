// Third party imports
import React, { useMemo } from 'react';
import isArray from 'lodash/isArray';
import { useSelector } from 'react-redux';

import { selectModal } from '../../../services/modal/modalSelector';
import CommonModal from '../../molecules/modal';
import RightNoteModalWrapper from '../notes/index';

const ModalWrapper = () => {
  const modalSelector = useMemo(selectModal, []);
  const modals = useSelector((state) => modalSelector(state));

  return (
    <>
      {isArray(modals) &&
        modals.length > 0 &&
        modals.map((modal) => {
          if (modal.type === 'RIGHT_MODAL') {
            return <RightNoteModalWrapper key={modal.id} id={modal.id} />;
          } else {
            return <CommonModal key={modal.id} id={modal.id} />;
          }
        })}
    </>
  );
};

export default ModalWrapper;