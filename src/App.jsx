  import React, { useState, useEffect } from 'react';

  const NewsWebsite = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      fetch('/api/news') // This now works on Vercel
        .then((res) => res.json())
        .then((data) => {
          setArticles(data.articles || []);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load news');
          setLoading(false);
        });
    }, []);


  const fetchNews = async (query = '') => {
    setLoading(true);
    setError(null);
    
    try {
      let url;
      if (query.trim()) {
        url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}&pageSize=20&sortBy=publishedAt`;
      } else {
        url = `${BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}&pageSize=20`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'ok') {
        setArticles(data.articles || []);
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      setError(err.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    fetchNews(searchQuery);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Inline Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0,
      width: '100vw',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    },
    header: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '2rem 1rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      width: '100%',
      boxSizing: 'border-box'
    },
    headerContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
      padding: '0 1rem'
    },
    title: {
      textAlign: 'center',
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
      margin: '0 0 2rem 0'
    },
    searchContainer: {
      maxWidth: '600px',
      margin: '0 auto',
      display: 'flex',
      borderRadius: '8px',
      overflow: 'hidden',
      width: '100%'
    },
    searchInput: {
      flex: 1,
      padding: '1rem',
      border: '2px solid #ccc',
      borderRight: 'none',
      fontSize: '1rem',
      outline: 'none',
      borderRadius: '8px 0 0 8px',
      color: '#000'
    },
    searchButton: {
      padding: '1rem 1.5rem',
      backgroundColor: '#333333',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '0 8px 8px 0',
      transition: 'background-color 0.3s',
      fontSize: '1rem'
    },
    main: {
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem 1rem',
      boxSizing: 'border-box',
      minHeight: '60vh',
      flex: 1
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '5rem 0',
      flexDirection: 'column',
      width: '100%',
      minHeight: '400px',
      boxSizing: 'border-box'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #333333',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem'
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '5rem 0',
      width: '100%',
      minHeight: '400px',
      boxSizing: 'border-box'
    },
    errorBox: {
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '8px',
      padding: '2rem',
      textAlign: 'center',
      maxWidth: '500px',
      color: '#c33',
      width: '100%'
    },
    retryButton: {
      marginTop: '1rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#c33',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    newsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '2rem',
      width: '100%',
      boxSizing: 'border-box',
      padding: 0
    },
    articleCard: {
      backgroundColor: 'white',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.3s',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    },
    articleImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      transition: 'transform 0.3s'
    },
    articleContent: {
      padding: '1.5rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    },
    articleMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.9rem',
      color: '#666666',
      marginBottom: '1rem'
    },
    articleSource: {
      fontWeight: '600'
    },
    articleDate: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem'
    },
    articleTitle: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      lineHeight: '1.4',
      transition: 'color 0.3s',
      margin: '0 0 1rem 0'
    },
    articleDescription: {
      color: '#555555',
      marginBottom: '1rem',
      lineHeight: '1.6'
    },
    articleAuthor: {
      fontSize: '0.9rem',
      color: '#666666',
      marginBottom: '1rem',
      fontStyle: 'italic'
    },
    readMoreButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#000000',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: '500',
      transition: 'background-color 0.3s',
      marginTop: 'auto'
    },
    footer: {
      backgroundColor: '#000000',
      color: 'white',
      textAlign: 'center',
      padding: '2rem 1rem',
      marginTop: 'auto',
      width: '100%'
    },
    footerTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      margin: '0 0 1rem 0'
    },
    footerText: {
      color: '#cccccc',
      marginBottom: '1rem'
    },
    footerSmall: {
      fontSize: '0.9rem',
      color: '#888888'
    },
    noResults: {
      textAlign: 'center',
      padding: '5rem 0',
      width: '100%',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      gridColumn: '1 / -1'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <h1 style={styles.title}>NewsHub</h1>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for news..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              style={{
                ...styles.searchInput,
                ':focus': { borderColor: '#666666' }
              }}
            />
            <button
              onClick={handleSearch}
              style={styles.searchButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#555555'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#333333'}
            >
              🔍
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <span style={{ fontSize: '1.2rem' }}>Loading news...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={styles.errorContainer}>
            <div style={styles.errorBox}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️ Error Loading News</h3>
              <p>{error}</p>
              <button
                onClick={() => fetchNews()}
                style={styles.retryButton}
                onMouseOver={(e) => e.target.style.backgroundColor = '#a22'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#c33'}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* News Articles */}
        {!loading && !error && (
          <div style={styles.newsGrid}>
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <article
                  key={index}
                  style={styles.articleCard}
                  className="article-card"
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Article Image */}
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      style={styles.articleImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}

                  {/* Article Content */}
                  <div style={styles.articleContent}>
                    {/* Source and Date */}
                    <div style={styles.articleMeta}>
                      <span style={styles.articleSource}>{article.source?.name}</span>
                      <div style={styles.articleDate}>
                        <span>📅</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 style={styles.articleTitle}>
                      {truncateText(article.title, 100)}
                    </h2>

                    {/* Description */}
                    {article.description && (
                      <p style={styles.articleDescription}>
                        {truncateText(article.description, 150)}
                      </p>
                    )}

                    {/* Author */}
                    {article.author && (
                      <p style={styles.articleAuthor}>
                        By {article.author}
                      </p>
                    )}

                    {/* Read More Button */}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.readMoreButton}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#333333'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#000000'}
                    >
                      Read Full Article
                      <span>🔗</span>
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div style={styles.noResults}>
                <h3 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>No Articles Found</h3>
                <p style={{ color: '#666666' }}>Try adjusting your search.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.headerContainer}>
          <h3 style={styles.footerTitle}>NewsHub</h3>
          <p style={styles.footerText}>
            Stay informed with the latest news from around the world
          </p>
          <p style={styles.footerSmall}>
            Powered by NewsAPI.org
          </p>
        </div>
      </footer>

      {/* CSS Animation for Spinner */}
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 1200px) {
            .news-grid {
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
              gap: 1.5rem !important;
            }
          }
          
          @media (max-width: 768px) {
            .news-grid {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
            }
            
            .header-container {
              padding: 1rem !important;
            }
            
            .search-container {
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            
            .search-input {
              border-radius: 8px !important;
              border: 2px solid #ccc !important;
            }
            
            .search-button {
              border-radius: 8px !important;
            }
          }
          
          @media (max-width: 480px) {
            .title {
              font-size: 2rem !important;
            }
            
            .main {
              padding: 1rem 0.5rem !important;
            }
            
            .article-card {
              margin: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default NewsWebsite;