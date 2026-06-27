import "leaflet/dist/leaflet.css";

import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useForm } from "react-hook-form";
import {
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiSend,
} from "react-icons/fi";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import contactUsApi from "../apis/user/contactUsApi";
import BannerAd from "../components/ads/BannerAd";
import { CONTACT_US_BANNER_SCRIPT } from "../constants";
import HomeLayout from "../layouts/HomeLayout";

/* Custom marker icon for the map */
const orangeIcon = new L.Icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function ContactUs() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    await contactUsApi(data);
    reset();
  };

  return (
    <HomeLayout>
      <div className="py-12 px-4 md:px-8 lg:px-16 bg-linear-to-br from-orange-50 via-amber-50 to-white">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Get in{" "}
              <span className="bg-linear-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or need help? We’d love to hear from you.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Contact Form */}
            <div className="card bg-white shadow-xl border border-orange-100 w-full lg:max-w-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="card-title text-2xl font-bold mb-2 flex items-center gap-2 text-orange-600">
                    <FiMessageSquare className="text-3xl" />
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form and we&apos;ll get back to you soon.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Subject field */}
                  <div className="form-control flex flex-col">
                    <label htmlFor="subject" className="label mb-2">
                      <span className="label-text font-semibold text-gray-700">
                        Subject
                      </span>
                    </label>
                    <input
                      id="subject"
                      {...register("subject", {
                        required: "Subject is required",
                        minLength: {
                          value: 5,
                          message: "Subject must be at least 5 characters",
                        },
                        maxLength: {
                          value: 30,
                          message: "Subject must be at most 30 characters",
                        },
                      })}
                      type="text"
                      placeholder="Enter your subject"
                      className="input w-full input-bordered focus:border-orange-400 focus:ring focus:ring-orange-200"
                    />
                    {errors.subject && (
                      <span className="label-text-alt text-error mt-1">
                        {errors.subject.message}
                      </span>
                    )}
                  </div>

                  {/* Message field */}
                  <div className="form-control flex flex-col">
                    <label htmlFor="message" className="label mb-2">
                      <span className="label-text font-semibold text-gray-700">
                        Message
                      </span>
                    </label>
                    <textarea
                      id="message"
                      {...register("message", {
                        required: "Message is required",
                        minLength: {
                          value: 10,
                          message: "Message must be at least 10 characters",
                        },
                      })}
                      placeholder="Type your message..."
                      className="textarea resize-none w-full textarea-bordered h-32 focus:border-orange-400 focus:ring focus:ring-orange-200"
                    ></textarea>
                    {errors.message && (
                      <span className="label-text-alt text-error mt-1">
                        {errors.message.message}
                      </span>
                    )}
                  </div>

                  {/* Submit button */}
                  <div className="form-control mt-6">
                    <button className="btn bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold gap-2 rounded-2xl shadow-md transition-all duration-300 w-full">
                      <FiSend className="text-lg" />
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 w-full lg:max-w-sm">
              <div className="card bg-white shadow-md border border-orange-100 hover:shadow-lg transition-all duration-300">
                <div className="card-body p-6 space-y-4">
                  <h3 className="card-title text-lg font-bold text-orange-600">
                    Contact Information
                  </h3>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <FiMail className="text-xl text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-gray-600">bitezzy.app@gmail.com</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <FiPhone className="text-xl text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-gray-600">+91 91234 56789</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <FiMapPin className="text-xl text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-gray-600">
                        Kolkata, West Bengal, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Ads */}
              <BannerAd scriptUrl={CONTACT_US_BANNER_SCRIPT} />
            </div>
          </div>

          {/* Map Section */}
          <div className="card bg-white shadow-xl border border-orange-100 mt-12">
            <div className="card-body p-6">
              <h2 className="card-title text-2xl font-bold mb-4 text-orange-600">
                Find Us
              </h2>

              {/* Leaflet map centered at Kolkata */}
              <div className="rounded-lg overflow-hidden h-64 border border-orange-100">
                <MapContainer
                  center={[22.5726, 88.3639]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[22.5726, 88.3639]} icon={orangeIcon}>
                    <Popup>
                      <b>Bitezzy HQ</b> <br />
                      Kolkata, West Bengal 🇮🇳
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
