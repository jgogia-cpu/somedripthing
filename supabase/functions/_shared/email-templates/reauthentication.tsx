/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={wordmark}>DRIPWAY</Text>
        <Heading style={h1}>Confirm it's you</Heading>
        <Text style={text}>Enter the code below to verify your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code expires shortly. If you didn't request it, safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '520px' }
const wordmark = { fontSize: '13px', fontWeight: 700 as const, letterSpacing: '0.3em', color: '#C8A96E', textTransform: 'uppercase' as const, margin: '0 0 28px' }
const h1 = { fontSize: '26px', fontWeight: 700 as const, color: '#0F0F0F', lineHeight: '1.25', margin: '0 0 18px' }
const text = { fontSize: '15px', color: '#55575d', lineHeight: '1.6', margin: '0 0 22px' }
const codeStyle = {
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '28px',
  fontWeight: 700 as const,
  letterSpacing: '0.4em',
  color: '#0F0F0F',
  backgroundColor: '#F6F1E7',
  padding: '16px 20px',
  borderRadius: '12px',
  margin: '0 0 30px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '36px 0 0', lineHeight: '1.5' }
