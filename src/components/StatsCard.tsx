import {
    Box,
    chakra,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
		Link,
  } from '@chakra-ui/react';
  
  interface StatsCardProps {
    title?: string | React.ReactNode;
    stat: string;
		name?: string;
		symbol?: string;
		link?: string;
  }
  export default function StatsCard(props: StatsCardProps) {
    const { title, stat, name, symbol, link } = props;
    return (
      <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <StatLabel fontWeight={'medium'} isTruncated>
					{name && symbol && link &&
						<Box>
							<Link href={link} 
								isExternal 
								color="teal.500"
                textDecoration="underline"
                _hover={{ textDecoration: 'none', color: 'teal.700' }}>
							{`${name} (${symbol}) `}
						</Link>
					Amount
					</Box>}
					{title}
				</StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
          {stat}
        </StatNumber>
      </Stat>
    );
  }
  