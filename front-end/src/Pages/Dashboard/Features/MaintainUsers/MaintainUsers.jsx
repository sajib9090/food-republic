import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { AuthContext } from "../../../../GlobalContext/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MaintainUsers = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { setLoading, createNewUserWithEmail, logOut } =
    useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data && data.email) {
      // Update the 'username' field by appending '@foodrepublic.com'
      data.email = data.email + "@foodrepublic.com";

      const user = {
        email: data.email,
        role: data.role,
        createdDate: new Date().toISOString(),
      };
      createNewUserWithEmail(data.email, data.password)
        .then((userCredential) => {
          if (userCredential?.user?.email) {
            axios
              .post(`${import.meta.env.VITE_API_URL}/api/add-user`, user)
              .then((res) => {
                if (res.data.acknowledged) {
                  logOut();
                  navigate("/login");
                  setLoading(false);
                }
              })
              .catch((err) => {
                if (err) {
                  console.log(err);
                  setLoading(false);
                }
              });
          }
        })
        .catch((error) => {
          const errorMessage = error.message;
          if (errorMessage == "Firebase: Error (auth/email-already-in-use).") {
            axios
              .post(`${import.meta.env.VITE_API_URL}/api/add-user`, user)
              .then((res) => {
                console.log(res.data.acknowledged);
                if (res.data.acknowledged) {
                  logOut();
                  navigate("/login");
                  setLoading(false);
                }
              })
              .catch((err) => {
                if (err) {
                  console.log(err);
                  setLoading(false);
                }
              });
          }
        });
    }
  };

  return (
    <div>
      <div className="w-full px-4 pt-4">
        <div className="mx-auto w-full max-w-md shadow-md rounded-2xl bg-white p-2">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                  <span>Want to add new user?</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <div>
                      <label>Username*</label>
                      <input
                        className="h-[40px] w-full border-2 border-purple-900 rounded-md px-2"
                        type="text"
                        placeholder="Username"
                        {...register("email", {
                          required: "Warning! Username is required",
                        })}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                      {errors.email && (
                        <p className="text-red-700" role="alert">
                          {errors.email?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Select role*</label>
                      <select
                        className="h-[40px] w-full border-2 border-purple-900 rounded-md"
                        {...register("role", {
                          required: "Warning! Role is required",
                        })}
                        aria-invalid={errors.role ? "true" : "false"}
                      >
                        <option value="" disabled selected>
                          Choose a role
                        </option>
                        <option value="admin">Admin</option>
                        <option value="chairman">Chairman</option>
                        <option value="manager">Manager</option>
                      </select>
                      {errors.role && (
                        <p className="text-red-700" role="alert">
                          {errors.role?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label>Password*</label>
                      <input
                        className="h-[40px] w-full border-2 border-purple-900 rounded-md px-2"
                        type={visible ? "text" : "password"}
                        placeholder="Password"
                        required
                        {...register("password")}
                        aria-invalid={errors.password ? "true" : "false"}
                      />
                      {visible ? (
                        <FaEyeSlash
                          onClick={() => setVisible(!visible)}
                          className="h-4 w-4 cursor-pointer absolute bottom-3 right-2"
                        />
                      ) : (
                        <FaEye
                          onClick={() => setVisible(!visible)}
                          className="h-4 w-4 cursor-pointer absolute bottom-3 right-2"
                        />
                      )}
                    </div>
                    <div className="">
                      <button
                        type="submit"
                        className="h-[40px] w-full bg-purple-900 hover:bg-opacity-80 text-white rounded-md flex items-center justify-center"
                      >
                        Create user
                      </button>
                    </div>
                  </form>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
};

export default MaintainUsers;
