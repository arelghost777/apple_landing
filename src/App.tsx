import React from 'react'
import NavBar from './components/NavBar'
import Hero from './components/Hero'
import ProductViewer from './components/ProductViewer'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Features from './components/Features'
import Performance from './components/Performance'

gsap.registerPlugin(ScrollTrigger)

const App = () => {
  return (
    <main>
        <NavBar/>
        <Hero/>
        <ProductViewer />
        <Performance />
        <Features />
    </main>
  )
}

export default App