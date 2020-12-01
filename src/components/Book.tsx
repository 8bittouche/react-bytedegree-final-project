import React from 'react';

import styles from './Book.module.css';
import {
  BookOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { BookResType } from '../types';
import { history } from '../redux/create';
import { Link } from 'react-router-dom';
import moment from 'moment';

interface BookProps extends BookResType {
  removeBookById: (bookId: number) => void;
}

// [project] 컨테이너에 작성된 함수를 컴포넌트에서 이용했다.
// [project] BookResType 의 응답 값을 이용하여, Book 컴포넌트를 완성했다.
const Book: React.FC<BookProps> = ({
  author,
  bookId,
  createdAt,
  title,
  url,
  removeBookById,
}) => {
  const edit = () => {
    history.push(`/edit/${bookId}`);
  };

  const remove = () => {
    removeBookById(bookId);
  };

  return (
    <>
      <div className={styles.book}>
        <div className={styles.title}>
          <Link to={`/book/${bookId}`} className={styles.link_detail_title}>
            <BookOutlined className={styles.bookOutlined} />
            {title}
          </Link>
        </div>
        <div className={styles.author}>
          <Link to={`/book/${bookId}`} className={styles.link_detail_author}>
            {author}
          </Link>
        </div>
        <div className={styles.created}>
          {moment(createdAt).format('MM-DD-YYYY hh:mm a')}
        </div>
        <div className={styles.tooltips}>
          <button className={styles.button_url}>
            <a href={url} className={styles.link_url}>
              <HomeOutlined />
            </a>
          </button>
          <button className={styles.button_edit} onClick={edit}>
            <EditOutlined className={styles.editOutlined} />
          </button>
          <button className={styles.button_remove} onClick={remove}>
            <DeleteOutlined />
          </button>
        </div>
      </div>
    </>
  );
};

export default Book;
