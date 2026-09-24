import { ClubDetailPage } from "@/components/clubDetails"

export default function ClubPage({ params }: { params: { id: string } }) {
  return <ClubDetailPage clubId={params.id} />
}
