/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your password for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={wordmark}>DRIPWAY</Text>
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We got a request to reset your DRIPWAY password. Tap below to choose a new one.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Reset password
        </Button>
        <Text style={footer}>
          Didn't ask for this? Ignore this email — your password stays unchanged.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '520px' }
const wordmark = { fontSize: '13px', fontWeight: 700 as const, letterSpacing: '0.3em', color: '#C8A96E', textTransform: 'uppercase' as const, margin: '0 0 28px' }
const h1 = { fontSize: '26px', fontWeight: 700 as const, color: '#0F0F0F', lineHeight: '1.25', margin: '0 0 18px' }
const text = { fontSize: '15px', color: '#55575d', lineHeight: '1.6', margin: '0 0 26px' }
const button = { backgroundColor: '#C8A96E', color: '#0F0F0F', fontSize: '14px', fontWeight: 600 as const, letterSpacing: '0.05em', borderRadius: '12px', padding: '14px 24px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#999999', margin: '36px 0 0', lineHeight: '1.5' }
