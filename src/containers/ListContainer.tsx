import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from '../components/List';
import {
  getBooks as getBooksSaga,
  removeBook as removeBookSaga,
} from '../redux/modules/books';
import { logout as logoutSaga } from '../redux/modules/auth';
import { push } from 'connected-react-router';

import { RootState } from '../redux/modules/rootReducer';

const ListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const goAdd = useCallback(() => {
    dispatch(push('/add'));
  }, [dispatch]);
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  const { books, loading } = useSelector((state: RootState) => state.books);

  const getBookList = useCallback(() => {
    dispatch(getBooksSaga());
  }, [dispatch]);

  const removeBookById = useCallback(
    (bookId: number) => {
      dispatch(removeBookSaga(bookId));
    },
    [dispatch],
  );

  return (
    <List
      books={books}
      loading={loading}
      goAdd={goAdd}
      logout={logout}
      getBookList={getBookList}
      removeBookById={removeBookById}
    />
  );
};

export default ListContainer;
