import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css'; // Optional, but helps with styling

export default function News() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(
          'https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=10&token=fecfd12b0c3623142acab98d021668f1'
        );
        setArticles(res.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="news-page">
      <h2>🗞️ Daily News</h2>
      {articles.length === 0 && <p>Loading news...</p>}
      {articles.map((a, i) => (
        <div key={i} className="news-card">
          {a.image && <img src={a.image} alt="news" />}
          <h4>{a.title}</h4>
          <p>{a.description}</p>
          <a href={a.url} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </div>
      ))}
    </div>
  );
}
