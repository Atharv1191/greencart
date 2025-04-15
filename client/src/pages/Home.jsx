import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BotttomBanner from '../components/BotttomBanner'
import NewsLetter from '../components/NewsLetter'
const Home = () => {
  return (
    <div className='mt-10'>
        <MainBanner/>
        <Categories/>
        <BestSeller/>
        <BotttomBanner/>
        <NewsLetter/>

    </div>
  ) 
}

export default Home