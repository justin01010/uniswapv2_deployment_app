'use client'
import { Link } from '@chakra-ui/next-js'
import MyApp from '@/components/MyApp';
import InteractPage from '@/components/InteractPage';

export default function Page() {
  return (
    <MyApp>
      <InteractPage />
    </MyApp>
  )
}
