import  HeroSection  from '@/components/HeroSection'
import Header from '@/components/Header'
import Image from 'next/image'
import SelectDemo from '@/components/SelectDemo'
import  Card  from '@/components/Card'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="bg-[#1A1A1A]">
      {/* <Header /> */}
      <HeroSection/>
      <Card/>
      {/* <Footer/> */}
    </div>
  )
}
