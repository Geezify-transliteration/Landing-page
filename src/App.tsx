import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "@/pages/HomePage";
import ParagraphTransliteratorPage from "@/pages/ParagraphTransliteratorPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/paragraph-transliterator" element={<ParagraphTransliteratorPage />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
