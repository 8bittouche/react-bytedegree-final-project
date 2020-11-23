import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Edit from '../components/Edit';
import {
  getBooks as getBooksSaga,
  editBook as editBookSaga,
} from '../redux/modules/books';
import { logout as logoutSaga } from '../redux/modules/auth';
import { RootState } from '../redux/modules/rootReducer';
import { BookReqType } from '../types';

const EditContainer = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.
  const { books, loading } = useSelector((state: RootState) => state.books);
  const { id } = useParams<{ id?: string }>();
  const bookId = Number(id) || -1;
  const book = books ? books?.find((book) => book.bookId === bookId) : null;

  const editBookById = useCallback(
    (bookId: number, book: BookReqType) => {
      dispatch(editBookSaga(bookId, book));
    },
    [dispatch],
  );

  useEffect(() => {
    if (books === null) {
      dispatch(getBooksSaga());
    }
  }, [dispatch, books]);

  return (
    <Edit
      book={book}
      loading={loading}
      logout={logout}
      editBookById={editBookById}
    />
  );
};

export default EditContainer;
