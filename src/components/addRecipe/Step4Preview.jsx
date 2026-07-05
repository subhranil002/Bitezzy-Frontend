import { useFormContext } from "react-hook-form";
import { 
  FaClock, 
  FaUsers, 
  FaUtensils, 
  FaRupeeSign, 
  FaExternalLinkAlt, 
  FaImage, 
  FaListUl,
  FaFire
} from "react-icons/fa";

const formatLabel = (str) =>
  str ? str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

const Step4Preview = () => {
  const { watch } = useFormContext();
  const formData = watch();
  console.log(formData);

  const totalTime = Number(formData.cookMinutes) || 0;

  const estimatedPrice = (formData.ingredients || []).reduce(
    (t, ing) => t + (Number(ing.marketPrice) || 0),
    0
  );

  const costPerServing =
    formData.servings > 0 ? estimatedPrice / formData.servings : 0;

  return (
    <div className="space-y-6 p-1 relative z-0">
      {/* Cool Background Graphic */}
      <div className="absolute -inset-6 md:-inset-10 bg-[url('https://res.cloudinary.com/dpoqek1ce/image/upload/food_tjm7b4.png')] opacity-90 mix-blend-overlay pointer-events-none -z-10 bg-repeat bg-[length:800px] rounded-3xl"></div>
      
      {/* Page Header */}
      <div className="border-b border-base-200 pb-4">
        <h2 className="text-2xl font-bold text-base-content">Final Preview</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Review your recipe card before submitting.
        </p>
      </div>

      {/* --- Main Recipe Card --- */}
      <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
        
        {/* Card Header / Hero Section */}
        <div className="flex flex-col md:flex-row bg-orange-50/30">
            
            {/* Thumbnail Image */}
            <div className="w-full md:w-5/12 min-h-[250px] md:min-h-full bg-base-200 relative">
                {formData.thumbnailFile ? (
                    <img 
                        src={URL.createObjectURL(formData.thumbnailFile)} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        alt="Recipe Thumbnail" 
                    />
                ) : formData.existingThumbnailUrl ? (
                    <img 
                        src={formData.existingThumbnailUrl} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        alt="Recipe Thumbnail" 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-base-content/30 gap-2">
                        <FaImage className="w-10 h-10" />
                        <span className="text-xs uppercase font-bold tracking-wider">No Image</span>
                    </div>
                )}
                {/* Premium Badge Overlay */}
                {formData.isPremium && (
                    <div className="absolute top-4 left-4 badge badge-warning gap-1 shadow-md font-bold z-10">
                        <FaFire /> Premium
                    </div>
                )}
            </div>

            {/* Title & Description */}
            <div className="card-body md:w-7/12 p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-1">
                    <div className="badge badge-outline border-orange-400 text-orange-600 font-semibold uppercase text-xs tracking-wide">
                        {formData.cuisine ? formatLabel(formData.cuisine) : "Cuisine"}
                    </div>
                    {formData.dietaryLabels?.map(label => (
                         <div key={label} className="badge badge-ghost text-xs text-base-content/60">
                             {formatLabel(label)}
                         </div>
                    ))}
                </div>

                <h2 className="card-title text-3xl font-bold text-base-content mb-2">
                    {formData.title || "Untitled Recipe"}
                </h2>
                
                <p className="text-base-content/70 text-sm leading-relaxed mb-4">
                    {formData.description || "No description provided."}
                </p>

                {/* DaisyUI Stats Horizontal */}
                <div className="stats stats-vertical lg:stats-horizontal shadow-sm bg-white border border-base-200 w-full mt-auto">
                    <div className="stat px-4 py-2">
                        <div className="stat-figure text-orange-500">
                            <FaUsers className="w-5 h-5" />
                        </div>
                        <div className="stat-title text-xs">Servings</div>
                        <div className="stat-value text-lg">{formData.servings || 0}</div>
                    </div>
                    
                    <div className="stat px-4 py-2">
                        <div className="stat-figure text-orange-500">
                            <FaClock className="w-5 h-5" />
                        </div>
                        <div className="stat-title text-xs">Time</div>
                        <div className="stat-value text-lg">{totalTime} <span className="text-xs font-normal text-base-content/50">min</span></div>
                    </div>

                    <div className="stat px-4 py-2">
                        <div className="stat-figure text-orange-500">
                            <FaRupeeSign className="w-5 h-5" />
                        </div>
                        <div className="stat-title text-xs">Total Cost</div>
                        <div className="stat-value text-lg text-success">
                            {estimatedPrice.toFixed(0)}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Divider */}
        <div className="divider m-0 h-0 border-base-200"></div>

        <div className="flex flex-col md:flex-row w-full">
            
            {/* --- Left Column: Ingredients --- */}
            <div className="w-full md:w-4/12 bg-base-50/50 p-6 border-b md:border-b-0 md:border-r border-base-200">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <FaListUl className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-lg">Ingredients</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="table table-compact w-full">
                        <thead>
                            <tr>
                                <th className="bg-transparent pl-0 text-base-content/50">Item</th>
                                <th className="bg-transparent text-right pr-0 text-base-content/50">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(formData.ingredients || []).length === 0 && (
                                <tr>
                                    <td colSpan="2" className="text-center text-base-content/40 italic py-4">
                                        No ingredients listed.
                                    </td>
                                </tr>
                            )}
                            {(formData.ingredients || []).map((ing, i) => (
                                <tr key={ing.id || i} className="hover">
                                    <td className="pl-0 py-2">
                                        <div className="font-bold text-base-content/90">{ing.name}</div>
                                        <div className="text-xs text-base-content/60">{ing.quantity} {ing.unit}</div>
                                    </td>
                                    <td className="pr-0 text-right font-mono text-xs">
                                        ₹{Number(ing.marketPrice).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th className="pl-0 pt-4 text-xs font-normal text-orange-600 uppercase">Cost / Serving</th>
                                <th className="pr-0 pt-4 text-right text-lg font-bold text-orange-600">
                                    ₹{costPerServing.toFixed(2)}
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* --- Right Column: Instructions */}
            <div className="w-full md:w-8/12 p-6 bg-base-100">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <FaUtensils className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-lg">Instructions</h3>
                </div>

                <ul className="steps steps-vertical w-full overflow-hidden">
                    {(formData.steps || []).length === 0 && (
                        <li className="step step-neutral text-base-content/40" data-content="?">
                            No instructions added yet.
                        </li>
                    )}

                    {(formData.steps || []).map((step, index) => (
                        <li key={step.id || index} className="step step-warning w-full text-left">
                            <div className="flex flex-col items-start text-left ml-4 mb-8 w-full min-w-0">
                                <span className="font-bold text-sm text-orange-600 uppercase tracking-wide mb-1">
                                    Step {index + 1}
                                </span>
                                <p className="text-base-content/80 leading-relaxed mb-3 break-words w-full">
                                    {step.text}
                                </p>
                                {step.imageFile && (
                                    <div className="w-full max-w-md rounded-xl overflow-hidden shadow-sm border border-base-200 mt-2 bg-base-100">
                                        <img 
                                            src={URL.createObjectURL(step.imageFile)} 
                                            alt={`Step ${index + 1}`}
                                            className="w-full h-64 object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                {/* External Links Section */}
                {(formData.externalMediaLinks || []).length > 0 && (
                    <div className="mt-8 pt-6 border-t border-base-200">
                        <h4 className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-3">
                            Related Media
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {formData.externalMediaLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-xs btn-outline gap-2 font-normal normal-case text-base-content/70 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600"
                                >
                                    <FaExternalLinkAlt className="text-[10px]" />
                                    {link.name || "Link"}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Preview;