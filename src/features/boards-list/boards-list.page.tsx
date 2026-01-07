import { rqClient } from '@/shared/api/instance';

function BoardsListPage() {
  const data = rqClient.useQuery('get', '/boards');

  if (data.isLoading) { 
    return <div>Loading...</div>;
  }

  if (data.isError) {
    return <div>Error: {data.error.message}</div>;
  }

  return (
    <div>
      <h1>Board page</h1>
      <ul>
        {data.data?.map(board => (
          <li key={board.id}>{board.name}</li>
        ))}
      </ul>
    </div>
  );
}

export const Component = BoardsListPage;
