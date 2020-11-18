import { push } from 'connected-react-router';
import { call, put, takeEvery } from 'redux-saga/effects';
import { handleActions, createActions } from 'redux-actions';
import { BookResType } from '../../types';
import BookService from '../../services/BookService';

export interface BooksState {
  books: BookResType[] | null;
  bookId: number;
  loading: boolean;
  error: Error | null;
}

const initialState: BooksState = {
  books: null,
  bookId: 0,
  loading: false,
  error: null,
};

const options = {
  prefix: 'my-books/books',
};

// [project] redux-action 을 이용하여, books 모듈의 액션 생성 함수와 리듀서를 작성했다.
export const GET_BOOKS = 'GET_BOOKS';
export const GET_BOOKS_SUCCESS = 'GET_BOOKS_SUCCESS';
export const GET_BOOKS_ERROR = 'GET_BOOKS_ERROR';

export const ADD_BOOK = 'ADD_BOOK';
export const ADD_BOOK_SUCCESS = 'ADD_BOOK_SUCCESS';
export const ADD_BOOK_ERROR = 'ADD_BOOK_ERROR';

export const REMOVE_BOOK = 'REMOVE_BOOK';
export const REMOVE_BOOK_SUCCESS = 'REMOVE_BOOK_SUCCESS';
export const REMOVE_BOOK_ERROR = 'REMOVE_BOOK_ERROR';

export const EDIT_BOOK = 'EDIT_BOOK';
export const EDIT_BOOK_SUCCESS = 'EDIT_BOOK_SUCCESS';
export const EDIT_BOOK_ERROR = 'EDIT_BOOK_ERROR';

export const SET_BOOK_ID = 'my-books/books/SET_BOOK_ID';

export const booksActionCreator = createActions(
  {
    GET_BOOKS_SUCCESS: (books: BookResType[]) => ({ books }),
    GET_BOOKS_ERROR: (error: Error) => ({ error }),

    ADD_BOOK_ERROR: (error: Error) => ({ error }),

    REMOVE_BOOK_ERROR: (error: Error) => ({ error }),

    EDIT_BOOK_ERROR: (error: Error) => ({ error }),
  },
  GET_BOOKS,
  ADD_BOOK,
  ADD_BOOK_SUCCESS,
  REMOVE_BOOK,
  REMOVE_BOOK_SUCCESS,
  EDIT_BOOK,
  EDIT_BOOK_SUCCESS,
  options,
);

// generic type 확인
const reducer = handleActions<BooksState, any>(
  {
    GET_BOOKS: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    GET_BOOKS_SUCCESS: (state, action) => ({
      ...state,
      books: action.payload.books,
      loading: false,
      error: null,
    }),
    GET_BOOKS_ERROR: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload.error,
    }),
    SET_BOOK_ID: (state, action) => ({
      ...state,
      bookId: action.payload.bookId,
    }),
  },
  initialState,
  options,
);

export default reducer;

// [project] 책 목록을 가져오는 saga 함수를 작성했다.
function* getBooksSaga(action: ReturnType<typeof booksActionCreator.getBooks>) {
  try {
    const books: BookResType[] = yield call(BookService.getBooks, action.payload.token);
    yield put(booksActionCreator.getBooksSuccess(books));
  } catch (error) {
    yield put(booksActionCreator.getBooksError(error));
  }
}

// [project] 책을 추가하는 saga 함수를 작성했다.
function* addBookSaga(action: ReturnType<typeof booksActionCreator.addBook>) {
  try {
    const data = yield call(BookService.addBook, action.payload.token, action.payload.book);
    yield put(booksActionCreator.addBookSuccess());
    yield put(push("/"));
  } catch(error) {
    yield put(booksActionCreator.addBookError(error));
  }
}

// [project] 책을 삭제하는 saga 함수를 작성했다.
function* removeBookSaga(action: ReturnType<typeof booksActionCreator.removeBook>) {
  try {
    yield call(BookService.deleteBook, action.payload.token, action.payload.bookId);
    yield put(booksActionCreator.removeBookSuccess());
  } catch(error) {
    yield put(booksActionCreator.removeBookError(error));
  }
}

// [project] 책을 수정하는 saga 함수를 작성했다.
function* editBookSaga(action: ReturnType<typeof booksActionCreator.editBook>) {
  try {
    yield call(BookService.editBook, action.payload.token, action.payload.bookId, action.payload.book);
    yield put(booksActionCreator.editBookSuccess());
    yield put(push("/"));
  } catch(error) {
    yield put(booksActionCreator.editBookError(error));
  }
}

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.
export function* sagas() {
  yield takeEvery(`${options.prefix}/GET_BOOKS`, getBooksSaga);
  yield takeEvery(`${options.prefix}/ADD_BOOK`, addBookSaga);
  yield takeEvery(`${options.prefix}/REMOVE_BOOK`, removeBookSaga);
  yield takeEvery(`${options.prefix}/EDIT_BOOK`, editBookSaga);
}
