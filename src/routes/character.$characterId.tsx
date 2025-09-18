import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchCharacterById } from '../api';
import type { Character } from '../types';

export const Route = createFileRoute('/character/$characterId')({
    component: CharacterDetailComponent,
});

function CharacterDetailComponent() {
    const { characterId } = Route.useParams();

    interface queryType {
        data: Character | undefined;
        isLoading: boolean;
        isError: boolean
    }

    const { data, isLoading, isError }: queryType = useQuery({
        queryKey: ['character', characterId],
        queryFn: () => fetchCharacterById(Number(characterId)),
    });

    if (isLoading) return <div>Loading character details...</div>;
    if (isError) return <div>Error loading character.</div>;

    return (
        <div>
            <Link to="/">&larr; Back to List</Link>
            <h1>{data?.name}</h1>
            <img src={data?.image} alt={data?.name} style={{ borderRadius: '8px' }} />
            <p><strong>Status:</strong> {data?.status}</p>
            <p><strong>Species:</strong> {data?.species}</p>
            <p><strong>Gender:</strong> {data?.gender}</p>
            <p><strong>Origin:</strong> {data?.origin.name}</p>
            <p><strong>Last Known Location:</strong> {data?.location.name}</p>
        </div>
    );
}
