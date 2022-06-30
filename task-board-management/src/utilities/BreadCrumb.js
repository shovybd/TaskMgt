import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { URLS } from "./constants";
import arrow from "/public/images/arrow.svg";

//breadCrumb for single group and single sub group  page edit title

const BreadCrumb = ({ children }) => {
  const router = useRouter();
  return (
    <section id="headerNav">
      <nav
        className="navbar navbar-expand-lg border-bottom navbar-third"
        id="navbar3"
      >
        <div className="container-fluid">
          <div className="navbar-brand text-primary" href="#">
            <div className="d-flex">
              <div className="d-flex brand-text-span ">
                <Link href={URLS.GROUPLIST} as={URLS.GROUPLIST} passHref>
                  <a>Group</a>
                </Link>
                <span className="ms-1 me-1 ">
                  <Image src={arrow} width="6px" height="10px" alt="" />
                </span>
                <span>{children}</span>
              </div>
            </div>
          </div>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
        </div>
      </nav>
    </section>
  );
};

export default BreadCrumb;
