'use client'
import { useEffect, useState } from "react";
import Card from "./components/Card";
import jobs from "../public/jobs.json";
import Link from "next/link";
import { finished } from "stream";
import {Job} from '@/types/jobs';

interface typeName {
  job: Job[];
}

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async() => {
      try{
        const res = await fetch("https://akil-backend.onrender.com/opportunities/search");
        if (!res.ok){
          throw new Error("The network is not ok")
        } 
        const data = await res.json();
        setJobs(data.data);
      }
      catch(error){
        setError("Failed to fatch jobs");
      }
      finally{
        setLoading(false);
      }
    
    }
    fetchJobs();
  },[])

  if (loading) {
    return <p>loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div className="px-28">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="m-3 text-xl font-bold">Opportunities</h1>
          <p className="m-3">Showing 73 results</p>
        </div>
        <div>
          <select>
            <option>
              Sort by: Most relevent
            </option>
            <option>
              Sort by: Size
            </option>
          </select>
        </div>
      </div>
      <div>
        {jobs.map((job, index) => (
          <Link href={`/discription/${index}`}>
            <Card
              key={index}
              jobTitle={job.title}
              orgName={job.orgName}
              jobDescription={job.description}
              imageUrl={job.logoUrl}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
