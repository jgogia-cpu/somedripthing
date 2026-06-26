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

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail is the user's current address (HookData.OldEmail). For the
  // NEW-recipient half of a secure email_change fanout, `email` equals the
  // recipient (NEW), so the "from" line must render oldEmail to read
  // "from OLD to NEW" instead of "from NEW to NEW".
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={wordmark}>DRIPWAY</Text>
        <Heading style={h1}>Confirm your new email</Heading>
        <Text style={text}>
          You asked to change your DRIPWAY email from{' '}
          <Link href={`mailto:${oldEmail}`} style={link}>{oldEmail}</Link>{' '}
          to{' '}
          <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm change
        </Button>
        <Text style={footer}>
          Didn't request this? Secure your account immediately.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '520px' }
const wordmark = { fontSize: '13px', fontWeight: 700 as const, letterSpacing: '0.3em', color: '#C8A96E', textTransform: 'uppercase' as const, margin: '0 0 28px' }
const h1 = { fontSize: '26px', fontWeight: 700 as const, color: '#0F0F0F', lineHeight: '1.25', margin: '0 0 18px' }
const text = { fontSize: '15px', color: '#55575d', lineHeight: '1.6', margin: '0 0 26px' }
const link = { color: '#C8A96E', textDecoration: 'underline' }
const button = { backgroundColor: '#C8A96E', color: '#0F0F0F', fontSize: '14px', fontWeight: 600 as const, letterSpacing: '0.05em', borderRadius: '12px', padding: '14px 24px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#999999', margin: '36px 0 0', lineHeight: '1.5' }
