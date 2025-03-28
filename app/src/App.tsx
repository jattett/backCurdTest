import { useState, useEffect } from 'react';
import './App.css';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchPosts, setIsSearchPosts] = useState('');
  const [isSortOrder, setIsSortOrder] = useState<'asc' | 'desc'>('asc');

  const [editId, setEditId] = useState<number | null>(null);
  const [edittitle, setEditTitle] = useState('');
  const [editcontent, setEditContent] = useState('');
  const [editauthor, setEditAuthor] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error, '에러 발생했습니다');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const addPost = async () => {
    if (!title || !content || !author) {
      alert('모든 입력을 작성해주세요!');
      return;
    }

    const newPost = {
      title,
      content,
      author,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) throw new Error('POST 실패');

      const saved = await response.json();
      setPosts([...posts, saved]);
      setTitle('');
      setContent('');
      setAuthor('');
    } catch (err) {
      console.error('글 추가 실패:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('삭제 실패');

      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const handleEditClick = (post: Post) => {
    setEditId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditAuthor(post.author);
  };

  const handleUpdate = async () => {
    if (!edittitle || !editcontent || !editauthor || editId === null) return;

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: edittitle,
          content: editcontent,
          author: editauthor,
        }),
      });

      if (!response.ok) throw new Error('수정 실패');

      const updated = await response.json();
      setPosts(posts.map((post) => (post.id === editId ? updated : post)));

      // 초기화
      setEditId(null);
      setEditTitle('');
      setEditContent('');
      setEditAuthor('');
    } catch (err) {
      console.error('수정 실패:', err);
    }
  };

  const filteredPosts = [...posts]
    .filter((post) => post.title.includes(isSearchPosts))
    .sort((a, b) => (isSortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));

  if (isLoading) return <p>로딩중...</p>;

  return (
    <div className="App">
      <h1>게시물 리스트</h1>

      <div>
        <h2>검색</h2>
        <input
          type="text"
          placeholder="검색어 입력"
          value={isSearchPosts}
          onChange={(e) => setIsSearchPosts(e.target.value)}
        />
      </div>

      <button onClick={() => setIsSortOrder(isSortOrder === 'asc' ? 'desc' : 'asc')}>
        {isSortOrder === 'asc' ? '내림차순' : '오름차순'}
      </button>

      <div>
        <h2>게시물 추가</h2>
        <input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} />
        <input placeholder="작성자" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <button onClick={addPost}>추가</button>
      </div>

      <ul>
        {filteredPosts.map((post, index) => (
          <li key={post.id}>
            {editId === post.id ? (
              <div>
                <input value={edittitle} onChange={(e) => setEditTitle(e.target.value)} />
                <input value={editcontent} onChange={(e) => setEditContent(e.target.value)} />
                <input value={editauthor} onChange={(e) => setEditAuthor(e.target.value)} />
                <button onClick={handleUpdate}>저장</button>
                <button onClick={() => setEditId(null)}>취소</button>
              </div>
            ) : (
              <div>
                <strong>
                  {index + 1}. {post.title}
                </strong>{' '}
                - {post.author}
                <p>{post.content}</p>
                <button onClick={() => handleDelete(post.id)}>삭제</button>
                <button onClick={() => handleEditClick(post)}>수정</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
