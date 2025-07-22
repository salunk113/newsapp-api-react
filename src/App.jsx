import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, ExternalLink, Zap } from 'lucide-react';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('us');

  // Replace with your actual News API key
  const API_KEY = '366a240e6df2457d94f526d2d18c179b';
  const BASE_URL = 'https://newsapi.org/v2';

  const countries = [
    { code: 'us', name: 'USA' }
  ];

  useEffect(() => {
    fetchNews();
  }, [country]);

  const fetchNews = async (search = '') => {
    setLoading(true);
    setError('');

    try {
      let url = '';
      if (search) {
        url = `${BASE_URL}/everything?q=${encodeURIComponent(search)}&apiKey=${API_KEY}&pageSize=20&sortBy=publishedAt`;
      } else {
        url = `${BASE_URL}/top-headlines?country=${country}&apiKey=${API_KEY}&pageSize=20`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      
      if (data.status === 'ok') {
        setArticles(data.articles.filter(article => 
          article.title && 
          article.description && 
          article.urlToImage &&
          !article.title.includes('[Removed]')
        ));
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      setError(err.message);
      // Fallback to sample data for demo
      setArticles(getSampleArticles());
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (searchTerm.trim()) {
      fetchNews(searchTerm);
    }
  };

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    setSearchTerm('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSampleArticles = () => [
    {
      title: "Breaking: Major Technology Breakthrough Announced",
      description: "Scientists have made a significant discovery that could revolutionize the tech industry...",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop",
      publishedAt: new Date().toISOString(),
      source: { name: "Tech News" },
      author: "John Doe"
    },
    {
      title: "Global Climate Summit Reaches Historic Agreement",
      description: "World leaders unite on unprecedented climate action plan with ambitious targets...",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: { name: "World News" },
      author: "Jane Smith"
    },
    {
      title: "Stock Market Hits Record High Amid Economic Recovery",
      description: "Markets continue upward trajectory as economic indicators show strong recovery signs...",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: { name: "Financial Times" },
      author: "Mike Johnson"
    }
  ];

  return (
    <div className="news-app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <Zap size={32} />
            <h1>NewsHub</h1>
          </div>
          
          {/* Search Bar */}
          <div className="search-form">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="search-input"
              />
              <button onClick={handleSearch} className="search-btn">Search</button>
            </div>
          </div>

          {/* Country Selector */}
          <select 
            value={country} 
            onChange={(e) => handleCountryChange(e.target.value)}
            className="country-select"
          >
            {countries.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {error && (
            <div className="error">
              <p>⚠️ {error}</p>
              <p>Showing sample articles for demonstration.</p>
            </div>
          )}

          {!loading && articles.length === 0 && (
            <div className="no-results">
              <p>No articles found. Try a different search term.</p>
            </div>
          )}

          {articles.length > 0 && (
            <>
              <div className="results-info">
                <h2>
                  {searchTerm ? `Search results for "${searchTerm}"` : 'Latest News'}
                </h2>
                <p>{articles.length} articles found</p>
              </div>

              <div className="articles-grid">
                {articles.map((article, index) => (
                  <article key={index} className="article-card">
                    <div className="article-image">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop';
                        }}
                      />
                    </div>
                    
                    <div className="article-content">
                      <div className="article-meta">
                        <span className="source">{article.source.name}</span>
                        <span className="date">
                          <Calendar size={14} />
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                      
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-description">{article.description}</p>
                      
                      <div className="article-footer">
                        {article.author && (
                          <span className="author">
                            <User size={14} />
                            {article.author}
                          </span>
                        )}
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="read-more"
                        >
                          Read More
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 NewsHub. Powered by News API</p>
        </div>
      </footer>

      <style jsx>{`
        .news-app {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .container {
          max-width: 1500px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Header */
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header .container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #667eea;
          font-weight: bold;
        }

        .logo h1 {
          margin: 0;
          font-size: 1.8rem;
        }

        .search-form {
          flex: 1;
          max-width: 500px;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #666;
          z-index: 2;
        }

        .search-input {
          flex: 1;
          padding: 12px 16px 12px 44px;
          border: 2px solid #e1e5e9;
          border-radius: 25px;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          margin-left: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .search-btn:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .country-select {
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          background: white;
          cursor: pointer;
          outline: none;
        }

        .country-select:focus {
          border-color: #667eea;
        }

        /* Main Content */
        .main {
          padding: 2rem 0;
          min-height: calc(100vh - 200px);
        }



        .error {
          background: rgba(255, 107, 107, 0.9);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 2rem;
        }

        .no-results {
          text-align: center;
          color: white;
          font-size: 1.2rem;
          padding: 3rem 0;
        }

        .results-info {
          margin-bottom: 2rem;
          color: white;
          text-align: center;
        }

        .results-info h2 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
        }

        .results-info p {
          margin: 0;
          opacity: 0.8;
        }

        /* Articles Grid */
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .article-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .article-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .article-image {
          height: 200px;
          overflow: hidden;
        }

        .article-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .article-card:hover .article-image img {
          transform: scale(1.05);
        }

        .article-content {
          padding: 1.5rem;
        }

        .article-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #666;
        }

        .source {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 600;
        }

        .date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .article-title {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          line-height: 1.4;
          color: #2d3748;
        }

        .article-description {
          margin: 0 0 1.5rem 0;
          color: #4a5568;
          line-height: 1.6;
        }

        .article-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #e2e8f0;
          padding-top: 1rem;
        }

        .author {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #666;
        }

        .read-more {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .read-more:hover {
          color: #5a67d8;
          transform: translateX(2px);
        }

        /* Footer */
        .footer {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          text-align: center;
          padding: 2rem 0;
          margin-top: 4rem;
        }

        .footer p {
          margin: 0;
          opacity: 0.8;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header .container {
            flex-direction: column;
            gap: 1rem;
          }

          .search-container {
            flex-direction: column;
            gap: 0.5rem;
          }

          .search-btn {
            margin-left: 0;
            align-self: stretch;
          }

          .articles-grid {
            grid-template-columns: 1fr;
          }

          .results-info h2 {
            font-size: 1.5rem;
          }

          .article-footer {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default App;