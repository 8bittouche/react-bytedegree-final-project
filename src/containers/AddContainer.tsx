import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Add from '../components/Add';
import { addBook as addBookSaga } from '../redux/modules/books';
import { logout as logoutSaga } from '../redux/modules/auth';
import { RootState } from '../redux/modules/rootReducer';
import { BookReqType } from '../types';

const AddContainer = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  const { loading } = useSelector((state: RootState) => state.books);

  const addBook = useCallback(
    (book: BookReqType) => {
      dispatch(addBookSaga(book));
    },
    [dispatch],
  );

  return <Add loading={loading} logout={logout} addBook={addBook} />;
};

export default AddContainer;
