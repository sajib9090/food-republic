import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Fragment, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { AuthContext } from "../../../../GlobalContext/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../../GlobalContext/UserContext";
import DateFormatter from "../../../../components/DateFormatter/DateFormatter";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { RiLoader2Fill } from "react-icons/ri";

const MaintainUsers = () => {
  const [visible, setVisible] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const { allUser, singleUser, refetchUsers } = useUserContext();

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
      data.email = data.email + "@foodrepublic.com";

      const user = {
        email: data.email.toLowerCase(),
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

  const handleChangeRole = (e) => {
    e.preventDefault();
    const userRole = e.target.role.value;
    const data = {
      role: userRole,
    };
    if (userRole) {
      setEditLoading(true);
      axios
        .patch(
          `${import.meta.env.VITE_API_URL}/api/update-user/${editedUser?._id}`,
          data
        )
        .then((res) => {
          if (res) {
            refetchUsers();
            setIsOpen(!isOpen);
            setEditLoading(false);
          }
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong");
            setEditLoading(false);
          }
        });
    }
  };

  return (
    <div>
      <div className="w-full px-4 pt-4">
        <div className="mx-auto w-full max-w-md shadow-md rounded-2xl bg-white p-2 mb-8">
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
        <div>
          {allUser &&
            allUser
              .filter((user) => user.email !== "rayan@foodrepublic.com")
              .map((user, index) => (
                <div
                  key={user._id}
                  className="max-w-3xl mx-auto min-h-[60px] border-b border-gray-300 flex justify-between items-center px-2"
                >
                  <div className="flex items-center">
                    <div className="mr-2">{index + 1}.</div>
                    <div className="flex items-center">
                      <p>Username:</p>
                      <p className="ml-2">{user.email.split("@")[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-8">
                    <div className="flex items-center">
                      <p>Role:</p>
                      <p className="ml-2">{user.role}</p>
                    </div>
                    <div className="flex items-center space-x-12">
                      <DateFormatter dateString={user.createdDate} />
                      <button
                        onClick={() => {
                          setEditedUser(user);
                          setIsOpen(!isOpen);
                        }}
                        disabled={singleUser?.email == user.email}
                        className="bg-blue-600 px-2 py-1 text-white rounded hover:bg-opacity-70"
                      >
                        Change Role
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(!isOpen)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[200px] transform overflow-hidden rounded bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={handleChangeRole}>
                    <div>
                      <label>Select role*</label>
                      <select
                        required
                        name="role"
                        className="h-[40px] w-full border-2 border-purple-900 rounded-md"
                      >
                        <option value="" disabled selected>
                          Choose a role
                        </option>
                        <option value="admin">Admin</option>
                        <option value="chairman">Chairman</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <div className="mt-2">
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="h-[40px] w-full border-2 border-purple-900 bg-purple-900 text-white rounded-md flex items-center justify-center"
                      >
                        Submit
                        {editLoading ? (
                          <RiLoader2Fill className="w-6 h-6 animate-spin text-white" />
                        ) : null}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default MaintainUsers;
