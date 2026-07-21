/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

export interface HeatCheckPick {
  name: string
  brandName: string
  price: string
  image: string
  url: string
}

interface Props {
  weekLabel?: string
  picks?: HeatCheckPick[]
}

const SAMPLE: HeatCheckPick[] = [
  {
    name: 'Sample Hoodie',
    brandName: 'Sample Brand',
    price: '$120',
    image: 'https://placehold.co/300x360',
    url: 'https://thedripway.com/collections',
  },
]

const HeatCheckEmail = ({
  weekLabel = 'This week',
  picks = SAMPLE,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>The Monday Heat Check — {picks.length} drops we're co-signing this week.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={wordmark}>DRIPWAY</Text>
        <Text style={eyebrow}>Heat Check · {weekLabel}</Text>
        <Heading style={h1}>The Monday Edit.</Heading>
        <Text style={intro}>
          Fresh drops from independent labels we're watching this week. One click, no algorithm.
        </Text>

        <Section style={{ marginTop: '28px' }}>
          {picks.map((p, i) => (
            <Row key={i} style={{ marginBottom: '18px' }}>
              <Column style={{ width: '108px', verticalAlign: 'top' }}>
                <Link href={p.url}>
                  <Img src={p.image} alt={p.name} width="96" height="120" style={img} />
                </Link>
              </Column>
              <Column style={{ verticalAlign: 'top', paddingLeft: '12px' }}>
                <Text style={brandLine}>{p.brandName}</Text>
                <Link href={p.url} style={productLink}>{p.name}</Link>
                <Text style={priceLine}>{p.price}</Text>
              </Column>
            </Row>
          ))}
        </Section>

        <Button style={button} href="https://thedripway.com/collections">
          See the full Heat Check
        </Button>

        <Hr style={hr} />
        <Text style={footer}>
          You're getting this because you joined the DRIPWAY newsletter.
          Curated weekly. No spam, ever.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: HeatCheckEmail,
  subject: 'The Monday Heat Check 🔥',
  displayName: 'Weekly Heat Check',
  previewData: { weekLabel: 'Week of Nov 3', picks: SAMPLE },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const wordmark = { fontSize: '13px', fontWeight: 700 as const, letterSpacing: '0.3em', color: '#C8A96E', textTransform: 'uppercase' as const, margin: '0 0 24px' }
const eyebrow = { fontSize: '11px', fontWeight: 700 as const, letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase' as const, margin: '0 0 8px' }
const h1 = { fontSize: '28px', fontWeight: 700 as const, color: '#0F0F0F', lineHeight: '1.2', margin: '0 0 12px' }
const intro = { fontSize: '15px', color: '#55575d', lineHeight: '1.6', margin: '0' }
const img = { display: 'block', borderRadius: '8px', objectFit: 'cover' as const, border: '1px solid #eee' }
const brandLine = { fontSize: '11px', fontWeight: 700 as const, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#C8A96E', margin: '0 0 4px' }
const productLink = { fontSize: '15px', fontWeight: 600 as const, color: '#0F0F0F', textDecoration: 'none', display: 'block', margin: '0 0 4px' }
const priceLine = { fontSize: '14px', color: '#55575d', margin: '0' }
const button = { backgroundColor: '#C8A96E', color: '#0F0F0F', fontSize: '14px', fontWeight: 600 as const, letterSpacing: '0.05em', borderRadius: '12px', padding: '14px 24px', textDecoration: 'none', marginTop: '20px' }
const hr = { borderColor: '#eee', margin: '36px 0 16px' }
const footer = { fontSize: '12px', color: '#999', margin: '0', lineHeight: '1.5' }