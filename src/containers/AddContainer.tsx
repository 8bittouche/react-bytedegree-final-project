import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Add from '../components/Add';
import useToken from '../hooks/useToken';
import { logout as logoutSaga } from '../redux/modules/auth';
import { booksActionCreator } from '../redux/modules/books';
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
  const token = useToken();

  const addBook = useCallback(
    (book: BookReqType) => {
      dispatch(booksActionCreator.addBook(token, book));
    },
    [dispatch, token],
  );

  return <Add loading={loading} logout={logout} addBook={addBook} />;
};

export default AddContainer;
