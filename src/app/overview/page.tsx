'use client'
import { Link } from '@chakra-ui/next-js'
import MyApp from '@/components/MyApp';
import OverviewPage from '@/components/OverviewPage';

export default function Page() {
  return (
    // eslint-disable-next-line react/no-children-prop
    <MyApp>
      <OverviewPage />
    </MyApp>
  )
}
