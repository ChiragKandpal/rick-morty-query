// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { fetchCharacterById } from "./api";
import { useParams, Link } from "@tanstack/react-router";

export default function CharacterDetail() {
  const { id } = useParams({ from: '/rick-morty-query/character/$id' });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["character", id],
    queryFn: () => fetchCharacterById(Number(id)),
  });

  if (isLoading) return <div>Loading character details...</div>;
  if (isError || !data) return <div>Error loading character.</div>;

  return (
    <div>
      <Link to="/rick-morty-query/character">&larr; Back to List</Link>
      <h2>{data.name}</h2>
      <img src={data.image} alt={data.name} width={200} />
      <p>Status: {data.status}</p>
      <p>Species: {data.species}</p>
      <p>Gender: {data.gender}</p>
      <p>Origin: {data.origin.name}</p>
      <p>Last Known Location: {data.location.name}</p>
    </div>
  );
}
