import React, { useState } from 'react';

function News(props) {
  return (
    <div className="news">
      {props.news ? (
        <NewsElement news={props.news} index={props.newsIndex} />
      ) : (
        ''
      )}
    </div>
  );
}

function NewsElement(props) {
  const news = props.news.articles[props.index];

  return (
    <div className="news__container">
      <div className="news--index">{props.index + 1 + '/20'}</div>
      <div className="news--author">{news.author}</div>
      <div className="news--title">{news.title}</div>
      <div className="news--description">{news.description}</div>
    </div>
  );
}

export default News;
