const SearchBar = ({ query, setQuery }) => {
  return (
    <div className='search-container'>
        
        <input
            type='text'
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                boxSizing: 'border-box',
                borderRadius: '20px',
                border: '1px solid var(--input-border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-primary)',
                outline: 'none'
            }}
        />
        
    </div>
  )
}

export default SearchBar