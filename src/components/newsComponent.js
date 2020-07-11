import React, { useState } from 'react';

function News(props) {
  return (
    <div className="news">
      {props.newsFrame}
      {props.needNews}
      {props.news && !props.newsFrame && props.needNews ? (
        <NewsElement news={props.news} index={props.newsIndex} />
      ) : (
        ''
      )}
      {props.newsFrame && props.needNews ? (
        <NewsFrame news={props.news} index={props.newsIndex} />
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

function NewsFrame(props) {
  const news = props.news.articles[props.index];
  
  return (
    <iframe
      id="news"
      is="x-frame-bypass"
      src={news.url}
      scrolling="yes"
    ></iframe>
  );
}

export default News;
