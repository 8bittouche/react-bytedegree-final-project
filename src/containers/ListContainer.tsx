import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from '../components/List';
import { logout as logoutSaga } from '../redux/modules/auth';
import { push } from 'connected-react-router';

import { booksActionCreator, SET_BOOK_ID } from '../redux/modules/books';
import { RootState } from '../redux/modules/rootReducer';
import useToken from '../hooks/useToken';
import { history } from '../redux/create';

const ListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const goAdd = useCallback(() => {
    dispatch(push('/add'));
  }, [dispatch]);
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  const token = useToken();
  const getBookList = useCallback(() => {
    dispatch(booksActionCreator.getBooks({ token }));
  }, [dispatch]);

  const removeBookById = useCallback(async (bookId: number) => {
    await dispatch(booksActionCreator.removeBook({ token, bookId }));
    await dispatch(booksActionCreator.getBooks({ token }));
  }, [dispatch]);

  const setBookId = (bookId: number) => {
    dispatch({ type: SET_BOOK_ID, payload: { bookId }});
    // dispatch(booksActionCreator.setBookId({ bookId }));
  }

  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  const { books, loading } = useSelector((state: RootState) => state.books);
  
  return <List books={books} loading={loading} goAdd={goAdd} logout={logout} getBookList={getBookList} removeBookById={removeBookById} setBookId={setBookId} />;
};

export default ListContainer;
