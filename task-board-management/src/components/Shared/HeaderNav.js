import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { HEADERNAV } from "../../utilities/constants";

const HeaderNav = ({ children }) => {
  const router = useRouter();
  return (
    <section id="headerNav">
      {/* second navbar  */}
      {HEADERNAV.map((url, index) => {
        return (
          <div
            key={index}
            className={router.asPath === `${url.href}` ? "d-block " : "d-none"}
          >
            <nav
              className="navbar navbar-expand-lg border-bottom bg-white navbar-third"
              id="navbar2"
            >
              <div className="container-fluid">
                <div className="navbar-brand text-primary" href="#">
                  <div className="d-flex">
                    <div>{/* <Image src={home} />{" "} */}</div>
                    <div className="d-flex brand-text-span">
                      <span
                        className={
                          router.asPath === `${url.href}` ? "d-block" : "d-none"
                        }
                      >
                        <Link href={url.href} as={url.href} passHref>
                          <a> {url.text}</a>
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0"> 
                {/* {children} */}
                </ul>
              </div>
            </nav>
          </div>
        );
      })}
    </section>
  );
};

export default HeaderNav;
