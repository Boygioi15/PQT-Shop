import FloatingInput from "../../../component/FloatingInput";
import loginBackground from "../../../assets/loginBackground.png";
import logoFacebook from "../../../assets/logoFacebook.png";
import logoGoogle from "../../../assets/logoGoogle.png";
import logoPhone from "../../../assets/logoPhone.png";

const LoginPage = ({ loginMethod }) => {
  return (
    <div
      className="min-h-screen bg-white flex flex-col py-8 sm:px-6 lg:px-8 justify-center"
      style={{
        backgroundImage: `url(${loginBackground})`,
      }}
    >
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 rounded-[25px] sm:px-10">
          <div className="text-center text-xl text-gray-900 mb-4">
            Join us today
          </div>

          <form className="space-y-6 mt-3">
            <div className="text-sm text-gray-600">
              <a
                href="/login/email"
                onClick={() => loginMethod("email")}
                className={`hover:text-black ${
                  loginMethod === "email"
                    ? "text-black font-bold"
                    : "text-[#666666]"
                }`}
              >
                Email
              </a>
              <span className="mx-2">/</span>
              <a
                href="/login/phone"
                onClick={() => loginMethod("phone")}
                className={`hover:text-black ${
                  loginMethod === "phone"
                    ? "text-black font-bold"
                    : "text-[#666666]"
                }`}
              >
                Phone
              </a>
            </div>

            <FloatingInput
              label={loginMethod === "phone" ? "Enter phone" : "Enter email"}
              type={loginMethod === "phone" ? "tel" : "email"}
              id={loginMethod === "phone" ? "phone" : "email"}
              placeholder=""
              required={true}
            />
            <button
              // type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-[32px] text-white bg-[#068932] hover:bg-[#0A9D3C] focus:outline-none focus:ring-0 focus:ring-[#0A9D3C] focus:ring-offset-2 transition duration-300"
            >
              Sign in
            </button>
          </form>
          <div className="space-y-6 mt-3">
            <div className="text-xs text-right">
              <a href="#" className="text-[#0E88F0] hover:text-[#066D9B]">
                Already had an account?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-100 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mt-6 grid grid-cols-1 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-[40px] shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 space-x-2"
                >
                  <img
                    className="h-7 w-7"
                    src={logoFacebook}
                    alt="Facebook"
                  />
                  <span>Continue with Facebook</span>
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-[40px] shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 space-x-2"
                >
                  <img
                    className="h-7 w-7"
                    src={logoGoogle}
                    alt="Google"
                  />
                  <span>Continue with Google</span>
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-[40px] shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 space-x-2"
                >
                  <img
                    className="h-7 w-5"
                    src={logoPhone}
                    alt="Phone"
                  />
                  <span>Continue with Phone</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
