import { Fragment, useContext, useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { AiFillHome, AiFillPlusSquare } from "react-icons/ai";
import { MdSell } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../GlobalContext/AuthProvider";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { RiLoader2Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { differenceInDays } from "date-fns";

const { Header, Sider, Content } = Layout;

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  const { logOut, user } = useContext(AuthContext);
  const [subscription, setSubscription] = useState({});

  const currentDate = new Date();
  const expiresAt = new Date(subscription?.expiresAt);
  const difference = differenceInDays(expiresAt, currentDate);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const mobile = e.target.mobile.value;

    if (name && mobile && mobile.length == 11) {
      setLoading(true);
      const memberInfo = {
        name: name,
        mobile: mobile,
      };

      axios
        .post(`${import.meta.env.VITE_API_URL}/api/add-member`, memberInfo)
        .then((res) => {
          if (res) {
            setIsOpen(!isOpen);
            toast.success("Member added");
          }
        })
        .catch((err) => {
          if (err) {
            if (err.response.data.message) {
              toast.error(err.response.data.message);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Fill the field carefully");
    }
  };

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subscription`
      );
      setSubscription(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubscription();
  }, []);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div className="max-w-[118rem] mx-auto">
      <Layout className="min-h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          {collapsed ? (
            <div className="demo-logo-vertical mt-6 mb-10">
              <div className="w-[70%] mx-auto">
                <img src="https://i.ibb.co/SywmmpK/food-republic.png" alt="" />
              </div>
              <h1 className="text-2xl text-white text-center font-bold">FR</h1>
            </div>
          ) : (
            <div className="demo-logo-vertical mt-6 mb-10">
              <div className="w-[50%] mx-auto">
                <img src="https://i.ibb.co/SywmmpK/food-republic.png" alt="" />
              </div>
              <h1 className="text-2xl text-white text-center font-bold">
                Food Republic
              </h1>
              <address className="text-gray-300 text-center">
                Naria, Shariatpur
              </address>
            </div>
          )}
          <Menu
            className="text-xl py-1"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={window.location.pathname}
          >
            <Menu.Item
              title="Home"
              key={"/"}
              icon={<AiFillHome className="h-4 w-4" />}
            >
              <Link to={"/"}>Home</Link>
            </Menu.Item>
            <Menu.Item
              title="Sell"
              key={"/sell"}
              icon={<MdSell className="h-4 w-4" />}
            >
              <Link to={"/sell"}>Sell</Link>
            </Menu.Item>
            <Menu.Item
              title="Dashboard"
              key={"/dashboard"}
              icon={<MdDashboard className="h-4 w-4" />}
            >
              <Link to={"/dashboard"}>Admin</Link>
            </Menu.Item>
            <Menu.Item
              onClick={() => setIsOpen(!isOpen)}
              title="Add Member"
              key={"/add-member"}
              icon={<AiFillPlusSquare className="h-4 w-4" />}
            >
              <p>Add Member</p>
            </Menu.Item>
            {user ? (
              <Menu.Item
                onClick={() => logOut()}
                key={"/logout"}
                title="Logout"
                icon={<FiLogOut className="h-4 w-4" />}
              >
                <Link>Logout</Link>
              </Menu.Item>
            ) : null}
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              display: "flex",
              justifyContent: "space-between",
              paddingRight: "1.2%",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            <span
              onClick={() => navigate("/payment")}
              className="font-bold capitalize cursor-pointer"
            >
              {difference > 0 ? (
                <span>
                  Subscription Will expire in -{" "}
                  <span className="text-red-600 text-lg">({difference})</span>{" "}
                  days
                </span>
              ) : difference === 0 ? (
                <span className="text-red-600">Last day of expiration</span>
              ) : (
                <span className="text-red-600">Expired</span>
              )}
            </span>
            <span>
              Hi,{" "}
              <span title={user?.email} className="font-bold capitalize">
                {user?.email?.split("@")[0]}
              </span>
            </span>
          </Header>
          <Content
            style={{
              margin: "14px 8px",
              padding: 12,
              minHeight: 100,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 shadow-xl transition-all">
                  <form onSubmit={handleSubmit} className="space-y-1">
                    <input
                      className="w-full h-[30px] border-2 border-purple-500 rounded px-2"
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      required
                    />
                    <input
                      className="w-full h-[30px] border-2 border-purple-500 rounded px-2"
                      type="number"
                      name="mobile"
                      placeholder="Enter Mobile Number"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full h-[30px] border-2 border-purple-500 flex items-center justify-center bg-purple-500 rounded text-white"
                    >
                      Add{" "}
                      {loading ? (
                        <RiLoader2Line className="h-5 w-5 animate-spin text-white " />
                      ) : null}
                    </button>
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

export default Main;
