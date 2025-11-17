import type { DataType} from "../interface/interfaces";

interface ProfilePageProps {
  data: DataType[] | null;
  onDownload: () => void;
}

 const Certifications = ({
    data,
    onDownload,
}: ProfilePageProps) => {
if (!data || data.length === 0) {
  return <p className="text-gray-500">No certifications available.</p>;
}

  return (
    <div className=" flex flex-col w-full gap-5">
      <h2 className="md:2xl text-xl text-[#323338] font-semibold ">
        Certificates and Recognition
      </h2>
      <h4 className="md:text-lg text-base  text-[#676879] ">
        View and download your volunteering certificates and achievements.
      </h4>
      {data.map((certification, index) => (
        <div
          className="bg-white p-6 rounded-xl shadow-lg w-full max-h-[90vh] "
          key={index}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base font-semibold mb-2">
                {certification.title}
              </h2>
              <p className="text-gray-700 mb-1">{certification.company}</p>
            </div>

            <div className="flex items-center gap-3 mb-3">
              {certification.verified && (
                <div className="flex items-center gap-1 text-white bg-[#00854D]   px-5 rounded-3xl   text-sm">
                  Verified
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {certification.earned && (
              <p className="text-[#676879] text-sm flex items-center gap-1 mb-2">
                <span className=") text-sm ">Earned:</span>
                {certification.earned}
              </p>
            )}

            {certification.hoursContributed !== undefined && (
              <p className="text-[#676879] text-sm mb-2">
                <span className=" text-sm ">Hours contributed:</span>
                {certification.hoursContributed}
              </p>
            )}
          </div>

          {certification.companyIndustries &&
            certification.companyIndustries.length > 0 && (
              <div className="flex flex-wrap gap-2 my-3">
                {certification.companyIndustries.map((industry, idx) => (
                  <span
                    key={idx}
                    className="border border-ui text-xs px-5 py-1 rounded-full"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            )}
          <div className="flex justify-between items-center">
            <div className="sm:text-sm text-xs text-[#676879]">
              <p >{certification.role}:</p>
              <span>{certification.userName}</span>
            </div>
            <button
              onClick={onDownload}
              className="md:px-5 px-2 py-1 md:text-base sm:text-sm text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Certifications;