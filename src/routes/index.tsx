// src/routes/index.tsx
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { fetchCharacters } from '../api';
import type { ApiResponse, Character } from '../types';
import { z } from 'zod';

// Zod schema for validating search params
const characterSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute('/')({
  validateSearch: characterSearchSchema,
  component: CharacterListComponent,
});

function CharacterListComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page } = Route.useSearch();
  const queryClient = useQueryClient();

  interface queryResp {
    data: any;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean
  }

  const { data, isLoading, isError, isFetching }: queryResp = useQuery({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
  });

  const columnHelper = createColumnHelper<Character>();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <Link to="/character/$characterId" params={{ characterId: String(info.row.original.id) }}>
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('status', { header: 'Status' }),
    columnHelper.accessor('species', { header: 'Species' }),
  ];

  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const handlePagination = (newPage: number) => {
    navigate({ search: { page: newPage } });
  };
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['characters', page] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Rick & Morty Characters</h1>
      <button onClick={handleRefresh} disabled={isFetching}>
        {isFetching ? 'Refreshing...' : 'Refresh Current Page'}
      </button>

      <table style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ textAlign: 'left', padding: '8px' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ padding: '8px', borderTop: '1px solid #ddd' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <span>
          Page{' '}
          <strong>
            {page} of {data?.info.pages}
          </strong>
        </span>
        <button onClick={() => handlePagination(page - 1)} disabled={!data?.info.prev}>
          Previous
        </button>
        <button onClick={() => handlePagination(page + 1)} disabled={!data?.info.next}>
          Next
        </button>
      </div>
    </div>
  );
}
