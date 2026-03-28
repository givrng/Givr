// :
//           <>
//             <form onSubmit={handleSubmit}>
//               <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mt-2">Organization Details</h3>
//               <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-6">
//                   <img
//                       src={ formData.profileUrl || fallbackUrl}
//                       alt="Profile"
//                       className="w-24 h-24 rounded-full border object-cover"
//                   />
                
//                   <div className="space-y-1">
//                     <p className="text-sm font-medium">
//                         Organization Logo
//                     </p>
//                     <CloudinaryUpload
//                     folder="avatars"
//                     buttonText="Change Photo"
//                     onUploadSuccess={(url) => {
//                         setFormData(prev => ({
//                         ...prev,
//                         profileUrl: url,
//                         }));
//                     }}
//                     />
//                     <p className="text-xs text-gray-400">
//                       JPG, PNG or WEBP • Max 2MB.
//                       </p>
//                     </div>
//                   </div>
                
//                 <div className="bg-gray-50 rounded-xl p-6 space-y-6">
//                   <h3 className="text-lg font-semibold border-b pb-2">
//                     Organization Details
//                   </h3>
                  
//                   <div>
//                     {input2.map((input) => {

//                   if (input.name == "organizationType") {
//                     let options: organizationType[] = ["NGO/Non profit", "Religious Group", "Government Agency", "Educational Institution", "Corporate Foundation", "Community Group"]
//                     return <div className="flex flex-col gap-y-2">
//                       <label
//                         htmlFor={"description"}
//                         className={`text-xs sm:text-sm text-[#323338]`}
//                       >{input.label} </label>
//                       <select name={input.name}
//                         className="w-full border-ui focus:ring-blue-500 rounded-md pl-3 py-2 outline-none"
//                         onChange={handleChange}>

//                         <option selected hidden value={""} key={"default"}>{input.label}</option>

//                         {options.map(option => <option key={option}>{option}</option>)}
//                       </select>
//                     </div>
//                   }

//                   return <div key={input.name}>
//                     <Input
//                       label={input.label}
//                       type={input.type}
//                       placeholder={input.placeholder}
//                       name={input.name}
//                       value={
//                         input.name ? formData[input.name as keyof FormFields] : ""
//                       }
//                       onChange={handleChange}

//                     />
//                   </div>
//                 })}
//                 </div>
                
//                 {/*  LocationSelect component here */}
//                   <div >
//                     <LocationSelect
//                       onChange={handleLocationChange}
//                       error={{ state: errors.state, lga: errors.lga }}
//                     />
//                   </div>
//                   <div>
                    
//                   <div>
//                     <label
//                       className="text-sm font-semibold"
//                     >Description</label>
//                     <textarea className="w-full rounded-md border-ui p-3"
//                       name={"description" as keyof FormFields} value={formData.description} 
//                       onChange={handleChange} rows={4} placeholder="Briefly describe your organization"/>
                      
//                   </div>
//                   </div>
//               </div>
//               <div className="flex gap-x-4">
//                 <Button variant="outline"
//                   className="text-sm px-4 py-2 shadow-none mt-4 w-full"
//                   onClick={() => setStep(0)}
//                 >Back</Button>
//                 <Button
//                   variant="green"
//                   className="text-sm px-4 py-2 shadow-none mt-4 w-full"
//                 >
//                   {isLoading ? <LoadingEffect message="Creating Account..." /> : "Skip"}
//                 </Button>
//               </div>
//             </form>
//           </>