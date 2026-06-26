/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to join {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={wordmark}>DRIPWAY</Text>
        <Heading style={h1}>You're invited to DRIPWAY</Heading>
        <Text style={text}>
          Join{' '}
          <Link href={siteUrl} style={link}><strong>DRIPWAY</strong></Link>{' '}
          — the discovery engine for the brands Instagram won't show you. Accept below to set up your account.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accept invite
        </Button>
        <Text style={footer}>
          Not expecting this? You can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '520px' }
const wordmark = { fontSize: '13px', fontWeight: 700 as const, letterSpacing: '0.3em', color: '#C8A96E', textTransform: 'uppercase' as const, margin: '0 0 28px' }
const h1 = { fontSize: '26px', fontWeight: 700 as const, color: '#0F0F0F', lineHeight: '1.25', margin: '0 0 18px' }
const text = { fontSize: '15px', color: '#55575d', lineHeight: '1.6', margin: '0 0 26px' }
const link = { color: '#C8A96E', textDecoration: 'underline' }
const button = { backgroundColor: '#C8A96E', color: '#0F0F0F', fontSize: '14px', fontWeight: 600 as const, letterSpacing: '0.05em', borderRadius: '12px', padding: '14px 24px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#999999', margin: '36px 0 0', lineHeight: '1.5' }
