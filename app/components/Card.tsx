interface JobCardProps {
  jobTitle: string;
  orgName: string;
  jobDescription: string;
  imageUrl: string;
}

const jobCard = ({
  jobTitle,
  orgName,
  jobDescription,
  imageUrl,
}: JobCardProps) => {
  return (
  
    <div className="border border-grey-200 m-4 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex flex-row">

      <img src={imageUrl} alt={jobTitle} className="mt-5 w-11 h-11 object-cover"/>
      <div className="p-4">
        <h2 className="text-xl font-bold">{jobTitle}</h2>
        <p className="text-grey-5 mt-3 mb-3 ">Young Men Christians Association .Addis Ababa,Ethiopia</p>
        <p className="text-gray-700">{jobDescription}</p>
        <div className="flex flex-row space-x-2 mt-4">
          <div className="bg-green-200 text-green-500 px-4 py-2 rounded-full min-w-[100px]">In person</div>
          <div className="h-5">|</div>
          <div className="border-orange-500 border-2 text-orange-300 px-4 py-2 rounded-full min-w-[120px]">Education</div>
          <div className="border-blue-500 border-2 text-blue-500 px-4 py-2 rounded-full min-w-[120px] text-center">IT</div>
        </div>
      </div>
      </div>
    </div>
  
  );
};

export default jobCard;
