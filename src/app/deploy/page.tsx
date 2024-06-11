'use client'
import { Link } from '@chakra-ui/next-js'
import NavBar from "@/components/Navbar";
import MyApp from '@/components/MyApp';
import DeployPage from '@/components/DeployPage';

export default function Page() {
  return (
    <MyApp>
      <DeployPage />
    </MyApp>
  )
}
