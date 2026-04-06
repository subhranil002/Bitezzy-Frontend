import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaQuoteLeft } from "react-icons/fa";

import HomeLayout from "../layouts/HomeLayout";

const teamMembers = [
  {
    name: "Subhranil Chakraborty",
    role: "The Simmering Strategist",
    image: "https://res.cloudinary.com/dpoqek1ce/image/upload/ar_1:1,c_auto,g_auto,w_500/v1772466343/Subhranil_pei11c.jpg",
    linkedin_url: "https://www.linkedin.com/in/subhranilchakraborty",
    github_url: "https://www.github.com/subhranil002",
    bio: "Master of long-term planning and slow-cooked perfection. Subhranil ensures every project boils down to flawless execution and sustainable architecture.",
    color: "from-orange-400 to-red-500",
  },
  {
    name: "Wasiq Afnan Ansari",
    role: "Sultan of the Sauce",
    image: "https://res.cloudinary.com/dpoqek1ce/image/upload/ar_1:1,c_auto,g_auto,w_500/v1772469945/Wasiq_n7vl3o.jpg",
    linkedin_url: "https://www.linkedin.com/in/wasiq-afnan-ansari-cs2021",
    github_url: "https://www.github.com/wasiqAfnan",
    bio: "Adding that extra kick to everything we build. Wasiq blends code and creativity to make sure our products always leave a lasting, flavorful impression.",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Trisit Chanda",
    role: "Keeper of the Secret Sauce",
    image: "https://res.cloudinary.com/dpoqek1ce/image/upload/v1775483067/myImage_s1uofe.jpg",
    linkedin_url: "https://www.linkedin.com/in/trisit-chanda-2a2548260",
    github_url: "https://www.github.com/Trisitchanda",
    bio: "Guarding the architecture and core algorithms. Trisit manages the hidden ingredients and robust logic that make our applications truly unique.",
    color: "from-rose-400 to-orange-600",
  },
  {
    name: "Soudipta Sarkar",
    role: "Future Flavor Forecaster",
    image: "https://res.cloudinary.com/dpoqek1ce/image/upload/ar_1:1,c_auto,g_auto,w_500/v1772470790/soudipta_zdndet.jpg",
    linkedin_url: "https://www.linkedin.com/in/soudipta-sarkar-19a398312",
    github_url: "https://www.github.com/soudipta6010",
    bio: "Always looking ahead to what’s next. Soudipta anticipates emerging trends, explores innovative ideas, and helps shape features that keep our products fresh, forward-thinking, and ready for the future.",
    color: "from-orange-500 to-amber-600",
  },
  {
    name: "Nabanita Nath",
    role: "Garnish Wizard",
    image: "https://res.cloudinary.com/dpoqek1ce/image/upload/ar_1:1,c_auto,g_auto,w_500/v1772904668/NabanitaNath_l8i9bg.jpg",
    linkedin_url: "https://www.linkedin.com/in/nabanita-nath-747837225",
    github_url: "https://www.github.com/Nabanita315",
    bio: "Master of aesthetics and final touches. Nabanita turns functional interfaces into visual masterpieces, making sure every pixel looks delectable.",
    color: "from-red-500 to-amber-500",
  },
];

const VerticalTeamPage = () => {
  return (
    <HomeLayout>
      <div className="relative min-h-screen bg-orange-50/30 overflow-hidden py-20">
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-24">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold text-gray-800"
            >
              The <span className="text-orange-500">MasterChefs</span>
            </motion.h1>
            <p className="text-gray-500 mt-4 italic">Crafting the future of food, one line of code at a time.</p>
          </div>

          <div className="space-y-32">
            {teamMembers.map((member, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
                >
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="relative">
                      {/* Decorative Background Square */}
                      <div className={`absolute -inset-4 bg-linear-to-tr ${member.color} opacity-20 blur-2xl rounded-full animate-pulse`} />
                      
                      <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Side */}
                  <div className={`w-full lg:w-1/2 text-center ${isEven ? "lg:text-left" : "lg:text-right"}`}>
                    <div className={`inline-block p-2 rounded-lg bg-linear-to-br ${member.color} text-white text-xs font-bold uppercase tracking-widest mb-4`}>
                      {member.role}
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">{member.name}</h2>
                    
                    <div className={`relative p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-orange-100 shadow-xl inline-block max-w-xl`}>
                      <FaQuoteLeft className="absolute -top-4 left-6 text-orange-200 text-3xl" />
                      <p className="text-gray-600 leading-relaxed italic">
                        {member.bio}
                      </p>
                    </div>

                    <div className={`flex gap-6 mt-8 justify-center ${isEven ? "lg:justify-start" : "lg:justify-end"}`}>
                      {member.linkedin_url && (
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`}>
                          <FaLinkedin className="text-gray-400 hover:text-orange-500 cursor-pointer transition-colors text-xl" />
                        </a>
                      )}
                      {member.github_url && (
                        <a href={member.github_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s GitHub`}>
                          <FaGithub className="text-gray-400 hover:text-orange-500 cursor-pointer transition-colors text-xl" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default VerticalTeamPage;