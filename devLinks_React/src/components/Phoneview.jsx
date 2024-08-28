const Phoneview=()=>{
    return(
       <>
         <div className="p-8  relative mx-auto 
             rounded flex flex-col jusify-center iteams-center">              
                <div className="border  mobile-height w-60 rounded-3xl p-3 left-16">
                    <div className=" flex flex-col border rounded-3xl h-full w-full">
                       
                        <div className=" w-20 h-20 rounded-full  mx-auto mt-4 bg-gray-100" 
                        ></div>
                        <div className="mt-2 h-3  w-2/3 rounded-md mx-auto bg-gray-100"></div>
                        <div className="mt-2 h-3  w-1/3 rounded-md mx-auto bg-gray-100"></div>

                        <div className=" mt-10 bg-black flex iteams-center justify-arround w-3/4 mx-auto rounded-md h-8">
                           
                            <i class="fa-brands fa-github my-auto ml-1 text-white"></i>
                            <p  className="text-white mx-2 my-auto"> Github</p>
                        </div>
                        <div className=" mt-3 bg-blue-800 flex w-3/4 mx-auto rounded-md h-8">
                            <i class="fa-brands fa-linkedin my-auto ml-1 text-white"></i>
                            <p  className="text-white mx-2 my-auto"> linkedIn</p>
                        </div>
                        <div className=" mt-3 bg-red-600 flex w-3/4 mx-auto rounded-md h-8">
                            <i className="fa-brands fa-youtube my-auto ml-1 text-white"></i>
                            <p  className="text-white mx-2 my-auto"> Youtube</p>
                        </div>
                        <div className=" mt-3 bg-gray-100 flex w-3/4 mx-auto rounded-md h-8"></div>
                        <div className=" mt-3 bg-gray-100 flex w-3/4 mx-auto rounded-md h-8"></div>


                    </div>
                </div>             
            </div>
        </>
    )
}
export default Phoneview