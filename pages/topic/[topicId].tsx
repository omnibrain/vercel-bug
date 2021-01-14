import { GetServerSidePropsContext } from 'next'

export async function getServerSideProps({}: GetServerSidePropsContext<{
  topicId: string
}>) {
  return {
    props: {},
  }
}

export default function Topic() {
  return <div>Hello</div>
}
