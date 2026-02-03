import { draftMode } from 'wabix/headers'

export async function generateMetadata(props: any) {
  const params = await props.params
  await getMostRecentChangelog(params.slug, draftMode().isEnabled)
}
