import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Detail from '../components/Detail';
import { getBooks as getBooksSaga } from '../redux/modules/books';
import { logout as logoutSaga } from '../redux/modules/auth';
import { RootState } from '../redux/modules/rootReducer';

const DetailContainer = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.
  const { books } = useSelector((state: RootState) => state.books);
  const { id } = useParams<{ id?: string }>();
  const bookId = Number(id) || -1;
  const book = books ? books.find((book) => book.bookId === bookId) : null;

  useEffect(() => {
    if (books === null) {
      dispatch(getBooksSaga());
    }
  }, [dispatch, books]);

  return <Detail book={book} logout={logout} />;
};

export default DetailContainer;
