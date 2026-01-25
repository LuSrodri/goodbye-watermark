import { Metadata } from 'next'
import HistoryClient from './HistoryClient'

export const metadata: Metadata = {
  title: 'Your History',
  description: 'View all your processed images with watermarks removed.',
  robots: {
    index: false,
    follow: false
  }
}

export default function HistoryPage() {
  return <HistoryClient />
}
