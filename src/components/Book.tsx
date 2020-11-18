import React, { useEffect } from 'react';

import styles from './Book.module.css';
import {
  BookOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { BookResType } from '../types';
import { history } from '../redux/create';

interface BookProps extends BookResType {
  removeBookById: (bookId: number) => void;
  setBookId: (bookId: number) => void;
}

// [project] 컨테이너에 작성된 함수를 컴포넌트에서 이용했다.
// [project] BookResType 의 응답 값을 이용하여, Book 컴포넌트를 완성했다.
const Book: React.FC<BookProps> = ({
  author,
  bookId,
  createdAt,
  message,
  title,
  updatedAt,
  url,
  removeBookById,
  setBookId,
}) => {
  const edit = () => {
    setBookId(bookId);
    history.push(`/edit/${bookId}`);
  };

  const remove = () => {
    removeBookById(bookId);
  };

  const detail = () => {
    setBookId(bookId);
    history.push(`/book/${bookId}`);
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(Date.parse(dateString));

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hours = date.getHours().toString();
    let hoursNumber = parseInt(hours);
    let minutes = date.getMinutes().toString();
    let minutesNumber = parseInt(minutes);
    const ampm = hoursNumber >= 12 ? 'pm' : 'am';

    hoursNumber = hoursNumber % 12;
    hoursNumber = hoursNumber === 0 ? 12 : hoursNumber;
    hours = hoursNumber < 10 ? '0' + hoursNumber : hours;
    minutes = minutesNumber < 10 ? '0' + minutesNumber : minutes;

    return (
      day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ' ' + ampm
    );
  };

  const createdDate = getFormattedDate(createdAt);

  return (
    <>
      <div className={styles.book}>
        <div className={styles.title}>
          <a className={styles.link_detail_title} onClick={detail}>
            <BookOutlined className={styles.bookOutLined} />
            {title}
          </a>
        </div>
        <div className={styles.author}>
          <a className={styles.link_detail_author} onClick={detail}>
            {author}
          </a>
        </div>
        <div className={styles.created}>{createdDate}</div>
        <div className={styles.tooltips}>
          <a href={url} className={styles.button_url}>
            <HomeOutlined />
          </a>
          <button className={styles.button_edit} onClick={edit}>
            <EditOutlined />
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
