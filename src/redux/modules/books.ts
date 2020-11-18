import { BookReqType } from './../../types';
import { push } from 'connected-react-router';
import { call, put, takeEvery } from 'redux-saga/effects';
import { handleActions, createActions } from 'redux-actions';
import { BookResType } from '../../types';
import BookService from '../../services/BookService';

export interface BooksState {
  books: BookResType[] | null;
  loading: boolean;
  error: Error | null;
}

const initialState: BooksState = {
  books: null,
  loading: false,
  error: null,
};

const options = {
  prefix: 'my-books/books',
};

// [project] redux-action 을 이용하여, books 모듈의 액션 생성 함수와 리듀서를 작성했다.
export const booksActionCreator = createActions(
  {
    SUCCESS: (data: BookResType | BookReqType | number, type: string) => ({
      data,
      type,
    }),
    FAIL: (error: Error) => error,

    GET_BOOKS: (token: string) => ({ token }),
    ADD_BOOK: (token: string, book: BookReqType) => ({ token, book }),
    EDIT_BOOK: (token: string, bookId: number, book: BookReqType) => ({
      token,
      bookId,
      book,
    }),
    REMOVE_BOOK: (token: string, bookId: number) => ({ token, bookId }),
  },
  'PENDING',
  options,
);

const reducer = handleActions<BooksState, any>(
  {
    PENDING: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    SUCCESS: (state, action) => ({
      ...state,
      books:
        action.payload.type === 'GET'
          ? action.payload.data
          : action.payload.type === 'ADD'
          ? state.books?.concat(action.payload.data)
          : action.payload.type === 'REMOVE'
          ? state.books?.filter((book) => book.bookId !== action.payload.data)
          : action.payload.type === 'EDIT'
          ? state.books?.map((book) =>
              book.bookId === action.payload.data.bookId
                ? action.payload.data
                : book,
            )
          : null,
      loading: false,
      error: null,
    }),
    FAIL: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
  initialState,
  options,
);

export default reducer;

// [project] 책 목록을 가져오는 saga 함수를 작성했다.
function* getBooksSaga(action: ReturnType<typeof booksActionCreator.getBooks>) {
  try {
    yield put(booksActionCreator.pending());
    const books: BookResType[] = yield call(
      BookService.getBooks,
      action.payload.token,
    );
    yield put(booksActionCreator.success(books, 'GET'));
  } catch (error) {
    yield put(booksActionCreator.fail(error));
  }
}

// [project] 책을 추가하는 saga 함수를 작성했다.
function* addBookSaga(action: ReturnType<typeof booksActionCreator.addBook>) {
  try {
    yield put(booksActionCreator.pending());
    const book = yield call(
      BookService.addBook,
      action.payload.token,
      action.payload.book,
    );
    yield put(booksActionCreator.success(book, 'ADD'));
    yield put(push('/'));
  } catch (error) {
    yield put(booksActionCreator.fail(error));
  }
}

// [project] 책을 삭제하는 saga 함수를 작성했다.
function* removeBookSaga(
  action: ReturnType<typeof booksActionCreator.removeBook>,
) {
  try {
    yield put(booksActionCreator.pending());
    yield call(
      BookService.deleteBook,
      action.payload.token,
      action.payload.bookId,
    );
    yield put(booksActionCreator.success(action.payload.bookId, 'REMOVE'));
  } catch (error) {
    yield put(booksActionCreator.fail(error));
  }
}

// [project] 책을 수정하는 saga 함수를 작성했다.
function* editBookSaga(action: ReturnType<typeof booksActionCreator.editBook>) {
  try {
    yield put(booksActionCreator.pending());
    const book = yield call(
      BookService.editBook,
      action.payload.token,
      action.payload.bookId,
      action.payload.book,
    );
    yield put(booksActionCreator.success(book, 'EDIT'));
    yield put(push('/'));
  } catch (error) {
    yield put(booksActionCreator.fail(error));
  }
}

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.
export function* sagas() {
  yield takeEvery(`${options.prefix}/GET_BOOKS`, getBooksSaga);
  yield takeEvery(`${options.prefix}/ADD_BOOK`, addBookSaga);
  yield takeEvery(`${options.prefix}/REMOVE_BOOK`, removeBookSaga);
  yield takeEvery(`${options.prefix}/EDIT_BOOK`, editBookSaga);
}
