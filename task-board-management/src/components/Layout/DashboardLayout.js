import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import withAuth from "../../../HOC/withAuth";
import { NAVIGATION } from "../../utilities/navigation";
import Footer from "../Shared/Footer";
import Navbar from "../Shared/Navbar";
import crossImg from "/public/images/close.svg";
import humbergerImg from "/public/images/humberger.svg";

const DashboardLayout = ({ children }) => {
  const [active, setActive] = useState(true);
  const router = useRouter();

  return (
    <div className="master-dashboard-section">
      <div className={`sidebar  ${active ? "active" : ""}`}>
        <div className="logo-details">
          <div onClick={() => setActive(!active)} className=" ps-3 text-center">
            <Image
              src={active ? humbergerImg : crossImg}
              role="button"
              className=" img-fluid"
              alt=""
            />
          </div>
        </div>

        <div className="main-menu ">
          {/* sidebar menu  */}
          {NAVIGATION.map((url, index) => {
            return (
              <div key={index} className={url?.class}>
                <div className={url?.className}>
                  <div className="menu-list">
                    <Link href={url.href} as={url.href} passHref>
                      <a className="menu-links">
                        <div
                          className={
                            router.pathname === `${url.href}`
                              ? "active-link"
                              : ""
                          }
                        >
                          <div className="menu-item  d-flex">
                            <div className="menu-icon">
                              <Image
                                src={url.icons}
                                width={url.width}
                                height={url.height}
                                className="img-fluid"
                                alt=""
                              />
                            </div>
                            {active ? "" : <span>{url.pageName}</span>}
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <section className="home-section">
        {/* overlay  */}
        <div className="overlay">
          <div className="layer"></div>
        </div>

        {/* home content wrapped by navbar and footer  */}
        <Navbar />
        <div className="home-content">{children}</div>
        <Footer />
      </section>
    </div>
  );
};

// export default DashboardLayout;
export default withAuth(DashboardLayout, {
  isProtectedRoute: true,
}); // route is protected . without login user can't access pages  which is wrapped by this layout. If user is logged in already then user can't access unprotected pages without logout
