import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Edit from '../components/Edit';
import useToken from '../hooks/useToken';
import { logout as logoutSaga } from '../redux/modules/auth';
import { booksActionCreator } from '../redux/modules/books';
import { RootState } from '../redux/modules/rootReducer';
import { BookReqType, BookResType } from '../types';

const EditContainer = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  const token = useToken();
  const editBookById = useCallback((bookId: number, book: BookReqType) => {
    dispatch(booksActionCreator.editBook({ token, bookId, book }));
  }, [dispatch]);

  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  const { books, bookId, loading } = useSelector((state: RootState) => (state.books));
  const book: BookResType | undefined | null = books?.filter(book => book.bookId === bookId)[0];

  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.
  useEffect(() => {
    if(books === null) {
      dispatch(booksActionCreator.getBooks({ token }));
    }
  }, []);
  

  return <Edit book={book} loading={loading} logout={logout} editBookById={editBookById} />;
};

export default EditContainer;
