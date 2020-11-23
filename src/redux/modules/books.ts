import { BookReqType } from './../../types';
import { push } from 'connected-react-router';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import { handleActions, createActions } from 'redux-actions';
import { BookResType } from '../../types';
import BookService from '../../services/BookService';
import { getBooksFromState, getTokenFromState } from '../utils';

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
export const {
  success,
  pending,
  fail,
  getBooks,
  addBook,
  editBook,
  removeBook,
} = createActions(
  {
    SUCCESS: (books: BookResType[], type: string) => ({
      books,
      type,
    }),
    FAIL: (error: Error) => error,

    ADD_BOOK: (book: BookReqType) => ({ book }),
    EDIT_BOOK: (bookId: number, book: BookReqType) => ({
      bookId,
      book,
    }),
    REMOVE_BOOK: (bookId: number) => ({ bookId }),
  },
  'PENDING',
  'GET_BOOKS',
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
      books: action.payload.books,
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
function* getBooksSaga(action: ReturnType<typeof getBooks>) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const books: BookResType[] = yield call(BookService.getBooks, token);
    yield put(success(books));
  } catch (error) {
    yield put(fail(error));
  }
}

// [project] 책을 추가하는 saga 함수를 작성했다.
function* addBookSaga(action: ReturnType<typeof addBook>) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const books: BookResType[] = yield select(getBooksFromState);
    const book = yield call(BookService.addBook, token, action.payload.book);
    yield put(success([...books, book]));
    yield put(push('/'));
  } catch (error) {
    yield put(fail(error));
  }
}

// [project] 책을 삭제하는 saga 함수를 작성했다.
function* removeBookSaga(action: ReturnType<typeof removeBook>) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const books: BookResType[] = yield select(getBooksFromState);
    yield call(BookService.deleteBook, token, action.payload.bookId);
    yield put(
      success(books.filter((book) => book.bookId !== action.payload.bookId)),
    );
  } catch (error) {
    yield put(fail(error));
  }
}

// [project] 책을 수정하는 saga 함수를 작성했다.
function* editBookSaga(action: ReturnType<typeof editBook>) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const books: BookResType[] = yield select(getBooksFromState);
    const editedBook = yield call(
      BookService.editBook,
      token,
      action.payload.bookId,
      action.payload.book,
    );
    yield put(
      success(
        books.map((book) =>
          book.bookId === action.payload.bookId ? editedBook : book,
        ),
      ),
    );
    yield put(push('/'));
  } catch (error) {
    yield put(fail(error));
  }
}

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.
export function* sagas() {
  yield takeEvery(`${options.prefix}/GET_BOOKS`, getBooksSaga);
  yield takeEvery(`${options.prefix}/ADD_BOOK`, addBookSaga);
  yield takeEvery(`${options.prefix}/REMOVE_BOOK`, removeBookSaga);
  yield takeEvery(`${options.prefix}/EDIT_BOOK`, editBookSaga);
}
