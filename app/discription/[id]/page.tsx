'use client'
import { useEffect, useState } from "react";
// import jobs from "../../../public/jobs.json";
import { CheckCircleIcon, MapIcon } from "@heroicons/react/solid";
import { FaCalendarCheck, FaFire } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RxPlusCircled } from "react-icons/rx";
import { FaRegCalendarMinus } from "react-icons/fa6";
import { Job } from "@/types/jobs";


interface Prop {
  params: {
    id: string;
  };
}
// const page = ({ params: { id } }: Prop) => {
//   const job = jobs.job_postings[+id];

const InnerHome = ({params: {id}} : Prop) => {
  const [job, setJobs] = useState<Job | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const[error, setError] = useState<string | null>(null)

  useEffect (() => {
    const fetchDetailData = async() => {
      try{
        const res = await fetch(`https://akil-backend.onrender.com/opportunities/${id}`);
        if (!res.ok){
          const errorText = await res.text();
          console.error('Error response:', errorText);
          setError("An error occurred while fetching the job details.");
          throw new Error ("Network response was not ok");
        }
        const data = await res.json();
        console.log(data.data)
        if (data && data.data){

          data.data.responsibilities = data.data.responsibilities.split('\n');
          setJobs(data.data);
          console.log(data.data)
        }
        else{
          setError("An error occurred while fetching the job details.");
          throw new Error("Network response was not ok");
        }
      }
      catch(error){
        console.log(error);
        setError("Failed to fetch");
      }
      finally{
        setLoading(false);
      }
    };
 
  fetchDetailData();
  }, [id]);

  if (loading) {
    return <p>loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!job) {
    return <p>No job data available</p>
  }

  return (
    <div className="flex flex-row my-3 container mx-auto p-4 border-b border-grey-200">
      <div>
        <div className="text-xl font-bold mb-3">Description</div>
        <p className="text-gray-700 mt-3">{job.description}</p>
        <div className="my-3 pborder-b border-gray-200">
          <h1 className="text-xl font-bold">Resposibilities</h1>
          <ul className=" mt-3">
            {job.responsibilities.map((item, index) => (
              <li key={index} className="text-gray-700 flex mb-2">
                <CheckCircleIcon className="h-6 w-6 border-green-700 text-green-500 mr-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h1 className="text-xl font-bold">Ideal candidate we want</h1>
          <p>{job.idealCandidate}</p>
        </div>
        
        <h1 className="text-xl font-bold my-3">When & where</h1>
        <div className=" flex items-center ">
          <HiOutlineLocationMarker className="h-6 w-6 text-blue-500 mr-2" />
          <p>{job.whenAndWhere}</p>
        </div>
      </div>
      <div className="md:w-1/3 md:ml-4 border-b border-grey-200 grid-cols-2  ">
        <h3 className="text-xl font-bold">About</h3>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <RxPlusCircled className="h-6 w-6 text-blue-500 mr-2"/>
            <div>
              <h1 className="ml-auto text-grey-700">Posted on</h1>
              <p className="text-gray-700 font-bold">{job.datePosted}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaFire className="h-6 w-6 text-blue-500 mr-2"/>
            <div>
              <p className="text-gray-700">Dead Line</p>
              <p className="text-gray-700 font-bold">{job.deadline}</p>
            </div>
          </div>
          <div className="flex items-center">
            <HiOutlineLocationMarker className="h-6 w-6 text-blue-500 mr-2" />   
            <div>
              <p className="text-gray-700">Location</p>
              <p className="text-gray-700 font-bold">{job.location}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaRegCalendarMinus className="h-6 w-6 text-blue-500 mr-2" />
            <div>
              <h1 className="text-gray-700">Start Date</h1>
              <p className="text-gray-700 font-bold">{job.startDate}</p>
            </div>
          </div>
          <div className="flex items-center" >
            <FaCalendarCheck className="h-6 w-6 text-blue-500 mr-2" />
            <div>
              <h1 className="text-gray-700">End Date</h1>
              <p className="text-gray-700 font-bold">{job.endDate}</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t m-3">
          <h1 className="text-xl font-bold">Categories</h1>
          {job.categories.map((categ, index) => (
            <span key={index} className="mr-3 text-yellow-500 bg-yellow-200 rounded-full">
              {categ}
            </span>
          ))}
        </div>

        <div className="my-4 border-t">
          <h2 className="text-xl font-bold">Required Skills</h2>

          {job.requiredSkills.map((skill, index) => (
            <span key={index} className="my-5 mr-3 text-[#1010d3] bg-blue-400 rounded-md">
              {skill}

            </span>

          ))}
        </div>
      </div>
    </div>
  );
};

export default InnerHome;
