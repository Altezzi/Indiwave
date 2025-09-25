import { getSeriesFromDatabase } from '../../lib/database';

export default async function TestDatabasePage() {
  const series = await getSeriesFromDatabase();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Database Test - Series from Database</h1>
      <p>Found {series.length} series in the database:</p>
      
      {series.length === 0 ? (
        <p style={{ color: 'red' }}>No series found in database!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {series.map((s) => (
            <div key={s.id} style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h3>{s.title}</h3>
              <p><strong>Author:</strong> {s.author}</p>
              <p><strong>Year:</strong> {s.year}</p>
              <p><strong>Status:</strong> {s.status}</p>
              <p><strong>Chapters:</strong> {s.totalChapters}</p>
              <p><strong>Description:</strong> {s.description}</p>
              <p><strong>Tags:</strong> {s.tags.join(', ')}</p>
              <p><strong>Created:</strong> {new Date(s.createdAt).toLocaleDateString()}</p>
              
              {s.chapters && s.chapters.length > 0 && (
                <div>
                  <h4>Chapters:</h4>
                  <ul>
                    {s.chapters.slice(0, 3).map((chapter: any) => (
                      <li key={chapter.id}>
                        Chapter {chapter.chapterNumber}: {chapter.title}
                      </li>
                    ))}
                    {s.chapters.length > 3 && <li>... and {s.chapters.length - 3} more</li>}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
