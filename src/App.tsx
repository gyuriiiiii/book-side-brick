// src/App.tsx
import { BookSlideshow } from './components/BookSlideshow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '5760px', height: '1080px', overflow: 'hidden' }}>
        <BookSlideshow />
      </div>

      {/* 개발용 devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
