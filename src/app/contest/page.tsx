import Navbar from '@/components/navbar'


export default function ContestPage() {
  return (
    <div>
        <Navbar></Navbar>
        <div className='h-100 min-w-96'>
            <h1 className='text-5xl font-bold pt-7 pl-4 '>Developer Contests</h1>
            <h3 className='pt-3 pl-4 text-blue-50'>Compete in real-world development challenges. Build auth systems, automate <br /> bots, design APIs, and master backend engineering.</h3>

  <div className='flex items-center justify-between pr-43 pl-27 '>
  <div className='w-60 h-30 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'> Live Now</div>
 <div className='w-60 h-30 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'> Upcommig </div>
 <div className='w-60 h-30 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'>Completed</div>
 <div className='w-60 h-30 rounded-lg border border-r-2 bg-blue-500 mt-20 ml-20 gap-2'>Total</div>
        </div>
        </div>

      
          
        
    </div>
  )
}
