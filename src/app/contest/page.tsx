import { Footer } from '@/components/footer-section'
import Navbar from '@/components/navbar'


export default function ContestPage() {

    
  return (
    <div>
        <Navbar ></Navbar>
        <div className='h-100 min-w-96'>
            <h1 className='text-5xl font-bold pt-7 pl-4 '>Developer Contests</h1>
            <h3 className='pt-3 pl-4 text-blue-50 text-muted-foreground'>Compete in real-world development challenges. Build auth systems, automate <br /> bots, design APIs, and master backend engineering.</h3>

  <div className='flex items-center justify-between pr-43 pl-27 '>
  <div className='w-60 h-30 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'> Live Now</div>
 <div className='w-60 h-30 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'> Upcommig </div>
 <div className='w-60 h-30 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'>Completed</div>
 <div className='w-60 h-30 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'>Total</div>
        </div>

        </div>
        <div className='flex items-center' >
            <div className='h-98 w-80 bg-blue-800 ml-5 '> </div>
            <div className='flex items-center justify-center overflow-x-hidden overflow-y-auto grid grid-cols-3 gap-4 mr-7 mb-20'>
 <div className='w-80 h-70 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'> hello World</div>
  <div className='w-80 h-70 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'> hello World</div>
   <div className='w-80 h-70 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'> hello World</div>
    <div className='w-80 h-70 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'> hello World</div>
  <div className='w-80 h-70 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'> hello World</div>
   <div className='w-80 h-70 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'> hello World</div>
            </div>
           
              

        </div>
      

      
          
        <Footer></Footer>
    </div>
  )
}