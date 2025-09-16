// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Routes wrappers
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

// Page imports
import LandingPage from './pages/LandingPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardPage from './pages/DashboardPage';
import FoldersPage from './pages/FoldersPage';
import FolderDetailPage from './pages/FolderDetailPage';
import CreateConceptPage from './pages/CreateConceptPage';
import ConceptDetailPage from './pages/ConceptDetailPage';
import EditConceptPage from './pages/EditConceptPage';
import QuizPage from './pages/QuizPage';
import QuizResultsPage from './pages/QuizResultsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            {/* Toast Container */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#374151',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginForm />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterForm />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/folders"
                element={
                  <ProtectedRoute>
                    <FoldersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/folder/:folderId"
                element={
                  <ProtectedRoute>
                    <FolderDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/folder/:folderId/create-concept"
                element={
                  <ProtectedRoute>
                    <CreateConceptPage />
                  </ProtectedRoute>
                }
              />

              {/* Concept Routes */}
              <Route
                path="/concept/:conceptId"
                element={
                  <ProtectedRoute>
                    <ConceptDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/concept/:conceptId/edit"
                element={
                  <ProtectedRoute>
                    <EditConceptPage />
                  </ProtectedRoute>
                }
              />

              {/* Quiz Routes */}
              <Route
                path="/folder/:folderId/quiz"
                element={
                  <ProtectedRoute>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:folderId/results"
                element={
                  <ProtectedRoute>
                    <QuizResultsPage />
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;