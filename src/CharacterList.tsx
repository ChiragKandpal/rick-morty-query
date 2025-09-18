// @ts-nocheck
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { fetchCharacters } from "./api";
import { Character } from "./types";

export default function CharacterList() {
  const searchParams = new URLSearchParams(window.location.search);
  const page = parseInt(searchParams.get("page") || "1", 10);

  const queryClient = useQueryClient();
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["characters", page],
    queryFn: () => fetchCharacters(page),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Rick & Morty Characters</h1>
      <button
        onClick={() => queryClient.invalidateQueries({ queryKey: ["characters", page] })}
        disabled={isFetching}
      >
        {isFetching ? "Refreshing..." : "Refresh Current Page"}
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Species</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((character: Character) => (
            <tr key={character.id}>
              <td>
                <Link to={`/rick-morty-query/character/${character.id}`}>{character.name}</Link>
              </td>
              <td>{character.status}</td>
              <td>{character.species}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => (window.location.search = `?page=${page - 1}`)}
          disabled={!data.info.prev}
        >
          Previous
        </button>
        <span style={{ margin: "0 12px" }}>
          Page {page} of {data.info.pages}
        </span>
        <button
          onClick={() => (window.location.search = `?page=${page + 1}`)}
          disabled={!data.info.next}
        >
          Next
        </button>
      </div>
    </div>
  );
}
