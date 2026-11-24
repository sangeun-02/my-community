import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login-page';
import PostDetailPage from './pages/post-detail-page';
import PostListPage from './pages/post-list-page';
import PostWritePage from './pages/post-write-page';

/**
 * 앱 라우팅 (GitHub Pages 호환을 위해 main.jsx 에서 HashRouter 사용)
 *
 * Example usage:
 * <App />
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={ <PostListPage /> } />
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="/post/:id" element={ <PostDetailPage /> } />
      <Route path="/write" element={ <PostWritePage /> } />
      <Route path="/write/:id" element={ <PostWritePage /> } />
      <Route path="*" element={ <Navigate to="/" replace /> } />
    </Routes>
  );
}

export default App;
